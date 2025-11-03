"use client";

import React, { useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Image from "next/image";
import { getAbout, saveAbout } from "@/app/services/About/about.api";

// Define the form data type
type AboutUsFormData = {
  story: {
    content: string;
    image: string | FileList;
    altTag: string;
  };
  mission: {
    content: string;
    image: string | FileList;
    altTag: string;
  };
  vision: {
    content: string;
    image: string | FileList;
    altTag: string;
  };
  approach: {
    heading: string;
    subheading: string;
    image: string | FileList;
    altTag: string;
  }[];
  coreValues: {
    heading: string;
    image: string | FileList;
    altTag: string;
  }[];
  whyChooseUs: {
    content: string;
  };
};

// --- SunEditor Wrapper ---
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

export default function AboutUsForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AboutUsFormData>({
    defaultValues: {
      story: { content: "", image: "", altTag: "" },
      mission: { content: "", image: "", altTag: "" },
      vision: { content: "", image: "", altTag: "" },
      approach: [{ heading: "", subheading: "", image: "", altTag: "" }],
      coreValues: [{ heading: "", image: "", altTag: "" }],
      whyChooseUs: { content: "" },
    },
  });

  const {
    fields: approachFields,
    append: appendApproach,
    remove: removeApproach,
  } = useFieldArray({
    control,
    name: "approach",
  });

  const {
    fields: coreValueFields,
    append: appendCore,
    remove: removeCore,
  } = useFieldArray({
    control,
    name: "coreValues",
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
    const fetchAbout = async () => {
      const res = await getAbout();
      if (res) {
        // Transform whyChooseUs from string to object format
        const transformedData = {
          ...res,
          whyChooseUs: {
            content:
              typeof res.whyChooseUs === "string"
                ? res.whyChooseUs
                : res.whyChooseUs?.content || "",
          },
        };
        reset(transformedData);
      }
    };
    fetchAbout();
  }, [reset]);

  const onSubmit = async (data: AboutUsFormData) => {
    const formData = new FormData();

    // Story, Mission, Vision - ADD ALT TAGS
    (["story", "mission", "vision"] as const).forEach((section) => {
      if (data[section]?.content) {
        formData.append(`${section}Content`, data[section].content);
      }

      // Add alt tag
      if (data[section]?.altTag) {
        formData.append(`${section}AltTag`, data[section].altTag);
      }

      if (data[section]?.image && data[section].image[0] instanceof File) {
        formData.append(`${section}Image`, data[section].image[0]);
      } else if (
        typeof data[section]?.image === "string" &&
        data[section].image.startsWith("http")
      ) {
        formData.append(`${section}ImageUrl`, data[section].image);
      }
    });

    // Approach - INCLUDE ALT TAG
    const approachData = data.approach.map((item: any, i: number) => {
      if (item.image && item.image[0] instanceof File) {
        formData.append(`approach[${i}][image]`, item.image[0]);
      }
      return {
        heading: item.heading,
        subheading: item.subheading,
        altTag: item.altTag || "",
        image:
          typeof item.image === "string" && item.image.startsWith("http")
            ? item.image
            : "",
      };
    });
    formData.append("approach", JSON.stringify(approachData));

    // Core Values - INCLUDE ALT TAG
    const coreValuesData = data.coreValues.map((item: any, i: number) => {
      if (item.image && item.image[0] instanceof File) {
        formData.append(`coreValues[${i}][image]`, item.image[0]);
      }
      return {
        heading: item.heading,
        altTag: item.altTag || "",
        image:
          typeof item.image === "string" && item.image.startsWith("http")
            ? item.image
            : "",
      };
    });
    formData.append("coreValues", JSON.stringify(coreValuesData));

    formData.append("whyChooseUsContent", data.whyChooseUs?.content || "");

    const response = await saveAbout(formData);
    if (response?.status) {
      alert("About page saved successfully!");
    }
  };

  return (
    <section className="container my-4">
      <h2>About Us Management</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Story / Mission / Vision */}
        {(["story", "mission", "vision"] as const).map((section) => (
          <div key={section} className="mb-5">
            <h4 className="text-capitalize">{section}</h4>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                {...register(`${section}.image`)}
              />
              {getImagePreview(watch(`${section}.image`)) && (
                <Image
                  src={getImagePreview(watch(`${section}.image`)) as string}
                  alt={watch(`${section}.altTag`) || `${section}-preview`}
                  width={250}
                  height={180}
                  className="mt-2 rounded border"
                />
              )}
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Alt Text for Image</Form.Label>
              <Form.Control
                type="text"
                {...register(`${section}.altTag`)}
                placeholder={`Enter alt text for ${section} image`}
              />
              <Form.Text className="text-muted">
                Alt text improves SEO and accessibility
              </Form.Text>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Content</Form.Label>
              <Controller
                name={`${section}.content`}
                control={control}
                render={({ field }) => (
                  <MyEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </Form.Group>
          </div>
        ))}

        {/* Approach Section */}
        <div className="mb-5">
          <h4>Our Approach (Max 4 items)</h4>
          {approachFields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded mb-3">
              <Form.Group>
                <Form.Label>Heading (Max 30 characters)</Form.Label>
                <Form.Control
                  {...register(`approach.${index}.heading`, {
                    required: "Heading is required",
                    maxLength: {
                      value: 30,
                      message: "Heading cannot exceed 30 characters",
                    },
                  })}
                  isInvalid={!!errors.approach?.[index]?.heading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.approach?.[index]?.heading?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {watch(`approach.${index}.heading`)?.length || 0}/30
                  characters
                </Form.Text>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Subheading (Max 150 characters)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register(`approach.${index}.subheading`, {
                    required: "Subheading is required",
                    maxLength: {
                      value: 150,
                      message: "Subheading cannot exceed 150 characters",
                    },
                  })}
                  isInvalid={!!errors.approach?.[index]?.subheading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.approach?.[index]?.subheading?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {watch(`approach.${index}.subheading`)?.length || 0}/150
                  characters
                </Form.Text>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register(`approach.${index}.image`)}
                />
                {getImagePreview(watch(`approach.${index}.image`)) && (
                  <Image
                    src={
                      getImagePreview(
                        watch(`approach.${index}.image`)
                      ) as string
                    }
                    alt={
                      watch(`approach.${index}.altTag`) || "approach preview"
                    }
                    width={200}
                    height={150}
                    className="mt-2 rounded border"
                  />
                )}
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Alt Text for Image</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`approach.${index}.altTag`)}
                  placeholder="Enter alt text for approach image"
                />
                <Form.Text className="text-muted">
                  Alt text improves SEO and accessibility
                </Form.Text>
              </Form.Group>
              <Button
                variant="danger"
                className="mt-2"
                onClick={() => removeApproach(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          {approachFields.length < 4 && (
            <Button
              onClick={() =>
                appendApproach({
                  heading: "",
                  subheading: "",
                  image: "",
                  altTag: "",
                })
              }
            >
              Add Approach
            </Button>
          )}
          {approachFields.length >= 4 && (
            <div className="text-danger mt-2">
              Maximum of 4 approach items allowed
            </div>
          )}
        </div>

        {/* Why Choose Us */}
        <div className="mb-5">
          <h4>Why Choose Us</h4>
          <Controller
            name="whyChooseUs.content"
            control={control}
            render={({ field }) => (
              <MyEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Core Values */}
        <div className="mb-5">
          <h4>Our Core Values (Max 4 items)</h4>
          {coreValueFields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded mb-3">
              <Form.Group>
                <Form.Label>Heading (Max 30 characters)</Form.Label>
                <Form.Control
                  {...register(`coreValues.${index}.heading`, {
                    required: "Heading is required",
                    maxLength: {
                      value: 30,
                      message: "Heading cannot exceed 30 characters",
                    },
                  })}
                  isInvalid={!!errors.coreValues?.[index]?.heading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.coreValues?.[index]?.heading?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {watch(`coreValues.${index}.heading`)?.length || 0}/30
                  characters
                </Form.Text>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register(`coreValues.${index}.image`)}
                />
                {getImagePreview(watch(`coreValues.${index}.image`)) && (
                  <Image
                    src={
                      getImagePreview(
                        watch(`coreValues.${index}.image`)
                      ) as string
                    }
                    alt={
                      watch(`coreValues.${index}.altTag`) ||
                      "core value preview"
                    }
                    width={200}
                    height={150}
                    className="mt-2 rounded border"
                  />
                )}
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Alt Text for Image</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`coreValues.${index}.altTag`)}
                  placeholder="Enter alt text for core value image"
                />
                <Form.Text className="text-muted">
                  Alt text improves SEO and accessibility
                </Form.Text>
              </Form.Group>
              <Button
                variant="danger"
                className="mt-2"
                onClick={() => removeCore(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          {coreValueFields.length < 4 && (
            <Button
              onClick={() => appendCore({ heading: "", image: "", altTag: "" })}
            >
              Add Core Value
            </Button>
          )}
          {coreValueFields.length >= 4 && (
            <div className="text-danger mt-2">
              Maximum of 4 core values allowed
            </div>
          )}
        </div>

        <Button variant="primary" type="submit">
          Save About Page
        </Button>
      </Form>
    </section>
  );
}
