import React from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  MdCheckCircle as CheckCircleIcon,
  MdArrowForward,
} from "react-icons/md";
import { MdPhone as PhoneIcon } from "react-icons/md";
import Link from "next/link";
import { ReadBlogButton } from "../Blogs/Blogs";

function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 8 },
        bgcolor: "#fff",
        borderRadius: 3,
      }}
    >
      <Container >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.07)",

            minHeight: 400,
          }}
        >
          {/* Left: Images & Badge */}
          {!isMobile && (
            <Box
              sx={{
                flex: { xs: "none", md: "0 0 45%" },
                width: { xs: "100%", md: "45%" },
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "#f5f5f5",
                p: 0,
                minHeight: 350,
                borderRadius: 3,
              }}
            >
              {/* Top Image */}
              <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                <Image
                  src="/assets/img/about_us_img.jpg"
                  alt="About Jaypee Associates"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 600px) 100vw, 45vw"
                />
              </Box>

              {/* Years Badge */}
              {/* <Box
              sx={{
                position: "absolute",
                top: "0px",
                left: "-30px",
                transform: "translateY(-50%)",
                bgcolor: "#4b5c4b",
                color: "#fff",
                borderRadius: "50%",
                width: 110,
                height: 110,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 22,
                padding: "10px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                zIndex: 2,
                border: "6px solid #fff",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                24+
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 400, fontSize: 14 }}
              >
                Years Of <br /> Experience
              </Typography>
            </Box> */}
              {/* Feedback Bar */}
              {/* <Box
                sx={{
                  position: "absolute",
                  right: -30,
                  top: "30%",
                  bgcolor: "#fff",
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  writingMode: "vertical-rl",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "#4b5c4b",
                  fontSize: 16,
                  zIndex: 3,
                  display: { xs: "none", md: "block" },
                }}
              >
                24+ <br />
                <span style={{ fontWeight: 400, fontSize: 13 }}>
                  Years of Experience
                </span>
              </Box> */}
            </Box>
          )}

          {/* Right: Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#8b8b8b",
                mb: 1,
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              About
            </Typography>

            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#222",
                lineHeight: 1.2,
              }}
            >
              Jaypee Associates
            </Typography>
            {isMobile && (
              <Image
                src="/assets/img/about_us_img.jpg"
                alt="About Jaypee Associates"
                width={250}
                height={200}
                style={{
                  objectFit: "cover",
                  position: "static",
                  maxWidth: "100%",
                }}
                sizes="(max-width: 600px) 100vw, 45vw"
              />
            )}
            <Typography
              variant="body1"
              sx={{ color: "#555", mb: 3, lineHeight: 1.7, maxWidth: 500 }}
            >
              Founded in 2000 by Juzer Abbasbhai, JAYPEE ASSOCIATES has been
              supplying high-quality hardware to businesses and individuals ever
              since. We pride ourselves on our extensive knowledge of the
              industry and our commitment to customer satisfaction.
            </Typography>
            {/* Highlights */}
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon style={{ color: "#4b5c4b", fontSize: 22 }} />
                <Typography variant="body2" sx={{ color: "#222" }}>
                  25+ Years of Experience
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon style={{ color: "#4b5c4b", fontSize: 22 }} />
                <Typography variant="body2" sx={{ color: "#222" }}>
                  customer-centric approach
                </Typography>
              </Stack>
            </Stack>
            {/* Contact & CTA */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems="center"
            >
              <ReadBlogButton
                sx={{ py: 2 }}
                variant="outlined"
                endIcon={<MdArrowForward />}
                LinkComponent={Link}
                href="/contactus"
              >
                Contact us
              </ReadBlogButton>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PhoneIcon style={{ color: "#4b5c4b" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Need Any Help?
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    (+91) 9830422190
                  </Typography>
                </Box>
              </Stack>
              {/* <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  src="/assets/img/leslie.jpg"
                  alt="Leslie Alexander"
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Leslie Alexander
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    Co Founder
                  </Typography>
                </Box>
              </Stack> */}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Aboutus;
