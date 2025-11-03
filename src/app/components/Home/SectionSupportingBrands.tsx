"use client";

import { Box, Container, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// type Bullet = { text: string }

// const bullets: Bullet[] = [
//   { text: "25 years of specialised CNC work holding expertise." },
//   { text: "Extensive catalogue of trustworthy, high-quality hardware." },
//   { text: "Custom solutions tailored to your unique manufacturing needs." },
//   { text: "Dedicated partners and guides, not just suppliers." },
//   { text: "Committed to accelerating your success with innovation." },
//   { text: "Delivering technical excellence and quality you can trust." },
// ]

export default function SectionSupportingBrands({
  solutions,
}: {
  solutions: string[];
}) {
  return (
    <Box
      component="section"
      className="section"
      aria-labelledby="supporting-brands-title"
    >
      <Container maxWidth="lg">
        <div className="sectionHeader">
          <Typography
            id="supporting-brands-title"
            variant="h4"
            component={"h2"}
            className="sectionTitle"
            sx={{ color: "#0E3A66" }}
          >
            Supporting Industries with Unbeatable Solutions{" "}
          </Typography>
        </div>

        <div className="bullets">
          {solutions.map((b, idx) => (
            <div className="bullet" key={idx}>
              <CheckCircleRoundedIcon color="primary" sx={{ mt: "2px" }} />
              <Typography variant="body1" component="p">
                {b}
              </Typography>
            </div>
          ))}
        </div>
      </Container>

      <style jsx>{`
        /* Colors: primary blue #0E3C6E, accent orange #E46A25, neutrals #ffffff, #111827, #E5E7EB */
        .section {
          padding: 48px 0;
          background: #ffffff;
          color: #111827;
        }
        .sectionHeader {
          text-align: center;
          margin-bottom: 24px;
        }
        .sectionTitle {
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .bullets {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px 24px;
        }
        @media (min-width: 768px) {
          .bullets {
            grid-template-columns: 1fr 1fr;
          }
        }
        .bullet {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
        }
      `}</style>
    </Box>
  );
}
