import React from 'react';
import { useRouter } from 'next/navigation';
import { MdRemoveRedEye } from "react-icons/md";
import { enquiryUser } from './enquiryStatus';
function EnquiryItem({ enquiry }: any) {
    const router = useRouter()
    const data = new Date(enquiry?.createdAt);

    const getEnquiry = (id: string) => {
        router.push(`/my-enquiry/${id}`)
    }
    return (
        <>
            <div className="enquiryCards">
                {enquiry?.isCart ? <>
                    <div className="card-header">
                        <h2>Total Items: {enquiry?.totalCart?.length}</h2>
                        <span className={`status`}>{enquiryUser(enquiry?.status)}</span>
                    </div>
                    <div className="card-content">
                        {enquiry?.enquiryNo && <div className="info">
                            <span className="label">Enquiry No</span>
                            <span className="value">{enquiry?.enquiryNo}</span>
                        </div>}
                        <div className="info">
                            <span className="label">Enquiry Date</span>
                            <span className="value">{data.toLocaleString()}</span>
                        </div>
                        <div className="info">
                            <span className="label">Products</span>
                            <span className="value">
                                {enquiry?.totalCart[0]?.productName}
                                {enquiry?.totalCart[1]?.productName ? ", " + enquiry?.totalCart[1]?.productName : ""}
                                {enquiry?.totalCart?.length > 2 ? ", +" + (enquiry?.totalCart?.length - 2) : ""}
                            </span>
                        </div>

                    </div>
                </>
                    :
                    <>

                        <div className="info">
                            <span className="label">Enquiry No</span>
                            <span className="value">{enquiry?.enquiryNo}</span>
                        </div>
                        <div className="card-header">
                            <h2>{enquiry?.productName}</h2>
                            <span className={`status`}>{enquiry?.status}</span>
                        </div>
                        <div className="card-content">
                            <div className="info">
                                <span className="label">Enquiry Date</span>
                                <span className="value">{data.toLocaleString()}</span>
                            </div>
                            <div className="info">
                                <span className="label">Model</span>
                                <span className="value">{enquiry?.productModel?.modelName}</span>
                            </div>
                            <div className="info">
                                <span className="label">Category</span>
                                <span className="value">{enquiry?.category?.categoryName ? enquiry?.category?.categoryName : enquiry?.category}</span>
                            </div>
                            <div className="info">
                                <span className="label">Brand</span>
                                <span className="value">{enquiry?.product?.brand}</span>
                            </div>
                        </div>

                    </>
                }
                <div className="card-footer">
                    <button onClick={() => getEnquiry(enquiry?._id)} className="view-details">
                        View Details
                        <MdRemoveRedEye />
                    </button>
                </div>
            </div>

            {/* <div className="enquiryCards">
                        <div className="card-header">
                            <h2>{enquiry?.productName}</h2>
                            <span className={`status`}>{enquiry?.status}</span>
                        </div>
                        <div className="card-content">
                            <div className="info">
                                <span className="label">Created At</span>
                                <span className="value">{data.toLocaleString()}</span>
                            </div>
                            <div className="info">
                                <span className="label">Model</span>
                                <span className="value">{enquiry?.productModel?.modelName}</span>
                            </div>
                            <div className="info">
                                <span className="label">Category</span>
                                <span className="value">{enquiry?.category?.categoryName ? enquiry?.category?.categoryName : enquiry?.category}</span>
                            </div>
                            <div className="info">
                                <span className="label">Brand</span>
                                <span className="value">{enquiry?.product?.brand}</span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button onClick={() => getEnquiry(enquiry?._id)} className="view-details">
                                View Details
                                <MdRemoveRedEye />
                            </button>
                        </div>
                    </div> */}



        </>
    )
}

export default EnquiryItem