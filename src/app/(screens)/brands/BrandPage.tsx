"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import loader_img from "../../../../public/assets/img/loader_img.png";
import { Spinner } from "react-bootstrap";
import { getBrands } from "@/app/services/Brands/BrandApi";
import Link from "next/link";
// import { StaticPageSlug } from "@/enums/static-pages-enum";
// import SeoContentSection from "@/app/components/ContentDescription";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface IBrand {
  id: string;
  brandName: string;
  brandImage: string;
  slug: string;
  brandImageAlt?: string;
}

function Brands() {
  const [brandList, setBrandList] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [setSeo] = useState<{ contentDescription?: string } | null>(null);
  // const slug = StaticPageSlug.Brands;
  const router = useRouter();

  const getBrandsList = async () => {
    setIsLoading(true);
    try {
      const data = await getBrands();
      setBrandList(
        data?.map((item: any) => ({
          id: item.id || item._id,
          brandName: item.brandName,
          brandImage: item.brandImage,
          slug: item.slug,
          brandImageAlt: item.brandImageAlt || "",
        }))
      );
    } catch (error) {
      console.error("Error fetching brand data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBrandsList();
    // const fetchSeo = async () => {
    //   try {
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`);
    //     const seoData = await res.json();
    //     setSeo(seoData);
    //   } catch (error) {
    //     setSeo(null);
    //   }
    // };
    // fetchSeo();
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
                  We Partner with
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
                  The Most Trusted Names in CNC Workholding & Tooling Solutions
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
                    At Jaypee Associates, we take pride in partnering with some
                    of the most trusted and reputable brands in the CNC tooling,
                    toolholders and workholding industry. Our goal is to provide
                    our esteemed customers with machining solutions that combine
                    durability, precision, and performance. We ensure every
                    solution we offer is backed by the credibility of
                    world-class manufacturers.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    With 25 years of experience, our collection is curated with
                    brand partners who ensure every clamp, fixture, and
                    accessory as well as toolings and toolholders like Swiss-cut
                    drills and Arris, meets the high standards required in
                    modern machining.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    We have brought forth an extensive catalogue of CNC tools,
                    each designed to deliver accuracy, reliability, and
                    long-term value.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Our brand collaborations enable us to support industries
                    ranging from automotive and aerospace to die & mould and
                    medical device manufacturing. Whether opting for heavy-duty
                    workholding for significant components or precision devices
                    for intricate parts, we offer solutions for every challenge.
                  </p>

                  <p
                    className="mb-4"
                    style={{
                      color: "#6c757d",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    When you choose Jaypee Associates, you’re not just choosing
                    a supplier; you’re choosing access to globally-recognised
                    brands who are committed to customer success.
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

      {/* Brands Section Title */}
      <div className="hero_banner_title pb-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="title text-center">
                <h2
                  className="display-5 fw-bold mb-3"
                  style={{ color: "#2c3e50" }}
                >
                  Brands
                </h2>
                <p className="lead text-muted mb-4">
                  Discover our trusted brand partners and their premium product
                  offerings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <section className="brands-grid pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 m-auto">
              <div className="row">
                {brandList.length ? (
                  brandList.map((item) => (
                    <div className="col-md-4 my-3" key={item.id}>
                      <div
                        className="d-flex flex-column align-items-center justify-content-center p-4 shadow-sm rounded h-100 position-relative brand-card"
                        style={{
                          background: "#fff",
                          minHeight: 220,
                          border: "1px solid #f0f0f0",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {/* Brand Image */}
                        <div
                          className="brand-image-container mb-3"
                          style={{
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            src={item?.brandImage}
                            alt={item?.brandImageAlt || item.brandName}
                            height={80}
                            width={120}
                            style={{
                              objectFit: "contain",
                              transition: "all 0.3s ease",
                            }}
                            unoptimized
                          />
                        </div>

                        {/* Brand Name */}
                        <h5
                          className="mb-3 text-center"
                          style={{
                            fontWeight: 600,
                            color: "#333",
                            lineHeight: "1.3",
                          }}
                        >
                          {item.brandName}
                        </h5>

                        {/* Action Button */}
                        <Link
                          href={`/brands/${item.slug}`}
                          className="btn btn-outline-secondary btn-sm"
                          style={{
                            borderRadius: 20,
                            fontWeight: 500,
                            padding: "8px 24px",
                            fontSize: 15,
                            letterSpacing: 0.5,
                            textDecoration: "none",
                            minWidth: "120px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          View Products
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <h4 className="text-center">No Brands Found</h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-11 col-md-12 mx-auto">
            <div className="brand-section text-center p-5">
              <h2 className="fw-bold text-white mb-3">
                Have A Specific CNC Machining Brand In Mind?
              </h2>
              <p className="text-white mb-4" style={{ fontSize: "16px" }}>
                Explore durable and trusted CNC brands available with Jaypee
                Associates.{" "}
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
        .brand-section {
          background-color: #123c7d; /* The dark blue from your screenshot */
          border-radius: 10px;
        }

        .description-content {
          transition: all 0.3s ease;
        }

        .description-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
        }

        .brand-card {
          position: relative;
        }

        .brand-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
        }

        .brand-card:hover .brand-image-container img {
          transform: scale(1.1);
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

export default Brands;
