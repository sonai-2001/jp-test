import { updateEnquirySlip } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { LuUpload } from 'react-icons/lu';
import { useDispatch } from 'react-redux';

function SubmitSlip({ enquiryData, handleCloseModel }: { enquiryData: any, handleCloseModel: () => void }) {

    const { register, handleSubmit, setError, clearErrors, reset, formState: { errors } } = useForm();
    const [file, setFile] = useState<any>(null);
    const [purchaseOrder, setPurchaseOrder] = useState<any>(null);
    const dispatch = useDispatch();

    // const onSubmitSlip = async (data: any) => {
    //     const formData = new FormData();
    //     formData.append('id', enquiryData?._id);
    //     formData.append('_id', enquiryData?._id);
    //     formData.append('status', "Slip Submited");
    //     formData.append('step', "Submited Slip");
    //     { purchaseOrder && formData.append('purchaseOrder', purchaseOrder) }
    //     { file && formData.append('paymentSlip', file) }
    //     formData.append('paymentSlipDate', `${new Date()}`);

    //     try {
    //         const result = await updateEnquirySlip(formData);

    //         dispatch(increment());
    //         if (result) {
    //             handleCloseModel();
    //             reset();
    //             setFile(null);
    //             setPurchaseOrder(null);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching enquiry:", error);
    //     }
    // };

    const onSubmitSlip = async (data: any) => {
        // Custom validation: at least one file should be uploaded
        if (!file && !purchaseOrder) {
            // Set a manual error on a virtual field
            setError("fileOrPO", {
                type: "manual",
                // message: "Please upload at least one file (Payment Slip or Purchase Order)."
                message: "Please upload Payment Slip."
            });
            return;
        } else {
            clearErrors("fileOrPO");
        }

        const formData = new FormData();
        formData.append('id', enquiryData?._id);
        formData.append('_id', enquiryData?._id);
        formData.append('status', "Slip Submited");
        formData.append('step', "Submited Slip");
        if (purchaseOrder) formData.append('purchaseOrder', purchaseOrder);
        if (file) formData.append('paymentSlip', file);
        formData.append('paymentSlipDate', `${new Date()}`);

        try {
            const result = await updateEnquirySlip(formData);

            dispatch(increment());
            if (result) {
                handleCloseModel();
                reset();
                setFile(null);
                setPurchaseOrder(null);
            }
        } catch (error) {
            console.error("Error fetching enquiry:", error);
        }
    };
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];


    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files && event.target.files[0]) {
    //         setFile(event.target.files[0]);
    //         clearErrors('fileOrPO');
    //     }
    // };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = event.target.files?.[0];
  if (selectedFile) {
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('fileOrPO', {
        type: 'manual',
        message: 'Only PDF, JPG, JPEG, and PNG images are allowed.',
      });
      setFile(null);
    } else {
      setFile(selectedFile);
      clearErrors('fileOrPO');
    }
  }
};



    const removeFile = () => {
        setFile(null);
        reset({ paymentSlip: '' });
    };

    // const handlePurchaseOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files && event.target.files[0]) {
    //         setPurchaseOrder(event.target.files[0]);
    //     }
    // };

    // const removePurchaseOrder = () => {
    //     setPurchaseOrder(null);
    //     reset({ purchaseOrder: '' });
    // };

    return (
        <Form>
            {!(purchaseOrder || file) && <div className='mb-4'>
                <div className="uploadContainer">
                    <label className="uploadLabel">
                        <input
                            type="file"
                            className="uploadInput"
                            {...register('paymentSlip'
                                // , { required: file ? false : true }
                            )}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                        />
                        <LuUpload className="uploadIcon" size={20} />
                        <span className="uploadText">Upload Receipt</span>
                    </label>
                </div>
                {/* {errors.paymentSlip && <div className="text-danger text-center mt-1">This field is required</div>} */}
            </div>}

            {file && (
                <div className="mb-3 text-center">
                    <div className="uploadImg_view">
                        {file.type === "application/pdf" ? (
                            <embed src={URL.createObjectURL(file)} type="application/pdf" width="200px" height="200px" />
                        ) : (
                            <img src={URL.createObjectURL(file)} alt="Payment Slip" />
                        )}
                        <Button className='btn' onClick={removeFile}>
                            <FaTrash />
                        </Button>
                    </div>
                </div>
            )}
            {/* {!(purchaseOrder || file) && <div className="mb-3 text-center px-4">
                <div className="divider">
                    <span className="divider-text">or</span>
                </div>
            </div>}
            {!(purchaseOrder || file) && <div className='mb-4'>
                <div className="uploadContainer">
                    <label className="uploadLabel">
                        <input
                            type="file"
                            className="uploadInput"
                            {...register('purchaseOrder')}
                            onChange={handlePurchaseOrderChange}
                            accept="image/*,application/pdf"
                        />
                        <LuUpload className="uploadIcon" size={20} />
                        <span className="uploadText">Upload Purchase Order</span>
                    </label>
                </div>
            </div>}
            {purchaseOrder && (
                <div className="mb-3 text-center">
                    <div className="uploadImg_view">
                        {purchaseOrder.type === "application/pdf" ? (
                            <embed src={URL.createObjectURL(purchaseOrder)} type="application/pdf" width="200px" height="200px" />
                        ) : (
                            <img src={URL.createObjectURL(purchaseOrder)} alt="Purchase Order" />
                        )}
                        <Button className='btn' onClick={removePurchaseOrder}>
                            <FaTrash />
                        </Button>
                    </div>
                </div>
            )} */}
            {errors.fileOrPO && (
                <div className="text-danger text-center mb-3">{errors.fileOrPO.message as String}</div>
            )}
            <div className="col-12">
                <div className="btn_box mb-2">
                    <button className='btn px-4' onClick={handleSubmit(onSubmitSlip)} style={{ maxWidth: '375px' }} type="button">Submit</button>
                </div>
            </div>
        </Form>
    )
}

export default SubmitSlip