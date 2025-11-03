import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Enquiry document
export interface IEnquiry extends Document {
  productName: string;
  productModel: any;
  quantity: string;
  customerName: string;
  email: string;
  phone: number;
  companyName: string;
  comment: string;
  category: any;
  status: string;
  step: string;
  userId: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  gstNumber: string;
  address: string;
  sameAsAddress: string;
  deliveryAddress: string;
  paymentSlip: string;
  purchaseOrder: string;
  paymentSlipDate: string;
  invoiceImage: string;
  CGST: string;
  SGST: string;
  IGST: string;
  totalTax: string;
  totalPrice: string;
  isCart: boolean;
  totalCart: any;
  analysisTable: any;
  enquiryQuotation: any;
  dataQuotation: any;
  dataInvoice: any;
  trackingDetails: any;
  estimatedTime: string;
  enquiryNo: string;
}

// Create the schema for the Enquiry model
const EnquirySchema: Schema = new Schema({
  productName: { type: String },
  productModel: {},
  quantity: { type: String },
  customerName: { type: String },
  email: { type: String },
  phone: { type: Number },
  companyName: { type: String },
  comment: { type: String },
  category: { type: {} },
  status: { type: String, default: "Pending" },
  step: { type: String },
  gstNumber: { type: String },
  address: { type: String },
  sameAsAddress: { type: String },
  deliveryAddress: { type: String },
  paymentSlip: { type: String },
  purchaseOrder: { type: String },
  paymentSlipDate: { type: String },
  invoiceImage: { type: String },
  CGST: { type: String },
  SGST: { type: String },
  IGST: { type: String },
  totalTax: { type: String },
  totalPrice: { type: String },
  enquiryQuotation: {},
  dataQuotation: {},
  dataInvoice: {},
  trackingDetails: {},
  analysisTable: {},
  isCart: { type: Boolean, default: false },
  totalCart: {},
  estimatedTime: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductUser" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  enquiryNo: { type: String },
},
  { timestamps: true });

// Create the model
const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
