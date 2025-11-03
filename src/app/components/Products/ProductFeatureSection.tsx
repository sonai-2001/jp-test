"use client";

import type React from "react";
import { Receipt, Percent, CheckCircle } from "@mui/icons-material";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProductFeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Receipt style={{ fontSize: "2.5rem", color: "#666" }} />,
      title: "GST Input Credit",
      description: "Get GST invoice and save up to 18% on your purchases.",
    },
    // {
    //   icon: <Refresh style={{ fontSize: "2.5rem", color: "#666" }} />,
    //   title: "7-Day Return",
    //   description:
    //     "If you receive defective Product, return it within 7 Days and Get 100% refund.",
    // },
    {
      icon: <Percent style={{ fontSize: "2.5rem", color: "#666" }} />,
      title: "Lowest Prices",
      description: "We are offering Products at Lowest Prices in the Industry",
    },
    {
      icon: <CheckCircle style={{ fontSize: "2.5rem", color: "#666" }} />,
      title: "Highest Quality",
      description: "We strive to provide best quality product.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "0px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          width: "90%",
          maxWidth: "1200px",
          gap: "20px",
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "20px",
              backgroundColor: "white",

            }}
          >
            <div style={{ marginBottom: "15px" }}>{feature.icon}</div>
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#333",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                margin: "0",
                fontSize: "0.9rem",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesSection;

 