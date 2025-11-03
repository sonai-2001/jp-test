//src\app\(screens)\my-enquiry\[id]\page.tsx
"use client"
// import enquiesDataImg from '@/app/components/data/enquies';
import { getOneUser } from '@/app/services/User/User';
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
            const data = await getOneUser(id);

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
                                                <h2>User Detail</h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 enquiry_box m-auto ">
                                        <div className="product_box">
                                            <div className="row ">
                                                {userData?.name && <div className='col-md-6'><p><b>name:</b> {userData?.name}</p></div>}
                                                {userData?.email && <div className='col-md-6'><p><b>email:</b> {userData?.email}</p></div>}
                                                {userData?.password && <div className='col-md-6'><p><b>password:</b> {userData?.password}</p></div>}
                                                {userData?.image && <div className='col-md-6'><p><b>image:</b> {userData?.image}</p></div>}
                                                {userData?.companyName && <div className='col-md-6'><p><b>companyName:</b> {userData?.companyName}</p></div>}
                                                {userData?.mobile && <div className='col-md-6'><p><b>mobile:</b> {userData?.mobile}</p></div>}
                                                {userData?.address && <div className='col-md-6'><p><b>address:</b> {userData?.address}</p></div>}
                                                {userData?.gstNumber && <div className='col-md-6'><p><b>gstNumber:</b> {userData?.gstNumber}</p></div>}
                                                {userData?.type && <div className='col-md-6'><p><b>type:</b> {userData?.type}</p></div>}
                                                {/* {userData?.sameAsAddress && <div className='col-md-6'><p><b>sameAsAddress:</b> {userData?.sameAsAddress}</p>}</div> */}
                                                {(userData?.deliveryAddress) && <div className='col-md-6'><p><b>deliveryAddress:</b> {userData?.deliveryAddress}</p></div>}
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