import { createFAQ, updateFAQ } from '@/app/services/Faq/FaqApi';
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';


function BrandFormModel({ userModel, setSectorFormCloseModel, getSectorData }: { userModel: any, setSectorFormCloseModel: any, getSectorData: any }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data: any) => {

        try {
            const response = await getSectorData ? updateFAQ(getSectorData?._id, data) : createFAQ(data)
            const responseData = await response

            if (responseData.status) {
                getSectorData = {}
                setSectorFormCloseModel();
            }
        } catch (error) {
            console.error(error, "Error submitting form:");
        }
    };


    useEffect(() => {
        if (getSectorData) {
            reset({ _id: getSectorData?._id, ...getSectorData })
        }
        else { reset() }
    }, [getSectorData])

    return (
        <Modal
            size='lg'
            centered
            show={userModel}
            onHide={() => {
                getSectorData = {}
                setSectorFormCloseModel();
            }}
            style={{ display: "block" }}
        >
            <Modal.Header className="modal-header" closeButton>
                <h5 className="modal-title  fw-bold" id="expaddLabel">
                    Faq
                </h5>
            </Modal.Header>
            <Modal.Body>
                <div className="deadline-form">
                    <form
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label>Question<span className='text-danger'>*</span></label>
                            <input  {...register("question", { required: true, })} type="text" className="form-control" placeholder="Question" />
                            {errors?.question && <span className="text-danger">This field is required</span>}
                        </div>
                        <div className="form-group">
                            <label>Answer<span className='text-danger'>*</span></label>
                            <textarea  {...register("answer", { required: true, })} rows={3} className="form-control" placeholder="Answer" style={{height:'120px'}} ></textarea>
                            {errors?.answer && <span className="text-danger">This field is required</span>}
                        </div>
                        <div className={`d-flex justify-content-between mt-3`}>
                            <button
                                onClick={() => {
                                    setSectorFormCloseModel();
                                    // setChangeStatusTo({});
                                }}
                                type="button"
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BrandFormModel