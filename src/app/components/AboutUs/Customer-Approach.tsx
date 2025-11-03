import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import { ApproachItem } from "@/app/(screens)/about-us/AboutUsPage";

export const CustomerCentricApproach = ({
  approachData,
}: {
  approachData: ApproachItem[];
}) => {
  console.log("🚀 ~ CustomerCentricApproach ~ approachData:", approachData);
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
          Our Customer Centric Approach
        </Typography>

        <Grid container spacing={4}>
          {/* <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#fff3e0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <FaClock style={{ width: 32, height: 32, color: "#ff9800" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#ff9800",
                  mb: 2,
                }}
              >
                On-Time Delivery
              </Typography>
              <Typography variant="body1" sx={{ color: "#616161" }}>
              We understand that time is critical, and we are committed to ensuring the timely delivery of products
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#fff3e0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <FaDollarSign
                  style={{ width: 32, height: 32, color: "#ff9800" }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#ff9800",
                  mb: 2,
                }}
              >
               Reasonable Pricing
              </Typography>
              <Typography variant="body1" sx={{ color: "#616161" }}>
              Our pricing structure is designed to be competitive and transparent, offering a wide range of options to suit different budgets. 
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#fff3e0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <FaTools style={{ width: 32, height: 32, color: "#ff9800" }} />

              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#ff9800",
                  mb: 2,
                }}
              >
               Technical Guidance
              </Typography>
              <Typography variant="body1" sx={{ color: "#616161" }}>
              Get access to technical guidance via our brand partners for a hassle-free experience with the best-rated CNC machinery tools.
              </Typography>
            </Box>
          </Grid> */}

          {approachData.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
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
                      alt={item.altTag || item.heading}
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
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#ff9800",
                    mb: 2,
                  }}
                >
                  {item.heading}
                </Typography>

                {/* Subheading */}
                <Typography variant="body1" sx={{ color: "#616161" }}>
                  {item.subheading}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
