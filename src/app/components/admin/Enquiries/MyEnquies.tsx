"use client"
import React, { useState } from 'react';
import ChangeUserStatusModel from './ChangeUserStatusModel';
import { enquiryAdmin } from '../../Enquiries/enquiryStatus';
import TrackingDetailsForm from './trackingDetailsForm';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { updateEnquiryEstimatedTime } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import { useDispatch } from 'react-redux';
import { FaEdit } from 'react-icons/fa';

function MyEnquies({ enquiry }: any) {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm<{ estimatedTime: string }>();
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const onSubmit = (data: any) => {
        setData(data);
        setShow(true);
    };

    const setUnsetEdit = () => {
        setEdit(!edit)
        reset({ estimatedTime: enquiry?.enquiry?.estimatedTime });
    }

    const onUpdateDay = async (data: { estimatedTime: string }) => {
        const body = { id: enquiry?.enquiry?._id, estimatedTime: data?.estimatedTime }
        try {
            if (data) {
                const response = await await updateEnquiryEstimatedTime(body);
                handleClose();
                if (response) {
                    dispatch(increment());
                    setUnsetEdit()
                }
            }
        } catch (error) {
            console.error("Error in POST /api/enquiry:", error);
        }
    };

    return (
        <div className="row p-0 m-0 ">
            <div className="col-md-7">
                <h4>{enquiry?.enquiry?.productName}</h4>
                <h6>Status: <span className={`${enquiry?.enquiry?.status == 'Quotation Received' ? "text-success" : 'text-warning'}`}>
                    {
                        enquiry?.enquiry?.enquiryQuotation?.discountedPricewors ?
                            (
                                !enquiry?.enquiry?.enquiryQuotation.draft ?
                                    "Deaft"
                                    : enquiryAdmin(enquiry?.enquiry?.status)
                            )
                            : enquiryAdmin(enquiry?.enquiry?.status)
                    }
                </span></h6>
                {!enquiry?.enquiry?.isCart &&
                    <p><b>Model:</b> {enquiry?.enquiry?.productModel?.modelName ? enquiry?.enquiry?.productModel?.modelName : enquiry?.enquiry?.productModel}</p>
                }
            </div>

            <div className={`col-md-5 text-end`}>
                {enquiry?.enquiry?.status == "Purchase Order" && <button className='btn btn-primary btn-sm me-3' onClick={() => onSubmit("Quotation Received")}>Back to Quotation Received</button>}
                {enquiry?.enquiry?.status == "Slip Submited" && <button className='btn btn-primary btn-sm me-3' onClick={() => onSubmit("Payment Resent")}>Verification Failed</button>}
                {enquiry?.enquiry?.status == "Slip Submited" && <button className='btn btn-primary btn-sm' onClick={() => onSubmit("Proof Received")}>Proof Verified</button>}
                {enquiry?.enquiry?.status == "Invoice has been send" && <button className='btn btn-primary btn-sm' onClick={() => onSubmit("Preparing For Shipment")}>Preparing For Shipment</button>}
                {/* {enquiry?.enquiry?.status == "Product Shipped" && <button className='btn btn-primary btn-sm' onClick={() => onSubmit("Tracking")}>Tracking</button>} */}
                {enquiry?.enquiry?.status == "Product Shipped" && <button className='btn btn-primary btn-sm' onClick={() => onSubmit("Delivered")}>Delivered</button>}

            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    {enquiry?.enquiry?.enquiryNo ? <p><b>Enquiry No:</b> {enquiry?.enquiry?.enquiryNo}</p> : ""}
                    {enquiry?.enquiry?.category && <div className="col-md-4"><p><b>Category:</b> {enquiry?.enquiry?.category?.categoryName ? enquiry?.enquiry?.category?.categoryName : enquiry?.enquiry?.category}</p></div>}
                    {enquiry?.enquiry?.quantity && <div className="col-md-4"><p><b>Quantity:</b> {enquiry?.enquiry?.quantity}</p></div>}
                    {enquiry?.enquiry?.customerName && <div className="col-md-4"><p><b>Customer Name:</b> {enquiry?.enquiry?.customerName}</p></div>}
                    {enquiry?.enquiry?.email && <div className="col-md-4"><p><b>Email:</b> {enquiry?.enquiry?.email}</p></div>}
                    {enquiry?.enquiry?.phone && <div className="col-md-4"><p><b>Phone:</b> {enquiry?.enquiry?.phone}</p></div>}
                    {enquiry?.enquiry?.paymentSlip && <div className="col-md-4"><p className='d-flex gap-3' ><b>Payment Slip:</b><a className='btn btn-sm py-0 my-0 btn-outline-info' href={enquiry?.enquiry?.paymentSlip} target='_blank'>View</a></p></div>}
                    {enquiry?.enquiry?.purchaseOrder && <div className="col-md-4"><p className='d-flex gap-3' ><b>Purchase Order:</b><a className='btn btn-sm py-0 my-0 btn-outline-info' href={enquiry?.enquiry?.purchaseOrder} target='_blank'>View</a></p></div>}
                    {enquiry?.enquiry?.companyName && <div className="col-md-4"><p><b>Company Name:</b> {enquiry?.enquiry?.companyName}</p></div>}
                    {enquiry?.enquiry?.comment && <div className="col-md-4"><p><b>Comment:</b> {enquiry?.enquiry?.comment}</p></div>}
                    {enquiry?.enquiry?.enquiryQuotation?.finalAmount && <div className="col-md-4"><p><b>Final Amount:</b> {enquiry?.enquiry?.enquiryQuotation?.finalAmount}</p></div>}
                    {enquiry?.enquiry?.step && <div className="col-md-4"><p><b>Step:</b> {enquiry?.enquiry?.step}</p></div>}
                    {enquiry?.enquiry?.gstNumber && <div className="col-md-4"><p><b>GST Number:</b> {enquiry?.enquiry?.gstNumber}</p></div>}
                    {enquiry?.enquiry?.address && <p><b>Address:</b> {enquiry?.enquiry?.address}</p>}
                    {enquiry?.enquiry?.deliveryAddress && enquiry?.enquiry?.deliveryAddress != undefined && enquiry?.enquiry?.deliveryAddress != 'undefined' && <p><b>Delivery Address:</b> {enquiry?.enquiry?.deliveryAddress}</p>}
                    {enquiry?.enquiry?.estimatedTime && <p><b>Estimated Time:</b> {enquiry?.enquiry?.estimatedTime} <span onClick={setUnsetEdit}>{edit ? <IoMdCloseCircleOutline /> : <FaEdit />}</span></p>}
                    {
                        edit &&
                        <div className="col-md-6">
                            <Form onSubmit={handleSubmit(onUpdateDay)} className="d-flex gap-2">
                                <Form.Group className="mb-3 form-group" controlId={`estimatedTime`}>
                                    <Form.Label>Estimated Time<span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register(`estimatedTime`, { required: true })}
                                        placeholder="3 Days"
                                    />
                                </Form.Group>
                                <button className="btn btn-primary me-3" style={{ height: "42px", marginTop: '26px' }}><IoCheckmarkDoneSharp /></button>
                            </Form>
                        </div>
                    }
                </div>
            </div>

            <div className="col-md-6 mt-3">
                {
                    (enquiry?.enquiry?.status === "Preparing For Shipment" ||
                        enquiry?.enquiry?.status === "Product Shipped" ||
                        enquiry?.enquiry?.status === "Delivered"
                        || enquiry?.enquiry?.status === "Tracking")
                    && <TrackingDetailsForm enquiry={enquiry?.enquiry} />
                }
            </div>

            <ChangeUserStatusModel data={data} show={show} handleClose={handleClose} enquiryData={enquiry?.enquiry} />
        </div>
    )
}

export default MyEnquies
