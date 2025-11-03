import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for the Answer document
export interface IAnswer extends Document {
  name: string;
  email: string;
  questionId: mongoose.Schema.Types.ObjectId[];
  questionText: string[];
  answer: string[];
  answerId: mongoose.Schema.Types.ObjectId[];
  score: number[];
  extraField?: string;
  totalScore: number;
  riskCategory: string;
  investmentRecommendation: string;
  questionnaire: mongoose.Schema.Types.ObjectId[];
  numberOfYears: string;
}

const AnswerSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    email: { type: String },
    questionId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Question",
      required: true,
    },
    questionText: {
      type: [String],
      required: true,
    },
    answer: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    answerId: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    score: {
      type: [Number],
    },
    totalScore: { type: Number, default: 0 },
    numberOfYears: { type: String },
    riskCategory: { type: String, default: "Unknown" },
    investmentRecommendation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    extraField: {
      type: String,
    },

    questionnaire: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

const Answer: Model<IAnswer> =
  mongoose.models.Answer || mongoose.model<IAnswer>("Answer", AnswerSchema);

export default Answer;
