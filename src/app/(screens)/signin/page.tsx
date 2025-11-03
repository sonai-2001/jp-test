// src\app\(screens)\signin\page.tsx
import React from 'react'
// import SignInBody from '@/app/components/Signin/SignInBody'

function SignInUser() {
    return (
        <>
            <section className="form_body">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6  form_box m-auto">
                            <div className="hero_banner_title py-0">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-8 m-auto">
                                            <div className="title">
                                                <h2>Sign-In</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <SignInBody closeModel={()=>{}} changeData={"login"} /> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignInUser