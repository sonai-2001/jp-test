"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getTestimonials } from "@/app/services/Testimonial/TestimonialApi";
import {  useSelector } from "react-redux";
import { Button, Spinner } from "react-bootstrap";
import { Avatar } from "@mui/material";
import { FaEye, FaTrash, FaEdit, FaStar } from "react-icons/fa";
import Image from "next/image";
import loader_img from "../../../../public/assets/img/loader_img.png";
import ConfirmDeleteTestimonial from "./ConfirmDeleteTestimonial";

interface TestimonialRow {
  _id: string;
  id: string;
  index: number;
  name: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

function MyTestimonials() {
  const router = useRouter();
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const counter = useSelector((state: any) => state.counter?.value);

  const [confirm, setConfirm] = useState({ show: false, id: "", message: "" });

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const result: any[] = await getTestimonials();
      const data = result.map((item, i) => ({
        ...item,
        id: item._id,
        index: i + 1,
      }));
      setRows(data);
    } catch (e) {
      console.error("Error fetching testimonials", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const columns: GridColDef[] = [
    { field: "index", headerName: "S.No.", width: 70 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 120,
      sortable: false,
      renderCell: (params: any) => <Avatar alt={params.row.name} src={params.row.avatar} />,
    },
    { field: "name", headerName: "Name", width: 200 },
    { field: "company", headerName: "Company", width: 220 },
    {
      field: "rating",
      headerName: "Rating",
      width: 120,
      renderCell: (params: any) => (
        <div className="d-flex align-items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} color={i < (params.row.rating || 0) ? "#facc15" : "#e5e7eb"} />
          ))}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 220,
      renderCell: (params: any) => (
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={(e) => {
              e.stopPropagation();
              viewRow(params.row.id);
            }}
          >
            <FaEye />
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              editRow(params.row.id);
            }}
          >
            <FaEdit />
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              setConfirm({ show: true, id: params.row.id, message: "Delete this testimonial?" });
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const viewRow = (id: string) => {
    router.push(`/admin/testimonials/form${id ? "?id=" + id : ""}`);
  };
  const editRow = (id: string) => {
    router.push(`/admin/testimonials/form${id ? "?id=" + id + "&edit=true" : ""}`);
  };

  return (
    <section>
      <div className="container">
        <div className="row ">
          <div className="col-lg-12 m-auto">
            <div className="title mb-0 d-flex justify-content-between align-items-center">
              <h2>All Testimonials</h2>
              <Button variant="primary" onClick={() => viewRow("")}>
                Add Testimonial
              </Button>
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
                    <Image src={loader_img} alt="loader_img" className="position-absolute" width={80} height={80} />
                  </div>
                ) : (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
                    sx={{ border: "none" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteTestimonial
        id={confirm.id}
        show={confirm.show}
        message={confirm.message}
        onClose={() => setConfirm({ show: false, id: "", message: "" })}
      />
    </section>
  );
}

export default MyTestimonials;