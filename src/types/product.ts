// Define a single product structure
export interface Product {
  id: string;
  _id: string;
  ProductName: string;
  companyName: string;
  description: string;
  images: string[];
  model: string[];
  altTags: string[];
  category: { 
    categoryName: string;
    subcategoryName: string;
  };
  category_id:string
}

// Define a structure for a collection of products (optional)
export interface ProductType {
  [key: string]: Product; // Index signature for multiple products
}