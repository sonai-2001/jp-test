"use client";
import { getCatalogues } from "@/app/services/Catalogue/CatalogueApi";
import { ICatalogue } from "@/models/Catalogue";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import { Spinner } from 'react-bootstrap';
import loader_img from "../../../../public/assets/img/loader_img.png";
import { FaDownload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import SeoContentSection from "@/app/components/ContentDescription";

function Catalogues() {
  const [catalogueList, setCatalogueList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const counter = useSelector((state: any) => state.counter?.value);
  const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);

  const slug = StaticPageSlug.Catalogues;

  const getCataloguesList = async () => {
    setIsLoading(true);
    try {
      const data = await getCatalogues();
      setCatalogueList(
        data?.map((item: ICatalogue, i: number) => ({
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
    getCataloguesList();
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
  }, [counter]);

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
        ></Spinner>
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
      <div className="hero_banner_title pb-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="title">
                <h2>Catalogues</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className=" hero_banner_title pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 m-auto">
              {/* <div className='boxShadow_curve'> */}
              <div className="row">
                {catalogueList?.length ? (
                  catalogueList?.map((item: ICatalogue) => (
                    <div className="col-md-4 my-2" key={item?.id}>
                      <div
                        className="boxShadow_curve"
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="catalogues_Imgcard"
                          style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div className="text-end">
                            <a href={item?.catalogueFile} target="_blank">
                              <FaDownload />
                            </a>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              src={item?.catalogueImage}
                              alt={item?.catalogueImageAlt ||    item?.catalogueName}
                              height={250}
                              width={250}
                            />
                          </div>
                          <div className="catalogues_Imgcard_content">
                            <p>{item?.catalogueName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h4 className="text-center">No Data Found</h4>
                )}
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>
      {seo?.contentDescription && (
        <SeoContentSection contentDescription={seo?.contentDescription} />
      )}
    </>
  );
}

export default Catalogues;
