import "./ProductDescription.css";

import { ProductType } from "@/types/product";
import React from "react";

function ProductDescription({ product }: { product: ProductType["product"] }) {
  const getText = (text: string) => {
    return text
      .replaceAll("<table", '<div class="table-wrapper"><table')
      .replaceAll("</table>", "</table></div>");
  };
  return (
    <div className="product_box mt-3">
      <div>
        <h4> Product Description:</h4>
        {product?.description && (
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: getText(product?.description) }}
          />
        )}
      </div>
    </div>
  );
}

export default ProductDescription;
