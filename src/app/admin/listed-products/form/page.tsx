"use client";
import { getBrands } from "@/app/services/Brands/BrandApi";
import { getCategories } from "@/app/services/Category/CategoryApi";
import { getIndustries } from "@/app/services/Industry/IndustryApi";
import {
  createProduct,
  getOneProduct,
  updateProduct,
} from "@/app/services/Product/ProductApi";
import { increment } from "@/app/services/redux/features/counterSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

// Editor
const MyEditor = ({ value, onChange }: any) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      editorRef.current.setContents(value || "");
    }
  }, [value]);

  return (
    <div>
      <SunEditor
        getSunEditorInstance={(editor) => {
          editorRef.current = editor;
        }}
        defaultValue={value}
        onChange={onChange}
        setOptions={{
          height: "200",
          buttonList: [
            ["undo", "redo"],
            ["formatBlock", "fontSize"],
            ["bold", "underline", "italic", "strike"],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "table"],
            ["link", "image", "video"],
            ["codeView"],
          ],
        }}
      />
    </div>
  );
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};

function ViewProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const editParam = searchParams.get("edit");

  const counter = useSelector((state: any) => state.counter?.value);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      images: [""],
      altTags: [""], // NEW: Add alt tags array
      productModel: [{ modelName: "", basePrice: "" }],
      industries: [],
    },
  });

  const slug: string = watch("ProductName");

  // Editable: if new OR edit=true
  const [editForm, setEditForm] = useState(!id || !!editParam);
  useEffect(() => {
    setEditForm(!id || !!editParam);
  }, [id, editParam]);

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  const { append: appendAltTag, remove: removeAltTag } = useFieldArray({
    control,
    name: "altTags",
  });

  const {
    fields: modelFields,
    append: appendModel,
    remove: removeModel,
  } = useFieldArray({
    control,
    name: "productModel",
  });

  const onSubmit = async (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const formData = new FormData();
    if (id) formData.append("id", id);
    formData.append("brand", data.brand.value);
    formData.append("category", data.category.value);
    formData.append(
      "industries",
      JSON.stringify((data.industries || []).map((i: any) => i.value))
    );

    formData.append("ProductName", data.ProductName);
    formData.append("hsn", data.hsn || "");
    formData.append("description", data.description || "");
    formData.append("slug", generateSlug(slug?.replaceAll(" ", "-")));

    data.productModel.forEach((model: any, index: number) => {
      console.log("🚀 ~ onSubmit ~ model:", model);
      if (model.modelName) {
        formData.append(`productModel[${index}][modelName]`, model.modelName);
        formData.append(
          `productModel[${index}][basePrice]`,
          model.basePrice || ""
        );
      }
    });

    // NEW: Add alt tags to form data
    data.altTags.forEach((altTag: string, index: number) => {
      formData.append(`altTags[${index}]`, altTag || "");
    });

    data.images.forEach((image: any, index: number) => {
      if (
        image?.[0] &&
        image[0] !== "h" &&
        image[0] !== "-h" &&
        watch("images")[index]
      ) {
        formData.append(`images[${index}]`, image[0]);
      } else {
        formData.append(`images[${index}]`, watch("images")[index]);
      }
    });

    try {
      const response = id
        ? await updateProduct(formData)
        : await createProduct(formData);
      if (response) {
        dispatch(increment());
        setEditForm(false);
        if (!id) {
          router.push(`/admin/listed-products`);
        }
      }
    } catch (error) {
      console.error("Error in POST/PATCH /api/product:", error);
    }
  };

  const getProduct = async () => {
    try {
      const data = await getOneProduct(id);
      reset({
        ...data,
        brand: data.brand
          ? { value: data.brand._id, label: data.brand.brandName }
          : null,
        category: data.category
          ? { value: data.category._id, label: data.category.category }
          : null,
        industries: Array.isArray(data.industries)
          ? data.industries.map((i: any) => ({
              value: i._id || i.value || i,
              label: i.industry || i.label || i,
            }))
          : [],
        // NEW: set alt tags if they exist, otherwise create empty array
        altTags:
          data.altTags && Array.isArray(data.altTags)
            ? data.altTags
            : Array(data.images?.length || 0).fill(""),
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(
        data.map((item: any) => ({ value: item?._id, label: item?.category }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(
        data.map((item: any) => ({ value: item?._id, label: item?.brandName }))
      );
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const getAllIndustries = async () => {
    try {
      const data = await getIndustries();
      setIndustries(
        data.map((item: any) => ({ value: item?._id, label: item?.industry }))
      );
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getProduct();
    } else {
      reset({
        productModel: [{ modelName: "", basePrice: "" }],
        images: [""],
        altTags: [""],
        industries: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  useEffect(() => {
    getAllCategories();
    getAllBrands();
    getAllIndustries();
  }, []);

  return (
    <section>
      <div className="container">
        <div className="row ">
          <div className="col-lg-12 m-auto">
            <div className="hero_banner_title py-0">
              <div className="container position-relative">
                <div className="row">
                  <div className="col-lg-8 m-auto">
                    <div className="title">
                      <h2>Product Form</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-3" controlId="ProductName">
                    <Form.Label>
                      Product Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("ProductName", { required: true })}
                      placeholder="Enter product name"
                      disabled={!editForm && id}
                    />
                    {slug && (
                      <small>Slug: /products/{generateSlug(slug)}</small>
                    )}
                    {errors.ProductName && (
                      <span className="text-danger">
                        This field is required
                      </span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group className="mb-3" controlId="ProductModel">
                    <Form.Label>
                      Product Model<span className="text-danger">*</span>
                    </Form.Label>
                    {modelFields.map((field, index) => (
                      <div key={field.id} className="row mb-2">
                        <div className="col-md-6">
                          <Form.Control
                            type="text"
                            {...register(
                              `productModel.${index}.modelName` as const
                              // { required: true }
                            )}
                            placeholder="Enter Model Name"
                            disabled={!editForm && id}
                          />
                          {(errors.productModel as any)?.[index]?.modelName && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                        <div className="col-md-5">
                          <Form.Control
                            type="text" // Changed from "number" to "text"
                            {...register(
                              `productModel.${index}.basePrice` as const,
                              {
                                pattern: {
                                  value: /^\d+(\.\d{1,2})?$/,
                                  message: "Please enter a valid price",
                                },
                              }
                            )}
                            placeholder="Enter Base Price"
                            disabled={!editForm && id}
                            inputMode="decimal" // Shows numeric keyboard on mobile
                            onInput={(e: any) => {
                              // Only allow numbers and decimal point
                              e.target.value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              // Prevent multiple decimal points
                              const parts = e.target.value.split(".");
                              if (parts.length > 2) {
                                e.target.value =
                                  parts[0] + "." + parts.slice(1).join("");
                              }
                            }}
                          />
                          {(errors.productModel as any)?.[index]?.basePrice && (
                            <span className="text-danger">
                              {(errors.productModel as any)?.[index]?.basePrice
                                ?.message || "This field is required"}
                            </span>
                          )}
                        </div>
                        <div className="col-1">
                          {editForm && (
                            <Button
                              variant="danger"
                              disabled={watch("productModel")?.length <= 1}
                              onClick={() => removeModel(index)}
                            >
                              -
                            </Button>
                          )}
                          {!editForm && (
                            <span
                              style={{
                                display: "inline-block",
                                width: 38,
                                height: 38,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {editForm && (
                      <Button
                        variant="primary"
                        onClick={() =>
                          appendModel({ modelName: "", basePrice: "" })
                        }
                      >
                        Add Model
                      </Button>
                    )}
                    {!editForm && <div style={{ minHeight: 38 }}></div>}
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group className="mb-3" controlId="hsn">
                    <Form.Label>HSN/SAC</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("hsn")}
                      placeholder="Enter HSN/SAC"
                      disabled={!editForm && id}
                    />
                    {errors.hsn && (
                      <span className="text-danger">
                        This field is required
                      </span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group className="mb-3" controlId="category">
                    <Form.Label>
                      Category<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          styles={{ menu: (p) => ({ ...p, zIndex: 99 }) }}
                          options={categories}
                          isDisabled={!editForm && id}
                        />
                      )}
                    />
                    {errors.category && (
                      <span className="text-danger">
                        This field is required
                      </span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group className="mb-3" controlId="brand">
                    <Form.Label>
                      Brand<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="brand"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          styles={{ menu: (p) => ({ ...p, zIndex: 99 }) }}
                          options={brands}
                          isDisabled={!editForm && id}
                        />
                      )}
                    />
                    {errors.brand && (
                      <span className="text-danger">
                        This field is required
                      </span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group className="mb-3" controlId="industries">
                    <Form.Label>Industries</Form.Label>
                    <Controller
                      name="industries"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isMulti
                          closeMenuOnSelect={false}
                          styles={{ menu: (p) => ({ ...p, zIndex: 99 }) }}
                          options={industries}
                          isDisabled={!editForm && id}
                        />
                      )}
                    />
                  </Form.Group>
                </div>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>
                    Description<span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    control={control}
                    name="description"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <MyEditor value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.description && (
                    <span className="text-danger">This field is required</span>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="images">
                  <Form.Label>
                    Images<span className="text-danger">*</span>
                  </Form.Label>
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="mb-2">
                      <div>
                        <div className="d-flex gap-3">
                          <Form.Control
                            type="file"
                            className="form-control"
                            accept="image/*"
                            {...register(`images.${index}` as const, {
                              required: watch("images")[index] ? false : true,
                            })}
                            disabled={!editForm && id}
                          />
                          {editForm && (
                            <Button
                              variant="danger"
                              disabled={watch("images")?.length <= 1}
                              onClick={() => {
                                removeImage(index);
                                removeAltTag(index);
                              }}
                            >
                              -
                            </Button>
                          )}
                          {!editForm && (
                            <span
                              style={{
                                display: "inline-block",
                                width: 38,
                                height: 38,
                              }}
                            />
                          )}
                        </div>

                        {/* NEW: Alt tag input field */}
                        <Form.Group className="mt-2">
                          <Form.Label>
                            Alt Text for Image {index + 1}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            {...register(`altTags.${index}` as const)}
                            placeholder="Enter alt text for SEO"
                            disabled={!editForm && id}
                          />
                        </Form.Group>

                        <div style={{ minHeight: 220 }}>
                          {Array.isArray(watch("images")) &&
                          typeof watch("images")[index] === "string" &&
                          watch("images")[index]?.includes("amazonaws.com") ? (
                            <Image
                              src={watch("images")[index]}
                              width={250}
                              height={200}
                              alt={
                                watch("altTags")[index] ||
                                `product-image-${index}`
                              }
                              style={{
                                objectFit: "contain",
                                maxHeight: "200px",
                                border: "1px solid #d5d5d5",
                                background: "#fff",
                                borderRadius: "10px",
                                marginTop: "10px",
                              }}
                            />
                          ) : Array.isArray(watch("images")) &&
                            watch("images")[index] &&
                            watch("images")[index][0] instanceof File ? (
                            <Image
                              src={URL.createObjectURL(
                                watch("images")[index][0]
                              )}
                              width={250}
                              height={200}
                              alt={
                                watch("altTags")[index] ||
                                `product-image-${index}`
                              }
                              style={{
                                objectFit: "contain",
                                maxHeight: "200px",
                                border: "1px solid #d5d5d5",
                                background: "#fff",
                                borderRadius: "10px",
                                marginTop: "10px",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 250,
                                height: 200,
                                border: "1px solid #d5d5d5",
                                background: "#f8f8f8",
                                borderRadius: "10px",
                                marginTop: "10px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                      {(errors.images as any)?.[index] && (
                        <span className="text-danger">
                          This field is required
                        </span>
                      )}
                    </div>
                  ))}
                  <br />
                  {editForm && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        appendImage("");
                        appendAltTag("");
                      }}
                    >
                      Add Image
                    </Button>
                  )}
                  {!editForm && <div style={{ minHeight: 38 }}></div>}
                </Form.Group>

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

export default ViewProduct;
