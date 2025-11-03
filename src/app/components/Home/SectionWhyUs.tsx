/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
// import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
// import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
// import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
// import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
// import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { IHomePage } from "@/models/Home";

/**
 * Rebuilt to match the provided screenshot exactly:
 * - Centered deep-blue title
 * - Two centered subtitle lines with a short underline
 * - 3x2 responsive grid of orange line icons with centered captions
 * - No cards, borders, or circular icon backgrounds
 * - All CSS colocated via styled-jsx, using only MUI components
 */

// type Why = {
//   icon: React.ReactNode;
//   label: string;
// };

const ORANGE = "#e46a25";
const BLUE = "#0E3A66";
const TEXT = "#334155";

// const items: Why[] = [
//   {
//     icon: <HandshakeOutlinedIcon sx={{ fontSize: 48 }} />,
//     label: "25 years of proven CNC work holding specialisation.",
//   },
//   {
//     icon: <ThumbUpAltOutlinedIcon sx={{ fontSize: 48 }} />,
//     label: "Reliable, high-quality hardware from a trusted catalogue.",
//   },
//   {
//     icon: <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 48 }} />,
//     label: "Customised solutions designed for your unique business needs.",
//   },
//   {
//     icon: <EmojiObjectsOutlinedIcon sx={{ fontSize: 48 }} />,
//     label: "Your dedicated partner and more than a hardware supplier.",
//   },
//   {
//     icon: <AccessTimeOutlinedIcon sx={{ fontSize: 48 }} />,
//     label: "Driving your success through innovation and technical excellence.",
//   },
//   {
//     icon: <DescriptionOutlinedIcon sx={{ fontSize: 48 }} />,
//     label: "Quality you can trust, backed by a commitment to service.",
//   },
// ];

export default function SectionWhyUs({
  whychoose,
}: {
  whychoose: IHomePage["whyJaypeeAssociates"];
}) {
  console.log("🚀 ~ SectionWhyUs ~ whychoose:", whychoose);
  return (
    <Box component="section" className="section" aria-labelledby="why-us-title">
      <Container maxWidth="lg">
        {/* Header */}
        <div className="header">
          <Typography
            id="why-us-title"
            paddingY={1}
            variant="h4"
            component="h2"
            className="title"
            sx={{ color: "#0E3A66" }}
          >
            Why Choose Jaypee Associates?
          </Typography>

          <Typography variant="body1" component={"p"} className="subtitle">
            When it comes to elevating your machining processes, choosing the
            right authorised dealer is critical. At Jaypee Associates, we offer
            more than just products; we deliver a partnership built on decades
            of expertise, quality, and a commitment to your success.
          </Typography>
          {/* <Typography variant="body1" className="subtitle">
            Technical teams having core engineering animation experience across multiple disciplines
          </Typography> */}

          <span className="underline" aria-hidden="true" />
        </div>

        {/* Grid */}
        <div className="grid">
          {/* {items.map((it, idx) => (
            <div key={idx} className="item">
              <div className="icon" aria-hidden="true">
                {it.icon}
              </div>
              <Typography variant="body2" className="label">
                {it.label}
              </Typography>
            </div>
          ))} */}

          {whychoose?.map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Box sx={{ textAlign: "center" }}>
                {/* Circular Image Wrapper */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#fff3e0",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.imageAlt || item.content}
                      style={{
                        width: "60%",
                        height: "60%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "60%",
                        height: "60%",
                        bgcolor: "#ccc",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>

                {/* Heading */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 300,
                    // color: "#ff9800",
                    mb: 2,
                  }}
                >
                  {item.content}
                </Typography>
              </Box>
            </Grid>
          ))}
        </div>
      </Container>

      <style jsx>{`
        .section {
          background: #ffffff;
          padding: 48px 0 56px;
          color: ${TEXT};
        }

        .header {
          text-align: center;
          margin-bottom: 28px;
        }

        .title {
          color: ${BLUE};
          font-weight: 800;
          letter-spacing: 0.2px;
          margin-bottom: 6px;
        }

        .subtitle {
          color: #475569;
          line-height: 1.5;
          margin: 0 auto;
          max-width: 880px;
        }

        .underline {
          display: inline-block;
          width: 80px;
          height: 2px;
          background: ${BLUE};
          margin-top: 10px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px 28px;
          justify-items: center;
          align-items: start;
          margin-top: 18px;
        }

        @media (min-width: 640px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        .item {
          text-align: center;
          max-width: 360px;
        }

        .icon :global(svg) {
          color: ${ORANGE};
          width: 56px;
          height: 56px;
        }

        .label {
          margin-top: 10px;
          color: ${TEXT};
          font-weight: 500;
          line-height: 1.5;
        }
      `}</style>
    </Box>
  );
}
