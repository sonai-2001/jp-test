//src\app\(screens)\my-enquiry\page.tsx
"use client";

import SeoContentSection from '@/app/components/ContentDescription';
// import enquiryData from '@/app/components/data/enquies';
import EnquiryItem from '@/app/components/Enquiries/EnquiryItem'
import SignInModel from '@/app/components/Signin/SignInModel';
import { getproductUserIdEnquiries } from '@/app/services/Enquiry/EnquiryApi';
import { StaticPageSlug } from '@/enums/static-pages-enum';
import React, { useEffect, useState } from 'react'

function MyEnquiry() {
    const [modelType, setModelType] = useState<string>('');
    const [showModel, setShowModel] = useState<boolean>(false);
    const closeModel = () => {
        setShowModel(false)
    }

    const [enquiryData, setEnquiryData] = useState<any[]>([]);
     const slug = StaticPageSlug.MyEnquiry;
              
          const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);

    const getenquies = async () => {

        const id: string = `${localStorage.getItem("jid")}`

        try {
            const data = await getproductUserIdEnquiries(id);
            setEnquiryData(data);
        } catch (error) {
            console.error("Error fetching enquies:", error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("jid")) {
            setModelType("SignIn");
            setShowModel(true);
        }
        
        if (localStorage.getItem("jid")) {
            getenquies();
        }
        const fetchSeo = async () => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`);
              const seoData = await res.json();
              setSeo(seoData);
            } catch (error) {
              setSeo(null);
            }
          };
          fetchSeo();
        // getenquies();
    }, [localStorage.getItem("jid")]);

    return (
        <>
            <div className="hero_banner_title pb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 m-auto">
                            <div className="title">
                                <h2>My Enquiries</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className=" pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 m-auto">
                            <div className='boxShadow_curve'>
                                <div className="row">
                                    {
                                        enquiryData?.length && enquiryData?.map((enquiry, index) => (
                                            <div className="col-lg-6" key={index} >
                                                <div className="enquiry_box mb-3">
                                                    <EnquiryItem enquiry={enquiry} />
                                                </div>
                                            </div>
                                        )) || ""
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {seo?.contentDescription && (
                                  <SeoContentSection contentDescription={seo?.contentDescription} />
                                )}
            <SignInModel showModel={showModel} closeModel={closeModel} data={modelType} />
        </>
    )
}

export default MyEnquiry