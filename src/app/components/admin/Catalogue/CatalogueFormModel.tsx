"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { increment } from "@/app/services/redux/features/counterSlice";
import { createCatalogue, updateCatalogue } from "@/app/services/Catalogue/CatalogueApi";
import Image from "next/image";
import loader_img from "../../../../../public/assets/img/loader_img.png";

interface CatalogueFormData {
  catalogueName: string;
  catalogueFile: any;
  catalogueImage: any;
  catalogueImageAlt: string; // NEW: Add alt tag
  catalogueDescription: string;
}

function CatalogueFormModel({ userModel, setCatalogueFormCloseModel, getCatalogueData }: any) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(getCatalogueData?.id);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CatalogueFormData>({
    defaultValues: {
      catalogueName: "",
      catalogueFile: "",
      catalogueImage: "",
      catalogueImageAlt: "", // NEW: Initialize alt tag
      catalogueDescription: ""
    }
  });

  const catalogueNameVal = watch("catalogueName") as string;

  const onSubmit = async (data: CatalogueFormData) => {
    setLoading(true);
    const formData = new FormData();
    getCatalogueData?.id && formData.append("id", getCatalogueData?.id);
    formData.append("catalogueName", data.catalogueName);
    formData.append("catalogueDescription", data.catalogueDescription);
    formData.append("catalogueImageAlt", data.catalogueImageAlt || ""); // NEW: Add alt tag

    // FIX: append files only if a new file (FileList) was selected
    if (data.catalogueImage instanceof FileList && data.catalogueImage.length > 0) {
      formData.append('catalogueImage', data.catalogueImage[0]);
    }

    if (data.catalogueFile instanceof FileList && data.catalogueFile.length > 0) {
      formData.append('catalogueFile', data.catalogueFile[0]);
    }

    try {
      const response = getCatalogueData?.id
        ? await updateCatalogue(formData)
        : await createCatalogue(formData);

      if (response) {
        reset({});
        setCatalogueFormCloseModel();
      }
    } catch (error) {
      console.error("Error in POST /api/catalogue:", error);
    } finally {
      dispatch(increment());
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getCatalogueData) {
      reset({
        ...getCatalogueData,
        catalogueImageAlt: getCatalogueData.catalogueImageAlt || "", // NEW: Set alt tag
      });
    } else {
      reset({});
    }
  }, [getCatalogueData, reset]);

  return (
    <Modal show={userModel} size="lg" onHide={()=>{
      if(!loading){
        setCatalogueFormCloseModel();
      }
    }} centered >
      <Modal.Header  closeButton={!loading} >
        <Modal.Title>{getCatalogueData?.id ? "Update Catalogue" : "Add Catalogue"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          { !loading ? <>
            <Form.Group className="mb-3" controlId="catalogueName">
              <Form.Label>Catalogue Name</Form.Label>
              <Form.Control
                type="text"
                {...register('catalogueName', { required: true })}
                placeholder="Enter catalogue name"
              />
              {errors.catalogueName && <span className="text-danger">This field is required</span>}
            </Form.Group>

            {/* NEW: Catalogue Image Alt Tag */}
            <Form.Group className="mb-3" controlId="catalogueImageAlt">
              <Form.Label>Catalogue Image Alt Text</Form.Label>
              <Form.Control
                type="text"
                {...register('catalogueImageAlt')}
                placeholder="Enter alt text for catalogue image (SEO)"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="catalogueImage">
              <Form.Label>Catalogue Image</Form.Label>
              <div>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register('catalogueImage', {
                    required: watch("catalogueImage")?.length ? false : 'This field is required',
                    validate: (value: any) => {
                      if (typeof value === "string") {
                        return true;
                      }
                      if (!value || value.length === 0) {
                        return isEdit ? true : "Image file is required";
                      }
                      const file = value[0];
                      if (!file?.type || !file.type.startsWith("image/")) {
                        return "Only image files are allowed";
                      }
                      return true;
                    },
                  })}
                />
                {watch("catalogueImage") &&
                  typeof watch("catalogueImage") === "string" &&
                  watch("catalogueImage")?.includes("amazonaws.com") && (
                    <Image
                      src={watch("catalogueImage")}
                      width={100}
                      height={100}
                      alt={watch("catalogueImageAlt") || `${catalogueNameVal || 'catalogue'} image`} // NEW: Use alt tag
                      unoptimized
                      className="object-fit-contain img-thumbnail mt-2"
                    />
                  )
                }
                {watch("catalogueImage") && watch("catalogueImage")[0] instanceof File && (
                  <Image
                    src={URL.createObjectURL(watch("catalogueImage")[0])}
                    width={100}
                    height={100}
                    alt={watch("catalogueImageAlt") || `${catalogueNameVal || 'catalogue'} image`} // NEW: Use alt tag
                    unoptimized
                    className="object-fit-contain img-thumbnail mt-2"
                  />
                )}
              </div>
              {errors.catalogueImage && <span className="text-danger">{errors?.catalogueImage?.message as String}</span>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="catalogueFile">
              <Form.Label>Catalogue File</Form.Label>
              <div>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  {...register("catalogueFile", {
                    required: !watch("catalogueFile") ? "This field is required" : false,
                    validate: (value: any) => {
                      if (typeof value === "string") {
                        return true;
                      }
                      if (!value || value.length === 0) {
                        return isEdit ? true : "PDF file is required";
                      }
                      const file = value[0];
                      if (!(file?.type === "application/pdf" || file?.name?.toLowerCase().endsWith(".pdf"))) {
                        return "Only PDF files are allowed";
                      }
                      return true;
                    },
                  })}
                />
                {watch("catalogueFile") &&
                  typeof watch("catalogueFile") === "string" &&
                  watch("catalogueFile")?.includes("amazonaws.com") && (
                    <iframe
                      src={watch("catalogueFile")}
                      width={140}
                      height={140}
                      className="mt-2"
                      title={watch("catalogueImageAlt") || `${catalogueNameVal || 'catalogue'} file`} // NEW: Use alt tag for iframe title
                    />
                  )
                }
                {watch("catalogueFile") && watch("catalogueFile")[0] instanceof File && (
                  <iframe
                    src={URL.createObjectURL(watch("catalogueFile")[0])}
                    width={140}
                    height={140}
                    className="mt-2"
                    title={watch("catalogueImageAlt") || `${catalogueNameVal || 'catalogue'} file`} // NEW: Use alt tag for iframe title
                  />
                )}
              </div>
              {errors.catalogueFile && <span className="text-danger">This field is required</span>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="catalogueDescription">
              <Form.Label>Catalogue Description</Form.Label>
              <Form.Control
                as="textarea"
                {...register('catalogueDescription', { required: true })}
                placeholder="Enter catalogue description"
                rows={3}
              />
              {errors.catalogueDescription && <span className="text-danger">This field is required</span>}
            </Form.Group>

            <div className="co-12 d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading}>
                {getCatalogueData?.id ? "Update" : "Add"}
              </Button>
            </div>
          </>
            :
            <div className="text-center position-relative d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <Spinner animation="border" role="status" style={{ width: '100px', height: '100px' }}>
              </Spinner>
              <Image src={loader_img} alt="loader_img" className='position-absolute' width={80} height={80} />
              <span  className='position-absolute' style={{top:"250px"}}>Please wait catalogue is uploading...</span>
            </div>
            }
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CatalogueFormModel;