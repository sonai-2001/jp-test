"use client"
import React, { useEffect, useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import CatalogueFormModel from './CatalogueFormModel'
import { Avatar } from '@mui/material';
import { FaEye, FaTrash } from 'react-icons/fa';
import { deleteCatalogue, getCatalogues } from '@/app/services/Catalogue/CatalogueApi';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import loader_img from "../../../../../public/assets/img/loader_img.png"
const initialData = {
    catalogueName: "",
    catalogueFile: "",
    catalogueImage: "",
    catalogueDescription: ""
}
function CatalogueBody() {
    const counter = useSelector((state: any) => state.counter?.value);
    const [userModel, setCatalogueFormModel] = useState(false);
    const [getCatalogueData, setgetCatalogueData] = useState<any>({});
    const setCatalogueFormCloseModel = () => {
        setCatalogueFormModel(false);
        setgetCatalogueData(initialData);
    };
    const formCatalogueUpdate = (data: any) => {
        setgetCatalogueData(data ? data : '');
        setCatalogueFormModel(true);
    };

    const [catalogueList, setCatalogueList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);


    // Cataloguedelete
    const [getCatalogueDelete, setgetCatalogueDelete] = useState<any>({});
    const [cataloguesDeleteModel, setCatalogueDeleteModel] = useState(false);
    const setCatalogueDeleteCloseModel = () => {
        setCatalogueDeleteModel(false);
        setgetCatalogueDelete(initialData);
    };

    const formCataloguedelete = (data: any) => {
        setCatalogueDeleteModel(true);
        setgetCatalogueDelete({ ...data });
    };
    const onSubmitDelete = async () => {
        try {
            const response = await deleteCatalogue(getCatalogueDelete?.id);
            if (response.ok) {
                setCatalogueDeleteCloseModel();
            }
        } catch (error) {
            console.error(error, "Error submitting form:");
        } finally {
            setgetCatalogueDelete(initialData)
            getCataloguesList();
            setCatalogueDeleteCloseModel();
        }
    };

    const columns = () => {
        return [
            {
                field: "index",
                headerName: "S.No.",
                sortable: true,
                width: 100,
            },
            {
                field: "catalogueImage",
                headerName: "Catalogue Image",
                width: 200,
                filterable: false,
                sortable: false,
                renderCell: (params: any) => (
                    <div className="btn-group">
                        <Avatar alt="Remy Sharp" src={params?.row?.catalogueImage} />
                    </div>
                ),
            },
            {
                field: "catalogueName",
                headerName: "Catalogue Name",
                sortable: true,
                width: 400,
            },
            {
                field: "action",
                headerName: "ACTION",
                width: 200,
                renderCell: (params: any) => (
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={(event: any) => {
                                event.stopPropagation();
                                formCatalogueUpdate(params.row);
                            }}
                        >
                            <FaEye />
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={(event) => {
                                event.stopPropagation();
                                formCataloguedelete(params.row);
                            }}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ),
            },
        ];
    };

    const getCataloguesList = async () => {
        setIsLoading(true);
        try {
            const data = await getCatalogues();
            setCatalogueList(
                data?.map((item: any, i: number) => ({
                    ...item,
                    index: i + 1,
                    id: item?._id,
                }))
            );
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCataloguesList();
    }, [counter]);

    return (
        <>
            <div className="hero_banner_title py-0">
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-lg-8 m-auto">
                            <div className="title">
                                <h2>Catalogue</h2>
                            </div>
                            <Button variant="primary" style={{ top: '0px', right: '10px' }} onClick={() => formCatalogueUpdate("")} className='position-absolute'>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        <div className="col-sm-12">
                            {isLoading ?
                                <div className="text-center position-relative d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                                    <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    <Image src={loader_img} alt="loader_img" className='position-absolute' width={80} height={80} />
                                </div>
                                :
                                <DataGrid
                                    rows={catalogueList}
                                    columns={columns()}
                                    loading={isLoading}
                                    pagination
                                    initialState={{
                                        ...catalogueList.initialState,
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
                    }
                </div>
            </div>
            <div>


            </div>
            <CatalogueFormModel userModel={userModel}
                setCatalogueFormCloseModel={setCatalogueFormCloseModel}
                getCatalogueData={getCatalogueData}
            />
            <Modal
                centered
                show={cataloguesDeleteModel}
                onHide={() => {
                    setCatalogueDeleteCloseModel();
                }}
                style={{ display: "block" }}
            >
                <Modal.Header className="modal-header" closeButton>
                    <h5 className="modal-title  fw-bold" id="expaddLabel">
                        {getCatalogueDelete?.modelHeading}
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
                            Are you sure to delete "{getCatalogueDelete?.catalogueName}" Catalogue?
                        </h4>
                        <div className={`d-flex justify-content-between`}>
                            <button
                                onClick={() => {
                                    setCatalogueDeleteCloseModel();
                                    setgetCatalogueDelete({});
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
        </>
    )
}

export default CatalogueBody