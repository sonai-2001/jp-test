import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import EnquiryQuotationModel from "./EnquiryQuotationModel";
import { enquiryQuotation as enquiryQuotationDraft } from "@/app/services/Enquiry/EnquiryApi";
import { increment } from "@/app/services/redux/features/counterSlice";
import { useDispatch } from "react-redux";
import { numberToIndianCurrencyWords } from "./numberToIndianCurrencyWords";

function CartEnquiryQuotation({ enquiry }: { enquiry: any }) {
  const dispatch = useDispatch();
  const styles: any = {
    th: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
      backgroundColor: "#f4f4f4",
    },
    td: {
      border: "1px solid black",
      padding: "8px",
      textAlign: "left",
    },
  };
  interface FormData {
    estimatedTime: string;
    products: {
      basePrice: number;
      markup: number;
      discount: number;
      productName: string;
      modelName: string;
      quantity: number;
      hsn: string;
      MRP: number;
      discountedPriceWithQuantity: number;
      unit: string; // NEW FIELD
    }[];
    freightCharges: number;
    CGST: number;
    SGST: number;
    IGST: number;
  }

  const {
    register,
    watch,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const [data, setData] = useState<any>("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const { fields: productsFields } = useFieldArray({
    control,
    name: "products",
  });

  const calculateProductPrice = (product: any) => {
    const basePrice: any = parseFloat(product?.basePrice || 0).toFixed(2);
    const markup: any = parseFloat(product.markup || 0).toFixed(2);
    const discount: any = parseFloat(product.discount || 0).toFixed(2);
    const quantity: any = parseFloat(product.quantity || 1);

    const markupValue: any = ((basePrice * markup) / 100).toFixed(2);
    const MRP: any = (parseFloat(basePrice) + parseFloat(markupValue)).toFixed(
      2
    );
    const discountValue: any = ((MRP * discount) / 100).toFixed(2);
    const discountedPrice: any = (MRP - discountValue).toFixed(2);
    const discountedPriceWithQuantity = (
      parseFloat(discountedPrice) * quantity
    ).toFixed(2);

    return {
      ...product,
      basePrice,
      markup,
      discount,
      markupValue,
      MRP,
      discountValue,
      discountedPrice,
      discountedPriceWithQuantity,
    };
  };

  const calculateTotals = (data: any) => {
    let totalPriceExclTax = 0;
    const productsCalculations =
      data.products &&
      data.products.map((product: any) => {
        const { discountedPriceWithQuantity, MRP } =
          calculateProductPrice(product);
        totalPriceExclTax += parseFloat(discountedPriceWithQuantity);
        return {
          ...product,
          discountedPriceWithQuantity,
          MRP,
          totalPriceExclTax,
        };
      });

    const freightCharges: any = parseFloat(data.freightCharges || 0).toFixed(2);
    const CGST: any = parseFloat(data.CGST);
    const SGST: any = parseFloat(data.SGST);
    const IGST: any = parseFloat(data.IGST);

    const finalPriceExclTax: any = totalPriceExclTax.toFixed(2);

    const amount: any =
      parseFloat(finalPriceExclTax) + parseFloat(freightCharges);

    const cgstAmount = ((amount * parseFloat(CGST)) / 100).toFixed(2);
    const sgstAmount = ((amount * parseFloat(SGST)) / 100).toFixed(2);
    const igstAmount = ((amount * parseFloat(IGST)) / 100).toFixed(2);

    const totalTax = (
      parseFloat(cgstAmount) +
      parseFloat(sgstAmount) +
      parseFloat(igstAmount)
    ).toFixed(2);
    const finalPriceInclTax: any = (
      parseFloat(amount) + parseFloat(totalTax)
    ).toFixed(2);

    return {
      productsCalculations,
      totalPriceExclTax: totalPriceExclTax.toFixed(2),
      freightCharges,
      CGST,
      SGST,
      IGST,
      cgstAmount,
      sgstAmount,
      igstAmount,
      finalPriceExclTax,
      totalTax,
      finalPriceInclTax,
    };
  };

  const onSubmitDraft = async (data: FormData) => {
    const {
      freightCharges,
      CGST,
      SGST,
      IGST,
      cgstAmount,
      sgstAmount,
      igstAmount,
      finalPriceExclTax,
      totalTax,
      finalPriceInclTax,
      productsCalculations,
      totalPriceExclTax,
    } = calculateTotals(data);

    const enquiryQuotation = {
      draft: false,
      productName: enquiry?.enquiry?.productName,
      modelName: enquiry?.enquiry?.productModel?.modelName,
      hsn: enquiry.product?.hsn,
      freightCharges,
      totalPriceExclTax,
      totalPriceExclTaxwords: numberToIndianCurrencyWords(
        +calculateTotals(watch()).finalPriceInclTax
      ),
      CGST,
      SGST,
      IGST,
      cgstAmount,
      sgstAmount,
      igstAmount,
      finalPriceExclTax,
      finalPriceInclTax,
      totalTax,
      Quantity: enquiry?.enquiry?.quantity,
      finalAmount: finalPriceInclTax,
    };

    const updateData = {
      ...data,
      CGST,
      SGST,
      IGST,
      totalTax,
      enquiryQuotation,
      dataQuotation: productsCalculations.map((product: any) => ({
        ...product,
      })),
    };

    const body = {
      id: enquiry?.enquiry?._id,
      _id: enquiry?.enquiry?._id,
      ...updateData,
    };
    try {
      if (data) {
        const response = await enquiryQuotationDraft(
          enquiry?.enquiry?._id,
          body
        );
        handleClose();
        if (response) {
          dispatch(increment());
        }
      }
    } catch (error) {
      console.error("Error in POST /api/productUser:", error);
    }
  };
  const onSubmit = async (data: FormData) => {
    const {
      freightCharges,
      CGST,
      SGST,
      IGST,
      cgstAmount,
      sgstAmount,
      igstAmount,
      finalPriceExclTax,
      totalTax,
      finalPriceInclTax,
      productsCalculations,
      totalPriceExclTax,
    } = calculateTotals(data);

    const enquiryQuotation = {
      draft: true,
      productName: enquiry?.enquiry?.productName,
      modelName: enquiry?.enquiry?.productModel?.modelName,
      hsn: enquiry.product?.hsn,
      freightCharges,
      CGST,
      SGST,
      IGST,
      cgstAmount,
      sgstAmount,
      igstAmount,
      finalPriceExclTax,
      finalPriceInclTax,
      totalTax,
      Quantity: enquiry?.enquiry?.quantity,
      finalAmount: finalPriceInclTax,
      totalPriceExclTax,
      totalPriceExclTaxwords: numberToIndianCurrencyWords(
        +calculateTotals(watch()).finalPriceInclTax
      ),
    };

    const updateData = {
      ...data,
      CGST,
      SGST,
      IGST,
      totalTax,
      dataQuotation: productsCalculations.map((product: any) => ({
        ...product,
      })),
      enquiryQuotation,
      status:
        enquiry?.enquiry?.status == "Revision Request Resend-user"
          ? "Revision Request Resend-admin"
          : "Quotation Received",
    };
    setData(updateData);
    setShow(true);
  };

  useEffect(() => {
    if (!enquiry?.enquiry?.dataQuotation?.length) {
      reset({
        ...enquiry?.enquiry,
        ...enquiry?.enquiry?.enquiryQuotation,
        CGST: parseInt(
          enquiry?.enquiry?.enquiryQuotation?.CGST
            ? enquiry?.enquiry?.enquiryQuotation?.CGST
            : 0
        ),
        SGST: parseInt(
          enquiry?.enquiry?.enquiryQuotation?.SGST
            ? enquiry?.enquiry?.enquiryQuotation?.SGST
            : 0
        ),
        IGST: parseInt(
          enquiry?.enquiry?.enquiryQuotation?.IGST
            ? enquiry?.enquiry?.enquiryQuotation?.IGST
            : 0
        ),
        products: enquiry?.enquiry?.totalCart?.map((item: any) => ({
          basePrice: item.productModel?.basePrice || 0,
          markup: 0,
          discount: 0,
          productName: item.productName || "-",
          modelName: item.productModel?.modelName || "-",
          quantity: item?.quantity || 1,
          hsn: item?.hsn || "",
        })),
      });
    }

    if (enquiry?.enquiry?.dataQuotation?.length) {
      reset({
        ...enquiry?.enquiry,
        ...enquiry?.enquiry?.enquiryQuotation,
        CGST: parseInt(
          enquiry?.enquiry?.enquiryQuotation?.CGST
            ? enquiry?.enquiry?.enquiryQuotation?.CGST
            : 0
        ),
        SGST: parseInt(
          enquiry?.enquiry?.enquiryQuotation?.SGST
            ? enquiry?.enquiry?.enquiryQuotation?.SGST
            : 0
        ),
        IGST: parseInt(
          enquiry?.enquiry?.enquiryQuotation?.IGST
            ? enquiry?.enquiry?.enquiryQuotation?.IGST
            : 0
        ),
        products: enquiry?.enquiry?.dataQuotation,
      });
    }
  }, [
    enquiry,
    enquiry?.enquiry?.totalCart,
    enquiry?.enquiry?.dataQuotation,
    reset,
  ]);

  const options1 = [0, 9];
  const options2 = [0, 18];
  const isDisabled =
    enquiry?.enquiry?.enquiryQuotation?.draft &&
    enquiry?.enquiry?.status !== "Revision Request Resend-user";

  return (
    <div className="row p-0 m-0">
      <div className="col-12 ">
        <h2>Enquiry Quotation</h2>

        <Form>
          <div className="row mx-0 px-0">
            <div className="col-md-3">
              <Form.Group
                className="mb-3 form-group"
                controlId={`estimatedTime`}
              >
                <Form.Label>
                  Estimated Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  disabled={isDisabled}
                  {...register(`estimatedTime`, { required: true })}
                  placeholder="3 Days"
                />
              </Form.Group>
            </div>
          </div>
          <div className="row mx-0 px-0">
            {productsFields &&
              productsFields.map((field, index) => (
                <div className="mb-2" key={field.id}>
                  <small>{field?.productName}</small>
                  <div className="row">
                    <div className="col-md-3 d-none">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`productName-${index}`}
                      >
                        <Form.Label>
                          Product Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          {...register(`products.${index}.productName`)}
                          placeholder="Enter product name"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3 d-none">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`modelName-${index}`}
                      >
                        <Form.Label>
                          Model Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          {...register(`products.${index}.modelName`)}
                          placeholder="Enter model name"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3 d-none">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`quantity-${index}`}
                      >
                        <Form.Label>
                          Quantity<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          {...register(`products.${index}.quantity`)}
                          placeholder="Enter quantity"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`hsn-${index}`}
                      >
                        <Form.Label>
                          HSN/SAC<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isDisabled}
                          {...register(`products.${index}.hsn`, {
                            required: "HSN/SAC is required",
                          })}
                          placeholder="Enter HSN/SAC"
                        />
                        {errors.products &&
                          (errors.products as any)[index]?.hsn && (
                            <span className="text-danger">
                              {(errors.products as any)[index].hsn?.message}
                            </span>
                          )}
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`basePrice-${index}`}
                      >
                        <Form.Label>
                          Base Price<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled={isDisabled}
                          {...register(`products.${index}.basePrice`, {
                            required: "Base price is required",
                          })}
                          placeholder="Enter base price"
                        />
                        {errors.products &&
                          (errors.products as any)[index]?.basePrice && (
                            <span className="text-danger">
                              {
                                (errors.products as any)[index].basePrice
                                  ?.message
                              }
                            </span>
                          )}
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`markup-${index}`}
                      >
                        <Form.Label>
                          Markup (%)<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled={isDisabled}
                          {...register(`products.${index}.markup`, {
                            required: "Markup is required",
                          })}
                          placeholder="Enter markup percentage"
                        />
                        {errors.products &&
                          (errors.products as any)[index]?.markup && (
                            <span className="text-danger">
                              {(errors.products as any)[index].markup?.message}
                            </span>
                          )}
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`discount-${index}`}
                      >
                        <Form.Label>
                          Discount (%)<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled={isDisabled}
                          {...register(`products.${index}.discount`, {
                            required: "Discount is required",
                          })}
                          placeholder="Enter discount percentage"
                        />
                        {errors.products &&
                          (errors.products as any)[index]?.discount && (
                            <span className="text-danger">
                              {
                                (errors.products as any)[index].discount
                                  ?.message
                              }
                            </span>
                          )}
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group
                        className="mb-3 form-group"
                        controlId={`unit-${index}`}
                      >
                        <Form.Label>
                          Unit/s<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isDisabled}
                          {...register(`products.${index}.unit`, {
                            required: "Unit is required",
                          })}
                          placeholder="e.g. pcs, kg, pair/s"
                        />
                        {errors.products &&
                          (errors.products as any)[index]?.unit && (
                            <span className="text-danger">
                              {(errors.products as any)[index].unit?.message}
                            </span>
                          )}
                      </Form.Group>
                    </div>
                  </div>
                </div>
              ))}
            <div className="col-md-3">
              <Form.Group
                className="mb-3 form-group"
                controlId="freightCharges"
              >
                <Form.Label>
                  Freight Charges<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  disabled={
                    enquiry?.enquiry?.enquiryQuotation?.draft &&
                    enquiry?.enquiry?.status !== "Revision Request Resend-user"
                  }
                  {...register("freightCharges", {
                    required: "Freight Charges is required",
                  })}
                  placeholder="Enter freight charges"
                />
                {errors && errors?.freightCharges && (
                  <span className="text-danger">
                    {errors.freightCharges?.message}
                  </span>
                )}
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group className="mb-3 form-group" controlId="CGST">
                <Form.Label>
                  CGST<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  disabled={
                    enquiry?.enquiry?.enquiryQuotation?.draft &&
                    enquiry?.enquiry?.status !== "Revision Request Resend-user"
                  }
                  {...register("CGST", { required: true })}
                >
                  {options1.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
                {errors.CGST && (
                  <span className="text-danger">This field is required</span>
                )}
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group className="mb-3 form-group" controlId="SGST">
                <Form.Label>
                  SGST<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  disabled={
                    enquiry?.enquiry?.enquiryQuotation?.draft &&
                    enquiry?.enquiry?.status !== "Revision Request Resend-user"
                  }
                  {...register("SGST", { required: true })}
                >
                  {options1.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
                {errors.SGST && (
                  <span className="text-danger">This field is required</span>
                )}
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group className="mb-3 form-group" controlId="IGST">
                <Form.Label>
                  IGST<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  disabled={
                    enquiry?.enquiry?.enquiryQuotation?.draft &&
                    enquiry?.enquiry?.status !== "Revision Request Resend-user"
                  }
                  {...register("IGST", { required: true })}
                >
                  {options2.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
                {errors.IGST && (
                  <span className="text-danger">This field is required</span>
                )}
              </Form.Group>
            </div>
          </div>
          <div className="col-12">
            <p>
              <b>Calculation</b>
            </p>
            {/* Product-wise calculations */}
            {watch("products")?.map((product: any, index: number) => {
              const { discountedPriceWithQuantity } =
                calculateProductPrice(product);
              return (
                <div className="row" key={index}>
                  <div className="col-lg-4 col-md-6">
                    <p>
                      <b>Product:</b> {index + 1}
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <p>
                      <b>Base Price:</b> {product?.basePrice}
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <p>
                      <b>Markup:</b> {product.markup}%
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <p>
                      <b>Units:</b> {product.unit}
                    </p>
                  </div>
                  {/*<p>MRP: {MRP}</p>*/}
                  <div className="col-lg-4 col-md-6">
                    <p>
                      <b>Discount:</b> {product.discount}%
                    </p>
                  </div>
                  {/*<p>Discount Value: {discountValue}</p>*/}
                  <div className="col-lg-4 col-md-6">
                    <p>
                      <b>Discounted Price With Quantity:</b>{" "}
                      {discountedPriceWithQuantity}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* Total Calculations */}
            {(() => {
              const totals = calculateTotals(watch());
              return (
                <>
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>Total Price (Excl. Tax):</b>{" "}
                        {totals.totalPriceExclTax}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>Freight Charges:</b> {totals.freightCharges}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>Final Price (Excl. Tax):</b>{" "}
                        {totals.finalPriceExclTax}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>CGST Amount ({totals.CGST}%):</b> {totals.cgstAmount}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>SGST Amount ({totals.SGST}%):</b> {totals.sgstAmount}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>IGST Amount ({totals.IGST}%):</b> {totals.igstAmount}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>Total Tax:</b> {totals.totalTax}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <p>
                        <b>Final Price (Incl. Tax):</b>{" "}
                        {totals.finalPriceInclTax}
                      </p>
                    </div>
                  </div>
                  {/*<p>Quantity: {enquiry?.enquiry?.quantity}</p>
                                    <p>Final Amount: {+(enquiry?.enquiry?.quantity) * +totals.finalPriceInclTax}</p>*/}
                </>
              );
            })()}
          </div>

          <div className="col-12">
            <div
              style={{
                // maxWidth: "600px",
                // margin: "auto",
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  color: "#333",
                  marginBottom: "13px",
                }}
              >
                Quotation Details
              </h2>
              <div style={{ border: "1px solid #000" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={styles.th}>S.No</th>
                      <th style={styles.th}>Description, Item Code</th>
                      <th style={styles.th}>HSN/SAC</th>
                      <th style={styles.th}>Unit/s</th> {/* NEW */}

                      <th style={styles.th}>Qty (in Unit/s)</th>
                      <th style={styles.th}>
                        Rate in Rs/Unit (not including taxes if applicable)
                      </th>
                      <th style={styles.th}>Discount %</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        Amount in Rs.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsFields.map((field, index) => {
                      const product = watch(`products.${index}`);
                      const {
                        productName,
                        modelName,
                        quantity,
                        hsn,
                        discount,
                        MRP,
                        discountedPriceWithQuantity,
                      } = calculateProductPrice(product);

                      return (
                        <tr key={field.id}>
                          <td style={styles.td}>{index + 1}</td>
                          <td style={styles.td}>
                            {productName}, {modelName}
                          </td>
                          <td style={styles.td}>{hsn}</td>
                          <td style={styles.td}>{product.unit}</td> {/* NEW */}

                          <td style={styles.td}>{quantity}</td>
                          <td style={styles.td}>{MRP}</td>
                          <td style={styles.td}>{discount}</td>
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {discountedPriceWithQuantity}
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{ fontWeight: "bold" }}>
                      <td colSpan={6} style={styles.td}>
                        TOTAL
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {calculateTotals(watch()).totalPriceExclTax}
                      </td>
                    </tr>
                    <tr style={{ fontStyle: "italic" }}>
                      <td colSpan={2} style={styles.td}>
                        QUOTATION VALUE IN WORDS
                      </td>
                      <td colSpan={5} style={styles.td}>
                        {numberToIndianCurrencyWords(
                          calculateTotals(watch()).finalPriceInclTax
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "50%",
                    marginLeft: "auto",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={styles.td}>Freight/P&F (In Rs)</td>
                      <td style={{ ...styles.td, textAlign: "right" }}></td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {calculateTotals(watch()).freightCharges}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.td}>CGST</td>
                      <td style={styles.td}>
                        {calculateTotals(watch()).CGST}%
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {calculateTotals(watch()).cgstAmount}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.td}>SGST</td>
                      <td style={styles.td}>
                        {calculateTotals(watch()).SGST}%
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {calculateTotals(watch()).sgstAmount}
                      </td>
                    </tr>
                    <tr style={{ fontSize: "0.8em" }}>
                      <td style={styles.td}>IGST</td>
                      <td style={styles.td}>
                        {calculateTotals(watch()).IGST}%
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {calculateTotals(watch()).igstAmount}
                      </td>
                    </tr>
                    <tr
                      style={{
                        fontWeight: "bold",
                        borderTop: "2px solid black",
                      }}
                    >
                      <td style={styles.td} colSpan={2}>
                        GRAND TOTAL
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {calculateTotals(watch()).finalPriceInclTax}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-12 text-end mt-3">
            {!enquiry?.enquiry?.enquiryQuotation?.draft && (
              <button
                onClick={handleSubmit(onSubmitDraft)}
                className="btn btn-primary me-3"
              >
                Draft
              </button>
            )}
            {!enquiry?.enquiry?.enquiryQuotation?.draft && (
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="btn btn-primary"
              >
                Submit
              </button>
            )}
            {enquiry?.enquiry?.status === "Revision Request Resend-user" && (
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="btn btn-primary"
              >
                {enquiry?.enquiry?.status == "Revision Request Resend-user" &&
                  "Resend Quotation"}
              </button>
            )}
          </div>
        </Form>
      </div>
      <EnquiryQuotationModel
        data={data}
        show={show}
        handleClose={handleClose}
        enquiryData={enquiry?.enquiry}
      />
    </div>
  );
}

export default CartEnquiryQuotation;
