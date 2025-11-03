"use client";
import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FaEye, FaTrash } from "react-icons/fa";
import Image from "next/image";
import loader_img from "../../../../public/assets/img/loader_img.png";
import IndustryFormModel from "./IndustryFormModel";
import {
  deleteIndustry,
  getIndustries,
} from "@/app/services/Industry/IndustryApi";

function IndustryFormList() {
  const { reset } = useForm();
  const [selectedIndustry, setSelectedIndustry] = useState<any>({});
  const [industryList, setIndustryList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // add/edit modal
  const [showFormModal, setShowFormModal] = useState(false);
  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedIndustry({});
    setTimeout(() => {
      fetchIndustries();
    }, 300);
  };

  // delete modal
  const [deleteTarget, setDeleteTarget] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget({});
  };

  const handleOpenForm = (row?: any) => {
    setSelectedIndustry(row?._id ? { ...row } : {});
    setShowFormModal(true);
  };

  const handleOpenDelete = (row: any) => {
    setDeleteTarget({ ...row });
    setShowDeleteModal(true);
  };

  const onSubmitDelete = async () => {
    try {
      const res = await deleteIndustry(deleteTarget?.id);
      if (res?.status) {
        // success toast is already shown in service
      }
    } catch (error) {
      console.error("Delete industry error:", error);
    } finally {
      closeDeleteModal();
      fetchIndustries();
    }
  };

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "S.No.",
      sortable: true,
      width: 120,
    },
    {
      field: "industry",
      headerName: "Industry Name",
      sortable: true,
      flex: 1,
      minWidth: 300,
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenForm(params.row);
            }}
            title="View / Edit"
          >
            <FaEye />
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDelete(params.row);
            }}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const fetchIndustries = async () => {
    setIsLoading(true);
    try {
      const data = await getIndustries();
      setIndustryList(
        data?.map((item: any, i: number) => ({
          ...item,
          index: i + 1,
          id: item?._id, // DataGrid requires `id`
        }))
      );
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  return (
    <>
      <section>
        <div className="container">
          <div className="row ">
            <div className="col-lg-12 m-auto">
              <div className="hero_banner_title py-0">
                <div className="container position-relative">
                  <div className="row">
                    <div className="col-lg-8 m-auto">
                      <div className="title">
                        <h2>Industries</h2>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenForm()}
                    style={{ top: "0px", right: "10px" }}
                    className="btn btn-primary position-absolute"
                  >
                    Add Industry
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  {isLoading ? (
                    <div
                      className="text-center position-relative d-flex justify-content-center align-items-center"
                      style={{ height: "400px" }}
                    >
                      <Spinner animation="border" role="status" style={{ width: "100px", height: "100px" }}>
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      <Image
                        src={loader_img}
                        alt="loader_img"
                        className="position-absolute"
                        width={80}
                        height={80}
                      />
                    </div>
                  ) : (
                    <DataGrid
                      rows={industryList}
                      columns={columns}
                      pagination
                      initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                      }}
                      pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
                      sx={{
                        border: "none",
                        "& .MuiDataGrid-root": { border: "none" },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndustryFormModel
        userModel={showFormModal}
        setIndustryFormCloseModel={closeFormModal}
        selectedIndustry={selectedIndustry}
      />

      <Modal
        centered
        show={showDeleteModal}
        onHide={closeDeleteModal}
        style={{ display: "block" }}
      >
        <Modal.Header className="modal-header" closeButton>
          <h5 className="modal-title fw-bold">Delete Industry</h5>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="deadline-form">
            <h4
              style={{
                textAlign: "center",
                fontSize: "22px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              Are you sure you want to delete "{deleteTarget?.industry}"?
            </h4>
            <div className="d-flex justify-content-between">
              <button onClick={closeDeleteModal} type="button" className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={onSubmitDelete} type="button" className="btn btn-primary">
                Yes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default IndustryFormList;