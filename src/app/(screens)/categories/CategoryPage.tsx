"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import { FaFolderOpen } from "react-icons/fa";

import { getCategories } from "@/app/services/Category/CategoryApi";
import { getProductsFilters } from "@/app/services/Product/ProductApi";
import loader_img from "../../../../public/assets/img/loader_img.png";
// import SeoContentSection from "@/app/components/ContentDescription";
// import { StaticPageSlug } from "@/enums/static-pages-enum";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface ICategory {
  id: string;
  category: string;
  slug: string;
  hasProducts?: boolean;
  categoryImage?: string;
  categoryImageAlt?: string;
  description?: string;
}

interface FilterCategory {
  _id: string;
  category: string;
  slug: string;
}

function CategoryList() {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // const slug = StaticPageSlug.Categories;
  // const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both concurrently
      const [allCatsRaw, filters] = await Promise.all([
        getCategories(),
        getProductsFilters(),
      ]);

      const allCats: ICategory[] = (allCatsRaw || []).map((item: any) => ({
        id: (item?.id || item?._id || "").toString(),
        category: item?.category,
        slug: item?.slug,
        categoryImage: item?.categoryImage || "",
        categoryImageAlt: item?.categoryImageAlt || "",
        description: item?.description || "",
      }));

      const filterCats: FilterCategory[] = filters?.categories || [];

      // Build fast-lookup sets (by id, and slug as fallback)
      const idSet = new Set(
        filterCats.map((c) => (c?._id || "").toString().trim())
      );
      const slugSet = new Set(
        filterCats.map((c) => (c?.slug || "").toString().trim().toLowerCase())
      );

      // Merge: mark each category with hasProducts based on id match (fallback to slug)
      const merged = allCats.map((cat) => {
        const hasById = idSet.has((cat.id || "").toString().trim());
        const hasBySlug = slugSet.has(
          (cat.slug || "").toString().trim().toLowerCase()
        );
        return {
          ...cat,
          hasProducts: hasById || hasBySlug,
        };
      });

      setCategoryList(merged);
    } catch (e) {
      console.error(e);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const fetchSeo = async () => {
    //   try {
    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`
    //     );
    //     const seoData = await res.json();
    //     setSeo(seoData);
    //   } catch {
    //     setSeo(null);
    //   }
    // };

    // fetchSeo();
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
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          padding: "80px 0",
          marginBottom: "40px",
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
                  Our Collection of
                </span>
                <h2
                  className="display-4 fw-bold mb-4"
                  style={{
                    color: "#2c3e50",
                    lineHeight: "1.2",
                    fontSize: "3rem",
                  }}
                >
                  Premium CNC Workholding & Tooling Devices for Operational
                  Brilliance
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
                    CNC machining is all about precision, consistency, and
                    efficiency, all of which demand the right workholding
                    devices.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    At Jaypee Associates, we specialise in providing reliable
                    and high-performance CNC workholding, tooling and toolholder
                    solutions. They form the backbone of modern manufacturing
                    setups, helping your business excel in operations.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Our devices ensure that every component of the machine is
                    held securely, eliminating vibration, misalignment, or
                    slippage during functionality. From supporting delicate
                    parts in the medical industry to holding heavy automotive
                    and construction components, our CNC workholding devices and
                    tools adapt to diverse needs and applications.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Our collection covers a spectrum of clamping, supporting,
                    and positioning devices, as well Swiss-cut drills, endmills
                    and Arris, each designed to help manufacturers reduce setup
                    times, streamline workflows, and achieve consistent results.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    At Jaypee Associates, we go beyond just supplying hardware;
                    we partner with you to understand your challenges and
                    provide tailored CNC workholding and tooling solutions that
                    keep your operations efficient and future-ready.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Explore our range today and experience the difference our
                    trusted, precision-driven workholding devices can make for
                    your business.
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

      {/* Categories Section Title */}
      <div className="hero_banner_title pb-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="title text-center">
                <h2
                  className="display-5 fw-bold mb-1"
                  style={{ color: "#2c3e50" }}
                >
                  Categories
                </h2>
                <p className="lead text-muted mb-4">
                  Browse our comprehensive collection of industrial tools and
                  accessories
                </p>
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

      {/* Categories Grid */}
      <section className="categories-grid pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 m-auto">
              <div className="row">
                {categoryList.length ? (
                  categoryList.map((item) => {
                    const isEmpty = item.hasProducts === false;
                    const altText =
                      item.categoryImageAlt ||
                      item.category ||
                      "Category image";

                    return (
                      <div className="col-md-4 my-3" key={item.id}>
                        <div
                          className="d-flex flex-column align-items-center justify-content-center p-4 shadow-sm rounded h-100 position-relative category-card"
                          style={{
                            background: "#fff",
                            minHeight: 280,
                            border: "1px solid #f0f0f0",
                            opacity: isEmpty ? 0.7 : 1,
                          }}
                        >
                          {/* Badge */}
                          <div
                            className="position-absolute top-0 end-0 m-2"
                            style={{ zIndex: 5 }}
                          >
                            <span
                              className={`badge ${
                                isEmpty ? "bg-secondary" : "bg-primary"
                              }`}
                            >
                              {isEmpty ? "No products" : "Available"}
                            </span>
                          </div>

                          {/* Category Image Section */}
                          <div
                            className="category-image-container mb-3"
                            style={{
                              width: "100%",
                              height: "140px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              background: "#f8f9fa",
                              border: "1px solid #e9ecef",
                              position: "relative",
                            }}
                          >
                            {item.categoryImage ? (
                              <Image
                                src={item.categoryImage}
                                alt={altText}
                                fill
                                style={{
                                  objectFit: "cover",
                                }}
                                unoptimized
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div style="
                                        display: flex; 
                                        align-items: center; 
                                        justify-content: center; 
                                        height: 100%; 
                                        background: #f8f9fa;
                                      ">
                                        <i class="fa fa-folder-open" style="font-size: 48px; color: #007bff;"></i>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                  background: "#f8f9fa",
                                }}
                              >
                                <FaFolderOpen size={48} color="#007bff" />
                              </div>
                            )}
                          </div>

                          {/* Category Info */}
                          <div
                            className="category-info text-center mb-3"
                            style={{ flex: 1 }}
                          >
                            <h5
                              className="mb-2"
                              style={{
                                fontWeight: 600,
                                color: "#333",
                                lineHeight: "1.3",
                              }}
                            >
                              {item.category}
                            </h5>

                            {item.description && (
                              <p
                                className="text-muted mb-0"
                                style={{
                                  fontSize: "14px",
                                  lineHeight: "1.4",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  minHeight: "34px",
                                }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          {item.hasProducts ? (
                            <Link
                              href={`/categories/${item.slug}`}
                              className="btn btn-outline-secondary btn-sm"
                              style={{
                                borderRadius: 20,
                                fontWeight: 500,
                                padding: "8px 24px",
                                fontSize: 15,
                                letterSpacing: 0.5,
                                textDecoration: "none",
                                minWidth: "120px",
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
                                padding: "8px 24px",
                                fontSize: 15,
                                letterSpacing: 0.5,
                                cursor: "not-allowed",
                                minWidth: "120px",
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
                  <h4 className="text-center">No Categories Found</h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-11 col-md-12 mx-auto">
            <div className="category-section text-center p-5">
              <h2 className="fw-bold text-white mb-3">
                Do You Have A Specific Workholding Device or Tooling You Need?
              </h2>
              <p className="text-white mb-4" style={{ fontSize: "16px" }}>
                Explore our range of high-quality and durable CNC workholding
                tools designed for varied industries.
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

      {/* {seo?.contentDescription && (
        <SeoContentSection contentDescription={seo?.contentDescription} />
      )} */}

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

export default CategoryList;
