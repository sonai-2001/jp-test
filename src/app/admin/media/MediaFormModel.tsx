"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { createMedia } from "@/app/services/Media/MediaApi";
import { useDispatch } from "react-redux";
import { increment } from "@/app/services/redux/features/counterSlice";
import { AiFillDelete } from "react-icons/ai";

interface MediaFormData {
  images: FileList | null;
}

function MediaFormModel({ userModel, setMediaFormCloseModel, getMediaData }: any) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MediaFormData>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const onSubmit = async (data: MediaFormData) => {
    const formData = new FormData();
    selectedImages.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      const response = await createMedia(formData);
      if (response) {
        dispatch(increment());
        reset();
        setSelectedImages([]);
        setMediaFormCloseModel();
      }
    } catch (error) {
      console.error("Error in POST /api/media:", error);
    }
  };

  useEffect(() => {
    if (getMediaData?.images) {
      setSelectedImages(getMediaData.images);
    } else {
      setSelectedImages([]);
    }
  }, [getMediaData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(event.target.files)]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  return (
    <Modal show={userModel} size="lg" onHide={setMediaFormCloseModel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{getMediaData?.id ? "Update Media" : "Add Media"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="images">
            <Form.Label>Media Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              {...register("images", { required: selectedImages.length === 0 })}
              onChange={handleFileChange}
            />
            {errors.images && <span className="text-danger">This field is required</span>}
          </Form.Group>

          <div className="image-preview d-flex flex-wrap gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="position-relative">
                <Image
                  src={typeof file === "string" ? file : URL.createObjectURL(file)}
                  alt="Preview"
                  thumbnail
                  width={100}
                  height={100}
                />
                <AiFillDelete
                  className="position-absolute text-danger"
                  style={{ cursor: "pointer", top: "5px", right: "5px" }}
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            ))}
          </div>

          <div className="co-12 d-flex justify-content-end mt-3">
            <Button variant="primary" type="submit">
              {getMediaData?.id ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default MediaFormModel;