import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import EnquiryQuotationModel from './EnquiryQuotationModel';
import { enquiryQuotation as enquiryQuotationDraft } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import { useDispatch } from 'react-redux';
import { numberToIndianCurrencyWords } from './numberToIndianCurrencyWords';

function EnquiryQuotation({ enquiry }: { enquiry: any }) {

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

    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm();

    const [data, setData] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const calculateValues = (data: any) => {
        const basePrice = parseFloat(data.basePrice || 0);
        const markup = parseFloat(data.markup || 0);
        const discount = parseFloat(data.discount || 0);
        const freightCharges = parseFloat(data.freightCharges || 0);
        const CGST = parseFloat(data.CGST || 0);
        const SGST = parseFloat(data.SGST || 0);
        const IGST = parseFloat(data.IGST || 0);
        const markupValue = (basePrice * markup) / 100;
        const MRP = basePrice + markupValue;
        const discountValue = (MRP * discount) / 100;
        const discountedPrice = MRP - discountValue;
        const finalPriceExclTax = (discountedPrice) * (+enquiry?.enquiry?.quantity);
        const amount = finalPriceExclTax + freightCharges
        const cgstAmount = (amount * CGST) / 100;
        const sgstAmount = (amount * SGST) / 100;
        const igstAmount = (amount * IGST) / 100;
        const totalTax = cgstAmount + sgstAmount + igstAmount;
        const finalPriceInclTax = amount + totalTax;


        return {
            basePrice: basePrice.toFixed(2),
            markup: markup.toFixed(2),
            discount: discount.toFixed(2),
            freightCharges: freightCharges.toFixed(2),
            CGST: CGST.toFixed(2),
            SGST: SGST.toFixed(2),
            IGST: IGST.toFixed(2),
            markupValue: markupValue.toFixed(2),
            MRP: MRP.toFixed(2),
            discountValue: discountValue.toFixed(2),
            discountedPrice: discountedPrice.toFixed(2),
            finalPriceExclTax: finalPriceExclTax.toFixed(2),
            cgstAmount: cgstAmount.toFixed(2),
            sgstAmount: sgstAmount.toFixed(2),
            igstAmount: igstAmount.toFixed(2),
            totalTax: totalTax.toFixed(2),
            finalPriceInclTax: finalPriceInclTax.toFixed(2),
        };
    };

    const onSubmitDraft = async (data: any) => {
        const calculatedValues = calculateValues(data);

        const enquiryQuotation = {
            draft: false,
            productName: enquiry?.enquiry?.productName,
            modelName: enquiry?.enquiry?.productModel?.modelName,
            perDiscount: data.discount,
            discountedPricewors: numberToIndianCurrencyWords(+(enquiry?.enquiry?.quantity) * +calculatedValues.finalPriceInclTax),
            hsn: enquiry.product?.hsn,
            ...calculatedValues,
            Quantity: enquiry?.enquiry?.quantity,
            finalAmount: +(enquiry?.enquiry?.quantity) * +calculatedValues.finalPriceInclTax
        };

        const updateData = {
            ...data,
            ...calculatedValues,
            enquiryQuotation
        };

        const body = { id: enquiry?.enquiry?._id, _id: enquiry?.enquiry?._id, ...updateData };
        try {
            if (data) {
                const response = await enquiryQuotationDraft(enquiry?.enquiry?._id, body);
                handleClose();
                if (response) {
                    dispatch(increment());
                }
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }
    };

    const onSubmit = (data: any) => {
        const calculatedValues = calculateValues(data);

        const enquiryQuotation = {
            draft: true,
            productName: enquiry?.enquiry?.productName,
            modelName: enquiry?.enquiry?.productModel?.modelName,
            perDiscount: data.discount,
            discountedPricewors: numberToIndianCurrencyWords(+(enquiry?.enquiry?.quantity) * +calculatedValues.finalPriceInclTax),
            hsn: enquiry.product?.hsn,
            ...calculatedValues,
            Quantity: enquiry?.enquiry?.quantity,
            finalAmount: +(enquiry?.enquiry?.quantity) * +calculatedValues.finalPriceInclTax
        };

        const updateData = {
            ...data,
            ...calculatedValues,
            enquiryQuotation,
            status: enquiry?.enquiry?.status == "Revision Request Resend-user" ? "Revision Request Resend-admin" : "Quotation Received",
        };
        setData(updateData);
        setShow(true);
    };

    const options1 = [0, 9];
    const options2 = [0, 18];

    useEffect(() => {
        if (enquiry?.enquiry?.productModel?.basePrice) {
            reset({
                ...enquiry?.enquiry,
                ...enquiry?.enquiry?.enquiryQuotation,
                CGST: parseInt(enquiry?.enquiry?.enquiryQuotation?.CGST ? enquiry?.enquiry?.enquiryQuotation?.CGST : 0),
                SGST: parseInt(enquiry?.enquiry?.enquiryQuotation?.SGST ? enquiry?.enquiry?.enquiryQuotation?.SGST : 0),
                IGST: parseInt(enquiry?.enquiry?.enquiryQuotation?.IGST ? enquiry?.enquiry?.enquiryQuotation?.IGST : 0),
                basePrice: enquiry?.enquiry?.enquiryQuotation?.basePrice ? enquiry?.enquiry?.enquiryQuotation?.basePrice : +enquiry.enquiry.productModel.basePrice,
            });
        }
    }, [enquiry, reset]);

    const calculatedValues = calculateValues(watch());

    return (
        <div className="row">
            <div className="col-12 ">
                <h2>Enquiry Quotation</h2>

                <Form>
                    <div className="row">
                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="basePrice">
                                <Form.Label>Base Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"}
                                    {...register('basePrice', { required: true })}
                                    placeholder="Enter base price"
                                />
                                {errors.basePrice && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>

                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="markup">
                                <Form.Label>Markup (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"}
                                    {...register('markup', { required: true })}
                                    placeholder="Enter markup percentage"
                                />
                                {errors.markup && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="discount">
                                <Form.Label>Discount (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"}
                                    {...register('discount', { required: true })}
                                    placeholder="Enter discount percentage"
                                />
                                {errors.discount && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="freightCharges">
                                <Form.Label>Freight Charges</Form.Label>
                                <Form.Control
                                    type="number"
                                    disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"}
                                    {...register('freightCharges', { required: true })}
                                    placeholder="Enter freight charges"
                                />
                                {errors.freightCharges && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="CGST">
                                <Form.Label>CGST</Form.Label>
                                <Form.Control as="select" disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"} {...register('CGST', { required: true })}>
                                    {options1.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Control>
                                {errors.CGST && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="SGST">
                                <Form.Label>SGST</Form.Label>
                                <Form.Control as="select" disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"} {...register('SGST', { required: true })}>
                                    {options1.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Control>
                                {errors.SGST && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group className="mb-3 form-group" controlId="IGST">
                                <Form.Label>IGST</Form.Label>
                                <Form.Control as="select" disabled={enquiry?.enquiry?.enquiryQuotation?.draft && enquiry?.enquiry?.status !== "Revision Request Resend-user"} {...register('IGST', { required: true })}>
                                    {options2.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Control>
                                {errors.IGST && <span className="text-danger">This field is required</span>}
                            </Form.Group>
                        </div>
                    </div>
                    <div className="col-12">
                        <p>Calculation</p>
                        <p>Base Price: {calculatedValues.basePrice}</p>
                        <p>Markup: {calculatedValues.markupValue}</p>
                        <p>MRP: {calculatedValues.MRP}</p>
                        <p>Discount: {calculatedValues.discount}%</p>
                        <p>Discount: {calculatedValues.discountValue}</p>
                        <p>Discounted Price: {calculatedValues.discountedPrice}</p>
                        <p>Freight Charges: {calculatedValues.freightCharges}</p>
                        <p>Quantity: {enquiry?.enquiry?.quantity}</p>
                        <p>Final Price (Excl. Tax): {calculatedValues.finalPriceExclTax}</p>
                        <p>CGST Amount ({calculatedValues.CGST}%): {calculatedValues.cgstAmount}</p>
                        <p>SGST Amount ({calculatedValues.SGST}%): {calculatedValues.sgstAmount}</p>
                        <p>IGST Amount ({calculatedValues.IGST}%): {calculatedValues.igstAmount}</p>
                        <p>Total Tax: {calculatedValues.totalTax}</p>
                        <p>Final Price (Incl. Tax): {calculatedValues.finalPriceInclTax}</p>

                    </div>

                    <div className="col-12">
                        <div
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h2 style={{ textAlign: "center", color: "#333" }}>Quotation Details</h2>
                            <div style={{ border: "1px solid #000" }}>
                                <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Arial, sans-serif" }}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>S.No</th>
                                            <th style={styles.th}>Description, Item Code</th>
                                            <th style={styles.th}>HSN/SAC</th>
                                            <th style={styles.th}>Qty (in No/s)</th>
                                            <th style={styles.th}>Rate in Rs/each (not including taxes if applicable)</th>
                                            <th style={styles.th}>Discount %</th>
                                            <th style={{ ...styles.th, textAlign: "right" }}>Amount in Rs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>1</td>
                                            <td style={styles.td}>{enquiry?.enquiry?.productName}, {enquiry?.enquiry?.productModel?.modelName}</td>
                                            <td style={styles.td}>{enquiry.product?.hsn}</td>
                                            <td style={styles.td}>{enquiry?.enquiry?.quantity}</td>
                                            <td style={styles.td}>{calculatedValues.MRP}</td>
                                            <td style={styles.td}>{calculatedValues.discount}</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.finalPriceExclTax}</td>
                                        </tr>
                                        <tr style={{ fontWeight: "bold" }}>
                                            <td colSpan={6} style={styles.td}>TOTAL</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.finalPriceExclTax}</td>
                                        </tr>
                                        <tr style={{ fontStyle: "italic" }}>
                                            <td colSpan={2} style={styles.td}>QUOTATION VALUE IN WORDS</td>
                                            <td colSpan={5} style={styles.td}>{numberToIndianCurrencyWords(calculatedValues.finalPriceInclTax)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table style={{ borderCollapse: "collapse", width: "50%", marginLeft: "auto" }}>
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>Freight/P&F (In Rs)</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}></td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.freightCharges}</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>CGST</td>
                                            <td style={styles.td}>{calculatedValues.CGST}%</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.cgstAmount}</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>SGST</td>
                                            <td style={styles.td}>{calculatedValues.SGST}%</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.sgstAmount}</td>
                                        </tr>
                                        <tr style={{ fontSize: "0.8em" }}>
                                            <td style={styles.td}>IGST</td>
                                            <td style={styles.td}>{calculatedValues.IGST}%</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.igstAmount}</td>
                                        </tr>
                                        <tr style={{ fontWeight: "bold", borderTop: "2px solid black" }}>
                                            <td style={styles.td} colSpan={2}>GRAND TOTAL</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{calculatedValues.finalPriceInclTax}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 text-end mt-3">
                        {!enquiry?.enquiry?.enquiryQuotation?.draft &&
                            <button onClick={handleSubmit(onSubmitDraft)} className="btn btn-primary me-3">Draft</button>}
                        {!enquiry?.enquiry?.enquiryQuotation?.draft && <button type="submit" onClick={handleSubmit(onSubmit)} className="btn btn-primary">Submit</button>}
                        {enquiry?.enquiry?.status === "Revision Request Resend-user" && <button type="submit" onClick={handleSubmit(onSubmit)} className="btn btn-primary">{enquiry?.enquiry?.status == "Revision Request Resend-user" && "Resend Quotation"}</button>}
                    </div>
                </Form>
            </div>
            <EnquiryQuotationModel data={data} show={show} handleClose={handleClose} enquiryData={enquiry?.enquiry} />
        </div>
    );
}

export default EnquiryQuotation;
