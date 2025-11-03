//src\app\(screens)\my-enquiry\[id]\page.tsx
"use client"
import { getConnectUsById } from '@/app/services/ConnectUs/ConnectUsApi';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function UserPage() {

    const params: any = useParams();
    const { id }: { id: string } = params;
    const [userData, setUserData] = useState<any>();
    const counter = useSelector((state: any) => state.counter?.value)


    const getUser = async () => {
        try {
            const data = await getConnectUsById(id);

            setUserData(data);
        } catch (error) {
            console.error("Error fetching enquiry:", error);
        }
    };

    useEffect(() => {
        getUser();
    }, [counter]);

    return (
        <>
            {/* <section className="enquiry_body"> */}
            <section>
                <div className="container">
                    <div className="row">
                        {/* <div className="col-lg-10 enquiry_box m-auto"> */}
                        <div className="col-lg-12 m-auto">
                            <div className="hero_banner_title py-0">
                                <div className="container position-relative">
                                    <div className="row">
                                        <div className="col-lg-8 m-auto">
                                            <div className="title">
                                                <h2>Connect Us Detail</h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 enquiry_box m-auto ">
                                        <div className="product_box">
                                            <div className="row ">
                                                {userData?.name && <div className='col-12'><p><b>Name:</b> {userData?.name}</p></div>}
                                                {userData?.email && <div className='col-12'><p><b>Email:</b> {userData?.email}</p></div>}
                                                {userData?.subject && <div className='col-12'><p><b>Subject:</b> {userData?.subject}</p></div>}
                                                {userData?.message && <div className='col-12'><p><b>Message:</b> {userData?.message}</p></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserPage