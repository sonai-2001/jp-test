'use client';
import { Box, Typography, useMediaQuery, useTheme, Breadcrumbs, Link } from "@mui/material";
import React from "react";
import NextLink from "next/link";

const AboutUsLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          height: { xs: "260px", sm: "320px", md: "380px" },
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/pic1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Breadcrumbs */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Breadcrumbs

            aria-label="breadcrumb"
            sx={{
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              fontWeight: 500,
              fontSize: { xs: "0.9rem", md: "1.05rem" },
            }}
          >
            <Link
              component={NextLink}
              underline="hover"
              color="inherit"
              href="/"
              sx={{ display: "flex", alignItems: "center", color: "#fff" }}
            >
          
              Home
            </Link>
            <Typography color="#fff" sx={{ opacity: 0.9 }}>
              About Us
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Main banner content */}
        <Box sx={{ maxWidth: "700px", zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h3" : isTablet ? "h2" : "h2"}
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            }}
          >
            About Us
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component='p'
            sx={{
              opacity: 0.9,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              px: { xs: 1, sm: 0 },
            }}
          >
            Learn more about our journey, our values, and what makes us the trusted partner for your business.
          </Typography>
        </Box>
      </Box>
      {children}
    </div>
  );
};

export default AboutUsLayout;