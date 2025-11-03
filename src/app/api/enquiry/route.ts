import { NextRequest, NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import ProductUser from "@/models/ProductUser";
import sendToMail, { sendToAdminMail } from "@/lib/sendToMail";

function generateAlphaNumericPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
// GET: Fetch all enquiries or a single enquiry by ID, productUserId, or productId
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const productUserId = url.searchParams.get("productUserId");
    const productId = url.searchParams.get("productId");

    if (id) {
      const enquiry = await Enquiry.findById(id).sort({ createdAt: -1 });
      if (!enquiry) {
        return NextResponse.json(
          { error: "Enquiry not found." },
          { status: 404 }
        );
      }

      if (enquiry?.isCart) {
        const productIds =
          enquiry.totalCart?.map((item: any) => item.productId) || [];

        // Fetch all products in a single database query
        const product = await Product.find({ _id: { $in: productIds } }).sort({
          createdAt: -1,
        });
        // const product = enquiry?.totalCart?.map((item:any)=> await Product.findById(item.productId).sort({ createdAt: -1 }))

        return NextResponse.json({ enquiry, product }, { status: 200 });
      }

      const product = await Product.findById(enquiry.productId).sort({
        createdAt: -1,
      });
      return NextResponse.json({ enquiry, product }, { status: 200 });
    } else if (productUserId) {
      const enquiries = await Enquiry.find({ userId: productUserId })
        .sort({ createdAt: -1 })
        .lean();
      const enquiriesWithProductDetails = await Promise.all(
        enquiries.map(async (enquiry) => {
          const product = await Product.findById(enquiry.productId).lean();
          return { ...enquiry, product };
        })
      );
      return NextResponse.json(enquiriesWithProductDetails, { status: 200 });
    } else if (productId) {
      const enquiries = await Enquiry.find({ productId: productId }).sort({
        createdAt: -1,
      });
      return NextResponse.json(enquiries, { status: 200 });
    } else {
      const enquiries = await Enquiry.find().sort({ updatedAt: -1 });
      return NextResponse.json(enquiries, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/enquiry:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the enquiries." },
      { status: 500 }
    );
  }
}

// POST: Create a new enquiry
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let {
      userId,
      productModel,
      quantity,
      email,
      productId,
      isCart,
      totalCart,
    } = data;

    let isLogin = true;
    let isNewUser = false;
    let userPass = '';
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    // Validate required fields
    if (isCart) {
      if (!email || !totalCart) {
        return NextResponse.json(
          { error: 'All fields are required.' },
          { status: 400 }
        );
      }
    } else if (!productModel || !quantity || !email || !productId) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Create/find user
    if (!userId) {
      const existingUser = await ProductUser.findOne({ email });
      if (existingUser) {
        userId = existingUser._id;
        isLogin = false;
      } else {
        const password = generateAlphaNumericPassword();
        userPass = password;
        const newUser = new ProductUser({
          email,
          password,
          name: data?.customerName,
          companyName: data?.companyName,
          mobile: data?.phone,
          type: 'user',
        });
        const savedUser = await newUser.save();
        userId = savedUser._id;
        isLogin = false;
        isNewUser = true;
      }
    }

    // Enquiry number
    const lastEnquiry = await Enquiry.findOne().sort({ createdAt: -1 });
    const lastNumber =
      lastEnquiry?.enquiryNo &&
      lastEnquiry?.enquiryNo !== undefined &&
      lastEnquiry?.enquiryNo !== 'undefined'
        ? parseInt(lastEnquiry.enquiryNo.slice(1))
        : 0;
    const nextNumber = lastNumber + 1;
    const newEnquiryNo = `E${nextNumber.toString().padStart(4, '0')}`;

    const { _id, id, ...cleanData } = data;

    const newEnquiry = isCart
      ? new Enquiry({
          ...cleanData,
          analysisTable: [{ date: new Date(), old: '', new: 'Pending' }],
          userId,
          email,
          enquiryNo: newEnquiryNo,
        })
      : new Enquiry({
          ...cleanData,
          analysisTable: [{ date: new Date(), old: '', new: 'Pending' }],
          isCart,
          totalCart,
          userId,
          email,
          enquiryNo: newEnquiryNo,
        });

    await ProductUser.findOneAndUpdate(
      { email },
      {
        name: data?.customerName || null,
        companyName: data?.companyName || null,
        mobile: data?.phone || null,
        gstNumber: data?.gstNumber || null,
        address: data?.address || null,
        sameAsAddress:
          data?.address?.trim() === data?.deliveryAddress?.trim()
            ? true
            : false,
        deliveryAddress: data?.deliveryAddress || null,
      },
      { new: true }
    );

    const savedEnquiry = await newEnquiry.save();

    // JWT for user verification
    const tokenForVerified = jwt.sign(
      { email: email, id: savedEnquiry?._id },
      process.env.JWT_TOKEN_SECRET!
      // { expiresIn: '1d' }
    );

    // Admin email (HTML)
    const subjectForAdmin = 'New enquiry request';
    const emailTemplateForAdmin = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <p><strong>Enquiry Number/ ID:</strong> ${savedEnquiry?.enquiryNo}</p>
          <p><strong>Customer Name:</strong> ${data?.customerName}</p>
          <p><strong>Customer Phone No:</strong> ${savedEnquiry?.phone}</p>
          <p><strong>Customer Email Address:</strong> ${email}</p>
          <p><strong>Customer Comments:</strong> ${savedEnquiry?.comment}</p>
          <p><strong>Products Enquired for (list with qty):</strong></p>
          <div style="overflow-x: auto;">
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">S.No</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Product Name</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">HSN/SAC</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Model Name</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Base Price</th>
                  <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Qty (in No/s)</th>
                </tr>
              </thead>
              <tbody>
                ${
                  savedEnquiry?.totalCart
                    ?.map(
                      (item: any, index: number) => `
                      <tr>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${index + 1}</td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.productName}</td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.hsn}</td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.productModel?.modelName}</td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.productModel?.basePrice}</td>
                        <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.quantity}</td>
                      </tr>`
                    )
                    .join('') || ''
                }
              </tbody>
            </table>
          </div>

          <p style="text-align: center; margin: 20px 0;">
            <a href="${baseURL}/admin/all-enquiry/${savedEnquiry?._id}" target="_blank"
              style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
              Click here to track this enquiry
            </a>
          </p>
          <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
            <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style="height:120px;" />
            <p style="font-size: 14px; font-weight:600; max-width: 390px;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the designated support contact information instead.</p>
          </div>
        </div>
      </div>
    `;

    if (isLogin) {
      // Email to user
      const subject = 'Thank You for Your Enquiry';
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
            <p>Hello <strong>${data?.customerName}</strong>,</p>
            <p>You can track your enquiries here.</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${baseURL}/my-enquiry/${savedEnquiry?._id}" target="_blank"
                style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
                Track your enquiries
              </a>
            </p>
            <p>If you have any questions, feel free to contact Support.</p>
            <p>Thanks,</p>
            <p><b>Jaypee Associates Kolkata</b></p>
            <p>The CNC Workholding Specialists</p>
          </div>
        </div>
      `;

      // ADMIN: object-style call
      await sendToAdminMail({
        subject: subjectForAdmin,
        html: emailTemplateForAdmin,
        replyTo: email,
      });

      // USER
      await sendToMail(email, emailTemplate, subject);

      return NextResponse.json(
        { message: 'Enquiry created successfully.', savedEnquiry },
        { status: 201 }
      );
    } else if (isNewUser) {
      // Email to new user
      const subject =
        'Thank You for your Enquiry, please verify your Profile to proceed - JAYPEE ASSOCIATES';
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; font-size: 28px;">Welcome to Our Platform!</h2>
            <p>Hello <strong>${data?.customerName}</strong>,</p>
            <p>Your account has been successfully created. Here are your sign-in details:</p>
            <p>You can track your enquiries here:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${baseURL}/my-enquiry/${savedEnquiry?._id}" target="_blank"
                style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
                Click here to track your enquiries
              </a>
            </p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${userPass}</p>
            <a href="${baseURL}/api/enquiry/userVarification?token=${tokenForVerified}"
              style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
              Complete Your Profile and Verify yourself
            </a>
          </div>
        </div>
      `;

      // ADMIN: object-style call
      await sendToAdminMail({
        subject: subjectForAdmin,
        html: emailTemplateForAdmin,
        replyTo: email,
      });

      // USER
      await sendToMail(email, emailTemplate, subject);

      return NextResponse.json(
        {
          message:
            'Enquiry created successfully and open your mail to track your Enquiry.',
          data: { ...savedEnquiry },
        },
        { status: 201 }
      );
    } else {
      // Email to existing user (not logged in path)
      const subject = 'Thank You for Your Enquiry';
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
            <p>Hello <strong>${data?.customerName}</strong>,</p>
            <p>You can track your enquiries here.</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${baseURL}/my-enquiry/${savedEnquiry?._id}" target="_blank"
                style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
                Track your enquiries
              </a>
            </p>
            <p>Thanks,</p>
            <p><b>Jaypee Associates Kolkata</b></p>
          </div>
        </div>
      `;

      // ADMIN: object-style call
      await sendToAdminMail({
        subject: subjectForAdmin,
        html: emailTemplateForAdmin,
        replyTo: email,
      });

      // USER
      await sendToMail(email, emailTemplate, subject);

      return NextResponse.json(
        { message: 'Enquiry created successfully.', data: { ...savedEnquiry } },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Error in POST /api/enquiry:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the enquiry.' },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing enquiry
export async function PATCH(req: NextRequest) {
  try {
    const { id, userId, productId, status, ...data } = await req.json();
    const email = data?.email;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const enquiryData: any = await Enquiry.findById(id);
    const tableData = enquiryData.analysisTable;
    tableData.push({ date: new Date(), old: enquiryData?.status, new: status });

    if (
      enquiryData.status == "Quotation Received" &&
      data?.companyName &&
      data?.gstNumber &&
      data?.step == "Submitted GST Detaile"
    ) {
      await ProductUser.findOneAndUpdate(
        { email },
        {
          companyName: data?.companyName || null,
          gstNumber: data?.gstNumber || null,
          address: data?.address || null,
          sameAsAddress:
            data?.address?.trim() === data?.deliveryAddress?.trim()
              ? true
              : false,
          deliveryAddress: data?.deliveryAddress || null,
        },
        { new: true }
      );
    }

    if (id && userId && productId) {
      const updatedEnquiry = await Enquiry.findOneAndUpdate(
        { _id: id, userId, productId },
        { ...data, status, analysisTable: tableData },
        { new: true }
      );
      if (!updatedEnquiry) {
        return NextResponse.json(
          { error: "Enquiry not found." },
          { status: 404 }
        );
      }
      console.log(status, "11111111111111status");

      if (status === "Product Shipped") {

        console.log(status, "11111111111111statusinnnnn");
        const subject = "Shipping Confirmation email";
        const emailTemplate = `
       <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
         <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
           <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
           <p>Hello,</p>
           <p>Your Order is on it's way! - JAYPEE ASSOCIATES</p>
           <P>Dear ${enquiryData.customerName}</P> 
           <P>Your Order corresponding to Invoice No - ${enquiryData.dataInvoice?.invoiceNo}</P> 
           <P>Enquiry No - ${enquiryData.enquiryNo}</P> 
           <P>Please find the shipping details of your Order down below -</P> 
           <P>Estimated Delivery by: ${enquiryData.estimatedTime}</P> 
           <P>Track Your Order - <a style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;"  href="${process.env.NEXT_PUBLIC_BASE_URL}/my-enquiry/${id}">Link</a></P> 
           <P>For further assistance regarding this order, Contact Support.</P> 
           <p>Thanks,</p>
           <p><b>Jaypee Associates Kolkata</b></p>
           <p>The CNC Workholding Specialists</p><h5>TERMS & CONDITIONS, POLICIES -</h5>
            <p>
                Please take a moment to review our Terms & Conditions, FAQ’s Shipping & Delivery Policy, and Privacy Policy — these apply to all purchases. You can find them linked in the footer of our website or down below under "Useful Links" to help avoid any misunderstandings.
            </p>

          <h5>Useful Links-</h5>
          <a href="${baseURL}/faq/">FAQ<a>, 
          <a  href="${baseURL}/terms-condition/">Terms & Conditions</a>, <a  href="${baseURL}/shipping-policy/">Shipping & Delivery Policy</a>, <a  href="${baseURL}/privacy-policy/">Privacy Policy</a>
          <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px;">
                <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style=" height:120px;" />
            <p style="font-size: 14px; font-weight:600;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the 
                designated support contact informa on instead</p>
          </div>
         </div>
       </div>
     `;

        await sendToMail(data?.email || enquiryData?.email, emailTemplate, subject);
      }

      if (status === "Purchase Order") {
        const subject = "Purchase Order";
        const emailTemplate = `
       <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
         <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
           <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
           <p>Greetings, ${enquiryData.customerName}</p>
           <P>As you selected purchase order for the enquiry (${enquiryData?.enquiryNo}), please drop us an email to <a href="mailto:jp_ascal@yahoo.com">jp_ascal@yahoo.com</a> (Juzer Abbasbhai, Proprietor) with the Purchase Order attached for placing an order / for further communications or updates regarding the same.</P> 
           <p>Thanks,</p>
           <p><b>Jaypee Associates Kolkata</b></p>
           <p>The CNC Workholding Specialists</p><h5>TERMS & CONDITIONS, POLICIES -</h5>
            <p>
                Please take a moment to review our Terms & Conditions, FAQ’s Shipping & Delivery Policy, and Privacy Policy — these apply to all purchases. You can find them linked in the footer of our website or down below under "Useful Links" to help avoid any misunderstandings.
            </p>

            <h5>Useful Links-</h5>
          <a href="${baseURL}/faq/">FAQ<a>, 
          <a  href="${baseURL}/terms-condition/">Terms & Conditions</a>, <a  href="${baseURL}/shipping-policy/">Shipping & Delivery Policy</a>, <a  href="${baseURL}/privacy-policy/">Privacy Policy</a>
          <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px;">
                <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style=" height:120px;" />
            <p style="font-size: 14px; font-weight:600;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the 
                designated support contact informa on instead</p>
          </div>
         </div>
       </div>
     `;

        await sendToMail(enquiryData?.email, emailTemplate, subject);
      }

      return NextResponse.json(updatedEnquiry, { status: 200 });
    } else if (id) {
      const updatedEnquiry = await Enquiry.findByIdAndUpdate(
        id,
        { ...data, status, analysisTable: tableData },
        { new: true }
      );
      if (!updatedEnquiry) {
        return NextResponse.json(
          { error: "Enquiry not found." },
          { status: 404 }
        );
      }

      console.log(status, "11111111111111status");
      if (status === "Product Shipped") {
        console.log(status, "11111111111111statusinnnnn");
        const subject = "Shipping Confirmation email";
        const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
            <p>Hello,</p>
            <p>Your Order is on it's way! - JAYPEE ASSOCIATES</p>
            <P>Dear ${enquiryData.customerName}</P> 
            <P>Your Order corresponding to Invoice No - ${enquiryData.dataInvoice?.invoiceNo}</P> 
            <P>Enquiry No - ${enquiryData.enquiryNo}</P> 
            <P>Please find the shipping details of your Order down below -</P> 
            <P>Estimated Delivery by: ${enquiryData.estimatedTime}</P> 
            <P>Track Your Order - <a style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;"  href="${process.env.NEXT_PUBLIC_BASE_URL}/my-enquiry/${id}">Link</a></P> 
            <P>For further assistance regarding this order, Contact Support.</P> 
            <p>Thanks,</p>
            <p><b>Jaypee Associates Kolkata</b></p>
            <p>The CNC Workholding Specialists</p><h5>TERMS & CONDITIONS, POLICIES -</h5>
            <p>
                Please take a moment to review our Terms & Conditions, FAQ’s Shipping & Delivery Policy, and Privacy Policy — these apply to all purchases. You can find them linked in the footer of our website or down below under "Useful Links" to help avoid any misunderstandings.
            </p>

            <h5>Useful Links-</h5>
          <a href="${baseURL}/faq/">FAQ<a>, 
          <a  href="${baseURL}/terms-condition/">Terms & Conditions</a>, <a  href="${baseURL}/shipping-policy/">Shipping & Delivery Policy</a>, <a  href="${baseURL}/privacy-policy/">Privacy Policy</a>
          <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px;">
                <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style=" height:120px;" />
            <p style="font-size: 14px; font-weight:600;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the 
                designated support contact informa on instead</p>
          </div>
          </div>
        </div>
      `;

        await sendToMail(data?.email || enquiryData?.email, emailTemplate, subject);
      }

      if (status === "Purchase Order") {
        const subject = "Purchase Order";
        const emailTemplate = `
       <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
         <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
           <h2 style="color: #333; font-size: 28px;">Welcome to Jaypee Associates!</h2>
           <p>Greetings, ${enquiryData.customerName}</p>
           <P>As you selected purchase order for the enquiry (${enquiryData?.enquiryNo}), please drop us an email to <a href="mailto:jp_ascal@yahoo.com">jp_ascal@yahoo.com</a> (Juzer Abbasbhai, Proprietor) with the Purchase Order attached for placing an order / for further communications or updates regarding the same.</P> 
           <p>Thanks,</p>
           <p><b>Jaypee Associates Kolkata</b></p>
           <p>The CNC Workholding Specialists</p><h5>TERMS & CONDITIONS, POLICIES -</h5>
            <p>
                Please take a moment to review our Terms & Conditions, FAQ’s Shipping & Delivery Policy, and Privacy Policy — these apply to all purchases. You can find them linked in the footer of our website or down below under "Useful Links" to help avoid any misunderstandings.
            </p>

          <h5>Useful Links-</h5>
          <a href="${baseURL}/faq/">FAQ<a>, 
          <a  href="${baseURL}/terms-condition/">Terms & Conditions</a>, <a  href="${baseURL}/shipping-policy/">Shipping & Delivery Policy</a>, <a  href="${baseURL}/privacy-policy/">Privacy Policy</a>
          <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px;">
                <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style=" height:120px;" />
            <p style="font-size: 14px; font-weight:600;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the 
                designated support contact informa on instead</p>
          </div>
         </div>
       </div>
     `;

        await sendToMail(enquiryData?.email, emailTemplate, subject);
      }

      return NextResponse.json(
        { message: "Updated successfully.", data: updatedEnquiry },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error in PATCH /api/enquiry:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the enquiry." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an existing enquiry
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    if (!deletedEnquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Enquiry deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in DELETE /api/enquiry:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the enquiry." },
      { status: 500 }
    );
  }
}
