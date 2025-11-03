"use client";

import { Box, Container } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Groups2Icon from "@mui/icons-material/Groups2";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function SectionStatsBanner({
  exp,
  products,
  customers,
}: {
  exp: number;
  products: number;
  customers: number;
}) {
  return (
    <Box
      component="section"
      className="statsBanner"
      role="region"
      aria-label="Company statistics"
    >
      <Container maxWidth="lg">
        <div
          className="statsRow"
          style={{ backgroundColor: "#0B3A6E", height: "130px" }}
        >
          <div className="statItem">
            <WorkspacePremiumIcon sx={{ color: "#fff" }} />
            <div style={{ color: "#fff" }}>
              <div className="statValue">{exp}+</div>
              <div className="statLabel">Years Experience</div>
            </div>
          </div>
          <div className="statItem">
            <Groups2Icon sx={{ color: "#fff" }} />
            <div style={{ color: "#fff" }}>
              <div className="statValue">{products}+</div>
              <div className="statLabel">Products</div>
            </div>
          </div>
          <div className="statItem">
            <Inventory2Icon sx={{ color: "#fff" }} />
            <div style={{ color: "#fff" }}>
              <div className="statValue">{customers}+</div>
              <div className="statLabel">Satisfied Customers</div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .statsBanner {
          background: #0e3c6e;
          color: #ffffff;
          padding: 28px 0;
          position: relative;
          overflow: hidden;
        }
        /* subtle angled accent */
        .statsBanner:before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.06) 0%,
            transparent 40%
          );
          pointer-events: none;
        }
        .statsRow {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px 48px;
        }
        .statItem {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
        }
        .statValue {
          font-weight: 800;
          font-size: 28px;
          line-height: 1;
        }
        .statLabel {
          opacity: 0.9;
          font-size: 14px;
        }
      `}</style>
    </Box>
  );
}
