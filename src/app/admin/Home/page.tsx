"use client";

import React, { useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button, Form, Row, Col } from "react-bootstrap";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Image from "next/image";
import { getHomePage, saveHomePage } from "@/app/services/home/home.api";

// Define the form data type
interface HomePageFormData {
  overview: {
    image1: string | FileList;
    image1Alt: string;
    image2: string | FileList;
    image2Alt: string;
    heading: string;
    subheading: string;
  };
  solutions: Array<{ value: string }>; // 👈 Changed here
  experienceYears: number;
  productsCount: number;
  satisfiedCustomerCount: number;
  clientImages: Array<{
    image: string | FileList;
    imageAlt: string;
  }>;
  whyJaypeeAssociates: Array<{
    image: string | FileList;
    imageAlt: string;
    content: string;
  }>;
}

const MyEditor = ({ value, onChange }: any) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentContent = editorRef.current.getContents();
      if (currentContent !== value) {
        editorRef.current.setContents(value || "");
      }
    }
  }, [value]);

  return (
    <SunEditor
      getSunEditorInstance={(editor) => {
        editorRef.current = editor;
      }}
      setContents={value || ""}
      onChange={onChange}
      setOptions={{
        height: "200",
        buttonList: [
          ["undo", "redo"],
          ["formatBlock", "bold", "underline", "italic"],
          ["fontColor", "hiliteColor"],
          ["align", "list"],
          ["link", "image"],
          ["codeView"],
        ],
      }}
    />
  );
};

export default function HomePageForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<HomePageFormData>({
    defaultValues: {
      overview: {
        image1: "",
        image1Alt: "",
        image2: "",
        image2Alt: "",
        heading: "",
        subheading: "",
      },
      solutions: [{ value: "" }],
      experienceYears: 0,
      productsCount: 0,
      satisfiedCustomerCount: 0,
      clientImages: [],
      whyJaypeeAssociates: [{ image: "", imageAlt: "", content: "" }],
    },
  });

  const {
    fields: solutionFields,
    append: appendSolution,
    remove: removeSolution,
  } = useFieldArray<HomePageFormData, "solutions">({
    control,
    name: "solutions",
  });

  const {
    fields: clientImageFields,
    append: appendClientImage,
    remove: removeClientImage,
  } = useFieldArray<HomePageFormData, "clientImages">({
    control,
    name: "clientImages",
  });

  const {
    fields: whyJaypeeFields,
    append: appendWhyJaypee,
    remove: removeWhyJaypee,
  } = useFieldArray<HomePageFormData, "whyJaypeeAssociates">({
    control,
    name: "whyJaypeeAssociates",
  });

  const getImagePreview = (imgValue: any) => {
    if (!imgValue) return null;
    if (typeof imgValue === "string" && imgValue.startsWith("http")) {
      return imgValue;
    }
    if (imgValue instanceof FileList && imgValue[0]) {
      return URL.createObjectURL(imgValue[0]);
    }
    return null;
  };

  useEffect(() => {
    const fetchHomePage = async () => {
      const res = await getHomePage();
      if (res) {
        const formattedData = {
          ...res,
          solutions: Array.isArray(res.solutions)
            ? res.solutions.map((s: string) => ({ value: s }))
            : [{ value: "" }],

          // optional safety for whyJaypeeAssociates
          whyJaypeeAssociates: Array.isArray(res.whyJaypeeAssociates)
            ? res.whyJaypeeAssociates.map((item: any) => ({
                image: item.image || "",
                imageAlt: item.imageAlt || "",
                content: item.content || "",
              }))
            : [{ image: "", imageAlt: "", content: "" }],

          // same idea if clientImages might be undefined
          clientImages: Array.isArray(res.clientImages)
            ? res.clientImages.map((img: any) => ({
                image: img.image || "",
                imageAlt: img.imageAlt || "",
              }))
            : [],
        };

        reset(formattedData);
      }
    };
    fetchHomePage();
  }, [reset]);

  const onSubmit = async (data: HomePageFormData) => {
    const formData = new FormData();

    // Overview section
    if (data.overview.heading) {
      formData.append("overviewHeading", data.overview.heading);
    }
    if (data.overview.subheading) {
      formData.append("overviewSubheading", data.overview.subheading);
    }

    // Overview Image 1
    if (data.overview.image1 && data.overview.image1[0] instanceof File) {
      formData.append("overviewImage1", data.overview.image1[0]);
    } else if (
      typeof data.overview.image1 === "string" &&
      data.overview.image1.startsWith("http")
    ) {
      formData.append("overviewImage1Url", data.overview.image1);
    }
    if (data.overview.image1Alt) {
      formData.append("overviewImage1Alt", data.overview.image1Alt);
    }

    // Overview Image 2
    if (data.overview.image2 && data.overview.image2[0] instanceof File) {
      formData.append("overviewImage2", data.overview.image2[0]);
    } else if (
      typeof data.overview.image2 === "string" &&
      data.overview.image2.startsWith("http")
    ) {
      formData.append("overviewImage2Url", data.overview.image2);
    }
    if (data.overview.image2Alt) {
      formData.append("overviewImage2Alt", data.overview.image2Alt);
    }

    // Solutions (filter empty strings)
    const validSolutions = data.solutions
      .filter((s: { value: string }) => s.value.trim() !== "")
      .map((s) => s.value);
    console.log("🚀 ~ onSubmit ~ validSolutions:", validSolutions);
    formData.append("solutions", JSON.stringify(validSolutions));

    // Client Images
    const clientImagesData = data.clientImages.map((item: any, i: number) => {
      if (item.image && item.image[0] instanceof File) {
        formData.append(`clientImages[${i}]`, item.image[0]);
      }
      return {
        imageAlt: item.imageAlt || "",
        image:
          typeof item.image === "string" && item.image.startsWith("http")
            ? item.image
            : "",
      };
    });

    formData.append("clientImages", JSON.stringify(clientImagesData));

    // Stats
    formData.append("experienceYears", data.experienceYears.toString());
    formData.append("productsCount", data.productsCount.toString());
    formData.append(
      "satisfiedCustomerCount",
      data.satisfiedCustomerCount.toString()
    );

    // Why Jaypee Associates
    const whyJaypeeData = data.whyJaypeeAssociates.map(
      (item: any, i: number) => {
        if (item.image && item.image[0] instanceof File) {
          formData.append(`whyJaypeeAssociates[${i}][image]`, item.image[0]);
        }
        return {
          content: item.content,
          imageAlt: item.imageAlt || "",
          image:
            typeof item.image === "string" && item.image.startsWith("http")
              ? item.image
              : "",
        };
      }
    );
    formData.append("whyJaypeeAssociates", JSON.stringify(whyJaypeeData));

    const response = await saveHomePage(formData);
    if (response?.status) {
      alert("Home page saved successfully!");
    }
  };

  return (
    <section className="container my-4">
      <h2>Home Page Management</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Overview Section */}
        <div className="mb-5">
          <h4>Overview Section</h4>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image 1</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register("overview.image1")}
                />
                {getImagePreview(watch("overview.image1")) && (
                  <Image
                    src={getImagePreview(watch("overview.image1")) as string}
                    alt={watch("overview.image1Alt") || "overview-1"}
                    width={250}
                    height={180}
                    className="mt-2 rounded border"
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Alt Text for Image 1</Form.Label>
                <Form.Control
                  type="text"
                  {...register("overview.image1Alt")}
                  placeholder="Enter alt text for image 1"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image 2</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register("overview.image2")}
                />
                {getImagePreview(watch("overview.image2")) && (
                  <Image
                    src={getImagePreview(watch("overview.image2")) as string}
                    alt={watch("overview.image2Alt") || "overview-2"}
                    width={250}
                    height={180}
                    className="mt-2 rounded border"
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Alt Text for Image 2</Form.Label>
                <Form.Control
                  type="text"
                  {...register("overview.image2Alt")}
                  placeholder="Enter alt text for image 2"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Heading</Form.Label>
            <Form.Control
              type="text"
              {...register("overview.heading", {
                required: "Heading is required",
              })}
              isInvalid={!!errors.overview?.heading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.overview?.heading?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subheading</Form.Label>
            <Controller
              name="overview.subheading"
              control={control}
              render={({ field }) => (
                <MyEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Group>
        </div>

        {/* Solutions Section */}
        <div className="mb-5">
          <h4>Solutions (Max 6 items, each max 100 characters)</h4>
          {solutionFields.map((field, index) => (
            <div key={field.id} className="mb-3">
              <Form.Group>
                <Form.Label>Solution {index + 1}</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    {...register(`solutions.${index}.value` as const, {
                      maxLength: {
                        value: 100,
                        message: "Solution cannot exceed 100 characters",
                      },
                    })}
                    isInvalid={!!errors.solutions?.[index]?.value}
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeSolution(index)}
                    disabled={solutionFields.length === 1}
                  >
                    Remove
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.solutions?.[index]?.value?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {watch(`solutions.${index}.value`)?.length || 0}/100
                  characters
                </Form.Text>
              </Form.Group>
            </div>
          ))}

          {solutionFields.length < 6 && (
            <Button onClick={() => appendSolution({ value: "" })}>
              Add Solution
            </Button>
          )}
          {solutionFields.length >= 6 && (
            <div className="text-danger mt-2">
              Maximum of 6 solutions allowed
            </div>
          )}
        </div>

        {/* Client Images Section */}
        <div className="mb-5">
          <h4>Client Images</h4>
          {clientImageFields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded mb-3">
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register(`clientImages.${index}.image`, {
                    required: watch(`clientImages.${index}.image`)
                      ? false
                      : "Image is required",
                  })}
                  isInvalid={!!errors.clientImages?.[index]?.image}
                />
                {getImagePreview(watch(`clientImages.${index}.image`)) && (
                  <Image
                    src={
                      getImagePreview(
                        watch(`clientImages.${index}.image`)
                      ) as string
                    }
                    alt={
                      watch(`clientImages.${index}.imageAlt`) || "client image"
                    }
                    width={200}
                    height={150}
                    className="mt-2 rounded border"
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.clientImages?.[index]?.image?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Alt Text for Image</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`clientImages.${index}.imageAlt`)}
                  placeholder="Enter alt text for client image"
                />
                <Form.Text className="text-muted">
                  Alt text improves SEO and accessibility
                </Form.Text>
              </Form.Group>

              <Button
                variant="danger"
                className="mt-2"
                onClick={() => removeClientImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          {!clientImageFields.length && (
            <div className="text-danger mt-2">
              At least one client image is required
            </div>
          )}

          <Button
            onClick={() => appendClientImage({ image: "", imageAlt: "" })}
          >
            Add Client Image
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mb-5">
          <h4>Statistics</h4>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Experience Years</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  {...register("experienceYears", {
                    required: "Experience years is required",
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                  isInvalid={!!errors.experienceYears}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.experienceYears?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Products Count</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  {...register("productsCount", {
                    required: "Products count is required",
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                  isInvalid={!!errors.productsCount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.productsCount?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Satisfied Customer Count</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  {...register("satisfiedCustomerCount", {
                    required: "Customer count is required",
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                  isInvalid={!!errors.satisfiedCustomerCount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.satisfiedCustomerCount?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Why Jaypee Associates */}
        <div className="mb-5">
          <h4>
            Why Jaypee Associates (Max 6 items, content max 100 characters)
          </h4>
          {whyJaypeeFields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Content (Max 100 characters)</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`whyJaypeeAssociates.${index}.content`, {
                    required: "Content is required",
                    maxLength: {
                      value: 100,
                      message: "Content cannot exceed 100 characters",
                    },
                  })}
                  isInvalid={!!errors.whyJaypeeAssociates?.[index]?.content}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.whyJaypeeAssociates?.[index]?.content?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {watch(`whyJaypeeAssociates.${index}.content`)?.length || 0}
                  /100 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register(`whyJaypeeAssociates.${index}.image`)}
                />
                {getImagePreview(
                  watch(`whyJaypeeAssociates.${index}.image`)
                ) && (
                  <Image
                    src={
                      getImagePreview(
                        watch(`whyJaypeeAssociates.${index}.image`)
                      ) as string
                    }
                    alt={
                      watch(`whyJaypeeAssociates.${index}.imageAlt`) ||
                      "why jaypee preview"
                    }
                    width={200}
                    height={150}
                    className="mt-2 rounded border"
                  />
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Alt Text for Image</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`whyJaypeeAssociates.${index}.imageAlt`)}
                  placeholder="Enter alt text for image"
                />
              </Form.Group>

              <Button variant="danger" onClick={() => removeWhyJaypee(index)}>
                Remove
              </Button>
            </div>
          ))}
          {whyJaypeeFields.length < 6 && (
            <Button
              onClick={() =>
                appendWhyJaypee({ image: "", imageAlt: "", content: "" })
              }
            >
              Add Item
            </Button>
          )}
          {whyJaypeeFields.length >= 6 && (
            <div className="text-danger mt-2">Maximum of 6 items allowed</div>
          )}
        </div>

        <Button variant="primary" type="submit" size="lg">
          Save Home Page
        </Button>
      </Form>
    </section>
  );
}
