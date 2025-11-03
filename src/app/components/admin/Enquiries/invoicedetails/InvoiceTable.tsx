
import { getInvoices } from '@/app/services/Invoice/InvoiceApi';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invoiceSend } from '@/app/services/Enquiry/EnquiryApi';
import { Modal } from 'react-bootstrap';
import useToast from '@/util/toast';
import { formatDate } from '@/lib/coreFunctions';
import { increment } from '@/app/services/redux/features/counterSlice';
import axios from 'axios';
import Image from 'next/image';
import { generatePdf } from '@/app/services/GeneratePdf/GeneratePdf';
import { FaDownload } from 'react-icons/fa';

const InvoiceTable = ({ data, show, handleClose }: any) => {
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const [downloadText, setDownload] = useState("");

    const [adminInvoice, setAdminInvoice] = useState({
        email: "",
        phone: "",
        address: "",
        companyName: "",
        GSTIN: "",
        CODE: "",
        PAN: "",
        website: "",
        signatory: "",
        bName: "",
        bAddress: "",
        bCity: "",
        bPinCode: "",
        bIFSCode: "",
        bAccountNo: ""
    });
    const counter = useSelector((state: any) => state.counter?.value);
    const { dataInvoice, isCart, dataQuotation, enquiryQuotation } = data || {};

    const isSetInvoise = !adminInvoice?.email ||
        !adminInvoice?.phone ||
        !adminInvoice?.address ||
        !adminInvoice?.companyName ||
        !adminInvoice?.GSTIN ||
        !adminInvoice?.CODE ||
        !adminInvoice?.PAN ||
        !adminInvoice?.website ||
        !adminInvoice?.signatory ||
        !adminInvoice?.bName ||
        !adminInvoice?.bAddress ||
        !adminInvoice?.bCity ||
        !adminInvoice?.bPinCode ||
        !adminInvoice?.bIFSCode


    const generatePDF = async () => {
        try {
            const element: any = document.getElementById("pdf-content");
            if (!element) {
                console.error("Element not found!");
                return;
            }

            const htmlContent = element.innerHTML;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/generatePdf`,
                { htmlContent },
                {
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'blob',
                }
            );

            const blobData = new Blob([response.data], { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('id', data?._id);
            formData.append(
                'invoiceImage',
                blobData,
                `invoice-${dataInvoice?.invoiceNo?.replaceAll("/", '_')}.pdf`
            );

            await invoiceSend(formData);
            dispatch(increment());
            handleClose();
        } catch (error: any) {
            showToast({
                type: 'error',
                message: error?.response?.data?.error || 'Something went wrong!',
            });
        } finally {
            setDownload("")
        }
    };


    const downloadPDF = async () => {
        const element = document.getElementById('pdf-content');
        if (!element) {
            console.error('Element not found');
            return;
        }

        const htmlContent = element.innerHTML;

        try {
            const response = await generatePdf(htmlContent);
            const blobData = await response
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setDownload("")
        }
    };
    const getInvoice = async () => {
        try {
            const data = await getInvoices();
            setAdminInvoice(data?.data);
        } catch (error) {
            console.error("Error fetching invoice:", error);
        }
    };

    useEffect(() => {
        getInvoice();
    }, [counter]);

    return (
        <div>
            <Modal centered show={show} size='xl' className="signInUp_modal">
                <Modal.Header className='border-0' closeButton onHide={() => handleClose()}>
                    <Modal.Title> Invoice Preview </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="pdf_box pb-0 pt-0 table-responsive" id="pdf-content">
                        <table className='mb-0' style={{ border: '2px solid #000', width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}></th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '400px' }} colSpan={3}><u>GST INVOICE</u></th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={5}><u>{downloadText || 'PROFORMA'}</u></th>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>Email:</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', textDecoration: 'underline', fontFamily: 'auto' }} colSpan={3} >JAYPEE ASSOCIATES</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={5}>Address:</th>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>{adminInvoice?.email}</td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>Ph: {adminInvoice?.phone}</td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={5}>{adminInvoice?.address}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px', borderBottom: '2px solid #000' }} colSpan={1}>GSTIN:{adminInvoice?.GSTIN}</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '2px solid #000' }} colSpan={3} >{adminInvoice?.CODE}</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '2px solid #000' }} colSpan={1}>PAN: {adminInvoice?.PAN}</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '2px solid #000' }} colSpan={4}>Website: {adminInvoice?.website}</th>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>INVOICE No:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>{dataInvoice?.invoiceNo}</td>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={1}>Date:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={4}>{formatDate(dataInvoice?.dateFirst)}</td>
                                </tr>

                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>To Name:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>{dataInvoice?.toName}</td>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={1}>CUSTOMER PO. NO.:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={4}>{dataInvoice?.customerPoNo}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>Address:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>{dataInvoice?.address}</td>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={1}>Date:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={4}>{formatDate(dataInvoice?.dateSecond)}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>District/Pin Code:</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>{dataInvoice?.districtPinCode}</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} rowSpan={3} colSpan={1} >Goods dispatched To:</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} rowSpan={3} colSpan={4}>{dataInvoice?.goodsDispatchedTo}</td>
                                </tr>

                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>GST NO:</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>{dataInvoice?.gstNo}</th>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }}>State Code:</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={3}>{dataInvoice?.stateCode}</th>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>S.No</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={2}>Description (Make - TOOLFAST)</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={1}>HSN/SAC</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={1}>Unit/s</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={1}>Qty (in Unit/s)</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={1}>Rate in Rs(/Unit)</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={1}>Discount(%)</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={1}>Amount in Rs.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isCart ?
                                        dataQuotation && dataQuotation?.map((item: any, index: number) => {
                                            return (
                                                <tr key={index} style={{ textAlign: "center" }}>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{index + 1}</td>
                                                    <td colSpan={2} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{item?.productName}</td>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{item?.hsn}</td>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{item?.unit}</td>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{item?.quantity}</td>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>₹{item?.MRP}</td>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{item?.discount}</td>
                                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>₹{item?.discountedPriceWithQuantity}</td>
                                                </tr>
                                            )
                                        })
                                        : <tr style={{ textAlign: "center" }}>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{1}</td>
                                            <td colSpan={3} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{enquiryQuotation?.productName}</td>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{enquiryQuotation?.hsn}</td>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{enquiryQuotation?.unit}</td>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{enquiryQuotation?.Quantity}</td>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{enquiryQuotation?.MRP}</td>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>{enquiryQuotation?.discount}</td>
                                            <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>₹{enquiryQuotation?.finalPriceExclTax}</td>
                                        </tr>
                                }
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px', minWidth: '200px', maxWidth: '200px' }} colSpan={1}>TOTAL INVOICE VALUE IN WORDS</th>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px', textAlign: 'left', textDecoration: 'underline' }} colSpan={6}>
                                        {isCart ? enquiryQuotation?.totalPriceExclTaxwords : enquiryQuotation?.discountedPricewors}
                                    </th>
                                    <th colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }}>TOTAL TAXABILE VALUE</th>
                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px', textAlign: 'right' }}>₹{isCart ? enquiryQuotation?.totalPriceExclTax : enquiryQuotation?.finalPriceExclTax}</td>
                                </tr>

                                <tr style={{ textAlign: "center" }}>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px' }} colSpan={6} rowSpan={5}>
                                        <div style={{ textAlign: "center", width: "100%" }}>
                                            <div style={{ textAlign: "center", width: "100%" }}>
                                                <span style={{ position: "absolute", left: "100px" }}>For-</span>
                                                <span style={{ fontWeight: '700', fontSize: '18px', fontFamily: 'auto' }}>JAYPEE ASSOCIATES</span>
                                            </div>

                                            <div style={{ textAlign: "center", width: "100%" }}>
                                                {adminInvoice?.signatory ? <Image
                                                    id='signatory'
                                                    src={adminInvoice?.signatory}
                                                    width={400}
                                                    height={100}
                                                    alt={`product-image`}
                                                    unoptimized
                                                />
                                                    : ('JAYPEE ASSOCIATES')
                                                }
                                            </div>
                                            <div>
                                                (Authorised Signatory)
                                            </div>
                                        </div>
                                    </td>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'left' }} colSpan={1}>Freight/P&F</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}></td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>₹{enquiryQuotation?.freightCharges}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'left' }} colSpan={1}>CGST</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>{enquiryQuotation?.CGST}%</td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>₹{enquiryQuotation?.cgstAmount}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'left' }} colSpan={1}>SGST</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>{enquiryQuotation?.SGST}%</td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>₹{enquiryQuotation?.sgstAmount}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'left' }} colSpan={1}>IGST</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>{enquiryQuotation?.IGST}%</td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', borderBottom: '1px solid transparent', textAlign: 'right' }} colSpan={1}>₹{enquiryQuotation?.igstAmount}</td>
                                </tr>
                                <tr style={{ textAlign: "center" }}>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', textAlign: 'left' }} >Rounded Off</th>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', textAlign: 'right' }}>-</td>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', textAlign: 'right' }}>-</td>
                                </tr>
                                <tr style={{ backgroundColor: '#fff', padding: '6px', border: '1px solid #ddd', fontSize: '12px', textAlign: "center" }}>
                                    <td style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={6} >
                                        <div className="d-sm-flex justify-content-center  w-100">
                                            <span>ALL Disputes are Subject to Kolkata Jurisdiction</span>
                                        </div>
                                    </td>
                                    <th style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px' }} colSpan={2}>GRAND TOTAL</th>
                                    <td colSpan={1} style={{ backgroundColor: '#fff', padding: '6px', border: '2px solid #000', fontSize: '12px', textAlign: 'right' }}>₹{enquiryQuotation?.finalPriceInclTax}</td>
                                </tr>
                                <tr
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '6px',
                                        border: '2px solid #000',
                                        fontSize: '12px',
                                    }}
                                >
                                    <th
                                        style={{
                                            backgroundColor: '#fff',
                                            padding: '6px',
                                            border: '2px solid #000',
                                            fontSize: '12px',
                                            position: 'relative', // keep if using absolute
                                        }}
                                        colSpan={9}
                                    >
                                        <div className="d-flex justify-content-center pt-2 w-100">
                                            <span>OUR BANK DETAILS - {adminInvoice?.bName}, {adminInvoice?.bAddress}</span>
                                        </div>
                                        <div className="d-flex justify-content-center gap-2 w-100">
                                            <span>{adminInvoice?.bCity} - {adminInvoice?.bPinCode}</span>
                                            <span>CURRENT A/C - {adminInvoice?.bAccountNo}</span>
                                            <span>IFSC CODE - {adminInvoice?.bIFSCode}</span>
                                        </div>

                                        {/* Replace absolute span with flex container */}
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                marginTop: '5px',
                                            }}
                                        >
                                            <span style={{ marginRight: '10px' }}>E.&O.E.</span>
                                        </div>
                                    </th>
                                </tr>

                            </tbody>
                        </table >
                    </div>
                    <div className="col-12 d-flex justify-content-between text-end mt-3">
                        <button className='btn btn-primary' onClick={() => handleClose()}>Edit</button>
                        <div className=' d-flex gap-3'>
                            <button className='btn btn-primary' onClick={
                                () => {
                                    setDownload("ORIGINAL")
                                    if (isSetInvoise) {
                                        showToast({
                                            type: "error", message: "Add all invoice details."
                                        });
                                    } else {
                                        setTimeout(() => {
                                            downloadPDF();
                                        }, 500)
                                    }
                                }
                            }><FaDownload className='me-2' style={{ fontSize: "13px" }} />ORIGINAL</button>
                            <button className='btn btn-primary' onClick={
                                () => {
                                    setDownload("DUPLICATE")
                                    if (isSetInvoise) {
                                        showToast({
                                            type: "error", message: "Add all invoice details."
                                        });
                                    } else {
                                        setTimeout(() => {
                                            downloadPDF();
                                        }, 500)
                                    }
                                }
                            }><FaDownload className='me-2' style={{ fontSize: "13px" }} />DUPLICATE</button>
                            <button className='btn btn-primary' onClick={
                                () => {
                                    setDownload("TRIPLICATE")
                                    if (isSetInvoise) {
                                        showToast({
                                            type: "error", message: "Add all invoice details."
                                        });
                                    } else {
                                        setTimeout(() => {
                                            downloadPDF();
                                        }, 500)
                                    }
                                }
                            }><FaDownload className='me-2' style={{ fontSize: "13px" }} />TRIPLICATE</button>


                            <button className='btn btn-primary' onClick={
                                () => {
                                    setDownload("PROFORMA")
                                    if (isSetInvoise) {
                                        showToast({
                                            type: "error", message: "Add all invoice details."
                                        });
                                    } else {
                                        setTimeout(() => {
                                            generatePDF();
                                        }, 500)
                                    }
                                }
                            }>Send Invoice</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default InvoiceTable;


