"use client";
import {
  Box,
  Breadcrumbs,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { useParams } from "next/navigation";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { slug } = useParams();

  // Helper function to format slug to readable title
  const formatSlugToTitle = (slug: string) => {
    if (!slug) return "Category";

    // First decode the URL encoding (handles %20, %2C, etc.)
    const decoded = decodeURIComponent(slug);

    // Replace hyphens with spaces and capitalize each word
    return decoded
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  return (
    <div>
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", sm: "350px", md: "400px" },
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/pic1.jpg")',
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
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.75rem" },
            }}
          >
           {slug ? `${formatSlugToTitle(Array.isArray(slug) ? slug[0] : slug)} Products` : 'Listed Products'}
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
              mb: 2,
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
            <Link
              component={NextLink}
              underline="hover"
              color="inherit"
              href="/industries"
              sx={{ display: "flex", alignItems: "center", color: "#fff" }}
            >
              Industries
            </Link>
            {slug && (
              <Typography color="#fff" sx={{ opacity: 0.9 }}>
                {formatSlugToTitle(Array.isArray(slug) ? slug[0] : slug)}
              </Typography>
            )}

            {!slug && (
              <Typography color="#fff" sx={{ opacity: 0.9 }}>
                Listed Product
              </Typography>
            )}
          </Breadcrumbs>
        </Box>
      </Box>
      {children}
    </div>
  );
};

export default LayoutWrapper;
