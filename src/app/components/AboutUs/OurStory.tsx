import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";

const OurStory = ({
  content,
  image,
  altTag,
}: {
  content: string;
  image: string;
  altTag: string;
}) => {
  return (
    <Box
      component="section"
      sx={{
        py: 8,
        bgcolor: "background.paper",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2",
            mb: 6,
            fontFamily: "inherit",
          }}
        >
          Our Story
        </Typography>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: "100%",
                height: "300px",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow:
                  "0 4px 8px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={image}
                alt={altTag || "Our Story"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ color: "#424242", lineHeight: 1.6 }}>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{
                  __html: content || "",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OurStory;
