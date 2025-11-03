//src\app\(screens)\my-enquiry\[id]\page.tsx
"use client"
import { createInvoice, updateInvoice, getInvoices } from '@/app/services/Invoice/InvoiceApi';
import { increment } from '@/app/services/redux/features/counterSlice';
import Image from 'next/image';
import React, { useEffect } from 'react'
import { Button, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

function InvoiceDetailsBody() {
  const dispatch = useDispatch();
  const counter = useSelector((state: any) => state.counter?.value);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<any>();

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "signatory" && data[key]?.[0]) {
        formData.append(key, watch("signatory") === "string" || data[key]?.[0] == "h" || data[key]?.[0] == "-h" ? watch("signatory") : data[key][0]);
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    formData.append('id', data._id);
    try {
      const response = data._id ? await updateInvoice(formData) : await createInvoice(formData);
      if (response) {
        dispatch(increment());
      }
    } catch (error) {
      console.error("Error in POST /api/invoice:", error);
    }
  };

  const getInvoice = async () => {
    try {
      const data = await getInvoices();
      reset(data?.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  useEffect(() => {
    getInvoice();
  }, [counter]);

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
                      <h2>Invoice Form</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="companyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('companyName', { required: true })}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>
                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...register('email', { required: true })}
                      placeholder="Enter email"
                    />
                    {errors.email && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>
                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('phone', { required: true })}
                      placeholder="Enter phone"
                    />
                    {errors.phone && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="GSTIN">
                    <Form.Label>GSTIN</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('GSTIN', { required: true })}
                      placeholder="Enter GSTIN"
                    />
                    {errors.GSTIN && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>
                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="CODE">
                    <Form.Label>CODE</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('CODE', { required: true })}
                      placeholder="Enter CODE"
                    />
                    {errors.CODE && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="PAN">
                    <Form.Label>PAN</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('PAN', { required: true })}
                      placeholder="Enter PAN"
                    />
                    {errors.PAN && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="bName">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('bName', { required: true })}
                      placeholder="Enter bank name"
                    />
                    {errors.bName && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="bCity">
                    <Form.Label>Bank City</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('bCity', { required: true })}
                      placeholder="Enter bank city"
                    />
                    {errors.bCity && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="bPinCode">
                    <Form.Label>Bank Pin Code</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('bPinCode', { required: true })}
                      placeholder="Enter bank pin code"
                    />
                    {errors.bPinCode && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="bAccountNo">
                    <Form.Label>Bank Account Number</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('bAccountNo', { required: true })}
                      placeholder="Enter bank Account Number"
                    />
                    {errors.bAccountNo && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-4 col-md-6">
                  <Form.Group className="mb-3" controlId="bIFSCode">
                    <Form.Label>Bank IFSC Code</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('bIFSCode', { required: true })}
                      placeholder="Enter bank IFSC code"
                    />
                    {errors.bIFSCode && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>
                <div className="col-lg-6 col-md-6">
                  <Form.Group className="mb-3" controlId="bAddress">
                    <Form.Label>Bank Address</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('bAddress', { required: true })}
                      placeholder="Enter bank address"
                    />
                    {errors.bAddress && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-6 col-md-6">
                  <Form.Group className="mb-3" controlId="website">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('website', { required: true })}
                      placeholder="Enter website"
                    />
                    {errors.website && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>
                <div className="col-lg-12 col-md-12">
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('address', { required: true })}
                      placeholder="Enter address"
                    />
                    {errors.address && <span className="text-danger">This field is required</span>}
                  </Form.Group>
                </div>

                <div className="col-lg-12 col-md-12">
                  <Form.Group className="mb-3" controlId="signatory">
                    <Form.Label>E-Sign</Form.Label>
                    <div>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        {...register("signatory", {
                          required: watch("signatory")?.length ? false : true,
                          validate: (value) => {
                            const existingFile = watch("signatory"); // Get the current value
                            if (!existingFile?.length && (!value || !value[0])) {
                              return "E-Sign is required"; // Show error only if there's no existing file and no new file is selected
                            }
                            if (existingFile?.length && value && value[0]) {
                              if (value[0]?.type?.startsWith != undefined && value[0]?.type?.startsWith != 'undefined' && !value[0]?.type?.startsWith("image/")) {
                                return "Only image files are allowed"; // Show error if non-image file is selected
                              }
                            }
                            return true;
                          }
                        })}
                      />
                      {watch("signatory") &&
                        typeof watch("signatory") === "string" &&
                        watch("signatory")?.includes("amazonaws.com") && (
                          <Image
                            src={watch("signatory")}
                            className='object-fit-contain'
                            width={200}
                            height={80}
                            alt={`product-image`}
                            unoptimized
                          />
                        )
                      }
                      {watch("signatory") && watch("signatory")[0] instanceof File && (
                        <Image
                          src={URL.createObjectURL(watch("signatory")[0])}
                          className='object-fit-contain'
                          width={200}
                          height={80}
                          alt={`product-image`}
                          unoptimized
                        />
                      )}
                    </div>
                    {errors.signatory && <span className="text-danger">{errors.signatory.message as String}</span>}
                  </Form.Group>
                </div>

                <div className='text-center'>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InvoiceDetailsBody;