import mongoose, { Model, Document } from "mongoose";
export interface TeamMember extends Document {
  name: string;
  designation: string;
  image: string;
}

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true, // S3 or Cloudinary image URL
    },
  },
  { timestamps: true }
);

const Team: Model<TeamMember> =
  mongoose.models.TeamMember || mongoose.model("TeamMember", teamMemberSchema);

export default Team;
