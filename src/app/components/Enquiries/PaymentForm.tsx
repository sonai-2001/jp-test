import React from 'react'
import SubmitSlip from './SubmitSlip'


function PaymentForm({ paymentDetaild, changeMethod, method, handleClose,
    enquiryData }: {
        changeMethod: any, method: any, handleClose: () => void,
        enquiryData: any, paymentDetaild: any,
    }) {

    return (
        <>
            <h5>{method?.methodName == "Online" ? "Pay by UPI" : "Pay by Net- Banking"} Method</h5>
            <div className="ql-editor" dangerouslySetInnerHTML={
                { __html: method?.methodName == "Online" ? paymentDetaild?.UPI : paymentDetaild?.NetBanking }
            } />
            <br />
            <br />
            <div className="col-12 d-flex justify-content-between mb-3">
                <button type='button' onClick={() => changeMethod()} className='changePayment_method'>Do want to change payment method?</button>
            </div>
            <SubmitSlip enquiryData={enquiryData} handleCloseModel={handleClose} />
        </>
    )
}

export default PaymentForm