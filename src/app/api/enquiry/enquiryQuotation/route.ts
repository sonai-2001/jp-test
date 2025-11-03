import { NextRequest, NextResponse } from "next/server";
import Enquiry from "@/models/Enquiry";
import sendToMail from "@/lib/sendToMail";

export async function PATCH(req: NextRequest) {
    try {
        const { id, userId, productId, status, isCart, dataQuotation, enquiryQuotation, ...data } = await req.json();

        const baseURL = process.env.NEXT_PUBLIC_BASE_URL
        const enquiryData: any = await Enquiry.findById(id)
        const tableData = enquiryData.analysisTable
        tableData.push({ date: new Date(), old: enquiryData?.status, new: status })

        const subject = `Thank You for Your Enquiry ${data?.enquiryNo}, please review our Quotation`
        const emailTemplate = ` 
<html>
<head></head>
<body>
 <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
  <p><strong>Greetings, ${data?.customerName}</strong></p>
<p>We have received your product enquiry, kindly review the quotation. Should you wish to purchase the same, kindly follow the link below to purchase these products</p>
<b>Enquriy No</b> - ${data?.enquiryNo}
<br />
<b>EEstimated Time</b> - ${data?.estimatedTime}
<div
    style="max-width: 600px; margin: auto; margin-top: 30px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">
    <h2 style="text-align: center; color: #333;">Quotation Details</h2>
    <div style="border: 1px solid #000;">
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <tr>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">S.No</th>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">Description, Item Code</th>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">HSN/SAC</th>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">Qty (in No/s)</th>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">Rate in Rs/each (not including taxes if applicable)</th>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">Discount %</th>
                <th style="border: 1px solid black; padding: 8px; text-align: right;">Amount in Rs.</th>
            </tr>

            <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">1</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.productName}, ${enquiryQuotation?.modelName}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.hsn}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.Quantity}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.MRP}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.perDiscount}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.finalPriceExclTax}</td>
            </tr>
            <tr style="font-weight: bold;">
                <td colspan="6" style="border: 1px solid black; padding: 8px; text-align: left;">TOTAL</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.finalPriceExclTax}</td>
            </tr>
            <tr style="font-style: italic;">
                <td colspan="2" style="border: 1px solid black; padding: 8px; text-align: left;">QUOTATION VALUE IN WORDS</td>
                <td colspan="5" style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.discountedPricewors}.</td>
            </tr>
        </table>
        <table style="border-collapse: collapse; width: 50%; margin-left: auto;">
            <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">Freight/P&F (In Rs)</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;"></td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.freightCharges}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">CGST</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.CGST}%</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.cgstAmount}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">SGST</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.SGST}%</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.sgstAmount}</td>
            </tr>
            <tr style="font-size: 0.8em;">
                <td style="border: 1px solid black; padding: 8px; text-align: left;">IGST</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.IGST}%</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.igstAmount}</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid black;">
                <td style="border: 1px solid black; padding: 8px; text-align: left;" colSpan="2" >GRAND TOTAL</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.finalPriceInclTax}</td>
            </tr>
        </table>
    </div>
    <p>Want to purchase this product? Follow this link to place your order - <a
         style="color:  #e50e0e;"  href="${process.env.NEXT_PUBLIC_BASE_URL}/my-enquiry/${id}">Link</a></p>
    <p>Need help regarding this quotation? Give us a call - +91 9007220181</p>
    <p><strong>DISCLAIMER:</strong> The Estimated Time for Delivery Quoted is in regards to your current Shipping Address, any changes to the same at the time of Purchase *will change* the Time to Delivery and you will be updated with a New Estimate.</p>
           <h5>TERMS & CONDITIONS, POLICIES -</h5>
            <p>
                Please take a moment to review our Terms & Conditions, FAQ’s Shipping & Delivery Policy, and Privacy Policy — these apply to all purchases. You can find them linked in the footer of our website or down below under "Useful Links" to help avoid any misunderstandings.
            </p>

  <h5>Useful Links-</h5>
          <a href="${baseURL}/faq/">FAQ<a>, 
          <a  href="${baseURL}/terms-condition/">Terms & Conditions</a>, <a  href="${baseURL}/shipping-and-divery-policy/">Shipping & Delivery Policy</a>, <a  href="${baseURL}/privacy-policy/">Privacy Policy</a>
          <div style="max-width: 600px; margin: 20px auto; display: flex; align-items: center; gap: 18px;">
                <img src="https://jaypee-images.s3.ap-south-1.amazonaws.com/products/banner3.png" style=" height:120px;" />
            <p style="font-size: 14px; font-weight:600;">This is an AUTO-GENERATED Email. Kindly DO NOT reply or write to this Email address and use the 
                designated support contact informa on instead</p>
          </div>
</div>
 </div>
</body>
</html>
`;

        const emailTemplateIsCart = ` 
<html>
<head>
</head>
<body>
 <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
  <p><strong>Greetings, ${data?.customerName}</strong></p>
  <p>We have received your product enquiry, kindly review the quotation. Should you wish to purchase the same, kindly follow the link below to purchase these products</p>
  <b>Enquriy No</b> - ${data?.enquiryNo}
  <br />
  <b>Estimated Time</b> - ${data?.estimatedTime}
  <div style="max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #333; margin-top: 0; margin-bottom: 20px;">Quotation Details</h2>
    <div style="border: 1px solid #000; font-family: Arial, sans-serif; overflow-x: auto;">
        <table style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">S.No</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Description, Item Code</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">HSN/SAC</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Qty (in No/s)</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Rate in Rs/each (not including taxes if applicable)</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f9f9f9;">Discount %</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: right; background-color: #f9f9f9;">Amount in Rs.</th>
                </tr>
            </thead>
            <tbody>
              ${dataQuotation?.map((item: any, index: any) => `
                  <tr>
                      <td style="border: 1px solid black; padding: 8px; text-align: left;">${index + 1}</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.productName}, "${item?.modelName}"</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.hsn}</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: left;">${item?.quantity}</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(item?.MRP).toFixed(2)}</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: center;">${item?.discount}</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(item?.discountedPriceWithQuantity).toFixed(2)}</td>
                  </tr>
              `).join('')}
            <tr style="font-weight: bold;">
                <td colspan="6" style="border: 1px solid black; padding: 8px; text-align: left;">TOTAL</td>
                <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(enquiryQuotation?.totalPriceExclTax).toFixed(2)}</td>
            </tr>
            <tr style="font-style: italic;">
                <td colspan="2" style="border: 1px solid black; padding: 8px; text-align: left;">QUOTATION VALUE IN WORDS</td>
                <td colspan="5" style="border: 1px solid black; padding: 8px; text-align: left;">${enquiryQuotation?.totalPriceExclTaxwords}</td>
            </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 50%; margin-left: auto; margin-top: 0px; font-family: Arial, sans-serif;">
            <!-- Ensure no top margin if it's part of the same bordered block -->
            <tbody>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">Freight/P&F (In Rs)</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;"></td> <!-- Empty cell for alignment -->
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(enquiryQuotation?.freightCharges).toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">CGST</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.CGST}%</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(enquiryQuotation?.cgstAmount).toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">SGST</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.SGST}%</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(enquiryQuotation?.sgstAmount).toFixed(2)}</td>
                </tr>
                <tr style="font-size: 0.9em;"> <!-- Slightly adjusted font size for better fit if needed -->
                    <td style="border: 1px solid black; padding: 8px; text-align: left;">IGST</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${enquiryQuotation?.IGST}%</td>
                    <td style="border: 1px solid black; padding: 8px; text-align: right;">${Number(enquiryQuotation?.igstAmount).toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold;">
                    <td colSpan="2" style="border: 1px solid black; border-top: 2px solid black; padding: 8px; text-align: left;">GRAND TOTAL</td>
                    <td style="border: 1px solid black; border-top: 2px solid black; padding: 8px; text-align: right;">${Number(enquiryQuotation?.finalAmount).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    </div>
   <p style="margin-top: 20px;">Want to purchase this product? Follow this link to place your order - <a
         style="color: #e50e0e; text-decoration: none;"  href="${process.env.NEXT_PUBLIC_BASE_URL}/my-enquiry/${id}">Link</a></p>
    <p>Need help regarding this quotation? Give us a call – +91 9007220181</p>
    <p style="font-size: 0.9em; color: #555;"><strong>DISCLAIMER:</strong> The Estimated Time for Delivery Quoted is in regards to your current Shipping Address, any changes to the same at the time of Purchase *will change* the Time to Delivery and you will be updated with a New Estimate.</p>
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
</body>
</html>

`;

        if (id && userId && productId) {
            const updatedEnquiry = await Enquiry.findOneAndUpdate(
                { _id: id, userId, productId },
                { ...data, status, enquiryQuotation, analysisTable: tableData },
                { new: true }
            );
            if (!updatedEnquiry) {
                return NextResponse.json(
                    { error: "Enquiry not found." },
                    { status: 404 }
                );
            }
            enquiryQuotation?.draft && await sendToMail(data?.email, isCart ? emailTemplateIsCart : emailTemplate, subject);
            return NextResponse.json({ message: enquiryQuotation?.draft ? "Updated successfully." : "Data saved.", data: updatedEnquiry }, { status: 200 });
        } else if (id) {
            const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, { ...data, status, enquiryQuotation, dataQuotation, analysisTable: tableData }, { new: true });
            if (!updatedEnquiry) {
                return NextResponse.json(
                    { error: "Enquiry not found." },
                    { status: 404 }
                );
            }
            enquiryQuotation?.draft && await sendToMail(data?.email, isCart ? emailTemplateIsCart : emailTemplate, subject);
            return NextResponse.json({ message: "Updated successfully.", data: updatedEnquiry }, { status: 200 });
        }
    } catch (error: any) {
        console.error("Error in PATCH /api/enquiry/enquiryQuotation:", error);
        return NextResponse.json(
            { error: "An error occurred while updating the enquiry." },
            { status: 500 }
        );
    }
}

