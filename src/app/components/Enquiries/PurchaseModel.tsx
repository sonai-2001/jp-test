"use client"
import React, { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PaymentForm from './PaymentForm';
import ProductEnquiryForm from './ProductEnquiryForm';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUser } from '@/app/services/User/User';
import { setUser } from '@/app/services/redux/features/userSlice';
import { updateEnquiry } from '@/app/services/Enquiry/EnquiryApi';
import { increment } from '@/app/services/redux/features/counterSlice';

function PurchaseModel({ paymentDetaild, enquiryData, show, handleClose }: { paymentDetaild: any, enquiryData: any, show: boolean, handleClose: () => void }) {

    const dispatch = useDispatch();
    const { userData } = useSelector((state: any) => state.user);
    const { register, handleSubmit, setValue, reset, formState: { errors }, watch } = useForm();
    const sameAsAddress = watch('sameAsAddress') || false;
    const [data, setData] = React.useState<any>(true);
    const [method, setMethod] = React.useState<any>({
        methodName: "",
        flage: true
    });
    const [size, setSize] = React.useState<any>('lg');

    const onSubmit = async (data: any) => {
        const body = { ...data, id: enquiryData?._id, _id: enquiryData?._id, step: "Submitted GST Detaile" }

        try {
            const response = await updateEnquiry(enquiryData?._id, body);
            if (response) {
                dispatch(setUser(response));
                dispatch(increment());
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }

        setData(false);
        setSize('md');
        // Handle form submission logic here
    };

    const resetModel = () => {
        handleClose();
        reset();
        setData(true);
        setSize('lg');
    }

    const setOnline = () => {
        setMethod({
            methodName: "Online",
            flage: false
        })
        setSize('lg');
    }

    const setOffline = () => {
        setMethod({
            methodName: "Offline",
            flage: false
        })
        setSize('lg');
    }

    const changeMethod = () => {
        setSize('md');
        setMethod({
            methodName: "",
            flage: true
        })
        reset();
        setData(false);
    }

    const handleGetUser = async () => {
        try {
            const response = await getOneUser(`${localStorage.getItem("jid")}`);
            if (response) {
                dispatch(setUser(response));
            }
            if (userData?.gstNumber && userData?.address && userData?.companyName) {
                setData(false)
            }
        } catch (error) {
            console.error("Error in GET /api/productUser:", error);
        }
    };

    useEffect(() => {
        handleGetUser()
        reset({ ...userData, id: userData?._id })
        setValue("sameAsAddress",
            userData?.sameAsAddress === "false" || userData?.sameAsAddress === false
                ? false : true
        )
    }, [])

    useEffect(() => {
        show == false && changeMethod();
    }, [`${show}`])

    return (
        <Modal size={size} scrollable centered show={show} className="signInUp_modal">
            <Modal.Header className='border-0' closeButton onHide={() => resetModel()}>
                <Modal.Title> {data ? "Product Enquiry" :
                    ((enquiryData.status == "Quotation Received" || enquiryData.status == "Revision Request Resend-admin" || enquiryData.status == "Revision Request Resend-user" || enquiryData.step == "Offline" || enquiryData.step == "Online") && enquiryData?.gstNumber && enquiryData.step == "Submitted GST Detaile") ?
                        'Payment Method' : "Billing Details"} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {(enquiryData.status == "Quotation Received" || enquiryData.status == "Revision Request Resend-admin" || enquiryData.status == "Revision Request Resend-user") && enquiryData?.gstNumber && method?.flage && enquiryData.step == "Submitted GST Detaile" ?
                        <>
                            {
                                <div className={`row ${!data && 'mb-4 px-3'}`}>
                                    <div className="col-6">
                                        <button onClick={setOnline} className='btn btn-primary text-white w-100'>Pay by UPI</button>
                                    </div>
                                    <div className="col-6">
                                        <button onClick={setOffline} className='btn btn-primary text-white w-100'>Pay by Net- Banking</button>
                                    </div>
                                </div>
                            }
                        </> : ""}

                    {(enquiryData.status == "Quotation Received" || enquiryData.status == "Revision Request Resend-user" || enquiryData.status == "Revision Request Resend-admin") && enquiryData.step != "Offline" && enquiryData.step != "Online" && !(enquiryData.step == "Submitted GST Detaile")
                        ? <ProductEnquiryForm reset={reset} register={register} setValue={setValue} watch={watch} errors={errors} sameAsAddress={sameAsAddress} />
                        : ""}

                    {!method?.flage ? <PaymentForm paymentDetaild={paymentDetaild} method={method} changeMethod={changeMethod} handleClose={handleClose} enquiryData={enquiryData} /> : ""}

                    {data
                        && enquiryData.step != "Offline" && enquiryData.step != "Online"
                        && enquiryData.status != "Pending" && enquiryData.status !== "Quotation Received" &&
                        <div className="col-12 text-end">
                            {enquiryData.status == "Offline"
                                && userData?.gstNumber && userData?.address && userData?.companyName ?
                                <Button variant="primary" type="button" onClick={resetModel}>
                                    Submit
                                </Button>
                                :
                                (!(enquiryData.status == "Revision Request Resend-user" || enquiryData.status == "Revision Request Resend-admin") && <Button variant="primary" type="submit">
                                    Submit
                                </Button>)
                            }
                        </div>}
                    {
                        (enquiryData.status == "Quotation Received" || enquiryData.status == "Revision Request Resend-user" || enquiryData.status == "Revision Request Resend-admin") && enquiryData.step != "Offline" && enquiryData.step != "Online" && !(enquiryData.step == "Submitted GST Detaile")
                            ? <Button variant="primary" type="submit">
                                Submit
                            </Button> : ""
                    }
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default PurchaseModel;
