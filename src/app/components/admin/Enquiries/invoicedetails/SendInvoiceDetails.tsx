import React, { useEffect, useState } from 'react'
import InvoiceTable from './InvoiceTable'
import InvoiceForm from './InvoiceForm'

function SendInvoiceDetails({ enquiryData }: any) {
  const { enquiry } = enquiryData || {};
  const [data, setData] = useState({});
  const [show, handleClose] = useState(false);



  useEffect(() => {
    enquiry && setData(enquiry)
  }, [enquiry])


  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    }}>
      <h3>Invoice Details</h3>
      <InvoiceForm data={data} setData={setData} handleClose={handleClose} />
      <InvoiceTable data={data} show={show}  handleClose={handleClose}/>
    </div>
  )
}

export default SendInvoiceDetails