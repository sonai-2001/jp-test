// src\app\admin\page.tsx
'use client'
import LoginBody from '@/app/components/admin/Login/Login'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jtoken");
        const type = localStorage.getItem("type");

        if (token && type === 'admin') {
            router.push("/admin/dashboard");
        }
    }, [router]);

    return (
        <>
            <section className="form_body password_recoverySec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 m-auto">
                            <div className='form_box'>
                                <div className="hero_banner_title py-0">
                                    <div className="title">
                                        <h2>Sign-In</h2>
                                    </div>
                                </div>
                                <LoginBody />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginPage;