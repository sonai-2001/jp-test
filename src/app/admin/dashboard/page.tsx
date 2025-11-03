
import DashboardBody from '@/app/components/admin/Dashboard/DashboardBody'
import React from 'react'

async function Dashboard() {

    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 m-auto">
                            <div className="hero_banner_title py-0">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-8 m-auto">
                                            <div className="title">
                                                <h2>Dashboard</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DashboardBody />
                </div>
            </section >
        </>
    )
}

export default Dashboard