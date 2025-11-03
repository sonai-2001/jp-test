import { updateEnquiry } from '@/app/services/Enquiry/EnquiryApi';
import { getInvoices, updateInvoiceNo } from '@/app/services/Invoice/InvoiceApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import React, { useEffect, useState } from 'react'; // Import useRef
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

function InvoiceForm({ data, setData, handleClose }: any) {
  const dispatch = useDispatch();
  const { register, watch, reset, handleSubmit } = useForm();
  const [getINVOICENo, setINVOICENo] = useState("");
  const [getINVOICEID, setINVOICEID] = useState("");

  // const invoiceNo = watch("invoiceNo");
  const INVOICEPrefix = watch("INVOICEPrefix");
  const INVOICEMidNo = watch("INVOICEMidNo");
  const INVOICENo = watch("INVOICENo");
  const toName = watch("toName");
  const dateFirst = watch("dateFirst");
  const customerPoNo = watch("customerPoNo");
  const address = watch("address");
  const dateSecond = watch("dateSecond");
  const districtPinCode = watch("districtPinCode");
  const gstNo = watch("gstNo");
  const stateCode = watch("stateCode");
  const goodsDispatchedTo = watch("goodsDispatchedTo");

  const isDisabled = !INVOICEPrefix || !INVOICEMidNo || !INVOICENo || !toName || !dateFirst || !customerPoNo || !address || !dateSecond || !districtPinCode || !gstNo || !stateCode || !goodsDispatchedTo

  const getInvoice = async () => {
    try {
      const data: any = await getInvoices();

      data && setINVOICENo(data?.data?.invoiceNumber)
      setINVOICEID(data?.data?._id)
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const onSubmit = async (formData: any) => {

    const formDataBody = { ...formData, invoiceNo: `${formData?.INVOICEPrefix}/${formData?.INVOICEMidNo}/${formData?.INVOICENo}` }

    const body = formData?.invoiceSend ?
      { id: data?._id, _id: data?._id, dataInvoice: formDataBody, }
      : { id: data?._id, _id: data?._id, status: "Invoice has been send", dataInvoice: formDataBody }
    try {
      const response = await updateEnquiry(data?._id, body);
      if (response) {
        dispatch(increment());
        !formData?.invoiceSend && updateInvoiceNo({ id: getINVOICEID, invoiceNumber: `${INVOICEPrefix}/${INVOICEMidNo}/${+INVOICENo + 1}` })
      }
      handleClose(true)

    } catch (error) {
      console.error("Error in POST /api/productUser:", error);
    }
  };


  useEffect(() => {
    getInvoice();
  }, []);


  useEffect(() => {
    setData((old: any) => ({ ...old, dataInvoice: { ...watch() } }));
  }, [INVOICEPrefix, INVOICEMidNo, INVOICENo, toName, dateFirst, customerPoNo, address, dateSecond, districtPinCode, gstNo, stateCode, goodsDispatchedTo, setData]);


  useEffect(() => {

    const splitsetInvoiceData =
      data?.dataInvoice?.invoiceNo && data ?
        data?.dataInvoice?.invoiceNo?.split("/") :
        getINVOICENo?.split("/")

    const INVOICENoData = INVOICEPrefix ? INVOICEPrefix : splitsetInvoiceData[splitsetInvoiceData?.length - 1]
    const INVOICEMidNoData = INVOICEMidNo ? INVOICEMidNo : splitsetInvoiceData[splitsetInvoiceData?.length - 2]
    const INVOICEPrefixData = INVOICENo ? INVOICENo : splitsetInvoiceData?.slice(0, splitsetInvoiceData?.length - 2)?.join("/")


    if (data?.dataInvoice && data) {
      !(INVOICEPrefix || INVOICEMidNo || INVOICENo) && data &&
        reset({
          ...data.dataInvoice,
          INVOICEPrefix: INVOICEPrefixData,
          INVOICEMidNo: INVOICEMidNoData,
          INVOICENo: INVOICENoData,
          invoiceSend: true
        });
    } else {
      !(INVOICEPrefix || INVOICEMidNo || INVOICENo) && data &&
        reset({
          // invoiceNo: getINVOICENo,
          INVOICEPrefix: INVOICEPrefixData,
          INVOICEMidNo: INVOICEMidNoData,
          INVOICENo: INVOICENoData,
          toName: data?.customerName,
          address: data?.address,
          gstNo: data?.gstNumber,
          goodsDispatchedTo: data?.deliveryAddress,
        });
    }
  }, [getINVOICENo, data, reset]);

  return (
    <div className='py-3 px-1'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="form-group mb-3">
            <label htmlFor="invoiceNo">INVOICE No<span className='text-danger'>* </span>
              {(INVOICEPrefix || INVOICENo || INVOICEMidNo) && <small>(INVOICE No.: <strong>{INVOICEPrefix}/{INVOICEMidNo}/{INVOICENo})</strong></small>}
            </label>
            <div className="d-flex gap-3 align-items-center">
              <input type="text" className="form-control" id="INVOICEPrefix" {...register('INVOICEPrefix')} placeholder="Enter invoice prefix" />
              <span>/</span>
              <input type="text" className="form-control" id="INVOICEMidNo" {...register('INVOICEMidNo')} placeholder="Enter invoice mid. no." />
              <span>/</span>
              <input type="number" className="form-control" id="INVOICENo" {...register('INVOICENo')} placeholder="Enter invoice no." />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="toName">To Name<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="toName" {...register('toName')} placeholder="Enter to name" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="date">Date<span className='text-danger'>*</span></label>
              <input type="date" className="form-control" id="date" {...register('dateFirst')} placeholder="Enter date" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="customerPoNo">CUSTOMER P.O No<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="customerPoNo" {...register('customerPoNo')} placeholder="Enter customer P.O no" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="date">Date<span className='text-danger'>*</span></label>
              <input type="date" className="form-control" id="date" {...register('dateSecond')} placeholder="Enter date" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="districtPinCode">District and Pin Code<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="districtPinCode" {...register('districtPinCode')} placeholder="Enter district and pin code" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="stateCode">State Code<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="stateCode" {...register('stateCode')} placeholder="Enter state code" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="goodsDispatchedTo">Goods dispatched To<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="goodsDispatchedTo" {...register('goodsDispatchedTo')} placeholder="Enter goods dispatched to" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="gstNo">GST NO<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="gstNo" {...register('gstNo')} placeholder="Enter GST no" />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group mb-3">
              <label htmlFor="address">Address<span className='text-danger'>*</span></label>
              <input type="text" className="form-control" id="address" {...register('address')} placeholder="Enter address" />
            </div>
          </div>
          <div className="col-12 d-flex justify-content-end">
            {data?.status !== 'Delivered' && <button disabled={isDisabled} type="submit" className="btn btn-primary mt-3">Save and Preview Invoice</button>}
            {/* {data.dataInvoice && data.status === "Invoice has been send" && <button type="button" className="btn btn-primary mt-3" handleClose(true)>Preview Invoice</button>} */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;