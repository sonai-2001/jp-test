import React from "react";
import { Container, Typography, Box } from "@mui/material";

export const WhyChooseUs = ({ content }: { content: string }) => {
  // const reasons = [
  //   "Over 25 years of specialised expertise in CNC workholding solutions with unmatched industry knowledge.",
  //   "Officially authorised distributor of globally trusted and reputed CNC brands, ensuring authenticity and reliability. ",
  //   "An ever-expanding catalogue of high-quality products from varied brands carefully curated to address diverse operational requirements.",
  //   "Tailored hardware solutions designed and customised to fit the unique needs of various businesses – from small to large-scale. ",
  //   "Dedicated technical guidance paired with around-the-clock customer support, ensuring an expert is always by your side.",
  //   "Proven record of success and trust, with 100+ satisfied clients across multiple industries, including automotive, construction, and other sectors.",
  //   "Competitive and transparent pricing models for maximum value without compromising on performance or quality.",
  //   "Commitment to reliability, continuous innovation, and long-term partnerships that go beyond just supplying products.",
  // ];

  return (
    <Box component="section" sx={{ py: 8, bgcolor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2",
            mb: 6,
          }}
        >
          Why Choose Us
        </Typography>

        {/* <Box sx={{ maxWidth: "md", mx: "auto" }}>
          <List sx={{ py: 0 }}>
            {reasons.map((reason, index) => (
              <ListItem
                key={index}
                sx={{ alignItems: "flex-start", px: 0, py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2, mt: "10px" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "#1976d2",
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={reason}
                  sx={{
                    m: 0,
                    "& .MuiListItemText-primary": {
                      color: "#424242",
                      fontSize: "1rem",
                      lineHeight: 1.5,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box> */}
        <Container maxWidth="md">
          <Box
            className="ql-editor"
            sx={{
              color: "#424242",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: "0 auto", // ✅ centers the block
              textAlign: "left", // ✅ keeps bullet points aligned properly
              "& ul": { paddingLeft: "1.5rem", listStyleType: "disc" },
              "& ol": { paddingLeft: "1.5rem", listStyleType: "decimal" },
              "& li": { marginBottom: "0.5rem" },
            }}
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        </Container>
      </Container>
    </Box>
  );
};
