"use client";
import React, { useEffect, useState } from "react";
import EnquiryModel from "./enquiryModel";
import { useDispatch, useSelector } from "react-redux";
import { setAddToCart } from "@/app/services/redux/features/addToCartSlice";
import useToast from "@/util/toast";
import GradientButton from "../buttons/GradientButton";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/navigation';

function ProductAddSection({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.productModel[0] || ""
  );
  const carts = useSelector((state: any) => state.addToCart?.data);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = React.useState<any>(1);
  const { showToast } = useToast();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const models: any = product?.productModel;
  const router = useRouter();

  useEffect(() => {
    setSelectedVariant(product.productModel[0] || "");
  }, [product.productModel]);

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const removeQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const onSaveToCart = async () => {
    const selectedModel = models.find((item: any) => item == selectedVariant);
    const cartsLength = carts?.length || 0;

    const isCartExist = carts?.find(
      (item: any) =>
        item.productId === product?._id &&
        item.productModel.modelName === selectedModel?.modelName
    );

    const body = {
      index: cartsLength,
      quantity: quantity,
      productName: product?.ProductName,
      productImage: product?.images[0],
      userId: localStorage.getItem("jid"),
      productId: product?._id,
      hsn: product?.hsn,
      productModel: {
        modelName: selectedModel?.modelName,
        basePrice: selectedModel?.basePrice,
      },
    };

    try {
      if (carts) {
        if (isCartExist) {
          const updatedCart = carts.map((item: any) => {
            if (
              item.productId === product?._id &&
              item.productModel.modelName === selectedModel?.modelName
            ) {
              return {
                ...item,
                quantity: item?.quantity + quantity,
              };
            }
            return item;
          });

          dispatch(setAddToCart(updatedCart));

          localStorage.setItem(
            "addToCartData",
            JSON.stringify([...updatedCart])
          );
        } else {
          dispatch(setAddToCart([body, ...carts]));

          localStorage.setItem(
            "addToCartData",
            JSON.stringify([body, ...carts])
          );
        }
      } else {
        dispatch(setAddToCart([body]));

        localStorage.setItem("addToCartData", JSON.stringify([body]));
      }
      showToast({
        type: "success",
        message: "Product added to cart successfully.",
      });

      setQuantity(1);
      // router.push("/my-cart")
    } catch (error) {
      showToast({
        type: "error",
        message: "Product didn't added to cart.",
      });
    }
  };

  const getBeforeColon = (text: string) => {
  const index = text.indexOf(':');
  return index !== -1 ? text.slice(0, index).trim() : text.trim();
};

  return (
    <>
      <div className="product_box">
        <div className="details">
          <small>
            {product?.category?.categoryName
              ? product?.category?.categoryName
              : product?.category}
          </small>
          <h1>{product?.ProductName}</h1>
          <h6>{product?.brand}</h6>
          <hr />
          <div>
            {
              product.productModel.length>0 &&
            (
              <>
                <h6>Model:</h6>
            <select
              className="form-select"
              onChange={(e) => {
                const selectedModel = models?.find(
                  (item: any) => item._id === e.target.value
                );
                setSelectedVariant(selectedModel);
              }}
            >
              {product?.productModel?.map((item: any) => (
                <option key={item?._id} value={item._id}>
                  {getBeforeColon(item?.modelName)}
                </option>
              ))}
            </select>
            </>
              )
            }
            
            <div className="col-md-6 gap-3 mt-3">
              <div className="mb-3 w-50 form-group">
                <h6>Quantity:</h6>
                <div className="d-flex gap-3 align-items-center">
                  <button
                    type="button"
                    className="btn btn-secondary px-3"
                    onClick={removeQuantity}
                  >
                    -
                  </button>
                  <span
                    style={{
                      minWidth: "16px",
                      display: "inline-flex",
                      justifyContent: "center",
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary px-3"
                    onClick={addQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="viewAll_box justify-content-start gap-3">
              <GradientButton
                onClick={onSaveToCart}
                fullWidth
                size="large"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  px: { xs: 2, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: 12, sm: 14, md: 15 },
                  whiteSpace: "normal",
                  lineHeight: 1.3,
                }}
              >
                Add to Cart for Enquiry
              </GradientButton>
              <GradientButton
                onClick={()=>router.push('/contactus')}
                fullWidth
                size="large"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  px: { xs: 2, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: 12, sm: 14, md: 15 },
                  whiteSpace: "normal",
                  lineHeight: 1.3,
                }}
              >
                Contact us
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
      <EnquiryModel
        show={show}
        model={selectedVariant}
        productName={product?.ProductName}
        models={models}
        handleClose={handleClose}
        category={product?.category}
        getQuantity={quantity}
        productId={product?._id}
      />
    </>
  );
}

export default ProductAddSection;
