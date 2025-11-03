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
  MdLocalShipping,
  MdInventory,
  MdSchedule,
  MdAttachMoney,
  MdLocationOn,
  MdWarning,
  MdEmail,
} from "react-icons/md";
import { StaticPageSlug } from "@/enums/static-pages-enum";
import SeoContentSection from "@/app/components/ContentDescription";

export default function ShippingPolicy() {
  const slug = StaticPageSlug.ShippingPolicy;

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
            Shipping Policy
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
              Shipping & Delivery
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
                  <MdLocalShipping size={32} />
                </Box>
                <Box>
                  <Typography variant="h4" component={"h2"} fontWeight={700}>
                    Shipping & Delivery Policy – Jaypee Associates
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
                By using our website (
                <a href="https://jaypeeassociates.co.in">
                  https://jaypeeassociates.co.in
                </a>
                ), you agree to the terms outlined in this Shipping & Delivery
                Policy. This policy explains how we process, ship, and deliver
                your orders, ensuring clarity and transparency at every stage.
              </Typography>
            </Box>

            {/* Shipping Process */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdLocalShipping size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  1. Shipping Process
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdLocalShipping size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="After payment confirmation and GST verification –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        If the product is in stock at our shop, it will be
                        packed and dispatched within 1-2 business days.
                      </li>
                      <li>
                        If the product needs to be sourced from the
                        manufacturer, additional lead time may be required
                        before dispatch.
                      </li>
                      <li>
                        Once the order is dispatched, a tracking ID will be sent
                        to your registered email address.
                      </li>
                    </Box>
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Stock Availability & Fulfilment Time */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdInventory size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  2. Stock Availability & Fulfilment Time
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdInventory size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="Delivery timelines depend on product availability –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        Stock available at our local warehouse/shop can be
                        dispatched quickly.
                      </li>
                      <li>
                        Items sourced from manufacturers/suppliers may require
                        extra procurement time.
                      </li>
                      <li>
                        Non-stocked items may take 5-20 working days for
                        fulfilment before dispatch.
                      </li>
                    </Box>
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Estimated Delivery Timeline */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdSchedule size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  3. Estimated Delivery Timeline (Post Dispatch)
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdSchedule size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="Delivery timelines vary depending on your location –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        <b>Kolkata & nearby regions:</b> 1-3 business days
                      </li>
                      <li>
                        <b>Eastern & metro cities (India):</b> 3-7 business days
                      </li>
                      <li>
                        <b>Other areas of India:</b> 5-12 business days
                      </li>
                    </Box>
                  </Box>
                </ListItem>
                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText
                      primary="Please note: These timelines apply only after the order has been dispatched from our warehouse."
                      primaryTypographyProps={{
                        fontStyle: "italic",
                        color: "text.secondary",
                      }}
                    />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Shipping Charges */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdAttachMoney size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  4. Shipping Charges
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdAttachMoney size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="Shipping fees are calculated based on –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>Product weight</li>
                      <li>Delivery pin code</li>
                      <li>Courier partner pricing</li>
                    </Box>
                  </Box>
                </ListItem>
                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="Shipping charges are transparently added to your final invoice before order confirmation." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Address Responsibility */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdLocationOn size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  5. Address Responsibility
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdLocationOn size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="Customers are responsible for providing a correct and complete shipping address during order placement. Jaypee Associates will not be held liable for delays, lost packages, or failed deliveries due to incorrect address entries." />
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Damage or Shortage */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdWarning size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  6. Damage or Shortage
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdWarning size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="If your package arrives damaged or if an item is missing –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>Please notify us within 24 hours of delivery.</li>
                      <li>
                        Provide clear photographs of the packaging and product
                        to validate your claim.
                      </li>
                      <li>
                        Claims submitted after this timeframe may not be
                        accepted.
                      </li>
                    </Box>
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* Contact Us */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box color="primary.main">
                  <MdEmail size={24} />
                </Box>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Contact Us
                </Typography>
              </Stack>
              <List dense>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon>
                    <MdEmail size={20} color="#888" />
                  </ListItemIcon>
                  <Box>
                    <ListItemText primary="For any questions about shipping, delivery timelines, or tracking assistance, please contact –" />
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
                      <li>
                        <b>Email:</b> sales@jaypeeassociates.com /
                        jp_ascal@yahoo.com
                      </li>
                      <li>
                        <b>Phone:</b> +91-9830422190
                      </li>
                    </Box>
                  </Box>
                </ListItem>
                <ListItem alignItems="flex-start" disableGutters>
                  <Box>
                    <ListItemText primary="We are committed to ensuring your orders reach you safely and on time." />
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
