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
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/pic4.jpg")',
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
        <Box sx={{ 
          maxWidth: "600px", 
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <Typography
            variant={isMobile ? "h3" : isTablet ? "h2" : "h2"}
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
              lineHeight: 1.2,
              textShadow: "0 2px 4px rgba(0,0,0,0.5)"
            }}
          >
            Brands
          </Typography>

          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              fontWeight: 500,
              fontSize: { xs: "0.9rem", md: "1.05rem" },
              '& .MuiBreadcrumbs-ol': {
                justifyContent: "center"
              },
              mt: 1.5,
              mb: 2
            }}
          >
            <Link
              component={NextLink}
              underline="hover"
              color="inherit"
              href="/"
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                color: "#fff",
                '&:hover': {
                  opacity: 0.8,
                  textDecoration: "none"
                }
              }}
            >
              Home
            </Link>
            <Typography color="#fff" sx={{ opacity: 0.9 }}>
              Brands
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      {children}
    </div>
  );
};

export default LayoutWrapper;