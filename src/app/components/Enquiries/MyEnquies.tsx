"use client"
import React, { useEffect, useState } from 'react'
import PurchaseModel from './PurchaseModel';
import AttachedPaymentModel from './AttachedPaymentModel';
import { Modal } from 'react-bootstrap';
import { enquiryUser } from './enquiryStatus';
import { getPaymentMethods } from '@/app/services/PaymentMethod/paymentMethodApi';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox } from '@mui/material';
import { updateEnquiry } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import { useDispatch } from 'react-redux';
import { FaInfoCircle } from 'react-icons/fa';

function MyEnquies({ enquiry }: any) {

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
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [havePurchaseOrder, setHavePurchaseOrder] = useState(enquiry?.enquiry.status === "Purchase Order" ? true : false);
    const [showDialog, setShowDialog] = useState(false);

    const handleCheckboxChange = (e: any) => {
        if (e.target.checked) {
            setShowDialog(true); // Show dialog on checking
        }
    };

    const handleConfirm = async () => {

        const body = { id: enquiry?.enquiry?._id, _id: enquiry?.enquiry?._id, status: "Purchase Order" }

        try {
            const response = await updateEnquiry(enquiry?.enquiry?._id, body);
            if (response) {
                dispatch(increment());
                setHavePurchaseOrder(true);
                setShowDialog(false);
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }
    };

    const handleCancel = () => {
        setHavePurchaseOrder(false);
        setShowDialog(false);
    };



    const [paymentDetaild, setPaymentDetaild] = useState({});
    const [payment, setPayment] = useState(false);

    const [showAttachedModel, setShowAttachedModel] = useState(false);
    const handleClosesetShowAttachedModel = () => setShowAttachedModel(false);

    const getPaymentData = async () => {
        try {
            const data = await getPaymentMethods();
            setPaymentDetaild(data?.data[0])
        } catch (error) {
            console.error("Error fetching payment:", error);
        }
    };

    useEffect(() => {
        getPaymentData();
    }, []);

    return (
        <>
            <div className="row p-0 m-0 position-relative">
                {(enquiry?.enquiry.status == "Offline Payment Selected") &&
                    <span >
                        <button onClick={() => setPayment(true)} className="btn btn-primary position-absolute" style={{ top: "30px", right: "10px" }}>
                            {(enquiry?.enquiry.status == "Offline Payment Selected" || enquiry?.enquiry.status == "Offline Payment Selected" || enquiry?.enquiry.status == "Slip Submited") && "Payment Method"}
                        </button>
                    </span> || ""}

                {enquiry?.enquiry.invoiceImage &&
                    <span >
                        <a href={enquiry?.enquiry.invoiceImage} className="btn btn-primary position-absolute" target='_blank' style={{ top: "30px", right: "10px" }}>
                            Download Invoice
                        </a>
                    </span> || ""}

                {!enquiry?.enquiry && <div className="col-md-8">
                    <h4>{enquiry?.enquiry?.productName}</h4>
                    <p><b>Model:</b> {enquiry?.enquiry?.productModel?.modelName}</p>
                </div>}

                <div className="col-md-5">
                    {/* <h6>Status: <span className={`${enquiry?.enquiry?.status == 'Quotation Received' ? "text-success" : 'text-warning'}`}>{enquiry?.enquiry?.status}</span></h6> */}
                    <h6>Status: <span className={`${enquiry?.enquiry?.status == 'Quotation Received' ? "text-success" : 'text-warning'}`}>{enquiryUser(enquiry?.enquiry?.status)}</span></h6>
                </div>

                <div className="col-12 mt-3">
                    {enquiry?.enquiry?.enquiryNo ? <p><b>Enquiry No:</b> {enquiry?.enquiry?.enquiryNo}</p> : ""}
                    {!enquiry?.enquiry && <>
                        <p><b>Enquiry No:</b> {enquiry?.enquiry?.enquiryNo ? enquiry?.enquiry?.enquiryNo : ""}</p>
                        <p><b>Category:</b> {enquiry?.enquiry?.category?.categoryName ? enquiry?.enquiry?.category?.categoryName : enquiry?.enquiry?.category}</p>
                        <p><b>Quantity:</b> {enquiry?.enquiry?.quantity}</p>
                    </>
                    }
                    <p><b>Customer Name:</b> {enquiry?.enquiry?.customerName}</p>
                    <p><b>Email:</b> {enquiry?.enquiry?.email}</p>
                    <p><b>Phone:</b> {enquiry?.enquiry?.phone}</p>
                    <p><b>Company Name:</b> {enquiry?.enquiry?.companyName}</p>
                    {enquiry?.enquiry?.comment && <p><b>Comment:</b> {enquiry?.enquiry?.comment}</p>}
                </div>

                <PurchaseModel paymentDetaild={paymentDetaild} show={show} handleClose={handleClose} enquiryData={enquiry?.enquiry} />
                <AttachedPaymentModel showAttachedModel={showAttachedModel} handleClosesetShowAttachedModel={handleClosesetShowAttachedModel} enquiryData={enquiry?.enquiry} />

                <Modal size='lg' centered show={payment} className="signInUp_modal">
                    <Modal.Header className='border-0' closeButton onHide={() => setPayment(false)}>
                        <Modal.Title>Payment Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>{enquiry?.enquiry.status}</h5>
                        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sequi eius sunt aliquam, est doloribus nemo pariatur consectetur. Animi beatae cupiditate perspiciatis, dolorum odit iste, quidem doloremque dolorem voluptatem ipsam, molestiae numquam corporis adipisci. Illum alias nobis eaque in dolor recusandae dicta, deleniti id modi dolorem, sunt dolores velit cum, magnam praesentium sint eius odit mollitia commodi voluptates pariatur. Sit id cumque dicta! Labore, voluptatum voluptates! Veritatis ipsam quas voluptates placeat delectus distinctio a, incidunt sint sapiente repudiandae libero recusandae atque eveniet rem est dolores quidem sequi voluptate. Sapiente ea illum deserunt eum veritatis esse illo totam, minima perspiciatis numquam.</span>
                    </Modal.Body>
                </Modal>
            </div>
            {enquiry?.enquiry?.trackingDetails ? <div
                style={{
                    // maxWidth: "600px",
                    // margin: "auto",
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}>
                {enquiry?.enquiry?.trackingDetails && <h4>Tracking Details</h4>}
                {enquiry?.enquiry?.trackingDetails?.trackingId && <p><b>Tracking Id:</b> {enquiry?.enquiry?.trackingDetails?.trackingId}</p>}
                {enquiry?.enquiry?.trackingDetails?.courierPartnerName && <p><b>Courier Partner Name:</b> {enquiry?.enquiry?.trackingDetails?.courierPartnerName}</p>}
                {enquiry?.enquiry?.trackingDetails?.contactNumber && <p><b>Contact Number:</b> {enquiry?.enquiry?.trackingDetails?.contactNumber}</p>}
            </div> : ""
            }
            {enquiry?.enquiry?.enquiryQuotation?.draft && <div className="row p-0 mm-0 my-30 position-relative">
                {enquiry?.enquiry?.enquiryQuotation?.finalAmount && !enquiry?.enquiry?.isCart && <div className="col-12">
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
                                        <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.productName}, {enquiry?.enquiry?.enquiryQuotation?.modelName}</td>
                                        <td style={styles.td}>{enquiry.product?.hsn}</td>
                                        <td style={styles.td}>{enquiry?.enquiry?.quantity}</td>
                                        <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.MRP}</td>
                                        <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.perDiscount}</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.finalPriceExclTax}</td>
                                    </tr>
                                    <tr style={{ fontWeight: "bold" }}>
                                        <td colSpan={6} style={styles.td}>TOTAL</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.finalPriceExclTax}</td>
                                    </tr>
                                    <tr style={{ fontStyle: "italic" }}>
                                        <td colSpan={2} style={styles.td}>QUOTATION VALUE IN WORDS</td>
                                        <td colSpan={5} style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.discountedPricewors}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table style={{ borderCollapse: "collapse", width: "50%", marginLeft: "auto" }}>
                                <tbody>
                                    <tr>
                                        <td style={styles.td}>Freight/P&F (In Rs)</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}></td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.freightCharges}</td>
                                    </tr>
                                    <tr>
                                        <td style={styles.td}>CGST</td>
                                        <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.CGST}%</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.cgstAmount}</td>
                                    </tr>
                                    <tr>
                                        <td style={styles.td}>SGST</td>
                                        <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.SGST}%</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.sgstAmount}</td>
                                    </tr>
                                    <tr style={{ fontSize: "0.8em" }}>
                                        <td style={styles.td}>IGST</td>
                                        <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.IGST}%</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.igstAmount}</td>
                                    </tr>
                                    <tr style={{ fontWeight: "bold", borderTop: "2px solid black" }}>
                                        <td style={styles.td} colSpan={2}>GRAND TOTAL</td>
                                        <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.finalPriceInclTax}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}

                {
                    enquiry?.enquiry?.dataQuotation && enquiry?.enquiry?.isCart && <div className="col-12">
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
                                        {enquiry?.enquiry?.dataQuotation?.map((item: any, index: number) => {
                                            return (
                                                <tr key={index + 1}>
                                                    <td style={styles.td}>{index + 1}</td>
                                                    <td style={styles.td}>{item?.productName}, {item?.modelName}</td>
                                                    <td style={styles.td}>{item?.hsn}</td>
                                                    <td style={styles.td}>{item?.quantity}</td>
                                                    <td style={styles.td}>{item?.MRP}</td>
                                                    <td style={styles.td}>{item?.discount}</td>
                                                    <td style={{ ...styles.td, textAlign: "right" }}>{item?.discountedPriceWithQuantity}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr style={{ fontWeight: "bold" }}>
                                            <td colSpan={6} style={styles.td}>TOTAL</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.totalPriceExclTax}</td>
                                        </tr>
                                        <tr style={{ fontStyle: "italic" }}>
                                            <td colSpan={2} style={styles.td}>QUOTATION VALUE IN WORDS</td>
                                            <td colSpan={5} style={styles.td}>{(enquiry?.enquiry?.enquiryQuotation?.totalPriceExclTaxwords)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table style={{ borderCollapse: "collapse", width: "50%", marginLeft: "auto" }}>
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>Freight/P&F (In Rs)</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}></td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.freightCharges}</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>CGST</td>
                                            <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.CGST}%</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.cgstAmount}</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>SGST</td>
                                            <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.SGST}%</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.sgstAmount}</td>
                                        </tr>
                                        <tr style={{ fontSize: "0.8em" }}>
                                            <td style={styles.td}>IGST</td>
                                            <td style={styles.td}>{enquiry?.enquiry?.enquiryQuotation?.IGST}%</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.igstAmount}</td>
                                        </tr>
                                        <tr style={{ fontWeight: "bold", borderTop: "2px solid black" }}>
                                            <td style={styles.td} colSpan={2}>GRAND TOTAL</td>
                                            <td style={{ ...styles.td, textAlign: "right" }}>{enquiry?.enquiry?.enquiryQuotation?.finalAmount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                <div className="col-12 text-end mt-3">

                    {
                        enquiry?.enquiry.status != "Slip Submited" && enquiry?.enquiry.status !== "Purchase Order" && enquiry?.enquiry.status !== "Pending" && enquiry?.enquiry.status !== 'Proof Received' &&
                        enquiry?.enquiry?.status != "Proof Received" && enquiry?.enquiry?.status != "Preparing For Shipment" && enquiry?.enquiry.status != "Product Shipped" &&
                        enquiry?.enquiry?.status != "Tracking" && enquiry?.enquiry?.status != "Delivered" && enquiry?.enquiry?.status != "Invoice has been send" &&
                        <button className="btn btn-primary" disabled={enquiry?.enquiry.status === "Purchase Order"} onClick={() => {
                            if (enquiry?.enquiry.status == "Payment Resent") {
                                setShowAttachedModel(true);
                            } else {
                                setShow(true);
                            }
                        }} >
                            {enquiry?.enquiry.status == "Payment Resent" ? "Request - Reverification" : 'Purchase'}
                        </button> || ""
                    }
                    <br />
                    {enquiry?.enquiry.status != "Payment Resent" && enquiry?.enquiry.status != "Slip Submited" && enquiry?.enquiry.status !== "Pending" && enquiry?.enquiry.status !== 'Proof Received' &&
                        enquiry?.enquiry?.status != "Proof Received" && enquiry?.enquiry?.status != "Preparing For Shipment" && enquiry?.enquiry.status != "Product Shipped" &&
                        enquiry?.enquiry?.status != "Tracking" && enquiry?.enquiry?.status != "Delivered" && enquiry?.enquiry?.status != "Invoice has been send" &&
                        <span className='d-flex gap-3'>
                            <Checkbox
                                id="HavePurchaseOrder"
                                checked={havePurchaseOrder || enquiry?.enquiry.status === "Purchase Order"}
                                disabled={enquiry?.enquiry.status === "Purchase Order"}
                                onChange={handleCheckboxChange}
                                sx={{
                                    p: 0,
                                    // color: 'red',
                                    '&.Mui-checked': {
                                        color: enquiry?.enquiry.status === "Purchase Order" ? '#EE6262' : 'red',
                                    },
                                }}
                            />
                            <label htmlFor="HavePurchaseOrder">I have a Purchase Order{enquiry?.enquiry.status === "Purchase Order" && <FaInfoCircle className='ms-1' onMouseOver={() => setShowDialog(true)} />}</label>
                        </span>}
                    <Dialog open={showDialog} onClose={handleCancel}>
                        <DialogTitle>Purchase Order</DialogTitle>
                        <DialogContent>
                            Please drop us an email to jp_ascal@yahoo.com (Juzer Abbasbhai, Proprietor) with the Purchase Order attached for placing an order / for further communications or updates regarding the same.
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancel} color="error">Cancel</Button>
                            {enquiry?.enquiry.status !== "Purchase Order" && <Button onClick={handleConfirm} sx={{ backgroundColor: "#2A5A84" }} variant="contained">Confirm</Button>}
                        </DialogActions>
                    </Dialog>
                </div>
            </div>}
        </>
    )
}

export default MyEnquies