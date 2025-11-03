import { NextRequest, NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import { uploadToS3 } from "@/lib/uploadS3";
// import sentFileByMail from "@/lib/sentFileByMail";
import sendToMail from "@/lib/sendToMail";
import INVOICE from "@/models/gstinvoice";

export async function PATCH(req: NextRequest) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const file = formData.get("invoiceImage") as File;
    const isSetInvoice: any = await Enquiry.findById(id);
    const tableData = isSetInvoice.analysisTable;
    tableData.push({
      date: new Date(),
      old: isSetInvoice?.status,
      new: "Invoice has been send",
    });

    if (!file || !id) {
      return NextResponse.json(
        { error: "The 'file' and 'id' fields are required" },
        { status: 400 }
      );
    }
    const fileUrl = file ? await uploadToS3(file, "invoice") : false;

    const updatedEnquiry: any = await Enquiry.findOneAndUpdate(
      { _id: id },
      isSetInvoice?.invoiceImage
        ? { invoiceImage: fileUrl, analysisTable: tableData }
        : {
          invoiceImage: fileUrl,
          analysisTable: tableData,
          status: "Invoice has been send",
        },
      { new: true }
    );

    if (!updatedEnquiry) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    const INVOICEData = await INVOICE.findOne();

    const subject = "Your GST Invoice for your recent purchase is Ready!";
    // Email template
    const emailTemplate = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
         <div style="max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <p>Hi ${updatedEnquiry?.dataInvoice?.toName},</p>
          <p>Thank you for your business with <strong>Jaypee Associates</strong>. Attached is your GST Invoice for your recent purchase.</p>
        
          <p><strong>Invoice Details:</strong></p>
          <ul>
            <li><strong>Invoice No:</strong> ${updatedEnquiry?.dataInvoice?.invoiceNo}</li>
            <li><strong>Invoice Date:</strong> ${updatedEnquiry?.dataInvoice?.dateFirst}</li>
            <li><strong>Total Amount:</strong> ₹${updatedEnquiry?.enquiryQuotation?.finalAmount}</li>
          </ul>
    
          <p>Please find the attached invoice for your reference.</p>
          <p style="text-align: center;">
           <a href="${fileUrl}" target="_blank" style="display: inline-block; margin: 10px 0; padding: 15px 32px; background-color: #e50e0e; color: #fff; text-decoration: none; border-radius: 10px; font-size: 16px; cursor: pointer;">Download Invoice</a>
          </p>
          <p>The attached Invoice is a GST Proforma Invoice, you will receive an Original GST Invoice as well along with the requested products at the time of delivery.</p>
          <p>If you have any questions or require further assistance, feel free to reach out to Support.</p>
          <p>Best regards,</p>
          <p><strong>Jaypee Associates</strong></p>
          <p>📍 ${INVOICEData?.address}</p>
          <p>📞 ${INVOICEData?.phone}</p>
          <p>✉️ ${INVOICEData?.email}</p>
          <p>🌐 <a href="${INVOICEData?.website}" style="color: #e50e0e; " target="_blank">${INVOICEData?.website}</a></p>
           <h5>TERMS & CONDITIONS, POLICIES -</h5>
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
    await sendToMail(updatedEnquiry?.email, emailTemplate, subject)
    // await sentFileByMail(updatedEnquiry?.email, emailTemplate, subject);
    // await sentFileByMail(updatedEnquiry?.email, emailTemplate, subject, attachments );
    return NextResponse.json(
      { message: "Invoice sent successfully.", data: updatedEnquiry },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/enquiry/enquiryQuotation:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the enquiry." },
      { status: 500 }
    );
  }
}
