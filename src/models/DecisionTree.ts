import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for the DecisionTree schema
export interface IDecisionTree extends Document {
  numberOfYears: Array<{
    min: number;
    max: number;
    label: string;
    totalScore: Array<{
      // totalScore is now an array of objects
      min: number;
      max: number;
      label: string;
      riskCategory: string;
      topComment: string;
      middleComment: string;
      bottomComment: string;
      investmentRecommendation: Record<string, number>;
    }>;
  }>;
}

const DecisionTreeSchema: Schema = new Schema(
  {
    numberOfYears: [
      {
        min: {
          type: Number,
          min: [0, "Number of years must be at least 0"],
        },
        max: {
          type: Number,
          max: [100, "Number of years must be less than or equal to 100"],
        },
        label: {
          type: String,
        },
        totalScore: [
          {
            min: {
              type: Number,
            },
            max: {
              type: Number,
            },

            label: {
              type: String,
            },
            riskCategory: {
              type: String,
            },
            topComment: { type: String },
            middleComment: { type: String },
            bottomComment: { type: String },
            investmentRecommendation: {
              type: Map,
              of: Number,
              default: {},
            },
          },
        ],
      },
    ],
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  },
  { timestamps: true }
);

// DecisionTree Model
const DecisionTree: Model<IDecisionTree> =
  mongoose.models.DecisionTree ||
  mongoose.model<IDecisionTree>("DecisionTree", DecisionTreeSchema);

export default DecisionTree;
