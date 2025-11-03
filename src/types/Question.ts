interface InvestmentRecommendation {
    "Fixed Deposit": number;
    Gold: number;
    Stocks: number;
  }
  
  interface TotalScore {
    min: number;
    max: number;
    label: string;
    riskCategory: string;
    topComment: string;
    middleComment: string;
    bottomComment: string;
    investmentRecommendation: InvestmentRecommendation;
    _id: string;
  }
  
 export interface NumberOfYearsType {
    min: number;
    max: number;
    label: string;
    totalScore: TotalScore[];
    _id: string;
  }
  
  interface DecisionTree {
    _id: string;
    numberOfYears: NumberOfYearsType[];
    questionId: string;
    __v: number;
  }
  
  interface Option {
    score: number;
    _id: string;
  }
  
 export interface QuestionType {
    _id: string;
    question: string;
    name:string;
    type: string;
    options: Option[];
    extraField: string;
    __v: number;
    decisionTree: DecisionTree[];
  }
  
