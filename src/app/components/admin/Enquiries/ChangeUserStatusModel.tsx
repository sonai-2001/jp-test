"use client"
import { updateEnquiry } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

function ChangeUserStatusModel({ data, enquiryData, show, handleClose }: { data: any, enquiryData: any, show: boolean, handleClose: () => void }) {

    const dispatch = useDispatch();
    const onSubmit = async () => {
        const body = { id: enquiryData?._id, _id: enquiryData?._id, status: data, email:enquiryData?.email }
        try {
            if (data?.length) {
                const response = await updateEnquiry(enquiryData?._id, body);
                handleClose();
                if (response) {
                    dispatch(increment());
                }
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }
    };



    return (
        <Modal centered show={show} className="signInUp_modal">
            <Modal.Header className='border-0' closeButton onHide={() => handleClose()}>
                <Modal.Title> {data ? "Product Enquiry" : 'Payment Method'} </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <h4>Are you sure to change the status?</h4>

                <div className="col-12 text-end mt-4">
                <Button variant="primary" className='px-3' onClick={onSubmit}>
                    Yes
                </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
}

export default ChangeUserStatusModel;