"use client"
import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { deleteMedia, getMedia } from "@/app/services/Media/MediaApi";
import MediaFormModel from "./MediaFormModel";
import { FaRegCopy } from "react-icons/fa";
import Image from "next/image";
import { copyToClipboard } from "@/lib/coreFunctions";
import { MdDelete } from "react-icons/md";
import loader_img from "../../../../public/assets/img/loader_img.png"

function MediaFormList() {
  const { reset } = useForm();
  const [changeStatusTo, setChangeStatusTo] = useState<any>({});
  const [getMediaData, setgetMediaData] = useState<any>({});
  const [sectorList, setSectorList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);


  // Sectordelete
  const [getSectorDelete, setgetSectorDelete] = useState<string>("");
  const [userDeleteModel, setSectorDeleteModel] = useState(false);
  const setSectorDeleteCloseModel = () => {
    setSectorDeleteModel(false);
    clearData();
  };

  
  const formSectordelete = (name: string) => {
    setSectorDeleteModel(true);
    setgetSectorDelete(name);
  };

  const onSubmitDelete = async () => {
    try {
      const response = await deleteMedia(getSectorDelete);
      if (response.ok) {
        setSectorDeleteCloseModel();
      }
    } catch (error) {
      console.error(error, "Error submitting form:");
    } finally {
      clearData();
      getSectorList();
      setSectorDeleteCloseModel();
    }
  };

  const [userMediaFormModel, setMediaFormModel] = useState(false);
  const setMediaFormCloseModel = () => {
    setMediaFormModel(false);
    setgetMediaData({});
    setTimeout(() => {
      getSectorList();
    }, 500);
  };
  const formSectorUpdate = (data: any) => {
    setgetMediaData('');
    setMediaFormModel(true);
  };

  const getSectorList = async () => {
    setIsLoading(true);
    try {
      const data = await getMedia();

      setSectorList(
        data?.images?.length ? data?.images : []
      );
    } catch (error) {
      console.error("Error fetching media data:", error);
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setgetMediaData({});
    setChangeStatusTo({});
    setgetSectorDelete("");
  };

  useEffect(() => {
    getSectorList();
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
                        <h2>Media</h2>
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
                    Add Media
                  </button>
                </div>
              </div>

              <div className="row position-relative">
                {!isLoading ?
                  <div className="col-sm-12">
                    <div className="row">
                      {
                        sectorList?.length ?
                          sectorList?.map((data: string, index: number) => {
                            return <div className="col-4 mb-4" key={index}>
                              <div className="card d-flex justify-content-center aling-items-center position-relative">
                              <span onClick={()=>copyToClipboard(data)} className="position-absolute bg-body-tertiary px-2 py-1 rounded-circle" style={{ top: "10px", right: "50px" }} ><FaRegCopy style={{fontSize:"20px", cursor:"pointer"}} /></span>
                              <span onClick={()=>formSectordelete(data)} className="position-absolute bg-body-tertiary px-2 py-1 rounded-circle" style={{ top: "10px", right: "10px" }} ><MdDelete color="#b22222" style={{fontSize:"20px", cursor:"pointer"}} /></span>
                                <Image src={data} alt={`media-${index}`} width={320} height={300} style={{maxWidth:'100%'}} />
                              </div>
                            </div>
                          })
                          : "No Media Found"

                      }
                    </div>

                  </div>
                  : <div className="text-center position-relative d-flex justify-content-center align-items-center" style={{height:'400px'}}>
                  <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                   <Image src={loader_img} alt="loader_img" className='position-absolute' width={80} height={80} />
                </div>}
              </div>
            </div>
          </div>
        </div>
      </section>

  
      <MediaFormModel
        userModel={userMediaFormModel}
        setMediaFormCloseModel={setMediaFormCloseModel}
        getMediaData={getMediaData}
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
              Are you sure to delete this media file?
            </h4>
            <div className={`d-flex justify-content-between`}>
              <button
                onClick={() => {
                  setSectorDeleteCloseModel();
                  setgetSectorDelete("");
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
export default MediaFormList;