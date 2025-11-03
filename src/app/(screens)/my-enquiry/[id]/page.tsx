//src\app\(screens)\my-enquiry\[id]\page.tsx
"use client"
import DetailCard from '@/app/(screens)/my-cart/detailCard';
// import enquiesDataImg from '@/app/components/data/enquies';
import MyEnquies from '@/app/components/Enquiries/MyEnquies';
import ProductDescription from '@/app/components/Products/ProductDescription';
import ProductImgSection from '@/app/components/Products/ProductImgSection';
import SignInModel from '@/app/components/Signin/SignInModel';
import { getIdEnquiries } from '@/app/services/Enquiry/EnquiryApi';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function MyEnquiry() {

    const [modelType, setModelType] = useState<string>('');
    const [showModel, setShowModel] = useState<boolean>(false);
    const closeModel = () => {
        setShowModel(false)
    }
    const params: any = useParams();
    const { id }: { id: string } = params;
    const [enquiryData, setEnquiryData] = useState<any>();
    const counter = useSelector((state: any) => state.counter?.value)
    const router = useRouter()

    const getEnquiry = async () => {
        try {
            const data = await getIdEnquiries(id);
            if (data?.enquiry?.userId == localStorage.getItem("jid")) {
                setEnquiryData(data);
            } else {
                router.push(`/my-enquiry`);
            }
        } catch (error) {
            setTimeout(() => {
                router.push(`/my-enquiry`);
            }, 500)
            console.error("Error fetching enquiry:", error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("jid")) {
            setModelType("SignIn");
            setShowModel(true);
        }

        if (localStorage.getItem("jid")) {
            getEnquiry();
        }
    }, [counter, localStorage.getItem("jid")]);


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
            <section className="enquiry_body">


                {enquiryData && <div className="container">
                    <div className="row ">

                        {
                            enquiryData && enquiryData?.enquiry?.isCart ?
                                <>
                                    <div className="col-lg-10 enquiry_box m-auto ">
                                        {enquiryData && <MyEnquies enquiry={enquiryData} />}
                                    </div>
                                    <div className="col-lg-10 enquiry_box m-auto mt-3">
                                        {
                                            enquiryData?.enquiry?.totalCart?.map(((item: any, index: number) => <div key={index}><DetailCard enquiry={item} /></div>))
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    <div className="col-lg-10 enquiry_box m-auto ">
                                        {enquiryData && <MyEnquies enquiry={enquiryData} />}
                                    </div>
                                    <div className="col-lg-10 enquiry_box enquiry_sections mt-4 mx-auto">
                                        {enquiryData?.product?.images && <ProductImgSection images={enquiryData?.product?.images} alts={enquiryData?.product?.altTags} />}
                                        {enquiryData?.product && <ProductDescription product={enquiryData?.product} />}
                                    </div>
                                </>
                        }
                    </div>
                </div>}
                <SignInModel showModel={showModel} closeModel={closeModel} data={modelType} />
            </section>
        </>
    )
}

export default MyEnquiry