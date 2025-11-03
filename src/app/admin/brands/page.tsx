"use client"
import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import { deleteBrand, getBrands } from "@/app/services/Brands/BrandApi";
import BrandFormModel from "./BrandFormModel";
import { FaEye, FaTrash } from "react-icons/fa";
import { Avatar } from "@mui/material";
import Image from "next/image";
import loader_img from "../../../../public/assets/img/loader_img.png"

function BrandFormList() {
  const { reset } = useForm();
  const [changeStatusTo, setChangeStatusTo] = useState<any>({});
  const [getSectorData, setgetSectorData] = useState<any>({});
  const [sectorList, setSectorList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);


  // SectorDetail
  const [userModel, setSectorModel] = useState(false);
  const setSectorCloseModel = () => {
    setSectorModel(false);
    clearData();
  };

  // Sectordelete
  const [getSectorDelete, setgetSectorDelete] = useState<any>({});
  const [userDeleteModel, setSectorDeleteModel] = useState(false);
  const setSectorDeleteCloseModel = () => {
    setSectorDeleteModel(false);
    clearData();
  };

  const formSectordelete = (data: any) => {
    setSectorDeleteModel(true);
    setgetSectorDelete({ ...data });
  };

  const onSubmitDelete = async () => {
    try {
      const response = await deleteBrand(getSectorDelete?.id);
      if (response.ok) {
        setSectorCloseModel();
      }
    } catch (error) {
      console.error(error, "Error submitting form:");
    } finally {
      clearData();
      getSectorList();
      setSectorDeleteCloseModel();
    }
  };


  const [userFormModel, setSectorFormModel] = useState(false);
  const setSectorFormCloseModel = () => {
    setSectorFormModel(false);
    setgetSectorData({});
    setTimeout(() => {
      getSectorList();
    }, 500);
  };
  const formSectorUpdate = (data: any) => {
    setgetSectorData(data?.id ? { ...data } : "");
    setSectorFormModel(true);
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
        field: "brandImage",
        headerName: "Brand Image",
        width: 200,
        filterable: false,
        sortable: false,
        renderCell: (params: any) => (
          <div className="btn-group">
            <Avatar alt="Remy Sharp" src={params?.row?.brandImage} />
          </div>
        ),
      },
      {
        field: "brandName",
        headerName: "Brand Name",
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
                formSectorUpdate(params.row);
              }}
            >
              <FaEye />
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={(event) => {
                event.stopPropagation();
                formSectordelete(params.row);
              }}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ];
  };

  const getSectorList = async () => {
    setIsLoading(true);
    try {
      const data = await getBrands();
      setSectorList(
        data?.map((item: any, i: number) => ({
          ...item,
          index: i + 1,
          id: item?._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setgetSectorData({});
    setChangeStatusTo({});
    setgetSectorDelete({});
  };

  useEffect(() => {
    getSectorList();
  }, []);

  return (
    <>
      {/* <section className="enquiry_body"> */}
      <section>
        <div className="container">
          <div className="row ">
            {/* <div className="col-lg-10 enquiry_box m-auto"> */}
            <div className="col-lg-12 m-auto">
              <div className="hero_banner_title py-0">
                <div className="container position-relative">
                  <div className="row">
                    <div className="col-lg-8 m-auto">
                      <div className="title">
                        <h2>Brands</h2>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      formSectorUpdate("");
                    }}
                    style={{ top: '0px', right: '10px' }}
                    className="btn btn-primary position-absolute"
                  >
                    Add Brand
                  </button>
                </div>
              </div>



              <div className="row">
                {
                  <div className="col-sm-12">
                      {isLoading ?
                     <div className="text-center position-relative d-flex justify-content-center align-items-center" style={{height:'400px'}}>
                     <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
                       <span className="visually-hidden">Loading...</span>
                     </Spinner>
                      <Image src={loader_img} alt="loader_img" className='position-absolute' width={80} height={80} />
                   </div>
                    :<DataGrid
                      rows={sectorList}
                      columns={columns()}
                      loading={isLoading}
                      pagination
                      initialState={{
                        ...sectorList.initialState,
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
          </div>
        </div>
      </section>

      <Modal
        show={userModel}
        size="xl"
        onHide={() => {
          setSectorCloseModel();
        }}
        style={{ display: "block" }}
      >
        <Modal.Header className="modal-header" closeButton></Modal.Header>
        <Modal.Body className="modal-body">
          <div className="deadline-form">
            <div className="row">
              <div className="col-12">
                <div className={`w-50`}>
                  <img
                    style={{ cursor: "pointer", width: "100px" }}
                    src={changeStatusTo?.logo}
                    alt={`uploaded `}
                  />
                </div>
              </div>

              <div className="col-12">
                <h4 className="mt-2">{changeStatusTo.companyName}</h4>
                <h5 className="mt-2" style={{ color: "#7F79F7" }}>
                  Sector : {changeStatusTo?.sector} | Ticker :{" "}
                  {changeStatusTo?.ticker}
                </h5>
              </div>

              <div className="col-12">
                <p style={{ fontSize: "18px" }}>
                  {changeStatusTo?.companyInfo}
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <BrandFormModel
        userModel={userFormModel}
        setSectorFormCloseModel={setSectorFormCloseModel}
        getSectorData={getSectorData}
      />

      <Modal
        centered
        show={userDeleteModel}
        onHide={() => {
          setSectorDeleteCloseModel();
        }}
        style={{ display: "block" }}
      >
        <Modal.Header className="modal-header" closeButton>
          <h5 className="modal-title  fw-bold" id="expaddLabel">
            {changeStatusTo?.modelHeading}
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
              Are you sure to delete "{getSectorDelete?.brandName}" brand?
            </h4>
            <div className={`d-flex justify-content-between`}>
              <button
                onClick={() => {
                  setSectorDeleteCloseModel();
                  setgetSectorDelete({});
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
  );
}
export default BrandFormList;