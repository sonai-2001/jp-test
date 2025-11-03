'use client';
import { Box, Breadcrumbs, Typography, useMediaQuery, useTheme, Link } from "@mui/material";
import React from "react";
import NextLink from "next/link";


const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", sm: "350px", md: "400px" },
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/assets/img/shakehand.jpg")',
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
            // separator={<NavigateNextIcon fontSize="small" sx={{ color: "#fff", opacity: 0.7 }} />}
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
              {/* <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> */}
              Home
            </Link>
            <Typography color="#fff" sx={{ opacity: 0.9 }}>
              Contact Us
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box sx={{ maxWidth: "600px", zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h3" : isTablet ? "h2" : "h2"}
            component="h1"
            className="content"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component={'p'}
            sx={{
              opacity: 0.9,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              px: { xs: 1, sm: 0 },
            }}
          >
            We'd love to hear from you. Get in touch with us today.
          </Typography>
        </Box>
      </Box>
      {children}
    </div>
  );
};

export default LayoutWrapper;