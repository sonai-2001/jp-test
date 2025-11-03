"use client";
import React from "react";
import EmblaCarousel from "../CustomCarousel";
import Image from "next/image";
import { Box, Button } from "@mui/material";

interface ClientsNameProps {
  heading?: string;
  button?: boolean;
  clientImages?: { image: string; imageAlt?: string }[];
}

// Put your images in the /public folder and reference them with a leading slash.
// Example: /public/logo1.png -> "/logo1.png"
// If they are in /public/brands, use "/brands/logo1.png"
// const STATIC_CLIENTS = [
//   { id: "logo-1", index: 1, brandImage: "/client1.jpeg" },
//   { id: "logo-2", index: 2, brandImage: "/client2.jpeg" },
//   { id: "logo-3", index: 3, brandImage: "/client3.jpeg" },
//   { id: "logo-4", index: 4, brandImage: "/client4.png" },
//   { id: "logo-5", index: 5, brandImage: "/client5.png" },
//   { id: "logo-6", index: 6, brandImage: "/client6.webp" },
//   // add more logos if you have them:
//   // { id: "logo-3", index: 3, brandImage: "/logo3.png" },
// ];

function ClientSection({
  heading = "Our Clients",
  button = false,
  clientImages,
}: ClientsNameProps) {
  // const clientList = STATIC_CLIENTS;

  const option = {
    items: 4,
    gap: 2.5,
    nav: true,
    dots: false,
    loop: true, // Enable loop for smooth autoplay
    autoplay: true, // Enable autoplay
    autoplayDelay: 2000, // 5 seconds delay between slides
    responsive: {
      0: {
        items: 1,
        dots: false,
        gap: 4.2,
        autoplay: true,
        nav: false,
      },
      480: {
        items: 2,
        gap: 3.2,
        dots: false,
        autoplay: true,
        nav: false,
      },
      767: {
        items: 3,
        gap: 2.4,
        autoplay: true,
        nav: false,
      },
      991: {
        items: 4,
        gap: 1.8,
        autoplay: true,
        nav: true,
      },
      1200: {
        items: 5,
        gap: 1.8,
        autoplay: true,
        nav: true,
      },
    },
  };

  return (
    <div className="hero_banner_title">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="title">
              <h2>{heading}</h2>
            </div>

            {clientImages?.length ? (
              <>
                <EmblaCarousel option={option} displayButtons={false}>
                  {clientImages
                    ?.filter((fItem: any) => {
                      return {
                        image: fItem?.image,
                        imageAlt: fItem?.imageAlt,
                      };
                    })
                    ?.map((item: any, i: number) => (
                      <div className="item" key={i}>
                        <div className="carouselCard">
                          <Image
                            src={item?.image}
                            alt={item?.imageAlt || ""}
                            width={1000}
                            height={100}
                            unoptimized
                          />
                        </div>
                      </div>
                    ))}
                </EmblaCarousel>

                {button ? (
                  <Box mt={3} textAlign="center">
                    <Button variant="contained" color="primary" size="medium">
                      VIEW ALL
                    </Button>
                  </Box>
                ) : null}
              </>
            ) : (
              <h3>No Data Found</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientSection;
