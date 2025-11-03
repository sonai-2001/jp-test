//src\app\(screens)\my-enquiry\[id]\page.tsx
"use client"
import DetailCard from '@/app/(screens)/my-cart/detailCard';
import CartEnquiryQuotation from '@/app/components/admin/Enquiries/CartEnquiryQuotation';
import EnquiryQuotation from '@/app/components/admin/Enquiries/EnquiryQuotation';
import SendInvoiceDetails from '@/app/components/admin/Enquiries/invoicedetails/SendInvoiceDetails';
// import enquiesDataImg from '@/app/components/data/enquies';
import MyEnquies from '@/app/components/admin/Enquiries/MyEnquies';
import ProductDescription from '@/app/components/Products/ProductDescription';
import ProductImgSection from '@/app/components/Products/ProductImgSection';
import { getIdEnquiries } from '@/app/services/Enquiry/EnquiryApi';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function MyEnquiry() {

    const params: any = useParams();
    const { id }: { id: string } = params;
    const [enquiryData, setEnquiryData] = useState<any>();
    const counter = useSelector((state: any) => state.counter?.value)

    const getEnquiry = async () => {
        try {
            const data = await getIdEnquiries(id);

            setEnquiryData(data);
        } catch (error) {
            console.error("Error fetching enquiry:", error);
        }
    };

    useEffect(() => {
        getEnquiry();
    }, [counter]);


    return (
        <section>
            <div className="container">
                <div className="row ">
                    <div className="col-lg-12 m-auto">
                        <div className="hero_banner_title py-0">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-8 m-auto">
                                        <div className="title">
                                            <h2>Enquiry</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {enquiryData && <div className="col-lg-12 enquiry_sections product_box mt-4 mx-auto">
                            <MyEnquies enquiry={enquiryData} />
                        </div>
                        }

                        {
                           enquiryData && (enquiryData?.enquiry?.paymentSlip || enquiryData?.enquiry?.purchaseOrder) && <div className="col-lg-12 enquiry_sections mt-4 mx-auto">
                                <SendInvoiceDetails enquiryData={enquiryData}/>
                            </div>
                        }

                        {enquiryData && <div className="col-lg-12 enquiry_sections product_box mt-4 mx-auto">
                            {enquiryData?.enquiry?.isCart ?
                                <CartEnquiryQuotation enquiry={enquiryData} />
                                : <EnquiryQuotation enquiry={enquiryData} />}
                        </div>
                        }
                    </div>
                    <div className="col-lg-12 enquiry_sections mt-4 mx-auto">
                        {enquiryData && enquiryData?.enquiry?.isCart ?
                            enquiryData?.enquiry?.totalCart?.map(((item: any, index: number) => <div key={index}>
                                <DetailCard enquiry={item} />
                            </div>))
                            :
                            <>
                                {enquiryData && <ProductImgSection images={enquiryData?.product?.images} alts={enquiryData?.product?.altTags} />}
                                <ProductDescription product={enquiryData?.product} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyEnquiry