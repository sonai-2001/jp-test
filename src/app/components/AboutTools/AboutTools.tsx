"use client";
import React from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
  Grid,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  MdCheckCircle as CheckCircleIcon,
  MdPrecisionManufacturing as PrecisionIcon,
  MdBuild as BuildIcon,
} from "react-icons/md";

function MergedAbout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const brands = [
    "TOOLFAST",
    "ARRIS",
    "SWISS-CUT",
    "ACCU-FIX",
    "SRP",
    "MITEE-BITE",
    "SOGGO",
    "RAPTOR",
    "SAFEWAY",
    "GINS",
  ];

  const keyProducts = [
    "Soft Jaws",
    "T-Bolts",
    "T-Nuts",
    "Toggle Clamps",
    "Precision Grinding Vices",
    "Carbide Endmills",
    "Inserts",
    "ER-Collets Adaptors",
    "Hydro-Grip Adaptors",
    "EOT Crane Controls",
  ];

  return (
    <Box sx={{ bgcolor: "#f8f9fa", py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "stretch",
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
            overflow: "hidden",
            mb: 6,
          }}
        >
          {/* Left Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6, lg: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 700,
                mb: 4,
                color: "#222",
                lineHeight: 1.2,
              }}
            >
              Preparing for your success, we provide truly prominent{" "}
              <Box component="span" sx={{ color: "#4b5c4b" }}>
                Hardware Solutions
              </Box>
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleIcon style={{ color: "#4b5c4b", fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: "#555", fontWeight: 500 }}>
                  We always focus on technical excellence and quality
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleIcon style={{ color: "#4b5c4b", fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: "#555", fontWeight: 500 }}>
                  Wherever you're going, we bring ideas and precision tools
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleIcon style={{ color: "#4b5c4b", fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: "#555", fontWeight: 500 }}>
                  We're consultants, guides, and partners for manufacturers
                </Typography>
              </Stack>
            </Stack>

            {/* Signature Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                mt: 4,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "cursive",
                    color: "#4b5c4b",
                    mb: 1,
                  }}
                >
                  Juzer Abbasbhai
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                  Founder, Jaypee Associates
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  Call to ask any question
                </Typography>
                <Typography variant="h6" sx={{ color: "#4b5c4b", fontWeight: 600 }}>
                  (+91) 9830422190
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Content - Progress Bars */}
          <Box
            sx={{
              flex: { xs: 1, lg: 0.6 },
              p: { xs: 4, md: 6, lg: 8 },
              bgcolor: "#fafafa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#555",
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              Accelerate innovation with world-class hardware solutions. We'll match you
              to an entire range of incredible quality tools for all your CNC machining
              needs, building precision, infrastructure, and efficiency.
            </Typography>

            <Stack spacing={4}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Quality Hardware
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#4b5c4b" }}>
                    95%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={95}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#4b5c4b",
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#4b5c4b" }}>
                    98%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={98}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#4b5c4b",
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Technical Excellence
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#4b5c4b" }}>
                    92%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#4b5c4b",
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Second Section - Who We Are */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "stretch",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            },
          }}
        >
          {/* Left Images */}
          <Box
            sx={{
              flex: { xs: 1, lg: 0.7 },
              minWidth: { lg: 420 },
              position: "relative",
              minHeight: { xs: 300, lg: 440 },
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
              }}
            >
              {/* FIX: give the image container a real height via aspect-ratio */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: { xs: "4 / 3", sm: "16 / 9", lg: "4 / 3" },
                  minHeight: { xs: 260, sm: 320 }, // fallback for older browsers
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                <Image
                  src="/assets/img/about_us_img.jpg"
                  alt="Jaypee Associates Workshop"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 900px) 100vw, 40vw"
                  priority
                />
              </Box>

              {/* Decorative overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 80,
                  height: 80,
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)",
                  backgroundSize: "12px 12px",
                  borderRadius: "50%",
                  zIndex: 3,
                }}
              />
            </Box>
          </Box>

          {/* Right Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6, lg: 8 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "rgba(255,255,255,0.9)",
                letterSpacing: 2,
                fontWeight: 600,
                mb: 2,
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              WHO WE ARE
            </Typography>

            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "#ffffff",
                lineHeight: 1.2,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              Highly Tailored Hardware Design, Management & Support Services.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                lineHeight: 1.7,
                textShadow: "0 1px 5px rgba(0,0,0,0.2)",
              }}
            >
              Accelerate innovation with world-class tech teams. We'll match you to an
              entire remote team of incredible freelance talent for all your software
              development needs.
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    p: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255,255,255,0.25)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "#ffffff",
                      textShadow: "0 1px 5px rgba(0,0,0,0.2)",
                    }}
                  >
                    Our Mission
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.6,
                      textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  >
                    Founded in 2000, we've been supplying high-quality hardware to
                    businesses. We help manufacturers elevate their machining processes
                    with precision tools and expert guidance.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    p: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255,255,255,0.25)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "#ffffff",
                      textShadow: "0 1px 5px rgba(0,0,0,0.2)",
                    }}
                  >
                    Custom Solutions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.6,
                      textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  >
                    From CNC machine accessories to EOT crane controls, we provide
                    tailored solutions that fit your specific manufacturing requirements
                    and optimize your operations.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Products and Brands Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "#222",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PrecisionIcon style={{ marginRight: 8 }} />
                Our Key Products
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {keyProducts.map((product, index) => (
                  <Chip
                    key={index}
                    label={product}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#4b5c4b",
                      color: "#4b5c4b",
                      "&:hover": {
                        bgcolor: "#4b5c4b",
                        color: "white",
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "#222",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BuildIcon style={{ marginRight: 8 }} />
                Trusted Brands
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {brands.map((brand, index) => (
                  <Chip
                    key={index}
                    label={brand}
                    size="small"
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: "#222",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "#e0e0e0",
                      },
                    }}
                  />
                ))}
                <Chip
                  label="& MORE"
                  size="small"
                  sx={{
                    bgcolor: "#4b5c4b",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default MergedAbout;