"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "react-bootstrap";

import { getIndustries } from "@/app/services/Industry/IndustryApi";
import { getProductsFilters } from "@/app/services/Product/ProductApi";

// Adjust this import path if your folder depth differs
import loader_img from "../../../../public/assets/img/loader_img.png";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface IIndustry {
  id: string;
  industry: string;
  slug: string;
  hasProducts?: boolean;
  industryImageAlt?: string;
  industryImage?: string;
}

interface FilterIndustry {
  _id?: string;
  industry?: string;
  slug?: string;
}

function IndustryList() {
  const [industryList, setIndustryList] = useState<IIndustry[]>([]);
  console.log("🚀 ~ IndustryList ~ industryList:", industryList);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const slug = StaticPageSlug.Industries;
  const router = useRouter();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [allIndsRaw, filters] = await Promise.all([
        getIndustries(),
        getProductsFilters(),
      ]);

      const allInds: IIndustry[] = (allIndsRaw || []).map((item: any) => ({
        id: (item?.id || item?._id || "").toString(),
        industry: item?.industry,
        slug: item?.slug,
        industryImageAlt: item?.industryImageAlt || "",
        industryImage: item?.industryImage || "",
      }));

      const filterInds: FilterIndustry[] = filters?.industries || [];

      // Build lookup sets
      const idSet = new Set(
        filterInds.map((i) => (i?._id || "").toString().trim()).filter(Boolean)
      );
      const slugSet = new Set(
        filterInds
          .map((i) => (i?.slug || "").toString().trim().toLowerCase())
          .filter(Boolean)
      );

      // Merge and mark hasProducts
      const merged = allInds.map((ind) => {
        const hasById = idSet.has((ind.id || "").toString().trim());
        const hasBySlug = slugSet.has(
          (ind.slug || "").toString().trim().toLowerCase()
        );
        return { ...ind, hasProducts: hasById || hasBySlug };
      });

      setIndustryList(merged);
    } catch (e) {
      console.error(e);
      setError("Failed to load industries. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div
        className="text-center position-relative d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner
          animation="border"
          role="status"
          style={{ width: "100px", height: "100px" }}
        />
        <Image
          src={loader_img}
          className="position-absolute"
          alt="loader_img"
          width={80}
          height={80}
        />
      </div>
    );
  }

  return (
    <>
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          padding: "80px 0",
          marginBottom: "60px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6">
              <div className="hero-content">
                <span
                  className="text-uppercase text-muted fw-bold mb-3 d-block"
                  style={{ fontSize: "14px", letterSpacing: "1px" }}
                >
                  We Deliver
                </span>
                <h2
                  className="display-4 fw-bold mb-4"
                  style={{
                    color: "#2c3e50",
                    lineHeight: "1.2",
                    fontSize: "3rem",
                    fontWeight: "500",
                  }}
                >
                  Top-Notch Solutions across Varied Industries{" "}
                </h2>
              </div>
            </div>

            {/* Right Content - Description */}
            <div className="col-lg-6">
              <div className="hero-description">
                <div
                  className="description-content p-5 rounded-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p
                    className="mb-4"
                    style={{
                      color: "#5a6c7d",
                      fontSize: "1.1rem",
                      lineHeight: "1.7",
                      fontWeight: "400",
                    }}
                  >
                    At Jaypee Associates, we provide CNC workholding solutions
                    that meet the diverse requirements of multiple industries.
                    With more than 25 years of expertise, we understand that
                    each sector demands precision, reliability, and
                    adaptability.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Manufacturers across India trust our range of clamps,
                    fixtures, and supports to achieve the much-needed accuracy
                    in their operations.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    We serve a diverse range of industries with utmost pride.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    In the automotive industry, we offer strong and stable
                    solutions for machining engine and chassis parts. In
                    aerospace, our products help produce lightweight yet complex
                    components with fine tolerances. For die and mould
                    manufacturing, our specialised clamps reduce setup time and
                    keep intricate moulds securely positioned.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    From lightweight to heavy machinery, our solutions maintain
                    alignment, prevent distortion, and offer reliability.
                  </p>
                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    At Jaypee Associates, we are more than your authorised
                    suppliers; we are partners committed to helping industries
                    achieve higher productivity and long-term growth with
                    dependable CNC workholding solutions.
                  </p>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#123c7d",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      textTransform: "none",
                      px: 4,
                      py: 1.5,
                      mt: 2,
                      "&:hover": { backgroundColor: "#0f2f63" },
                    }}
                    onClick={() => router.push("/contactus")}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="hero_banner_title pb-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="title">
                <h2>Industries</h2>
                {error && (
                  <p className="text-danger mt-2" style={{ fontSize: 14 }}>
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="hero_banner_title pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 m-auto">
              <div className="row">
                {industryList.length ? (
                  industryList.map((item) => {
                    const isEmpty = item.hasProducts === false;
                    const altText =
                      item.industryImageAlt ||
                      item.industry ||
                      "Industry image";

                    return (
                      <div className="col-md-4 my-3" key={item.id}>
                        <div
                          className="d-flex flex-column align-items-center justify-content-center p-4 shadow-sm rounded h-100 position-relative"
                          style={{
                            background: "#fff",
                            minHeight: 200,
                            border: "1px solid #f0f0f0",
                            opacity: isEmpty ? 0.7 : 1,
                          }}
                        >
                          <div className="position-absolute top-0 end-0 m-2">
                            <span
                              className={`badge ${
                                isEmpty ? "bg-secondary" : "bg-primary"
                              }`}
                            >
                              {isEmpty ? "No products" : "Available"}
                            </span>
                          </div>

                          {/* Industry Image or Icon */}
                          <div
                            className="mb-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: "8px",
                              overflow: "hidden",
                              backgroundColor: "#f8f9fa",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            <Image
                              src={item.industryImage || ""}
                              alt={altText}
                              width={56}
                              height={56}
                              style={{
                                objectFit: "contain",
                                width: "56px",
                                height: "56px",
                              }}
                              unoptimized
                              onError={(e) => {
                                // If image fails to load, show icon instead
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  const icon = document.createElement("div");
                                  icon.innerHTML =
                                    '<i class="fa fa-industry" style="font-size: 32px; color: #007bff;"></i>';
                                  parent.appendChild(icon);
                                }
                              }}
                            />
                          </div>

                          <h5
                            className="mb-2 text-center"
                            style={{ fontWeight: 600, color: "#333" }}
                          >
                            {item.industry}
                          </h5>

                          {item.hasProducts ? (
                            <Link
                              href={`/industries/${item.slug}`}
                              className="btn btn-outline-secondary btn-sm"
                              style={{
                                borderRadius: 20,
                                fontWeight: 500,
                                padding: "6px 22px",
                                fontSize: 15,
                                letterSpacing: 0.5,
                              }}
                            >
                              View Products
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm disabled"
                              disabled
                              aria-disabled="true"
                              title="No products available"
                              style={{
                                borderRadius: 20,
                                fontWeight: 500,
                                padding: "6px 22px",
                                fontSize: 15,
                                letterSpacing: 0.5,
                                cursor: "not-allowed",
                              }}
                            >
                              No Products
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h4 className="text-center">No Industries Found</h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="container my-5"
        style={{
          backgroundColor: "#123c7d",
          borderRadius: "10px",
        }}
      >
        <div className="row">
          <div className="col-lg-11 col-md-12 mx-auto">
            <div className="brand-section text-center p-5">
              <h2 className="fw-bold text-white mb-3">
                Wondering if We Serve Your Industry?
              </h2>
              <p className="text-white mb-4" style={{ fontSize: "16px" }}>
                Please have a chat with our representatives to learn more about
                our CNC workholding solutions{" "}
              </p>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  textTransform: "none",
                  px: 4,
                  "&:hover": { backgroundColor: "#f8f9fa" },
                }}
                onClick={() => router.push("/contactus")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.03"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.03"/><circle cx="50" cy="10" r="0.5" fill="%23000" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          z-index: 0;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-description {
          position: relative;
          z-index: 2;
        }

        .description-content {
          transition: all 0.3s ease;
        }

        .description-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
        }

        .category-card {
          position: relative;
          transition: all 0.3s ease;
        }
        .category-section {
          background-color: #123c7d; /* The dark blue from your screenshot */
          border-radius: 10px;
        }

        .category-card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .category-image-container {
          transition: all 0.3s ease;
        }

        .category-card:hover .category-image-container {
          transform: scale(1.02);
        }

        .btn:hover {
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 0;
          }

          .display-4 {
            font-size: 2.5rem !important;
          }

          .hero-description {
            margin-top: 40px;
          }
        }
      `}</style>
    </>
  );
}

export default IndustryList;
