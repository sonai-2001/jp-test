// src\app\(screens)\articles-page\page.tsx
import React from "react";
import Image from "next/image";
// import Blogs from "@/app/components/Blogs/Blogs";

function page() {
  return (
    <>
      <div className="hero_banner_title">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <div className="title">
                <h1>Blogs</h1>
                <p>
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                  sed stet lorem sit clita duo justo magna dolore erat amet
                </p>
              </div>
              <div className="video_section">
                <Image
                  src="/assets/img/market-minds-img.gif"
                  alt="image"
                  width={60}
                  height={60}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="letest_section">
        <div className="container">
          {/* <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Blogs />
                        </div>
                    </div> */}
        </div>
      </div>
    </>
  );
}

export default page;
