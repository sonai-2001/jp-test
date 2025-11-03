export interface CompanyItem {
  _id?: string; // _id of the company (required)
  companyName?: string; // Name of the company (required)
  companySectorId?: {
    companySector: ""
  }; // Sector of the company (required)
  ticker?: string; // Ticker symbol (required)
  companyInfo?: string; // Information about the company (required)
  logo?: string; // URL for the company's logo (optional)
}

export interface chartType {
  investmentRecommendation: {
    FD: number,
    Gold: number,
    Stocks: number
  }
}
