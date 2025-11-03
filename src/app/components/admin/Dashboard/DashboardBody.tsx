"use client"
import { getDashboard } from '@/app/services/dashboard/dashboardApi';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './dashboard.scss'
// import { Spinner } from 'react-bootstrap';
import { getInvoices, updateInvoiceNo } from '@/app/services/Invoice/InvoiceApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import { BiSolidEdit } from 'react-icons/bi';
import InvoiceEditModal from './DashboardModal'; // Import the modal
import Image from 'next/image';
import loader_img from "../../../../../public/assets/img/loader_img.png"
import { Spinner } from 'react-bootstrap';

function DashboardBody() {
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrdersPaymentUploaded: 0,
        totalEnquiries: 0,
        pendingOrdersNoPayment: 0,
        pendingQuotations: 0,
        deliveredOrders: 0,
        waitingForShipment: 0,
        pendingPayments: 0,
        totalUsers: 0,
        shippedOrders: 0,
    });
    const dispatch = useDispatch();
    const [INVOICEData, setINVOICEData] = useState<any>({});
    const [INVOICENo, setINVOICENo] = useState("");
    const [INVOICEMidNo, setINVOICEMidNo] = useState("");
    const [INVOICEPrefix, setINVOICEPrefix] = useState("");
    const [INVOICENoErr, setINVOICENoErr] = useState(false);
    const [INVOICEMidNoErr, setINVOICEMidNoErr] = useState(false);
    const [INVOICEPrefixErr, setINVOICEPrefixErr] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const counter = useSelector((state: any) => state.counter?.value);
    const [showModal, setShowModal] = useState(false);  // Modal visibility state


    const getAllProducts = async () => {

        setIsLoading(true);
        try {
            const result: any = await getDashboard(startDate, endDate);
            setDashboardData(result);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getresetProducts = async () => {
        setIsLoading(true);
        try {
            const result: any = await getDashboard('', '');
            setDashboardData(result);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}T00:00`;

    const disabledData = endDate?.length && startDate?.length

    const getInvoice = async () => {
        try {
            const data: any = await getInvoices();
            const splitsetInvoiceData = data?.data?.invoiceNumber?.split("/")
            splitsetInvoiceData && setINVOICENo(splitsetInvoiceData[splitsetInvoiceData?.length - 1])
            splitsetInvoiceData && setINVOICEMidNo(splitsetInvoiceData[splitsetInvoiceData?.length - 2])
            splitsetInvoiceData && setINVOICEPrefix(splitsetInvoiceData?.slice(0, splitsetInvoiceData?.length - 2)?.join("/"))

            setINVOICEData(data?.data)
        } catch (error) {
            console.error("Error fetching invoice:", error);
        }
    };

    useEffect(() => {
        getAllProducts();
        getInvoice();
    }, [counter]);

    const resetData = () => {
        setStartDate("");
        setEndDate("");
        getresetProducts();
    }

    const handleStartDateChange = (e: any) => {
        const selectedDate = e.target.value;
        setStartDate(selectedDate);
    };

    const handleEndDateChange = (e: any) => {
        const selectedDate = e.target.value;
        setEndDate(selectedDate);
    };

    const filterData = async () => {
        setIsLoading(true);
        try {
            const result: any = await getDashboard(startDate, endDate);
            setDashboardData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const UpdateINVOICE = async () => {
        if (!INVOICENo || !INVOICEPrefix || !INVOICEMidNo) {
            !INVOICENo && setINVOICENoErr(true);
            !INVOICEMidNo && setINVOICEMidNoErr(true);
            !INVOICEPrefix && setINVOICEPrefixErr(true);
        } else {
            setIsLoading(true);
            try {
                const responce = await updateInvoiceNo({ id: INVOICEData?._id, invoiceNumber: `${INVOICEPrefix}/${INVOICEMidNo}/${INVOICENo}` })
                if (responce) {
                    dispatch(increment());
                }
            } catch (error) {
                console.error("Error fetching enquiries:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <section>
            <div className="row p-0 m-0 ">
                <div className="">
                    <div className="row g-3 justify-content-end">
                        <div className="col-md-4">
                            <input
                                type="datetime-local"
                                id="startDate"
                                max={endDate || todayFormatted}
                                value={startDate}
                                className="form-control"
                                placeholder="Start Date"
                                onChange={handleStartDateChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="datetime-local"
                                id="endDate"
                                min={startDate || todayFormatted}
                                max={todayFormatted}
                                value={endDate}
                                className="form-control"
                                placeholder="End Date"
                                onChange={handleEndDateChange}
                            />
                        </div>
                        <div className="col-md-4 col-md-4">
                            <div className='d-flex gap-2'>
                                <button disabled={!disabledData} className='btn btn-primary w-50' onClick={filterData}>Filter</button>
                                <button disabled={!disabledData} className='btn btn-secondary w-50' onClick={resetData}>Reset</button>
                            </div>
                        </div>
                    </div>

                </div>
                {/* Remove this entire div from here */}
                {/* <div className="col-12 mt-3 d-md-flex justify-content-end gap-3 align-items-center">
                    <input
                        type="text"
                        className={`form-control w-25 ${INVOICEPrefixErr ? "border-2 border-danger" : ""}`}
                        placeholder="Invoice Prefix. Ex: JA"
                        value={INVOICEPrefix}
                        onChange={(e: any) => {
                            setINVOICEPrefixErr(false)
                            setINVOICEPrefix(e.target.value)
                        }}
                    />
                    <input
                        type="number"
                        className={`form-control w-25 ${INVOICEMidNoErr ? "border-2 border-danger" : ""}`}
                        placeholder="Invoice Mid No. Ex: 25"
                        value={INVOICEMidNo}
                        onChange={(e: any) => {
                            setINVOICEMidNoErr(false)
                            setINVOICEMidNo(e.target.value)
                        }}
                    />
                    <input
                        type="number"
                        className={`form-control w-25 ${INVOICENoErr ? "border-2 border-danger" : ""}`}
                        placeholder="Invoice Last No. Ex: 46"
                        value={INVOICENo}
                        onChange={(e: any) => {
                            setINVOICENoErr(false)
                            setINVOICENo(e.target.value)
                        }}
                    />
                    <button className='btn btn-primary px-3' onClick={UpdateINVOICE}>Update INVOICE</button>
                </div> */}

                {(INVOICEPrefix || INVOICENo || INVOICEMidNo) && (
                    <small className='mt-3'>
                        INVOICE No.: <strong>{INVOICEPrefix}/{INVOICEMidNo}/{INVOICENo}</strong>
                        <BiSolidEdit size={20} color='#b22222' style={{ cursor: 'pointer', marginLeft: '2px' }} onClick={handleOpenModal} />
                    </small>
                )}
            </div>
            {isLoading ?
                <div className="text-center position-relative d-flex justify-content-center align-items-center" style={{height:'400px'}}>
                <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                 <Image src={loader_img} alt="loader_img" className='position-absolute' width={80} height={80} />
              </div>
                :
                <div className="row">
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-success h-100">
                            <h5 className='text-success fw-semibold' style={{ fontSize: '18px' }}>Total Products</h5>
                            <h5>{dashboardData?.totalProducts || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-primary h-100">
                            <h5 className='text-primary fw-semibold' style={{ fontSize: '18px' }}>Total Users</h5>
                            <h5>{dashboardData?.totalUsers || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-danger h-100">
                            <h5 className='text-danger fw-semibold' style={{ fontSize: '18px' }}>Total Enquiries</h5>
                            <h5>{dashboardData?.totalEnquiries || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-primary h-100">
                            <h5 className='text-primary fw-semibold' style={{ fontSize: '18px' }}>Total Orders</h5>
                            <h5>{dashboardData?.totalOrdersPaymentUploaded || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-warning h-100">
                            <h5 className='text-warning fw-semibold' style={{ fontSize: '18px' }}>Pending Orders</h5>
                            <h5>{dashboardData?.pendingOrdersNoPayment || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-success h-100">
                            <h5 className='text-success fw-semibold' style={{ fontSize: '18px' }}>Delivered Orders</h5>
                            <h5>{dashboardData?.deliveredOrders || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-warning h-100">
                            <h5 className='text-warning fw-semibold' style={{ fontSize: '18px' }}>Pending Quotations</h5>
                            <h5>{dashboardData?.pendingQuotations || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-danger h-100">
                            <h5 className='text-danger fw-semibold' style={{ fontSize: '18px' }}>Waiting For Shipment</h5>
                            <h5>{dashboardData?.waitingForShipment || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-warning h-100">
                            <h5 className='text-warning fw-semibold' style={{ fontSize: '18px' }}>Pending Payments</h5>
                            <h5>{dashboardData?.pendingPayments || 0}</h5>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 card-box py-3">
                        <div className="card p-3 shadow-none border-primary h-100">
                            <h5 className='text-primary fw-semibold' style={{ fontSize: '18px' }}>Shipped Orders</h5>
                            <h5>{dashboardData?.shippedOrders || 0}</h5>
                        </div>
                    </div>
                </div>
            }

            <InvoiceEditModal
                show={showModal}
                onHide={handleCloseModal}
                invoicePrefix={INVOICEPrefix}
                invoiceMidNo={INVOICEMidNo}
                invoiceNo={INVOICENo}
                onPrefixChange={(value: string) => {
                    setINVOICEPrefixErr(false);
                    setINVOICEPrefix(value);
                }}
                onMidNoChange={(value: string) => {
                    setINVOICEMidNoErr(false);
                    setINVOICEMidNo(value);
                }}
                onNoChange={(value: string) => {
                    setINVOICENoErr(false);
                    setINVOICENo(value);
                }}
                invoicePrefixErr={INVOICEPrefixErr}
                invoiceMidNoErr={INVOICEMidNoErr}
                invoiceNoErr={INVOICENoErr}
                onUpdateInvoice={() => {
                    UpdateINVOICE();
                    handleCloseModal();
                }}
            />
        </section>
    )
}

export default DashboardBody