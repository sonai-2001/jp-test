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
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/pic3.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: "600px", zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h3" : isTablet ? "h2" : "h2"}
            component="h1"
            className="content"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, sm: 1 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
            }}
          >
            Industries
          </Typography>

          {/* Breadcrumbs positioned below heading */}
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              fontWeight: 500,
              fontSize: { xs: "0.9rem", md: "1.05rem" },
              justifyContent: "center",
              display: "flex",
              mt: 1,
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
              Industries
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      {children}
    </div>
  );
};

export default LayoutWrapper;