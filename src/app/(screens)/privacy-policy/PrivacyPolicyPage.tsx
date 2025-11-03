"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NextLink from "next/link";
import {
  MdSecurity,
  MdInfo,
  MdLock,
  MdAssignmentInd,
  MdVerifiedUser,
  MdGroup,
  MdContactMail,
  MdGavel,
} from "react-icons/md";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import SeoContentSection from "@/app/components/ContentDescription";

export default function PrivacyPolicy() {
  const slug = StaticPageSlug.PrivacyPolicy;

  const [seo, setSeo] = useState<{ contentDescription?: string } | null>(null);
  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seo/${slug}`
        );
        const seoData = await res.json();
        setSeo(seoData);
      } catch (error) {
        setSeo(null);
      }
    };
    fetchSeo();
  }, []);
  return (
    <>
      {/* Hero Banner with Breadcrumbs */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 300, sm: 350, md: 400 },
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("./pic2.jpg")',
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
          mb: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: "600px", zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.2rem" },
            }}
          >
            Privacy Policy
          </Typography>

          {/* Breadcrumbs styled like LayoutWrapper */}
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              fontWeight: 500,
              fontSize: { xs: "0.9rem", md: "1.05rem" },
              justifyContent: "center",
              display: "flex",
              mt: { xs: 1, sm: 2 },
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

            <Typography color="#fff" sx={{ opacity: 0.9 }}>
              Privacy & Policy
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Main Content - Full Width */}
      <Container maxWidth={false} disableGutters sx={{ mb: 8, px: 0 }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 5, md: 8 },
            borderRadius: 0,
            bgcolor: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            width: "100%",
            maxWidth: "100vw",
            mx: "auto",
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdSecurity size={32} />
                </Box>
                <Box>
                  <Typography variant="h4" component={"h2"} fontWeight={700}>
                    Privacy Policy – Jaypee Associates
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    color="text.secondary"
                  >
                    Effective Date: September 17, 2025
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" component="p" color="text.secondary">
                At Jaypee Associates (
                <a href="https://jaypeeassociates.co.in">
                  https://jaypeeassociates.co.in
                </a>
                ), we value your trust and are committed to protecting your
                privacy. This Privacy Policy explains in detail how we collect,
                use, and safeguard your information when you interact with our
                website, request quotations, or place orders with us. We believe
                transparency is essential, and we aim to help you understand
                exactly what data we handle, why we hold it, and how we ensure
                it remains secure at all times.
              </Typography>
            </Box>

            {/* What We Collect */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdInfo size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  1. What We Collect
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="We only collect the data required to serve you effectively and ensure smooth operations. This information allows us to –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        Respond to your product enquiries quickly and accurately
                      </li>
                      <li>
                        Generate quotations, invoices, and purchase
                        confirmations
                      </li>
                      <li>
                        Process orders, deliveries, and after-sales support
                      </li>
                    </Box>
                  </Box>
                </ListItem>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="The typical information we may collect includes –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>Your name, phone number, and email address</li>
                      <li>
                        GST number and company details for business transactions
                      </li>
                      <li>
                        Billing and shipping addresses to ensure timely delivery
                      </li>
                      <li>
                        UPI ID or other details, if voluntarily provided, as
                        proof of manual payment
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="We only request information that is relevant and necessary to complete our services, and nothing more." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* What We Don't Collect */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdLock size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  2. What We Don't Collect
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="To protect your privacy, we avoid collecting sensitive or unnecessary information. Specifically, we do not –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>Collect or store credit or debit card numbers</li>
                      <li>
                        Store passwords, PINs, or one-time passwords (OTPs)
                      </li>
                      <li>
                        Retain any personal financial data beyond what is
                        voluntarily shared for manual payments
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="By keeping data collection to a minimum, we reduce risks and ensure your sensitive details remain entirely under your control." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Data Usage */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdAssignmentInd size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  3. Data Usage
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="The data we collect is used solely to improve your experience and support our services. Examples include –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        Managing orders and ensuring accurate order fulfilment
                      </li>
                      <li>
                        Verifying payments and providing receipts or
                        confirmations
                      </li>
                      <li>
                        Communicating with you for updates, clarifications, or
                        after-sales support
                      </li>

                      <li>
                        Ensuring legal compliance with taxation and invoicing
                        requirements
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="By keeping data collection to a minimum, we reduce risks and ensure your sensitive details remain entirely under your control." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Data Protection */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdVerifiedUser size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  4. Data Protection
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="We take your data protection very seriously and use industry-standard practices to safeguard your information –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        SSL encryption is implemented on our website to ensure
                        secure communication
                      </li>
                      <li>
                        No sensitive payment data is stored on our servers at
                        any stage
                      </li>
                      <li>
                        Manually submitted documents (such as proof of payment)
                        are deleted after verification to prevent unnecessary
                        storage
                      </li>

                      <li>
                        Access to your information is restricted to authorised
                        personnel only
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="These measures ensure that your data remains confidential and safe throughout every step of our interaction." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Third Parties */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdGroup size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  5. Third Parties
                </Typography>
              </Stack>

              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="We do not sell, rent, or trade your personal data. However, in some instances, we may share limited information to complete services or comply with the law –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        <b> Courier and logistics partners</b> to ensure your
                        products are delivered accurately and on time
                      </li>
                      <li>
                        <b>Government or tax authorities</b>, if legally
                        required for invoicing, auditing, or compliance purposes
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="Apart from these specific cases, your data will never be disclosed to third parties." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* your rights */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdGavel size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  6. Your Rights
                </Typography>
              </Stack>

              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="As our customer, you have the right to –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        <b>Request a copy of your data</b> that we hold about
                        you.
                      </li>
                      <li>
                        <b>Ask us to correct</b> any inaccurate or incomplete
                        personal information.
                      </li>
                      <li>
                        <b>Request deletion</b> of data that is no longer needed
                        for legal or operational purposes.
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="We are committed to respecting your rights and ensuring you have full control over your personal information." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* contact us */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdContactMail size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Contact Us
                </Typography>
              </Stack>

              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAssignmentInd size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="If you have any questions, concerns, or requests about this Privacy Policy or how your data is handled, please reach out to us:" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        <b>Email:</b> sales@jaypeeassociates.com /
                        jp_ascal@yahoo.com
                      </li>
                      <li>
                        <b>Phone:</b> (+91) 9830422190 | 9831648378 | 9007220181
                      </li>
                    </Box>
                  </Box>
                </ListItem>

                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="Your trust is our highest priority, and we remain committed to protecting your privacy and ensuring that your information is always safe with Jaypee Associates." />
                  </Box>
                </ListItem>
              </List>
            </Box>
          </Stack>
        </Paper>
      </Container>
      {seo?.contentDescription && (
        <SeoContentSection contentDescription={seo?.contentDescription} />
      )}
    </>
  );
}
