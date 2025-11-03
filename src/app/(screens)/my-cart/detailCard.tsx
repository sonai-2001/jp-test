import React from 'react';
import Image from 'next/image';
function DetailCard({ enquiry }: any) {

    return (
        <>
            <div className="enquiryCards">
                <div className="card-header">
                    <h2>{enquiry?.productName}</h2>
                </div>
                <div className="w-100 d-flex">
                    <div className="w-50 card-content">
                        <Image className='sx-image' src={enquiry?.productImage} height={150} width={300} alt={enquiry?.productName} />
                    </div>
                    <div className="w-50 card-content">
                        <div className="info">
                            <span className="label">Model</span>
                            <span className="value">{enquiry?.productModel?.modelName}</span>
                        </div>
                        <div className="info">
                            <span className="label">Quantity</span>
                            <span className="value">{enquiry?.quantity}</span>
                        </div>
                        {enquiry?.category && <div className="info">
                            <span className="label">Category</span>
                            <span className="value">{enquiry?.category?.categoryName ? enquiry?.category?.categoryName : enquiry?.category}</span>
                        </div>}
                        {enquiry?.product?.brand && <div className="info">
                            <span className="label">Brand</span>
                            <span className="value">{enquiry?.product?.brand}</span>
                        </div>}
                    </div>
                </div>

            </div >
        </>
    )
}

export default DetailCard