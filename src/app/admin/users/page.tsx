"use client"
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import { FaEye } from "react-icons/fa";
import { getUsers } from "@/app/services/User/User";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";
import Image from "next/image";
import loader_img from "../../../../public/assets/img/loader_img.png"
import { Spinner } from "react-bootstrap";

function CategoryFormList() {
  const { reset } = useForm();
  const router = useRouter()
  const [sectorList, setSectorList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = () => {
    return [
      {
        field: "index",
        headerName: "S.No.",
        sortable: true,
        width: 100,
      },
      
      {
        field: "image",
        headerName: "Image",
        filterable: false,
        sortable: false,
        width: 200,
        renderCell: (params: any) => (
          <div className="btn-group">
           <Avatar alt="Remy Sharp" src={params?.row?.image} />
          </div>
        ),
      },
      {
        field: "name",
        headerName: "Name",
        sortable: true,
        width: 100,
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        width: 200,
      },
      {
        field: "mobile",
        headerName: "Mobile",
        sortable: true,
        width: 100,
      },
      {
        field: "address",
        headerName: "Address",
        sortable: true,
        width: 300,
      },
      {
        field: "action",
        headerName: "ACTION",
        width: 100,
        renderCell: (params: any) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={(event) => {
                event.stopPropagation();
                formSectorView(params.row.id);
              }}
            >
              <FaEye />
            </button>
          </div>
        ),
      },
    ];
  };

  const getCategoryList = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setSectorList(
        data?.map((item: any, i: number) => ({
          ...item,
          index: i + 1,
          id: item?._id,
        }))?.filter((item:any)=>item.type!=="admin")
      );
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  const formSectorView = (id: string) => {
    router.push(`/admin/users/${id}`)
  }

  useEffect(() => {
    getCategoryList();
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
                        <h2>Users</h2>
                      </div>
                    </div>
                  </div>
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
                    :
                    <DataGrid
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

    </>
  );
}
export default CategoryFormList;