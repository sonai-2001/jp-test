import React from 'react'
import UserProfileBody from '@/app/components/UserProfile/UserProfile'
import ChangePassword from '@/app/components/ChangePassword/ChangePassword'
import ManageEmailsBody from '@/app/components/admin/ManageEmailsBody/ManageEmailsBody'

function UserProfile() {
    return (
        <>
            <section>
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-12 m-auto">
                            <div className="hero_banner_title py-0">
                                <div className="container position-relative">
                                    <div className="row">
                                        <div className="col-lg-12 m-auto">
                                            <div className="title">
                                                <h2>Admin Profile</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto ">
                                            <UserProfileBody />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-12 m-auto">
                                            <div className="title">
                                                <h2 className='py-0 mb-0'>Manage Emails</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto ">
                                            <ManageEmailsBody />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-12 m-auto">
                                            <div className="title">
                                                <h2 className='py-0 mb-0'>Change Password</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto ">
                                            <ChangePassword />
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


export default UserProfile