"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { increment } from "@/app/services/redux/features/counterSlice";
import { createTestimonial, getOneTestimonial, updateTestimonial } from "@/app/services/Testimonial/TestimonialApi";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

const MyEditor = ({ value, onChange }: any) => {
  const editorRef = useRef<any>(null);

  const handleLoad = () => {
    if (editorRef.current) {
      editorRef.current.setContents(value || "");
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setContents(value || "");
    }
  }, [value]);

  return (
    <SunEditor
      getSunEditorInstance={(editor) => (editorRef.current = editor)}
      onLoad={handleLoad}
      onChange={onChange}
      setOptions={{
        height: '200',
        buttonList: [
          ["undo", "redo"],
          ["formatBlock", "fontSize"],
          ["bold", "underline", "italic", "strike"],
          ["fontColor", "hiliteColor", "textStyle"],
          ["removeFormat"],
          ["align", "horizontalRule", "list"],
          ["link", "image"],
          ["codeView"],
        ],
      }}
    />
  );
};

function ViewTestimonial() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const editParam = searchParams.get("edit");
  const counter = useSelector((state: any) => state.counter?.value);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: "",
      company: "",
      content: "",
      rating: 5,
      avatar: "", // string (URL) or File
    },
  });

  const [editForm, setEditForm] = useState(!id || !!editParam);
  useEffect(() => {
    setEditForm(!id || !!editParam);
  }, [id, editParam]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    if (id) formData.append("id", id);
    formData.append("name", data.name);
    formData.append("company", data.company);
    formData.append("content", data.content || "");
    formData.append("rating", String(data.rating || 5));

    const avatarVal = watch("avatar");
    if (avatarVal instanceof File) {
      formData.append("avatar", avatarVal);
    }

    try {
      const response = id ? await updateTestimonial(formData) : await createTestimonial(formData);
      if (response) {
        dispatch(increment());
        setEditForm(false);
        if (!id) router.push(`/admin/testimonials`);
      }
    } catch (e) {
      console.error("Create/Update testimonial error", e);
    }
  };

  const getOne = async () => {
    try {
      const data = await getOneTestimonial(id);
      reset({
        ...data,
        rating: data.rating || 5,
        avatar: data.avatar || "",
      });
    } catch (e) {
      console.error("Fetch testimonial error", e);
    }
  };

  useEffect(() => {
    if (id) getOne();
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const avatarVal = watch("avatar");
  const avatarIsFile = avatarVal instanceof File;
  const avatarIsUrl = typeof avatarVal === "string" && avatarVal.trim().length > 0;

  return (
    <section>
      <div className="container">
        <div className="row ">
          <div className="col-lg-12 m-auto">
            <div className="title">
              <h2>Testimonial Form</h2>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>
                      Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("name", { required: true })}
                      placeholder="Enter person name"
                      disabled={!editForm && id}
                    />
                    {errors.name && <span className="text-danger">Required</span>}
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3" controlId="company">
                    <Form.Label>
                      Company<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("company", { required: true })}
                      placeholder="Enter company"
                      disabled={!editForm && id}
                    />
                    {errors.company && <span className="text-danger">Required</span>}
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group className="mb-3" controlId="content">
                    <Form.Label>
                      Content<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      control={control}
                      name="content"
                      rules={{ required: true }}
                      render={({ field }) => <MyEditor value={field.value} onChange={field.onChange} />}
                    />
                    {errors.content && <span className="text-danger">Required</span>}
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rating (1-5)</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={5}
                      {...register("rating", { required: true, min: 1, max: 5 })}
                      disabled={!editForm && id}
                    />
                    {errors.rating && <span className="text-danger">1-5 only</span>}
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group className="mb-3" controlId="avatar">
                    <Form.Label>Avatar</Form.Label>
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e: any) => {
                            const f = e?.target?.files?.[0];
                            field.onChange(f || field.value);
                          }}
                          disabled={!editForm && id}
                        />
                      )}
                    />

                    <div style={{ minHeight: 220 }}>
                      {avatarIsUrl ? (
                        <Image
                          src={avatarVal}
                          width={250}
                          height={200}
                          alt="avatar"
                          unoptimized
                          style={{
                            objectFit: "contain",
                            border: "1px solid #d5d5d5",
                            borderRadius: 10,
                            marginTop: 10,
                          }}
                        />
                      ) : avatarIsFile ? (
                        <Image
                          src={URL.createObjectURL(avatarVal)}
                          width={250}
                          height={200}
                          alt="avatar"
                          unoptimized
                          style={{
                            objectFit: "contain",
                            border: "1px solid #d5d5d5",
                            borderRadius: 10,
                            marginTop: 10,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 250,
                            height: 200,
                            border: "1px solid #d5d5d5",
                            background: "#f8f8f8",
                            borderRadius: 10,
                            marginTop: 10,
                          }}
                        />
                      )}
                    </div>
                  </Form.Group>
                </div>

                <div className="mb-3" style={{ minHeight: 48 }}>
                  {editForm && (
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ViewTestimonial;