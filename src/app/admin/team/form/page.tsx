"use client";

import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { increment } from "@/app/services/redux/features/counterSlice";
import {
  createTeamMember,
  getOneTeamMember,
  updateTeamMember,
} from "@/app/services/Team/teamApi";

function ViewTeamMember() {
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
      designation: "",
      image: "", // string (URL) or File
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
    formData.append("designation", data.designation);

    const imageVal = watch("image");
    if (imageVal instanceof File) {
      formData.append("image", imageVal);
    }

    try {
      const response = id
        ? await updateTeamMember(formData)
        : await createTeamMember(formData);
      if (response) {
        dispatch(increment());
        setEditForm(false);
        if (!id) router.push(`/admin/team`);
      }
    } catch (e) {
      console.error("Create/Update team member error", e);
    }
  };

  const getOne = async () => {
    try {
      const data = await getOneTeamMember(id);
      reset({
        ...data,
        image: data.image || "",
      });
    } catch (e) {
      console.error("Fetch team member error", e);
    }
  };

  useEffect(() => {
    if (id) getOne();
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const imageVal = watch("image");
  const imageIsFile = imageVal instanceof File;
  const imageIsUrl = typeof imageVal === "string" && imageVal.trim().length > 0;

  return (
    <section>
      <div className="container">
        <div className="row ">
          <div className="col-lg-12 m-auto">
            <div className="title">
              <h2>Team Member Form</h2>
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
                      placeholder="Enter member name"
                      disabled={!editForm && id}
                    />
                    {errors.name && (
                      <span className="text-danger">Required</span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3" controlId="designation">
                    <Form.Label>
                      Designation<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("designation", { required: true })}
                      placeholder="Enter designation"
                      disabled={!editForm && id}
                    />
                    {errors.designation && (
                      <span className="text-danger">Required</span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group className="mb-3" controlId="image">
                    <Form.Label>
                      Image<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="image"
                      control={control}
                      rules={{ required: !id }}
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
                    {errors.image && (
                      <span className="text-danger">Image is required</span>
                    )}

                    <div style={{ minHeight: 220 }}>
                      {imageIsUrl ? (
                        <Image
                          src={imageVal}
                          width={250}
                          height={200}
                          alt="member"
                          unoptimized
                          style={{
                            objectFit: "contain",
                            border: "1px solid #d5d5d5",
                            borderRadius: 10,
                            marginTop: 10,
                          }}
                        />
                      ) : imageIsFile ? (
                        <Image
                          src={URL.createObjectURL(imageVal)}
                          width={250}
                          height={200}
                          alt="member"
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

export default ViewTeamMember;
