
"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getProducts, updatedBestsellerApi } from "@/app/services/Product/ProductApi";
import ConfirmModel from "./ConfirrmModel";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "react-bootstrap";
import { Avatar } from "@mui/material";
import { increment } from "@/app/services/redux/features/counterSlice";
import MediaFormModel from "./UploadCSVModel";
import Image from "next/image";
import loader_img from "../../../../public/assets/img/loader_img.png"
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";


interface EnquiryData {
    _id: string;
    productName: string;
    productModel: string;
    category: any;
    status: string;
    [key: string]: any;
}

function MyProduct() {
    const router = useRouter();
    const [enquiryData, setEnquiryData] = useState<EnquiryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const counter = useSelector((state: any) => state.counter?.value);
    const dispatch = useDispatch();

    const [data, setData] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [showUpload, setShowUpload] = useState(false);
    const handleUploadClose = () => setShowUpload(false);


    const getAllProducts = async () => {
        setIsLoading(true);
        try {

            const result: any = await getProducts();

            const data: EnquiryData[] = result.map((item: EnquiryData, i: number) => ({
                ...item,
                id: item._id,
                index:i+1
            }));

            setEnquiryData(data);

        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [counter]);


    const updateBestseller = async (row: any) => {
        setIsLoading(true);
        const updatedBestseller = `${!row?.bestseller}`
        const body = {
            id: row?.id,
            bestseller: updatedBestseller,
        }

        try {
            const result = await updatedBestsellerApi(body);
            if (result) {
                dispatch(increment());
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error in POST /api/productUser:", error);
        }
    }

    const columns: GridColDef[] = [
        {
            field: "index",
            headerName: "S.No.",
            sortable: true,
            width: 70,
        },
        {
            field: "images",
            headerName: "Image",
            width: 200,
            filterable: false,
            sortable: false,
            renderCell: (params: any) => (
                <div className="btn-group">
                    <Avatar alt="Remy Sharp" src={params?.row?.images[0]} />
                </div>
            ),
        },
        {
            field: "ProductName",
            headerName: "Product Name",
            sortable: true,
            width: 250,
        },
        // {
        //     field: "slug",
        //     headerName: "Slug",
        //     sortable: true,
        //     width: 250,
        // },
        {
            field: "brand",
            headerName: "Brand",
            sortable: true,
            width: 150,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{params.row?.brand?.brandName ? params?.row.brand?.brandName : '-'}</p>
                </div>
            )
        },
        {
            field: "category",
            headerName: "Category Name",
            sortable: true,
            width: 100,
            renderCell: (params) => (
                <div className="btn-group">
                    <p>{params.row?.category?.category ? params?.row.category?.category : '-'}</p>
                </div>
            )
        },
        {
            field: "bestseller",
            headerName: "Bestseller",
            sortable: true,
            width: 100,
            renderCell: (params) => (
                <div className="btn-group">
                    <label className="switch">
                        <input type="checkbox" checked={params.row.bestseller} onClick={() => updateBestseller(params.row)} />
                        <span className="slider round"></span>
                    </label>
                </div>
            )
        },
        {
            field: "action",
            headerName: "ACTION",
            width: 250,
            renderCell: (params) => (
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={(event) => {
                            event.stopPropagation();
                            viewProduct(params.row.id);
                        }}
                    >
                        <FaEye />
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={(event) => {
                            event.stopPropagation();
                            editProduct(params.row.id); // <-- Make sure this function exists
                        }}
                    >
                        <FaEdit />
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={(event) => {
                            event.stopPropagation();
                            deleteProduct(params.row.id);
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        }
    ];

    const viewProduct = (id: string) => {
        router.push(`/admin/listed-products/form${id ? "?id=" + id : ""}`)
    }
    const editProduct = (id: string) => {
        router.push(`/admin/listed-products/form${id ? "?id=" + id+ "&edit=true" : ""}`)
    }

    const deleteProduct = (id: string) => {
        setData({
            id: id,
            message: "Are you sure to delete this Product?"
        });
        setShow(true);
    }

    const uploadeProduct = () => {
        setShowUpload(true);
    }

    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 m-auto">
                        <div className="hero_banner_title py-0">
                            <div className="container position-relative">
                                <div className="row">
                                    <div className="col-lg-12 m-auto">
                                        <div className="title mb-0">
                                            <h2>All Products</h2>
                                        </div>
                                        <div className="col-12 d-flex justify-content-end gap-3 mb-3">
                                            <Button variant="primary" onClick={() => uploadeProduct()}>
                                                Upload CSV
                                            </Button>
                                            <Button variant="primary" onClick={() => viewProduct("")}>
                                                Add Products
                                            </Button>
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
            <ConfirmModel data={data} show={show} handleClose={handleClose} />
            <MediaFormModel showUpload={showUpload} handleUploadClose={handleUploadClose} />
        </section>
    );
}

export default MyProduct;