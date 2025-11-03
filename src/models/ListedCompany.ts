import mongoose from "mongoose";

const ListedCompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    ticker: { type: String, required: true },
    companyInfo: { type: String, required: true },
    companySectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanySector",
    },
    logo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ListedCompany ||
  mongoose.model("ListedCompany", ListedCompanySchema);
