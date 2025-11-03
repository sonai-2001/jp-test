import React from 'react'

function EnquiryItem({ enquiry }: any) {
    
    return (
        <div className="row p-0 m-0">
            <div className="col-md-4">
                <h5>{enquiry?.productName}</h5>
                <p>Model: {enquiry?.productModel}</p>
            </div>
            <div className="col-md-4">
                <p>Category: {enquiry?.category?.categoryName}</p>
                <p>Subcategory: {enquiry?.category?.subcategoryName}</p>
            </div>
            <div className="col-md-4">
                <h5>Status: <span className={`${enquiry?.status == 'Quotation Received'?"text-success":'text-warning'}`}>{enquiry?.status}</span></h5>
            </div>
        </div>
    )
}

export default EnquiryItem