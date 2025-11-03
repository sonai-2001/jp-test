import { updateEnquiry } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

function TrackingDetailsForm({ enquiry }: any) {
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const [edit, setEdit] = useState(false)
    const dispatch = useDispatch();

    const onSubmit = async (data: any) => {
        const body =
            enquiry?.trackingDetails ?
                { id: enquiry?._id, _id: enquiry?._id, trackingDetails: { ...data } }
                : { id: enquiry?._id, _id: enquiry?._id, trackingDetails: { ...data }, status: "Product Shipped" }

        try {
            const response = await updateEnquiry(enquiry?._id, body);
            if (response) {
                dispatch(increment());
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }
    };

    useEffect(() => {
        reset({
            ...enquiry?.trackingDetails
        })

        if (enquiry?.trackingDetails) {
            setEdit(true)
        }
    }, [enquiry?.trackingDetails])

    return (
        <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}>
            <h3>Tracking Details Form</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-3">
                    <label>Courier Partner Name <span className='text-danger'>*</span></label>
                    <input
                        disabled={edit}
                        type="text"
                        className="form-control"
                        {...register('courierPartnerName', { required: true })}
                        placeholder="Enter courier partner name"
                    />
                    {errors.courierPartnerName && <span className="text-danger">This field is required</span>}
                </div>

                <div className="form-group mb-3">
                    <label>Tracking ID <span className='text-danger'>*</span></label>
                    <input
                        disabled={edit}
                        type="text"
                        className="form-control"
                        {...register('trackingId', { required: true })}
                        placeholder="Enter tracking ID"
                    />
                    {errors.trackingId && <span className="text-danger">This field is required</span>}
                </div>

                <div className="form-group mb-3">
                    <label>Contact Number</label>
                    <input
                        disabled={edit}
                        type="tel"
                        className="form-control"
                        {...register('contactNumber', {
                            // required: true,
                            pattern: /^[0-9]{10}$/
                        })}
                        placeholder="Enter contact number"
                    />
                    {/* {errors.contactNumber && errors.contactNumber.type === "required" && (
                        <span className="text-danger">This field is required</span>
                    )} */}
                    {errors.contactNumber && errors.contactNumber.type === "pattern" && (
                        <span className="text-danger">Contact number must be 10 digits</span>
                    )}
                </div>

                {!edit && enquiry?.status!="Delivered" &&  <button type="submit" className="btn btn-primary">{enquiry?.trackingDetails ? "Update" : "Submit"}</button>}
                {edit && enquiry?.status!="Delivered" &&  <button type="button" onClick={() => setEdit(false)} className="btn btn-primary">edit</button>}
            
            </form>
        </div>
    );
}

export default TrackingDetailsForm;