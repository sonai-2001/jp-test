'use client'
import React, { useEffect } from 'react'
import styles from './UserVerification.module.css'
import { useRouter } from 'next/navigation'


function UserVerification() {
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push('/')
        }, 2000);
    }, [])

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card text-center p-5 shadow-sm" style={{ width: '500px' }}>
                <div className="mb-4 d-flex justify-content-center align-items-center " >
                    <div className={`d-flex justify-content-center align-items-center ${styles.circle}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="230"
                            height="230"
                            fill="white"
                            className={`bi bi-check-circle ${styles.tickAnimation}`}
                            viewBox="0 0 16 16"
                        >
                            <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1" fill="green" />
                            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                </div>
                <h4 className="mb-3">Account Verified!</h4>
                <p>Your email has been successfully verified.</p>
            </div>
        </div>
    );
};

export default UserVerification;
