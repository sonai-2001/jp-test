"use client";

import * as React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { IHomePage } from "@/models/Home";

export default function SectionCompanyOverview({
  overview,
}: {
  overview: IHomePage["overview"];
}) {
  const router = useRouter();
  return (
    <Box
      component="section"
      className="co-root"
      aria-labelledby="company-overview-heading"
    >
      <Container maxWidth="lg">
        <div className="sectionHeader">
          <Typography
            id="company-overview-heading"
            variant="h4"
            component={"h2"}
            className="sectionTitle"
            sx={{ color: "#0E3A66" }}
          >
            Jaypee Associates: Company Overview
          </Typography>
        </div>

        <div className="co-content">
          {/* Media column */}
          <div className="co-media">
            <img
              className="co-main-img"
              src={overview.image1 || ""}
              alt={overview.image1Alt || overview.heading}
            />
            <img
              className="co-inset-img"
              src={overview.image2 || ""}
              alt={overview.image2Alt || overview.subheading}
            />
          </div>

          {/* Text column */}
          <div className="co-text">
            <div
              className="co-tagline"
              role="note"
              aria-label="Highlighted message"
            >
              <span className="co-tagline-bar" aria-hidden="true" />
              <Typography
                variant="h6"
                component="p"
                className="co-tagline-text"
              >
                {/* The go-to authorised supplier for manufacturers elevating their
                machining processes – trusted over decades. */}

                {overview.heading}
              </Typography>
            </div>

            <Box sx={{ color: "#424242", lineHeight: 1.6 }}>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{
                  __html: overview.subheading || "",
                }}
              />
            </Box>

            {/* <Typography
              variant="body1"
              component="p"
              className="co-description"
            >
              Founded in 2000 by Juzer Abbasbhai, Jaypee Associates has built a
              reputation as the CNC Work Holding Specialists, providing
              high-quality hardware and unparalleled expertise. We take pride in
              being the best consultants, guides, and partners, committed to
              your success. Our extensive CNC catalogue features over 500
              products from reputable brands, all designed to be reliable and
              user-friendly. Our highly tailored hardware solutions ensure your
              specific operational needs are met. Our mission is to accelerate
              innovation by matching you with the right tools, helping you build
              precision, infrastructure, and efficiency.<br></br>
              {overview.subheading}
              <br></br>
            </Typography> */}

            {/* <Typography
              marginTop={2}
              variant="body1"
              component="p"
              className="co-description"
            >
              With over 100 satisfied customers and a commitment to complete
              support, we deliver the technical excellence and quality you can
              trust.{" "}
            </Typography> */}

            <Box mt={2}>
              <Button
                onClick={() => {
                  router.push("/about-us");
                }}
                variant="contained"
                className="co-button"
                aria-label="ABOUT US"
              >
                ABOUT US
              </Button>
            </Box>
          </div>
        </div>
      </Container>

      <style jsx>{`
        /* Color system:
           1) Primary: #0E3A66
           2) Neutral: #FFFFFF
           3) Neutral (text): #334155
           4) Accent: #FFC857
           5) Accent (highlight bg): #EAF4FF
        */

        .co-root {
          background: #ffffff;
          padding: 48px 0;
        }

        .sectionHeader {
          text-align: center;
          margin-bottom: 36px;
        }

        .sectionTitle {
          position: relative;
          font-weight: 800;
          letter-spacing: 0.2px;
          padding-bottom: 16px;
          color: #0e3a66;
          display: inline-block;
        }

        .sectionTitle:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #0b3a6e 0%, #1b75bc 100%);
        }

        .co-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Left media */
        .co-media {
          position: relative;
          width: 100%;
        }

        .co-main-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .co-inset-img {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 160px;
          object-fit: cover;
          border-radius: 6px;
          border: 6px solid #ffffff;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
          background: #ffffff;
        }

        /* Right text */
        .co-text {
          color: #334155;
        }

        .co-tagline {
          background: #eaf4ff;
          border-radius: 8px;
          padding: 16px 16px 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .co-tagline-bar {
          display: inline-block;
          width: 6px;
          height: 100%;
          background: #ffc857;
          border-radius: 3px;
          flex: 0 0 6px;
        }

        .co-tagline-text {
          color: #2d5f8b;
          font-weight: 700;
          line-height: 1.5;
          margin: 0;
        }

        .co-description {
          line-height: 1.7;
          margin-top: 8px;
        }

        .co-button {
          text-transform: uppercase;
          background: #0e3a66 !important;
          color: #ffffff !important;
          padding: 10px 22px !important;
          border-radius: 8px !important;
          font-weight: 800 !important;
          letter-spacing: 0.6px !important;
          box-shadow: 0 4px 14px rgba(14, 58, 102, 0.25) !important;
        }

        .co-button:hover {
          background: #0c3359 !important;
          box-shadow: 0 6px 16px rgba(14, 58, 102, 0.35) !important;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .co-content {
            grid-template-columns: 1fr;
          }
          .co-inset-img {
            bottom: -18px;
          }
        }

        @media (max-width: 640px) {
          .co-root {
            padding: 24px 12px 48px;
          }
          .sectionTitle {
            font-size: 28px;
            line-height: 1.2;
          }
          .co-tagline {
            padding: 14px;
            gap: 10px;
          }
          .co-inset-img {
            width: 132px;
            height: 132px;
            bottom: -16px;
          }
        }
      `}</style>
    </Box>
  );
}
