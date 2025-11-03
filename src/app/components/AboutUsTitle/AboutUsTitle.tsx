import React from 'react';
import Image from 'next/image';

function AboutUsTitle() {
    return (
        <div className='hero_banner_title pb-0'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 m-auto">
                        <div className="title">
                            <h2>About Us</h2>
                            <p>
                                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
                                Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                            </p>
                        </div>
                        <div className="video_section">
                            <Image
                                src="https://img1.wsimg.com/isteam/ip/9734b9b9-77b7-4d2d-a38e-76dfdded1cd1/Screenshot_20231115-102958_Google.jpg/:/rs=w:984,h:456"
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

export default AboutUsTitle