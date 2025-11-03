"use client";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createIndustry, updateIndustry } from "@/app/services/Industry/IndustryApi";

type Props = {
  userModel: boolean;
  setIndustryFormCloseModel: () => void;
  selectedIndustry: any; // {_id?: string, industry?: string, industryImage?: string, industryImageAlt?: string, description?: string}
};

function IndustryFormModel({ userModel, setIndustryFormCloseModel, selectedIndustry }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const imgVal = watch("industryImage");
  const descVal = watch("description") as string;
  const industryNameVal = watch("industry") as string;

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    if (selectedIndustry?._id) formData.append("id", selectedIndustry._id);
    formData.append("industry", data.industry);
    formData.append("description", data.description || "");
    formData.append("industryImageAlt", data.industryImageAlt || ""); // NEW: Add alt tag

    // Image: file or existing URL
    if (imgVal) {
      if (typeof imgVal === "string") {
        formData.append("industryImage", imgVal);
      } else if (imgVal?.length && imgVal[0] instanceof File) {
        formData.append("industryImage", imgVal[0]);
      }
    }

    try {
      const resp = selectedIndustry?._id
        ? await updateIndustry(formData)
        : await createIndustry(formData);

      if (resp?.status) setIndustryFormCloseModel();
    } catch (error) {
      console.error("Error submitting industry form:", error);
    }
  };

  useEffect(() => {
    if (selectedIndustry?._id) {
      reset({
        _id: selectedIndustry._id,
        industry: selectedIndustry.industry,
        industryImage: selectedIndustry.industryImage || "",
        industryImageAlt: selectedIndustry.industryImageAlt || "", // NEW: Set alt tag
        description: selectedIndustry.description || "",
      });
    } else {
      reset({ 
        industry: "", 
        industryImage: "", 
        industryImageAlt: "", // NEW: Initialize alt tag
        description: "" 
      });
    }
  }, [selectedIndustry, reset]);

  return (
    <Modal show={userModel} onHide={setIndustryFormCloseModel} style={{ display: "block" }}>
      <Modal.Header className="modal-header" closeButton>
        <h5 className="modal-title fw-bold">Industry</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="deadline-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label>
                Industry<span className="text-danger">*</span>
              </label>
              <input
                {...register("industry", { required: true })}
                type="text"
                className="form-control"
                placeholder="Industry"
              />
              {errors?.industry && <span className="text-danger">This field is required</span>}
            </div>

          

            {/* Description */}
            <div className="form-group mb-3">
              <label>Description</label>
              <textarea
                {...register("description", {
                  maxLength: { value: 1000, message: "Max 1000 characters" },
                })}
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
                Industry Image<span className="text-danger">*</span>
              </label>
              <div>
                <input
                  {...register("industryImage", {
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

                {typeof imgVal === "string" && imgVal && (
                  <Image
                    src={imgVal}
                    width={100}
                    height={100}
                    alt={watch("industryImageAlt") || `${industryNameVal || 'industry'} image`} // NEW: Use alt tag
                    unoptimized
                    className="img-thumbnail mt-2"
                  />
                )}

                {imgVal && typeof imgVal !== "string" && imgVal[0] instanceof File && (
                  <Image
                    src={URL.createObjectURL(imgVal[0])}
                    width={100}
                    height={100}
                    alt={watch("industryImageAlt") || `${industryNameVal || 'industry'} image`} // NEW: Use alt tag
                    unoptimized
                    className="img-thumbnail mt-2"
                  />
                )}
              </div>
              {errors?.industryImage && (
                <span className="text-danger">{(errors?.industryImage?.message as string) || ""}</span>
              )}
            </div>
              {/* NEW: Industry Image Alt Tag */}
            <div className="form-group mb-3">
              <label>Industry Image Alt Text</label>
              <input
                {...register("industryImageAlt")}
                type="text"
                className="form-control"
                placeholder="Enter alt text for industry image (SEO)"
              />
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button onClick={setIndustryFormCloseModel} type="button" className="btn btn-secondary">
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

export default IndustryFormModel;