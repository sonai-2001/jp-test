"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { getContact, saveContact } from "@/app/services/contact/contact.api";

interface ContactFormData {
  contact_numbers: { value: string }[];
  emailIds: { value: string }[];
  website: string;
  address: string;
  location: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      contact_numbers: [{ value: "" }],
      emailIds: [{ value: "" }],
      website: "",
      address: "",
      location: "",
    },
  });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "contact_numbers",
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: "emailIds",
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await getContact();
        if (res && Object.keys(res).length > 0) {
          // Ensure arrays have at least one empty field if empty
          const transformedData = {
            contact_numbers: res.contact_numbers?.length
              ? res.contact_numbers
              : [""],
            emailIds: res.emailIds?.length ? res.emailIds : [""],
            website: res.website || "",
            address: res.address || "",
            location: res.location || "",
          };
          reset(transformedData);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };
    fetchContact();
  }, [reset]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Filter out empty values from arrays
      const submitData = {
        contact_numbers: data.contact_numbers
          .filter((phone) => phone.value.trim() !== "")
          .map((phone) => phone.value),
        emailIds: data.emailIds
          .filter((email) => email.value.trim() !== "")
          .map((email) => email.value),
        website: data.website,
        address: data.address,
        location: data.location,
      };

      const response = await saveContact(submitData);
      if (response?.status) {
        console.log("Contact information saved successfully!");
      }
    } catch (error) {
      console.error("Error saving contact information:", error);
    }
  };

  return (
    <section className="container my-4">
      <h2>Contact Information Management</h2>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Contact Numbers */}
            <div className="mb-4">
              <h5>Contact Numbers</h5>
              {phoneFields.map((field, index) => (
                <Row key={index} className="mb-2 align-items-center">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Phone Number {index + 1}</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter phone number (e.g., +91 1234567890)"
                        {...register(
                          `contact_numbers.${index}.value` as const,
                          {
                            pattern: {
                              value: /^[\+]?[0-9\s\-\(\)]+$/,
                              message: "Please enter a valid phone number",
                            },
                          }
                        )}
                        isInvalid={!!errors.contact_numbers?.[index]?.value}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contact_numbers?.[index]?.value?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mt-3">
                    {phoneFields.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removePhone(index)}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => appendPhone({ value: "" })}
              >
                Add Phone Number
              </Button>
              <Form.Text className="text-muted d-block mt-1">
                Add multiple contact numbers if needed
              </Form.Text>
            </div>

            {/* Email Addresses */}
            <div className="mb-4">
              <h5>Email Addresses</h5>
              {emailFields.map((field, index) => (
                <Row key={field.id} className="mb-2 align-items-center">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Email Address {index + 1}</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address (e.g., contact@example.com)"
                        {...register(`emailIds.${index}.value` as const, {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                          },
                        })}
                        isInvalid={!!errors.emailIds?.[index]?.value}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.emailIds?.[index]?.value?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mt-3">
                    {emailFields.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeEmail(index)}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => appendEmail({ value: "" })}
              >
                Add Email Address
              </Button>
              <Form.Text className="text-muted d-block mt-1">
                Add multiple email addresses if needed
              </Form.Text>
            </div>

            {/* Website */}
            <div className="mb-4">
              <h5>Website</h5>
              <Form.Group>
                <Form.Label>Website URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  {...register("website", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: "Please enter a valid website URL",
                    },
                  })}
                  isInvalid={!!errors.website}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.website?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Include http:// or https:// for best results
                </Form.Text>
              </Form.Group>
            </div>

            {/* Address */}
            <div className="mb-4">
              <h5>Address</h5>
              <Form.Group>
                <Form.Label>Full Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter complete business address"
                  {...register("address", {
                    maxLength: {
                      value: 500,
                      message: "Address cannot exceed 500 characters",
                    },
                  })}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            {/* Location */}
            <div className="mb-4">
              <h5>Location</h5>
              <Form.Group>
                <Form.Label>Location/Map Reference</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter google map location url"
                  {...register("location", {})}
                  isInvalid={!!errors.location}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  This will be used for map integration and location display
                </Form.Text>
              </Form.Group>
            </div>

            <div className="mt-4">
              <Button variant="primary" type="submit" size="lg">
                Save Contact Information
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
}
