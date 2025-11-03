"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { getTeamMembers } from "@/app/services/Team/teamApi";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  image: string;
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const result = await getTeamMembers();
      setTeamMembers(result);
    } catch (error) {
      console.error("Error fetching team members", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No team members found.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
              fontWeight: "bold",
              color: "text.primary",
              mb: 2,
            }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: "32rem",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            Meet the minds who make this vision a reality
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {teamMembers.map((member) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              key={member._id}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  width: 380,
                  minHeight: 400,
                  mx: "auto",
                  transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.04)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                elevation={0}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={member.image}
                    alt={member.name}
                    sx={{
                      transition: "filter 0.4s cubic-bezier(.4,2,.6,1)",
                      "&:hover": {
                        filter: "grayscale(0%)",
                      },
                      width: "100%",
                      objectFit: "contain",
                      objectPosition: "top",
                      minHeight: 250,
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3, width: "100%" }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.primary",
                        fontWeight: "bold",
                        mb: 0.5,
                        letterSpacing: 0.5,
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      {member.name}
                      {/* Animated color line */}
                      <Box
                        component="span"
                        sx={{
                          display: "block",
                          height: 4,
                          borderRadius: 2,
                          background:
                            "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                          width: "40%",
                          mx: "auto",
                          mt: 1,
                          transition: "width 0.4s cubic-bezier(.4,2,.6,1)",
                          ".MuiCard-root:hover &": {
                            width: "80%",
                          },
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mt: 1.5,
                        fontWeight: 500,
                        minHeight: 48,
                      }}
                    >
                      {member.designation}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
