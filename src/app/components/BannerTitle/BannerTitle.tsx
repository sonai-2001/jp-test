import React from "react";
import Image from "next/image";

function BannerTitle() {
  return (
    <div className="hero_banner_title">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            <div className="title">
              <h1>Growing Wealth, Made Simple </h1>
              <p>
                Take the first step toward smarter investing! Our quick risk
                assessment helps us understand your financial goals and risk
                tolerance. With this, our AI creates a personalized portfolio
                allocation tailored to your needs across various asset classes
              </p>
            </div>
            <div className="video_section">
              <Image
                src="/assets/img/home_page_video.gif"
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
  );
}

export default BannerTitle;
