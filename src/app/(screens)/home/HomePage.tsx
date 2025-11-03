"use client";
import BannerBg from "@/app/components/BannerBg/BannerBg";
import Blogs from "@/app/components/Blogs/Blogs";
import FAQSection from "@/app/components/FAQSection/FAQSection";
import { fetchArticles } from "@/app/services/Articles/articlesApi";
import { getFAQs } from "@/app/services/Faq/FaqApi";
import { getProducts } from "@/app/services/Product/ProductApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import loader_img from "../../../../public/assets/img/loader_img.png";
import { Spinner } from "react-bootstrap";
import SeoContentSection from "@/app/components/ContentDescription";
import SectionSupportingBrands from "@/app/components/Home/SectionSupportingBrands";
import SectionStatsBanner from "@/app/components/Home/SectionStatsBanner";
import SectionProductCategories from "@/app/components/Home/SectionedProductCategories";
import SectionIndustries from "@/app/components/Home/SectionIndustry";
import SectionWhyUs from "@/app/components/Home/SectionWhyUs";
import SectionCompanyOverview from "@/app/components/Home/SectionCompanyOverview";
import { Box, Button } from "@mui/material";
import CNCWorkholdingBanner from "@/app/components/Home/Banner";
import BrandsSection from "@/app/components/Home/BrandsSection";
import ClientSection from "@/app/components/Home/ClientSection";
import { useRouter } from "next/navigation";
import SiteThemeProvider from "@/app/components/Home/SiteThemeProvider";
import { IHomePage } from "@/models/Home";
import { getHomePage } from "@/app/services/home/home.api";

function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [faqList, setFaqList] = useState<any[]>([]);
  const [homePage, setHomePage] = useState<IHomePage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const slug = "landing-page";
  console.log(products);
  const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
  const router = useRouter();

  const getArticles = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data ? data : []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSeo = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`);
      const seoData = await res.json();
      setSeo(seoData);
    } catch (error) {
      setSeo(null);
    }
  };

  const setHomeData = async () => {
    setIsLoading(true);
    const data = await getHomePage();
    setHomePage(data);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchSeo();
    getArticles();
    fetchProducts();
    setHomeData();
  }, []);

  const getFAQsList = async () => {
    try {
      const data = await getFAQs();
      setFaqList(
        data?.map((item: any, i: number) => ({
          ...item,
          index: i + 1,
          id: item?._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFAQsList();
  }, []);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // adjust duration as needed
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="col-12 position-relative d-flex justify-content-center align-items-center"
        style={{ height: "272px" }}
      >
        <Spinner
          animation="border"
          role="status"
          style={{ width: "100px", height: "100px" }}
        ></Spinner>
        <Image
          src={loader_img}
          alt="Loading..."
          className="position-absolute"
          width={80}
          height={80}
          unoptimized
        />
      </div>
    );
  }

  if (!homePage) {
    return <div>No Data Found</div>;
  }
  return (
    <>
      <SiteThemeProvider>
        {/* Banner Section */}
        <BannerBg />
        <div className="section-container mt-5 mb-5 py-3">
          <SectionCompanyOverview overview={homePage.overview} />
        </div>
        <div className="section-container mt-5 mb-5  py-3">
          <BrandsSection button={true} />
        </div>
        {/* Supporting Brands Section */}
        <div className="section-container mb-5 py-3">
          <SectionSupportingBrands solutions={homePage.solutions} />
        </div>
        <div className="section-container mb-5 py-2">
          <SectionStatsBanner
            exp={homePage.experienceYears}
            products={homePage.productsCount}
            customers={homePage.satisfiedCustomerCount}
          />
        </div>
        {/* Product Categories Section */}
        <div className="section-container mb-5 py-4">
          <SectionProductCategories />
        </div>

        {/* Industries Section */}
        <div className="section-container mb-5 py-4">
          <SectionIndustries />
        </div>
        {/* Why Us Section */}
        <div className="section-container mb-5 py-4">
          <SectionWhyUs whychoose={homePage.whyJaypeeAssociates} />
        </div>
        {/* <div className="section-container mb-5 py-4">
          <SectionOurWork />
        </div> */}
        <div className="section-container py-3">
          <ClientSection clientImages={homePage.clientImages} />
        </div>
        {/* <div className="section-container mb-5 py-3">
          <TestimonialsSection />
        </div> */}

        {/* FAQ Section */}
        {faqList?.length ? (
          <div className="section-container mb-5 py-4">
            <div className="container">
              <div className="row">
                <div
                  className="col-lg-10 mx-auto mb-4"
                  style={{ textAlign: "center" }}
                >
                  <div className="content">
                    <h2 style={{ color: "#0E3A66" }}>FAQ</h2>
                  </div>
                </div>
                <div className="col-lg-12">
                  {faqList?.length ? (
                    <FAQSection faqData={faqList.slice(0, 5)} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <Box mt={3} textAlign="center">
              <Button
                onClick={() => router.push("/faq")}
                variant="contained"
                color="primary"
                size="medium"
              >
                Read More
              </Button>
            </Box>
          </div>
        ) : (
          <div>
            <div className="section-container">No FAQ found</div>
          </div>
        )}

        {/* Blogs Section */}
        {articles?.length ? (
          <div className="section-container mb-5 py-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 mb-4">
                  <div className="content">
                    <h2 style={{ textAlign: "center", color: "#0E3C6E" }}>
                      Blogs
                    </h2>
                  </div>
                </div>

                {articles?.slice(0, 3)?.map((article) => (
                  <div
                    className="col-lg-4 col-md-6 col-sm-12 mb-4"
                    key={article.id}
                  >
                    <Blogs article={article} />
                  </div>
                ))}
                <Box mt={3} textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}`}
                    LinkComponent={Link}
                    style={{ width: "200px" }}
                  >
                    View All
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="section-container">No Blogs found</div>
          </div>
        )}
        <div className="section-container">
          <CNCWorkholdingBanner />
        </div>

        {/* SEO Content Section */}
        {seo?.contentDescription && (
          <div className="section-container mb-5 py-4">
            <SeoContentSection contentDescription={seo?.contentDescription} />
          </div>
        )}
      </SiteThemeProvider>

      <style jsx global>{`
        .section-container {
          width: 100%;
        }

        /* Responsive spacing */
        @media (max-width: 768px) {
          .section-container {
            margin-bottom: 3rem !important;
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
        }

        .content h2 {
          position: relative;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
        }

        .content h2:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 4px;
        }
      `}</style>
    </>
  );
}

export default HomePage;
