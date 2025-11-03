import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";

import { CoreValueItem } from "@/app/(screens)/about-us/AboutUsPage";

// Core Values Component
export const CoreValues = ({ coreValues }: { coreValues: CoreValueItem[] }) => {
  console.log("🚀 ~ CoreValues ~ coreValues:", coreValues);
  // const values = [
  //   {
  //     icon: FaUserShield,
  //     label: "Integrity First", // 🛡️ Strong ethics and honesty
  //   },
  //   {
  //     icon: BiHeart,
  //     label: "Customer Commitment", // ❤️ Dedication to customers
  //   },
  //   {
  //     icon: BiAward,
  //     label: "Best in Quality", // 🏆 Award for quality
  //   },
  //   {
  //     icon: FaHandshake,
  //     label: "Partnership & Trust", // 🤝 Trustworthy relationships
  //   },
  //   {
  //     icon: FaLightbulb,
  //     label: "Innovation Driven", // 💡 Innovation/ideas
  //   },
  // ];

  return (
    <Box component="section" sx={{ py: 8, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2",
            mb: 6,
          }}
        >
          Our Core Values
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Grid item xs={6} md={2.4} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "#e3f2fd",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <IconComponent
                      style={{ width: 32, height: 32, color: "#1976d2" }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#424242",
                    }}
                  >
                    {value.label}
                  </Typography>
                </Box>
              </Grid>
            );
          })} */}

          {coreValues?.map((item, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Box sx={{ textAlign: "center" }}>
                {/* Circle image container */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "#e3f2fd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    overflow: "hidden",
                  }}
                >
                  {item.image ? (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.altTag || item.heading}
                      sx={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    // fallback if no image
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "#90caf9",
                      }}
                    />
                  )}
                </Box>

                {/* Heading text */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#424242",
                  }}
                >
                  {item.heading}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
