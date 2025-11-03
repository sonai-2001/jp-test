// models/Questionnaire.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  question: string;
  type: "multiple-choice" | "single-choice" | "text";
  options: string[];
  decisionTreeId: {} | null;
}

const QuestionSchema: Schema = new Schema(
  {
    question: { type: String, unique: true },
    type: {
      type: String,
      enum: ["multiple-choice", "single-choice", "text", "decision-tree"],
      required: true,
    },
    // options: { type: [String], default: [] },
    options: {
      type: [
        {
          name: { type: String },
          score: { type: Number },
        },
      ],

      default: [],
    },
    extraField: {
      type: String,
      enum: ["NumberOfYears", ""],
      // default: null,
    },

    decisionTreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DecisionTree",
    },
  },
  { timestamps: true }
);

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
