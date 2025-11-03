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
  MdHome,
  MdNavigateNext,
  MdGavel,
  MdInfo,
  MdAttachMoney,
  MdReceipt,
  MdPayment,
  MdCheckCircle,
  MdSwapHoriz,
  MdCancel,
  MdEmail,
} from "react-icons/md";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import SeoContentSection from "@/app/components/ContentDescription";

export default function TermsCondition() {
  const slug = StaticPageSlug.TermsCondition;

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
          height: { xs: 220, sm: 280, md: 320 },
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("/assets/img/terms_banner.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          mb: { xs: 4, md: 6 },
        }}
      >
        {/* Breadcrumbs */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Breadcrumbs
            separator={
              <Box
                component="span"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <MdNavigateNext
                  size={18}
                  color="#fff"
                  style={{ opacity: 0.7 }}
                />
              </Box>
            }
            aria-label="breadcrumb"
            sx={{
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              fontWeight: 500,
              fontSize: { xs: "0.9rem", md: "1.05rem" },
            }}
          >
            <Link
              component={NextLink}
              underline="hover"
              color="inherit"
              href="/"
              sx={{ display: "flex", alignItems: "center", color: "#fff" }}
            >
              <MdHome style={{ marginRight: 4, fontSize: 18 }} />
              Home
            </Link>
            <Typography color="#fff" sx={{ opacity: 0.9 }}>
              Terms & Conditions
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Terms & Conditions
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{
              opacity: 0.9,
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.25rem" },
              maxWidth: 900,
              mx: "auto",
            }}
          >
            Please read our terms and conditions carefully before using our
            website.
          </Typography>
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
                  <MdGavel size={32} />
                </Box>
                <Box>
                  <Typography variant="h4" component="h2" fontWeight={700}>
                    Terms & Conditions – Jaypee Associates
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    color="text.secondary"
                  >
                    Effective Date: 17-09-2025
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 2 }} />
            </Box>

            {/* 1. Use of Website */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdInfo size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  1. Use of Website
                </Typography>
              </Stack>
              <Typography variant="body1" component="p" color="text.secondary">
                All content on this website—including text, images, graphics,
                product information, and downloadable resources—is the
                intellectual property of Jaypee Associates (
                <a href="https://jaypeeassociates.co.in ">
                  https://jaypeeassociates.co.in{" "}
                </a>
                ). Unauthorised copying, reproduction, distribution, or misuse
                of any content is strictly prohibited. Access to this site is
                granted solely for informational and transactional purposes
                related to our products and services.
              </Typography>
            </Box>

            {/* 2. Pricing & Quotations */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdAttachMoney size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  2. Pricing & Quotations
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                mb={1}
              >
                All product prices listed are exclusive of GST and may vary
                depending on supplier pricing, product availability, and
                applicable discounts. Formal quotations are valid for 30
                calendar days and are issued based on the following parameters:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Selected model number" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Required quantity" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Applicable markups and discounts" />
                </ListItem>
              </List>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                mb={1}
              >
                Prices are subject to change without prior notice if the
                quotation validity period has expired.
              </Typography>
            </Box>

            {/* 3. GST Invoicing */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdReceipt size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  3. GST Invoicing
                </Typography>
              </Stack>
              <Typography variant="body1" component="p" color="text.secondary">
                Customers seeking a GST-compliant invoice must provide a valid
                GST number along with relevant business details either during
                checkout or before order confirmation. Orders without complete
                GST details will be processed with a standard invoice.
              </Typography>
            </Box>

            {/* 4. Payment Terms */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdPayment size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  4. Payment Terms
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                mb={1}
              >
                All payments must be made through our secure online payment
                channels only. Accepted payment types include:
              </Typography>
              <Typography
                variant="body2"
                component="p"
                color="text.secondary"
                mb={1}
              >
                Accepted payment types:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="UPI (via secure gateway)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Net Banking (via secure gateway)" />
                </ListItem>
              </List>
              <Typography
                variant="body2"
                component="p"
                color="text.secondary"
                mb={1}
              >
                All payments are directed to the beneficiary: Jaypee Associates.
                <br />
                Payment confirmation is processed automatically via our secure
                system.
              </Typography>
            </Box>

            {/* 5. Order Processing & Fulfilment */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdCheckCircle size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  5. Order Processing & Fulfilment
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                mb={1}
              >
                Orders are processed only after successful payment verification
                and validation of GST details (where applicable).
              </Typography>
              <Typography
                variant="body2"
                component="p"
                color="text.secondary"
                mb={1}
              >
                Customers will receive updates on their order status through:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Email notifications are sent to the registered email ID" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="The “My Enquiries” section on our website" />
                </ListItem>
              </List>

              <Typography
                variant="body2"
                component="p"
                color="text.secondary"
                mb={1}
              >
                Delivery timelines depend on product availability, location, and
                courier logistics.
              </Typography>
            </Box>

            {/* 6. Exchange / Replacement Policy */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdSwapHoriz size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  6. Exchange / Replacement Policy
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                mb={1}
              >
                We maintain a strict no-return policy.
                <br />
                However, exchanges or replacements may be approved if an
                incorrect product has been delivered compared to your confirmed
                Purchase Order or Invoice.
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Conditions for exchange approval: The request must be submitted within 24 hours of delivery." />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="Customers must email their request with clear photographic proof of the product and the corresponding GST invoice to: sales@jaypeeassociates.com/jp_ascal@yahoo.com" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <MdCheckCircle size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText primary="An official approval email must be received from one of the addresses above." />
                </ListItem>
              </List>

              <Typography
                variant="body2"
                component={"p"}
                color="text.secondary"
                mb={1}
              >
                Once approved, the replacement will be delivered within 15–30
                business days, subject to product availability. The customer
                must bear all shipping charges associated with exchanges or
                replacements.
              </Typography>
            </Box>

            {/* 7. Refund Policy */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdCancel size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  7. Refund Policy
                </Typography>
              </Stack>
              <Typography variant="body1" component="p" color="text.secondary">
                Jaypee Associates follows a no-refund, no-return policy once the
                product has been delivered. Customers are strongly advised to
                verify product specifications, model numbers, and suitability
                before placing their orders. Refunds will not be entertained
                under any circumstances.
              </Typography>
            </Box>

            {/* 8. Governing Law */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdGavel size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  8. Governing Law
                </Typography>
              </Stack>
              <Typography variant="body1" component="p" color="text.secondary">
                All transactions, agreements, and disputes are governed
                exclusively by the laws of India. By engaging with Jaypee
                Associates, you agree that the courts located in Kolkata, West
                Bengal, shall have sole and exclusive jurisdiction over any
                legal matters.
              </Typography>
            </Box>
            {/* contact us */}

            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdGavel size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  9. Contact Us
                </Typography>
              </Stack>
              <Typography variant="body1" component="p" color="text.secondary">
                For queries regarding these Terms & Conditions, please get in
                touch with us at:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MdEmail size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        Email:{" "}
                        <Link
                          href="mailto:sales@jaypeeassociates.com"
                          color="primary"
                          underline="hover"
                        >
                          sales@jaypeeassociates.com
                        </Link>
                        {" / "}
                        <Link
                          href="mailto:jp_ascal@yahoo.com"
                          color="primary"
                          underline="hover"
                        >
                          jp_ascal@yahoo.com
                        </Link>
                      </>
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <MdEmail size={20} color="#888" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        Phone:{" "}
                        <Link
                          href="tel:+919830422190"
                          color="primary"
                          underline="hover"
                        >
                          +91-9830422190
                        </Link>
                      </>
                    }
                  />
                </ListItem>
              </List>
              <Typography variant="body1" component="p" color="text.secondary">
                By using this website or making a purchase with Jaypee
                Associates, you acknowledge that you have read, understood, and
                agreed to these Terms & Conditions.
              </Typography>
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
