// src\app\(screens)\about\page.tsx
import React from "react";
// import Aboutus from "@/app/components/AboutUs/Aboutus";
// import AboutUsTitle from "@/app/components/AboutUsTitle/AboutUsTitle";
import Image from 'next/image';
import { StaticPageSlug } from "@/enums/static-pages-enum";
import { Metadata } from "next";
import Script from "next/script";
// import BusinessGrow from "@/app/components/BusinessGrow/BusinessGrow";


export async function generateMetadata(): Promise<Metadata> {
  // The slug for this page is "about-us"
  const slug = StaticPageSlug.MeetTheTeam;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`,
    { cache: "no-store" }
  );
  const seo = await res.json();

  return {
    title: seo.metaTitle || "Meet The Team",
    description: seo.metaDescription || "Meet The Team",
    alternates: {
      canonical:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/${StaticPageSlug.MeetTheTeam}`,
    },
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url:
        seo.canonicalUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/${StaticPageSlug.MeetTheTeam}`,
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage,
              width: seo.ogImageWidth || 1200,
              height: seo.ogImageHeight || 630,
            },
          ]
        : [],
    },
    twitter: {
      title: seo.twitterTitle || seo.metaTitle,
      description: seo.twitterDescription || seo.metaDescription,
      images: seo.twitterImage ? [seo.twitterImage] : [],
    },
  };
}

function AboutUs() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jaypeeassociates.co.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Meet the Team",
        item: "https://jaypeeassociates.co.in/meet-the-team",
      },
    ],
  };
  return (
    <>
      {/* <AboutUsTitle />
      <Aboutus /> */}

<Script
        id="breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      

      <div className="letest_section section_padding_top">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <div className="content">
                <h2>Management team</h2>
                <p className="text-dark">
                  Meet the CNC Workholding and Toolholding Specialists
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
              <div className='managementTeam_main'>
                <div className='imgBox'>
                  <Image
                    src="/assets/img/team_1.jpg"
                    alt="image"
                    width={1000}
                    height={1000}
                    unoptimized
                  />
                </div>
                <div className='contentBox'>
                  <h5>Juzer Abbasbhai</h5>
                  <h6>Founder & Owner _Proprietor</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
              <div className='managementTeam_main'>
                <div className='imgBox'>
                  <Image
                    src="/assets/img/team_2.jpg"
                    alt="image"
                    width={1000}
                    height={1000}
                    unoptimized
                  />
                </div>
                <div className='contentBox'>
                  <h5>Mustafa Pipewala</h5>
                  <h6>Sales and Marketing Specialist_ E-commerce</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="letest_section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <ul className="marketYear_boxes">
                <li>
                  <h5>25+</h5>
                  <h6>Years In the Market </h6>
                </li>
                <li>
                  <h5> East India's</h5>
                  <h6>
                  Leading Supplier of CNC <br /> Workholders and Toolings
                  </h6>
                </li>
                <li>
                  <h5>100%</h5>
                  <h6>
                  Customer Satisfaction
                  </h6>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <BusinessGrow /> */}
    </>
  );
}

export default AboutUs;
