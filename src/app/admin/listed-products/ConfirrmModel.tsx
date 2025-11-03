"use client"
import { deleteProduct } from '@/app/services/Product/ProductApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';


function ConfirmModel({ data, show, handleClose }: { data: any, show: boolean, handleClose: () => void }) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true)
        try {
            if (data?.id) {
                const response = await deleteProduct(data?.id);
                handleClose();
                if (response) {
                    dispatch(increment());
                }
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        } finally {
            setIsLoading(false)
        }
    };



    return (
        <Modal centered show={show}>
            <Modal.Header className='border-0' closeButton onHide={() => handleClose()}>
                <Modal.Title>Product Delete </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {isLoading ? <div className="col-12 text-center">
                    <div className="spinner-grow text-secondary" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
                    :
                    <>
                        <h4>{data.message}</h4>
                        <div className="col-12 d-flex justify-content-between mt-4">
                            <Button variant="secondary" className='px-4' onClick={handleClose}>
                                No
                            </Button>
                            <Button variant="primary" className='px-4' onClick={onSubmit}>
                                Yes
                            </Button>
                        </div>
                    </>
                }
            </Modal.Body>
        </Modal>
    );
}

export default ConfirmModel;