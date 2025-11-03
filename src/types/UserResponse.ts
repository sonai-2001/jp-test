import { chartType } from "./company";


  
  interface TotalScore {
    min: number;
    max: number;
    label: string;
    riskCategory: string;
    topComment: string;
    middleComment: string;
    bottomComment: string;
    investmentRecommendation: chartType;
    _id: string;
  }
  
  interface AnswerDetails {
    min?: number;
    max?: number;
    label?: string;
    totalScore?: TotalScore[];
    _id: string;
  }
  
  interface Question {
    questionId: string;
    questionText: string;
    answer: string | AnswerDetails;
    score: number;
    extraField: string;
  }
  
  export interface UserResponseType {
    _id: string;
    name: string;
    email: string;
    questions: Question[];
    totalScore: number;
    numberOfYears: string;
    riskCategory: string;
    investmentRecommendation: chartType;
    topComment: string;
    middleComment: string;
    bottomComment: string;
  }
  