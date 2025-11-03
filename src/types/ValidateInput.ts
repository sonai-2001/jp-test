export interface validateInputType {
    [key: string]: string; 
  }


  interface Answers {
    name: string;
    email: string;
    [key: string]: string;
  }
  
  export interface FilterDataType {
    answers: Answers;
  }