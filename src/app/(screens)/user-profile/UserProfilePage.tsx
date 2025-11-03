'use client'
import React, { useEffect, useState } from 'react'
import UserProfileBody from '@/app/components/UserProfile/UserProfile'
import ChangePassword from '@/app/components/ChangePassword/ChangePassword'
import { StaticPageSlug } from '@/enums/static-pages-enum';
import SeoContentSection from '@/app/components/ContentDescription';

function UserProfile() {
    const slug = StaticPageSlug.UserProfile;
                  
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
        <>
            <div className="hero_banner_title pb-0 mb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="title">
                                <h2>User Profile</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className='hero_banner_title py-0 mb-0'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto ">
                            <UserProfileBody />
                        </div>
                    </div>
                </div>
            </section>
            <div className="hero_banner_title">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="title py-0 mb-0">
                                <h2 className='py-0 mb-0'>Change Password</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className='hero_banner_title pt-0'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <ChangePassword />
                        </div>
                    </div>
                </div>
            </section>

            {seo?.contentDescription && (
                            <SeoContentSection contentDescription={seo?.contentDescription} />
                          )}
        </>
    )
}


export default UserProfile