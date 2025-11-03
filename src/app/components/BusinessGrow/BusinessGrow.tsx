import React from 'react'
import Image from 'next/image';

function BusinessGrow() {
    return (
        <div className="about_section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12 mt-3">
                        <div className="content pe-lg-3">
                            <h2>We Help Our Clients To Grow Their Business</h2>
                            <p className='text-dark '>
                                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                                sed stet lorem sit clita duo justo magna dolore erat amet Tempor
                                erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit.
                                Aliqu diam amet diam et eos labore. Diam dolor diam ipsum et tempor
                                sit. Aliqu diam amet diam et eos labore.
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12 mt-3">
                        <div className="about_img">
                            <Image
                                src="/assets/img/about_business_grow.png"
                                alt="image"
                                width={1000}
                                height={1000}
                                unoptimized

                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessGrow