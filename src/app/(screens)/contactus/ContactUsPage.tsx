'use client'
import React, { useEffect, useState } from "react";
import ContactUs from "@/app/components/ContactUs/ContactUs";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import SeoContentSection from "@/app/components/ContentDescription";

const ContactUsPage = () => {
    const slug = StaticPageSlug.ContactUs;
        
    const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
   useEffect(()=>{
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
   },[])
    return (
      <>
      
        <title>Jaypee Associates | Contact Us</title>
        <ContactUs />
         {seo?.contentDescription && (
                <SeoContentSection contentDescription={seo?.contentDescription} />
              )}

      </>
    );
  };
  
  export default ContactUsPage;