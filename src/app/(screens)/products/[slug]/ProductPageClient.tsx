"use client";
import React, { useEffect, useState } from "react";
import ProductAddSection from "@/app/components/Products/ProductAddSection";
import ProductImgSection from "@/app/components/Products/ProductImgSection";
import ProductDescription from "@/app/components/Products/ProductDescription";
import { getOneProductBySlug } from "@/app/services/Product/ProductApi";
import { Product } from "@/types/product";
import loader_img from "../../../../../public/assets/img/loader_img.png";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import SeoContentSection from "@/app/components/ContentDescription";
import ProductCarousel from "@/app/components/Products/ProductsCarousel";
import ProductFeaturesSection from "@/app/components/Products/ProductFeatureSection";
import DisclaimerSection from "@/app/components/Products/DisclaimerSection";

// // Sample products data
// const sampleProducts: CarouselProduct[] = [
//   {
//     id: 1,
//     title: "CNC Machine Wood Router",
//     image: "/pic1.jpg",
//     onDownload: () => console.log("Download CNC Machine"),
//     onView: () => console.log("View CNC Machine"),
//     onInfo: () => console.log("Info CNC Machine"),
//   },
//   {
//     id: 2,
//     title: "Co2 Laser Cutting Machine",
//     image: "/pic1.jpg",
//     onDownload: () => console.log("Download Laser Cutter"),
//     onView: () => console.log("View Laser Cutter"),
//     onInfo: () => console.log("Info Laser Cutter"),
//   },
//   {
//     id: 3,
//     title: "Laser Cutting Bed-Blade Board",
//     image: "/pic1.jpg",
//     onDownload: () => console.log("Download Cutting Board"),
//     onView: () => console.log("View Cutting Board"),
//     onInfo: () => console.log("Info Cutting Board"),
//   },
//   {
//     id: 4,
//     title: "Wood Router with Rotary",
//     image: "/pic1.jpg",
//     onDownload: () => console.log("Download Wood Router"),
//     onView: () => console.log("View Wood Router"),
//     onInfo: () => console.log("Info Wood Router"),
//   },
//   {
//     id: 5,
//     title: "Plasma Cutting Machine",
//     image: "/pic1.jpg",
//     onDownload: () => console.log("Download Plasma Cutter"),
//     onView: () => console.log("View Plasma Cutter"),
//     onInfo: () => console.log("Info Plasma Cutter"),
//   },
//   {
//     id: 6,
//     title: "Fiber Laser Engraver",
//     image: "/pic2.jpg",
//     onDownload: () => console.log("Download Fiber Laser"),
//     onView: () => console.log("View Fiber Laser"),
//     onInfo: () => console.log("Info Fiber Laser"),
//   },
// ];

export default function ProductPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);

  const fetchProduct = async () => {
    try {
      const data = await getOneProductBySlug(slug);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();

    // Fetch SEO data
    const fetchSeo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`
        );
        const seoData = await res.json();
        setSeo(seoData);
      } catch (error) {
        setSeo(null);
      }
    };
    fetchSeo();
  }, [slug]);

  if (!product)
    return (
      <div
        className="text-center position-relative d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner
          animation="border"
          role="status"
          style={{ width: "100px", height: "100px" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <Image
          src={loader_img}
          alt="loader_img"
          className="position-absolute"
          width={80}
          height={80}
        />
      </div>
    );

  return (
    <section className="product_details">
      <div className="container">
        {product && (
          <div className="row">
            <div className="col-md-6 my-3">
              {product.images ? (
                <ProductImgSection images={product.images} alts={product.altTags} />
              ) : (
                <div className="product_box">
                  <h3>No Images</h3>
                </div>
              )}
            </div>
            <div className="col-md-6 my-3">
              {product && <ProductAddSection product={product} />}
            </div>
          </div>
        )}
        <div className="col-md-12">
          {product && <ProductDescription product={product} />}
        </div>
        <div className="col-md-12 mt-5">
          <ProductFeaturesSection />
        </div>
        {/* Add Product Carousel here */}
        <div className="col-md-12 mt-5">
          <ProductCarousel ProductCategory={product.category_id} product_id={product._id} />
        </div>

        <div className="col-md-12 mt-5">
          <DisclaimerSection />
        </div>
        {/* <div className="col-md-12 mt-5">
          <TestimonialsSection />
        </div> */}
        {/* --- Enhanced SEO Content Description Section --- */}
      </div>
      {seo?.contentDescription && (
        <SeoContentSection contentDescription={seo?.contentDescription} />
      )}
    </section>
  );
}
 