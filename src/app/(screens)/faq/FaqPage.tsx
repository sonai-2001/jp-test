'use client';
import React, { useEffect, useState } from 'react';
import FAQSection from '@/app/components/FAQSection/FAQSection';
import { getFAQs } from '@/app/services/Faq/FaqApi';
import { StaticPageSlug } from '@/enums/static-pages-enum';
import SeoContentSection from '@/app/components/ContentDescription';

function FaqPage() {
    const slug = StaticPageSlug.FAQ;
            
    const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
  const [faqList, setFaqList] = useState<any[]>([]);
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
        }
      };
    
    
      useEffect(() => {
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
        getFAQsList();
      }, []);
    return (
        <div className="hero_banner_title faq_section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 mx-auto">
                        <div className="title pb-1">
                            <h1>FAQ</h1>
                        </div>
                    </div>
                    <div className="col-lg-10 mx-auto">
                        {faqList?.length ? <FAQSection faqData={faqList} /> : <h4>No Data Found</h4> }
                    </div>
                </div>
            </div>
            {seo?.contentDescription && (
                <SeoContentSection contentDescription={seo?.contentDescription} />
              )}
        </div>
    )
}

export default FaqPage