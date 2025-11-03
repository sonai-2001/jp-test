
"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from 'next/navigation';
import { deleteEnquiry, getEnquiries } from '@/app/services/Enquiry/EnquiryApi';
import React, { useEffect, useState } from 'react';
import { FaEye, FaTrash } from "react-icons/fa";
import { Modal, Spinner } from "react-bootstrap";
import { enquiryAdmin } from "@/app/components/Enquiries/enquiryStatus";
import Image from "next/image";
import loader_img from "../../../../public/assets/img/loader_img.png"

interface EnquiryData {
    _id: string;
    productName: string;
    productModel: string;
    category: any;
    status: string;
    [key: string]: any;
}

function MyEnquiry() {
    const router = useRouter();
    const [enquiryData, setEnquiryData] = useState<EnquiryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // EnquiryDelete
    const [getEnquiryDelete, setgetEnquiryDelete] = useState<any>({});
    const [userDeleteModel, setEnquiryDeleteModel] = useState(false);
    const setEnquiryDeleteCloseModel = () => {
        setgetEnquiryDelete({})
        setEnquiryDeleteModel(false);
    };

    const formEnquiryDelete = (data: any) => {
        setEnquiryDeleteModel(true);
        setgetEnquiryDelete({ ...data });
    };

    const onSubmitDelete = async () => {
        try {
            const response: any = await deleteEnquiry(getEnquiryDelete?.id);
            if (response.ok) {
                setEnquiryDeleteCloseModel();
            }
        } catch (error) {
            console.error(error, "Error submitting form:");
        } finally {
            getAllEnquies();
            setEnquiryDeleteCloseModel();
            setgetEnquiryDelete({})
        }
    };

    const getAllEnquies = async () => {
        setIsLoading(true);
        try {
            const result: any = await getEnquiries();
            const data: EnquiryData[] = result?.map((item: EnquiryData, i: number) => ({
                ...item,
                id: item._id,
                index: i + 1,
            }));

            setEnquiryData(data);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllEnquies();
    }, []);

    const columns: GridColDef[] = [
        {
            field: "index",
            headerName: "S.No.",
            sortable: true,
            width: 70,
        },
        {
            field: "enquiryNo",
            headerName: "Enquiry No",
            sortable: true,
            width: 70,
        },
        {
            field: "productName",
            headerName: "Product Name",
            sortable: true,
            width: 250,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{params.row.isCart ? `${params.row?.totalCart[0]?.productName} ${params.row?.totalCart?.length > 1 && ", +" + (params.row?.totalCart?.length - 1)}` : params.row.productName}</p>
                </div>
            )
        },
        {
            field: "email",
            headerName: "Email",
            sortable: true,
            width: 250,
        },
        {
            field: "productModel",
            headerName: "Product Model",
            sortable: true,
            width: 150,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{params.row.isCart ? `${params.row?.totalCart[0]?.productModel?.modelName} ${params.row?.totalCart?.length > 1 ? ", +" + (params.row?.totalCart?.length - 1) : ""}` : params.row.productModel?.modelName}</p>
                </div>
            )

        },
        {
            field: "categoryName",
            headerName: "Category Name",
            sortable: true,
            width: 100,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{params.row.isCart ? `${params.row?.totalCart?.length > 1 ? (params.row?.totalCart?.length) + " categories" : (params.row?.totalCart?.length) + " category"}` : params.row.category}</p>
                </div>
            )

        },
        {
            field: "quantity",
            headerName: "Quantity",
            sortable: true,
            width: 100,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{params.row.isCart ? params.row?.totalCart?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) : params.row.quantity}</p>
                </div>
            )
        },
        {
            field: "status",
            headerName: "Status",
            sortable: true,
            width: 170,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{enquiryAdmin(params.row.status)}</p>
                </div>
            )

        },
        {
            field: "action",
            headerName: "ACTION",
            width: 200,
            renderCell: (params) => (
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={(event) => {
                            event.stopPropagation();
                            viewEnquiry(params.row.id);
                        }}
                    >
                        <FaEye />
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={(event) => {
                            event.stopPropagation();
                            formEnquiryDelete(params.row);
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const viewEnquiry = (id: string) => {
        router.push(`/admin/all-enquiry/${id}`)
    }

    return (
        // <section className="enquiry_body">
        <section>
            <div className="container">
                <div className="row">
                    {/* <div className="col-lg-10 enquiry_box m-auto"> */}
                    <div className="col-lg-12 m-auto">
                        <div className="hero_banner_title py-0">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-8 m-auto">
                                        <div className="title">
                                            <h2>All Enquiries</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                {isLoading ?
                                    <div className="text-center position-relative d-flex justify-content-center align-items-center" style={{height:'400px'}}>
                                    <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
                                      <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                     <Image src={loader_img} alt="loader_img" className='position-absolute' width={80} height={80} />
                                  </div>
                                    : <DataGrid
                                        rows={enquiryData}
                                        columns={columns}
                                        loading={isLoading}
                                        pagination
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 10 } },
                                        }}
                                        pageSizeOptions={[
                                            5,
                                            10,
                                            25,
                                            { value: -1, label: "All" },
                                        ]}
                                        sx={{
                                            border: "none",
                                            "& .MuiDataGrid-root": {
                                                border: "none",
                                            },
                                        }}
                                    />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                centered
                show={userDeleteModel}
                onHide={() => {
                    setEnquiryDeleteCloseModel();
                }}
                style={{ display: "block" }}
            >
                <Modal.Header className="modal-header" closeButton>
                    <h5 className="modal-title  fw-bold" id="expaddLabel">
                        {getEnquiryDelete?.modelHeading}
                    </h5>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    <div className="deadline-form">
                        <h4
                            style={{
                                textAlign: "center",
                                fontSize: "22px",
                                fontWeight: "600",
                                marginBottom: "20px",
                            }}
                        >
                            Are you sure to delete this enquiry?
                        </h4>
                        <div className={`d-flex justify-content-between`}>
                            <button
                                onClick={() => {
                                    setEnquiryDeleteCloseModel();
                                    setgetEnquiryDelete({});
                                }}
                                type="button"
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onSubmitDelete();
                                }}
                                type="button"
                                className="btn btn-primary"
                            >
                                yes
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
}

export default MyEnquiry;