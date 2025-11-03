// src\app\(screens)\password-recovery\page.tsx
"use client"
import React, { useEffect, useState } from 'react'
import PasswordRecoveryBody from '@/app/components/PasswordRecovery/PasswordRecoveryBody'
import { useSearchParams } from 'next/navigation'
import { StaticPageSlug } from '@/enums/static-pages-enum';
import SeoContentSection from '@/app/components/ContentDescription';

function PasswordRecovery() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const token = searchParams.get('token');
    const slug = StaticPageSlug.PasswordRecovery;
              
          const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
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
              
            }, []);
          

    return (
        <section className="form_body password_recoverySec">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 m-auto">
                        <div className='form_box'>
                            <div className="hero_banner_title py-0">
                                <div className="title">
                                    <h2>Password {id ? 'Reset' : 'Recovery'} </h2>
                                </div>
                            </div>
                            <PasswordRecoveryBody token={token ? token : ""} id={id ? id : ""} />
                        </div>
                    </div>
                </div>
            </div>
            {seo?.contentDescription && (
                                  <SeoContentSection contentDescription={seo?.contentDescription} />
                                )}
        </section>
    )
}

export default PasswordRecovery;