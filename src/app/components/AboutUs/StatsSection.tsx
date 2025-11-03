"use client";

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";

const stats = [
  {
    number: "25+",
    label: "Years of Experience"
  },
  {
    number: "60+",
    label: "Products"
  },
  {
    number: "24",
    label: "Hours of Support"
  },
  {
    number: "100+",
    label: "Customers"
  }
];

export default function StatsSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            background: "linear-gradient(135deg, #9333ea 0%, #2563eb 50%, #06b6d4 100%)",
            p: { xs: 4, md: 8 },
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.1,
              pointerEvents: "none",
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: "absolute",
                top: 40,
                left: 40,
                width: 128,
                height: 128,
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 80,
                right: 80,
                width: 96,
                height: 96,
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: "25%",
                width: 64,
                height: 64,
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 80,
                right: "33%",
                width: 80,
                height: 80,
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
              }}
            />
          </Box>

          {/* Stats Grid */}
          <Box sx={{ position: "relative", zIndex: 10 }}>
            <Grid container spacing={{ xs: 4, md: 6 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Box sx={{ textAlign: "center", color: "white" }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                        fontWeight: "bold",
                        mb: { xs: 1, md: 2 },
                        lineHeight: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.875rem", md: "1rem", lg: "1.125rem" },
                        fontWeight: 500,
                        opacity: 0.9,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
