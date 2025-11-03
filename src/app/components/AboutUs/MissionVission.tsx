import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { GrTarget } from "react-icons/gr";

// Mission Vision Component
export const MissionVision = ({
  contentMission,
  imageMission,
  altTagMission,
  contentVision,
  imageVision,
  altTagVision,
}: {
  contentMission: string;
  imageMission: string;
  altTagMission: string;
  contentVision: string;
  imageVision: string;
  altTagVision: string;
}) => {
  return (
    <Box component="section" sx={{ py: 8, bgcolor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          {/* Our Mission */}
          <Grid container spacing={4} alignItems="flex-start">
            <Grid
              item
              xs={12}
              md={1}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#e3f2fd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 0.5, // Small adjustment to align with text
                }}
              >
                <GrTarget style={{ width: 32, height: 32, color: "#1976d2" }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#1976d2",
                  mb: 3,
                }}
              >
                Our Mission
              </Typography>
              <Box sx={{ color: "#424242", lineHeight: 1.6 }}>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: contentMission || "",
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  mt: 9.5, // This aligns the image with the start of the paragraph
                }}
              >
                <img
                  src={imageMission || ""}
                  alt={altTagMission || "Our Mission - Team Collaboration"}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box>
          {/* Our Vision */}
          <Grid container spacing={4} alignItems="flex-start">
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                order: { xs: 2, md: 1 },
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  mt: 9.5, // This aligns the image with the start of the paragraph
                }}
              >
                <img
                  src={imageVision || ""}
                  alt={altTagVision || "Our Vision"}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7} sx={{ order: { xs: 3, md: 2 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#1976d2",
                  mb: 3,
                }}
              >
                Our Vision
              </Typography>
              {/* <Typography
                variant="body1"
                sx={{mb:2, color: "#424242", lineHeight: 1.6 }}
              >
               At Jaypee Associates, we aim to be a leading force in transforming the future of manufacturing through precision, reliability, and innovation in CNC workholding and tooling solutions. We are also trusted suppliers of Swiss cut drills, endmills,  toolholders and Arris. 
              </Typography>
              <Typography
                variant="body1"
                sx={{mb:2, color: "#424242", lineHeight: 1.6 }}
              >
                We aspire to set new benchmarks in quality and service by continuously expanding our product range, adopting advanced technologies, and strengthening our role as a trusted partner for industries across India and beyond.
              </Typography>
              <Typography
                variant="body1"
                sx={{mb:2, color: "#424242", lineHeight: 1.6 }}
              >
              We envision a future where every manufacturer, regardless of scale, has access to the right tools, expert guidance, and customised solutions.
              </Typography>
              <Typography
                variant="body1"
                sx={{mb:2, color: "#424242", lineHeight: 1.6 }}
              >
               With a culture of trust, continuous learning, and technical excellence, we aim to shape the manufacturing ecosystem into one that thrives on efficiency and innovation. As a recognised supplier, we strive to be the enabler of progress, empowering businesses to create value and deliver quality.
              </Typography> */}

              <Box sx={{ color: "#424242", lineHeight: 1.6 }}>
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: contentVision || "",
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                order: { xs: 1, md: 3 },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#e3f2fd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 0.5, // Small adjustment to align with text
                }}
              >
                <FaEye style={{ width: 32, height: 32, color: "#1976d2" }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MissionVision;
