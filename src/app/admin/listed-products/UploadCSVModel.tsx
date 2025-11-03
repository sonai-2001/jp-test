"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { increment } from "@/app/services/redux/features/counterSlice";
import { uploadeProduct } from "@/app/services/uploadeProduct/uploadeProductApi";

interface MediaFormData {
  csvFile: any;
}

function MediaFormModel({ showUpload, handleUploadClose }: any) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MediaFormData>({
    defaultValues: {
      csvFile: "",
    }
  });


  const onSubmit = async (data: MediaFormData) => {
    const formData = new FormData();
    formData.append(`csvFile`, data?.csvFile?.[0]);
    try {
      const response = await uploadeProduct(formData);


      if (response) {
        dispatch(increment());
        reset({ csvFile: '' })
        handleUploadClose();
      }
    } catch (error) {
      console.error("Error in POST /api/media:", error);
    }
  };


  return (
    <Modal show={showUpload} onHide={()=>{
      reset({ csvFile: '' });
      handleUploadClose();
    }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="images">
            <Form.Label>Upload CSV file</Form.Label>

            <div className="mb-2">
              <div className="d-flex gap-3">
                <Form.Control
                  type="file"
                  {...register(`csvFile`, {
                    required: "CSV file is required",
                    validate: (value) => {
                      if (!value) {
                        return "CSV file is required";
                      }
                      if (value[0].type !== "text/csv") {
                        return "Only CSV files are allowed";
                      }
                      return true;
                    },
                  })}
                   accept=".csv"
                />
              </div>
              {errors.csvFile && <span className="text-danger">{errors.csvFile.message as String}</span>}
            </div>
          </Form.Group>

          <div className="co-12 d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default MediaFormModel;