"use client";

import { createCategory, updateCategory } from "@/app/services/Category/CategoryApi";
import Image from "next/image";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

function CategoryFormModel({
  userModel,
  setSectorFormCloseModel,
  getSectorData,
}: {
  userModel: any;
  setSectorFormCloseModel: any;
  getSectorData: any;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const imgVal = watch("categoryImage");
  const descVal = watch("description") as string;
  const categoryNameVal = watch("category") as string;

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    if (getSectorData?._id) formData.append("id", getSectorData._id);
    formData.append("category", data.category);
    formData.append("description", data.description || "");
    formData.append("categoryImageAlt", data.categoryImageAlt || ""); // NEW: Add alt tag

    // Image: support existing URL or new file
    if (imgVal) {
      if (typeof imgVal === "string") {
        formData.append("categoryImage", imgVal);
      } else if (imgVal?.length && imgVal[0] instanceof File) {
        formData.append("categoryImage", imgVal[0]);
      }
    }

    try {
      const response = getSectorData?._id ? await updateCategory(formData) : await createCategory(formData);
      if (response?.status) {
        getSectorData = {};
        setSectorFormCloseModel();
      }
    } catch (error) {
      console.error(error, "Error submitting form:");
    }
  };

  useEffect(() => {
    if (getSectorData?._id) {
      reset({
        _id: getSectorData?._id,
        category: getSectorData?.category,
        categoryImage: getSectorData?.categoryImage || "",
        categoryImageAlt: getSectorData?.categoryImageAlt || "", // NEW: Set alt tag
        description: getSectorData?.description || "",
      });
    } else {
      reset({ 
        category: "", 
        categoryImage: "", 
        categoryImageAlt: "", // NEW: Initialize alt tag
        description: "" 
      });
    }
  }, [getSectorData, reset]);

  return (
    <Modal
      show={userModel}
      onHide={() => {
        getSectorData = {};
        setSectorFormCloseModel();
      }}
      style={{ display: "block" }}
    >
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title  fw-bold" id="expaddLabel">
          Category
        </h5>
      </Modal.Header>
      <Modal.Body>
        <div className="deadline-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label>
                Category<span className="text-danger">*</span>
              </label>
              <input
                {...register("category", { required: true })}
                type="text"
                className="form-control"
                placeholder="Category"
              />
              {errors?.category && <span className="text-danger">This field is required</span>}
            </div>

           
            <div className="form-group mb-3">
              <label>Description</label>
              <textarea
                {...register("description", { maxLength: { value: 1000, message: "Max 1000 characters" } })}
                className="form-control"
                rows={4}
                placeholder="Add a short description (optional)"
              />
              <div className="d-flex justify-content-between">
                <small className="text-muted">{(descVal?.length || 0)}/1000</small>
                {errors?.description && (
                  <span className="text-danger">{(errors.description.message as string) || ""}</span>
                )}
              </div>
            </div>

            <div className="form-group mb-3">
              <label>
                Category Image<span className="text-danger">*</span>
              </label>
              <div>
                <input
                  {...register("categoryImage", {
                    required:
                      typeof imgVal === "string" && imgVal?.length ? false : "This field is required",
                    validate: (value) => {
                      if (typeof value === "string") return true;
                      if (!value || value.length === 0) return "Image file is required";
                      if (!value[0]?.type?.startsWith("image/")) return "Only image files are allowed";
                      return true;
                    },
                  })}
                  type="file"
                  className="form-control"
                  accept="image/*"
                />

                {/* Preview existing URL */}
                {typeof imgVal === "string" && imgVal && (
                  <Image
                    src={imgVal}
                    width={100}
                    height={100}
                    alt={watch("categoryImageAlt") || `${categoryNameVal || 'category'} image`} // NEW: Use alt tag
                    unoptimized
                    className="img-thumbnail mt-2"
                  />
                )}

                {/* Preview new file */}
                {imgVal && typeof imgVal !== "string" && imgVal[0] instanceof File && (
                  <Image
                    src={URL.createObjectURL(imgVal[0])}
                    width={100}
                    height={100}
                    alt={watch("categoryImageAlt") || `${categoryNameVal || 'category'} image`} // NEW: Use alt tag
                    unoptimized
                    className="img-thumbnail mt-2"
                  />
                )}
              </div>
              {errors?.categoryImage && (
                <span className="text-danger">{(errors?.categoryImage?.message as string) || ""}</span>
              )}
            </div>
             {/* NEW: Category Image Alt Tag */}
            <div className="form-group mb-3">
              <label>Category Image Alt Text</label>
              <input
                {...register("categoryImageAlt")}
                type="text"
                className="form-control"
                placeholder="Enter alt text for category image (SEO)"
              />
            </div>


            <div className="d-flex justify-content-between align-items-center">
              <button
                onClick={() => {
                  setSectorFormCloseModel();
                }}
                type="button"
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CategoryFormModel;