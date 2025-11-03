"use client"

import { Container, Grid, Box } from "@mui/material"

type WorkPhoto = { src: string; alt: string }

const BLUE = "#0E3A66"
const PHOTOS: WorkPhoto[] = [
  { src: "/work1.jpg", alt: "Industrial machinery closeup" },
  { src: "/work2.jpg", alt: "Metalworking process" },
  { src: "/work3.jpg", alt: "Precision fixture assembly" },
  { src: "/work4.jpg", alt: "Manufacturing line inspection" },
]

export default function SectionOurWork() {
  return (
    <Container component="section" maxWidth="lg" className="section" aria-labelledby="our-work-title">
     <div className="title" style={{ textAlign: "center" }}>
  <h2 style={{ fontWeight: 600 }}>Our Work</h2>
</div>


      {/* spacing reduced to match tighter gutters from the reference image */}
      <Grid container spacing={2}>
        {PHOTOS.map((p, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Box className="tile">
              {/* Using img keeps it simple and fast; swap with Next/Image if desired */}
              <img src={p.src || "/placeholder.svg"} alt={p.alt} className="photo" />
            </Box>
          </Grid>
        ))}
      </Grid>

      <style jsx>{`
        .section {
          background: #ffffff;
          padding: 48px 0 56px;
        }
        .title {
          color: ${BLUE};
          font-weight: 800;
          letter-spacing: 0.3px;
          margin-bottom: 18px;
        }
        .tile {
          position: relative;
          overflow: hidden;
          /* remove rounded corners and borders for exact look */
          border-radius: 0;
          border: none;
          background: transparent;
        }
        .photo {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          aspect-ratio: 16/9;
          transition: transform 200ms ease;
        }
        .tile:hover .photo {
          transform: scale(1.02);
        }
        @media (max-width: 599px) {
          .section {
            padding: 36px 0 44px;
          }
        }
      `}</style>
    </Container>
  )
}
