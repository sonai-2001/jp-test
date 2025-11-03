"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createEnquiry } from "@/app/services/Enquiry/EnquiryApi";
import { useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/services/redux/features/userSlice";
import CartItem from "@/app/(screens)/my-cart/CartItem";
import { setAddToCart } from "@/app/services/redux/features/addToCartSlice";
import { increment } from "@/app/services/redux/features/counterSlice";
import { IoMdInformationCircle } from "react-icons/io";
import {
  FaShoppingCart,
  FaClipboardCheck,
  FaUserCheck,
  FaLock,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBuilding,
  FaEnvelope,
} from "react-icons/fa";
import GradientButton from "@/app/components/buttons/GradientButton";
import { RootState } from "@/app/services/redux/store";
import SignInModel from "@/app/components/Signin/SignInModel";
import useToast from "@/util/toast";

function MyEnquiry() {
  const router = useRouter();
  const carts = useSelector((state: RootState) => state.addToCart?.data || []);
  const dispatch = useDispatch();
  const [addToCartData, setCartsData] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const { showToast } = useToast();
    
  
  const { userData } = useSelector((state: RootState) => state.user || {});
  interface UserInputs {
    mobile?: string;
    name?: string;
    [key: string]: any;
  }

  const [userInputs, setUserInputs] = useState<UserInputs>({});
  const [jid, setJid] = useState<string | null>(null);
  const closeModel = () => setShowModel(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Initialize localStorage-dependent state only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJid(localStorage.getItem("jid"));
    }
  }, []);

  // Safely update cart data
  useEffect(() => {
    setCartsData(carts || []);
  }, [carts]);

  // Safely handle cart updates
  const updateCart = useCallback(
    (updatedCart: React.SetStateAction<never[]>) => {
      // Use setTimeout to defer the state update to the next tick
      setTimeout(() => {
        setCartsData(updatedCart);
      }, 0);
    },
    []
  );

  const onSubmit = async (data: any) => {
    if(!userData){
      setShowModel(true);
      showToast({
        type: "success", message:'Please Signup Or Signin First'
    });
    }
    else{
      const body = {
        ...data,
        isCart: true,
        totalCart: addToCartData,
        status: "Pending",
        userId: jid,
      };
  
      try {
        const result = await createEnquiry(body);
        if (result) {
          router.push("/enquiry-thankyou");
  
          // Defer Redux updates
          setTimeout(() => {
            dispatch(setAddToCart([]));
          }, 0);
        }
      } catch (error) {
        console.error(error);
      }
    }
      };

  // Reset form when userInputs change
  useEffect(() => {
    if (Object.keys(userInputs).length > 0) {
      reset({
        phone: userInputs?.mobile,
        customerName: userInputs?.name,
        ...userInputs,
      });
    }
  }, [userInputs, reset]);

  // Logout function
  const logOut = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jtoken");
      localStorage.removeItem("jid");
      localStorage.removeItem("type");
      localStorage.removeItem("image");
    }

    // Defer Redux updates
    setTimeout(() => {
      dispatch(setUser(null));
      dispatch(increment());
    }, 0);
  }, [dispatch]);

  // Set userInputs from userData
  useEffect(() => {
    if (userData) {
      const { createdAt, updatedAt, ...userSliceData } = userData || {};
      setUserInputs(userSliceData);
    }
  }, [userData]);

  return (
    <>
      <style jsx>{`
        /* Cart Page Styling */
        .cart-page-header {
          background: linear-gradient(135deg, #2b4a84 0%, #1a365d 100%);
          padding: 2.5rem 0;
          color: white;
          margin-bottom: 2rem;
          position: relative;
        }

        .cart-page-header::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff8e31, #e73c7e, #4834d4);
        }

        .checkout-steps {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 0 1.5rem;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2b4a84;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 2;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .step.active .step-icon {
          background: #4834d4;
          color: white;
        }

        .step-label {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .step-connector {
          position: absolute;
          top: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          right: calc(-50% + 20px);
          left: calc(50% + 20px);
        }

        .step:last-child .step-connector {
          display: none;
        }

        /* Equal height containers */
        .equal-height-row {
          display: flex;
          flex-wrap: wrap;
        }

        .cart-form-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .cart-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          margin-bottom: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .cart-header {
          background: #f8f9fa;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          flex-shrink: 0;
        }

        .cart-title {
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cart-body {
          padding: 1.5rem;
          flex-grow: 1;
          overflow-y: auto;
          max-height: 600px; /* Set a reasonable max height */
        }

        .cart-body-scrollable {
          overflow-y: auto;
          height: 100%;
        }

        .cart-empty {
          text-align: center;
          padding: 3rem 1rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cart-empty-icon {
          font-size: 3rem;
          color: #dee2e6;
          margin-bottom: 1rem;
        }

        .form-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .form-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
          flex-shrink: 0;
        }

        .form-body {
          padding: 1.5rem;
          flex-grow: 1;
          overflow-y: auto;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border-radius: 8px;
          border: 1px solid #ced4da;
          padding: 0.75rem 1rem;
          transition: all 0.2s;
        }

        .form-control:focus {
          border-color: #4834d4;
          box-shadow: 0 0 0 0.2rem rgba(72, 52, 212, 0.1);
        }

        .form-info-icon {
          color: #6c757d;
          cursor: help;
        }

        .form-hint {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }

        .form-error {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .form-footer {
          padding: 1.25rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .secure-checkout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .input-icon-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .input-with-icon {
          padding-left: 2.75rem;
        }

        .cart-summary {
          margin-top: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .summary-label {
          color: #6c757d;
        }

        .summary-value {
          font-weight: 600;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 150px;
        }

        .trust-badge-icon {
          font-size: 2rem;
          color: #2b4a84;
          margin-bottom: 0.5rem;
        }

        .trust-badge-text {
          font-size: 0.85rem;
          color: #6c757d;
        }

        .cart-item {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 1rem;
          transition: all 0.2s;
        }

        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 767px) {
          .checkout-steps {
            overflow-x: auto;
            padding-bottom: 1rem;
            justify-content: flex-start;
            width: 100%;
          }

          .step {
            padding: 0 1rem;
            min-width: 80px;
          }

          .cart-container,
          .form-container {
            margin-bottom: 1.5rem;
          }

          .form-container {
            height: auto;
          }

          .equal-height-row {
            display: block;
          }
        }
      `}</style>

      {/* Cart Page Header */}
      <div className="cart-page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto text-center">
              <h1 className="h2 mb-2">Your Shopping Cart</h1>
              <p className="mb-0">
                Review your items and complete your enquiry
              </p>

              {/* Checkout Steps */}
              <div className="checkout-steps">
                <div className="step active">
                  <div className="step-icon">
                    <FaShoppingCart />
                  </div>
                  <div className="step-connector"></div>
                  <div className="step-label">Cart</div>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <FaClipboardCheck />
                  </div>
                  <div className="step-connector"></div>
                  <div className="step-label">Enquiry</div>
                </div>
                <div className="step">
                  <div className="step-icon">
                    <FaUserCheck />
                  </div>
                  <div className="step-label">Confirmation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row equal-height-row">
          {/* Cart Items Section */}
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="cart-container">
              <div className="cart-header">
                <h5 className="cart-title">
                  <FaShoppingCart />
                  Cart Items ({addToCartData?.length || 0})
                </h5>
              </div>

              <div className="cart-body">
                <div className="cart-body-scrollable">
                  {addToCartData?.length > 0 ? (
                    addToCartData.map((enquiry, index) => (
                      <div className="cart-item" key={index}>
                        <CartItem
                          enquiry={
                            typeof enquiry === "object" && enquiry !== null
                              ? { ...(enquiry as object), isCart: true }
                              : { isCart: true }
                          }
                          addToCartData={addToCartData}
                          update={updateCart} // Use the safer update function
                        />
                      </div>
                    ))
                  ) : (
                    <div className="cart-empty">
                      <div className="cart-empty-icon">
                        <FaShoppingCart />
                      </div>
                      <h4>Your cart is empty</h4>
                      <p className="text-muted">
                        Browse our products and add items to your cart.
                      </p>
                      <GradientButton
                        onClick={() => router.push("/request-product-quotes")}
                        className="mt-3"
                      >
                        Browse Products
                      </GradientButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form Section */}
          <div className="col-lg-5">
            <div style={{ padding: "10px" }} className="form-container">
              {addToCartData?.length > 0 ? (
                <>
                  <div className="form-header">
                    <h5 className="mb-0">Enquiry Details</h5>
                  </div>

                  <Form onSubmit={handleSubmit(onSubmit)} className="form-body">
                    <div className="form-group">
                      <Form.Label className="form-label">
                        <FaUserCheck className="text-primary" />
                        Customer Name <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-icon-wrapper">
                        <Form.Control
                          type="text"
                          className="input-with-icon"
                          {...register("customerName", { required: true })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.customerName && (
                        <div className="form-error">Name is required</div>
                      )}
                    </div>

                    <div className="form-group">
                      <Form.Label className="form-label">
                        <FaEnvelope className="text-primary" />
                        Email Address <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-icon-wrapper">
                        <Form.Control
                          type="email"
                          className="input-with-icon"
                          disabled={userData?.email}
                          {...register("email", { required: true })}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {userData?.email && (
                        <div className="form-hint d-flex align-items-center justify-content-between">
                          <span>Need to change your email?</span>
                          <button
                            onClick={logOut}
                            className="btn btn-sm btn-outline-danger"
                            type="button"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                      {errors.email && (
                        <div className="form-error">Email is required</div>
                      )}
                    </div>

                    <div className="form-group">
                      <Form.Label className="form-label">
                        <FaPhoneAlt className="text-primary" />
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-icon-wrapper">
                        <Form.Control
                          type="tel"
                          className="input-with-icon"
                          maxLength={10}
                          {...register("phone", {
                            required: true,
                            pattern: /^[0-9]{10}$/,
                          })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && errors.phone.type === "required" && (
                        <div className="form-error">
                          Phone number is required
                        </div>
                      )}
                      {errors.phone && errors.phone.type === "pattern" && (
                        <div className="form-error">
                          Enter a valid 10-digit phone number
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <Form.Label className="form-label">
                        <FaBuilding className="text-primary" />
                        Company Name <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="input-icon-wrapper">
                        <Form.Control
                          type="text"
                          className="input-with-icon"
                          {...register("companyName", { required: true })}
                          placeholder="Enter your company name"
                        />
                      </div>
                      {errors.companyName && (
                        <div className="form-error">
                          Company name is required
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <Form.Label className="form-label">
                        <FaMapMarkerAlt className="text-primary" />
                        Delivery Address <span className="text-danger">*</span>
                        <FaInfoCircle
                          className="form-info-icon"
                          title="Please Enter your Updated/Current Shipping Address with pin code for getting an accurate Time to Delivery"
                        />
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...register("deliveryAddress", { required: true })}
                        placeholder="Enter your full delivery address with PIN code"
                      />
                      {errors.deliveryAddress && (
                        <div className="form-error">
                          Delivery address is required
                        </div>
                      )}
                      <div className="form-hint">
                        Include building number, street name, city, state, and
                        PIN code for accurate delivery.
                      </div>
                    </div>

                    <div className="form-group mb-0">
                      <Form.Label className="form-label">
                        <IoMdInformationCircle className="text-primary" />
                        Special Instructions (Optional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...register("comment")}
                        placeholder="Any special requirements or comments..."
                      />
                    </div>

                    <div className="cart-summary">
                      <div className="summary-row">
                        <div className="summary-label">Items in Cart:</div>
                        <div className="summary-value">
                          {addToCartData.length}
                        </div>
                      </div>
                      <div className="summary-row">
                        <div className="summary-label">Quotation:</div>
                        <div className="summary-value">Will be provided</div>
                      </div>
                    </div>

                    <div className="form-footer">
                      <div className="secure-checkout">
                        <FaLock />
                        <span>Secure Enquiry Process</span>
                      </div>
                      <GradientButton type="submit" className="px-4 py-2">
                        Submit Enquiry
                      </GradientButton>
                    </div>
                  </Form>
                </>
              ) : (
                <div className="p-4 d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <div className="mb-4">
                      <FaClipboardCheck
                        style={{ fontSize: "40px", color: "#dee2e6" }}
                      />
                    </div>
                    <h5>Add Products to Cart</h5>
                    <p className="text-muted">
                      Add products to your cart to submit an enquiry
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges mt-5">
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <FaClipboardCheck />
            </div>
            <div className="trust-badge-text">Quick Quotation Process</div>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="trust-badge-text">Pan India Delivery</div>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <FaUserCheck />
            </div>
            <div className="trust-badge-text">Expert Support</div>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">
              <FaLock />
            </div>
            <div className="trust-badge-text">Secure Process</div>
          </div>
        </div>
      </div>
      <SignInModel
                showModel={showModel}
                closeModel={closeModel}
                data={'SignIn'}
              />
    </>
  );
}

export default MyEnquiry;
