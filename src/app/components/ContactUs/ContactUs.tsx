"use client";
import React, { Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdLanguage,
  MdSend,
} from "react-icons/md";

import { useForm, Controller } from "react-hook-form";
import GradientButton from "../buttons/GradientButton";
import { createConnectUs } from "@/app/services/ConnectUs/ConnectUsApi";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactInfo {
  icon: React.ReactElement;
  label: string;
  value: string;
  href: string;
}

const ContactUs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const [submitSuccess, setSubmitSuccess] = React.useState<boolean>(false);

  const onSubmit = async (data: FormData): Promise<void> => {
    console.log("Form submitted:", data);
    try {
      const result = await createConnectUs(data);
      if (result) {
        setSubmitSuccess(true);
        reset();
        router.push("/contact-thankyou");
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: (
        <MdPhone style={{ color: "#1f3a5f", height: "20px", width: "20px" }} />
      ),
      label: "Phone",
      value: "(+91) 9830422190, 9831648378 , 9007220181",
      href: "tel:(+91) 9830422190",
    },
    {
      icon: (
        <MdEmail style={{ color: "#1f3a5f", height: "20px", width: "20px" }} />
      ),
      label: "Email",
      value: "jp_ascal@yahoo.com, sales@jaypeeassociates.com",
      href: "mailto:sales@jaypeeassociates.com",
    },
    {
      icon: (
        <MdLocationOn
          style={{ color: "#1f3a5f", height: "20px", width: "20px" }}
        />
      ),
      label: "Address",
      value:
        "Jaypee Associates, 3RD FLOOR, 31, Brabourne Rd, Murgighata, B.B.D. Bagh, Kolkata, West Bengal 700001",
      href: "https://maps.app.goo.gl/vi6k2z1kf6vxqhUz8",
    },
    {
      icon: (
        <MdLanguage
          style={{ color: "#1f3a5f", height: "20px", width: "20px" }}
        />
      ),
      label: "Website",
      value: "https://jaypeeassociates.co.in/",
      href: "https://jaypeeassociates.co.in/",
    },
  ];

  return (
    <Box>
      {/* Hero Section with Background Image */}

      {/* Main Content */}
      <Container
        sx={{
          pt: { xs: 4, sm: 5, md: 6 },
          px: { xs: 2, sm: 3, md: "auto" },
          maxWidth: { xs: "100%", sm: "lg", md: "lg" },
        }}
      >
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          {/* Contact Information - On mobile, this comes first */}
          <Grid item xs={12} md={5} order={{ xs: 1, md: 1 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                height: "fit-content",
                mb: { xs: 2, md: 0 },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h2"
                sx={{
                  mb: 1,
                  color: "#1f3a5f",
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
                }}
                className="content"
              >
                Get In Touch
              </Typography>

              <Typography
                variant="body1"
                component="p"
                sx={{
                  mb: 1,
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: { xs: 1.3, sm: 1.6 },
                }}
              >
                Ready to start your next project with us? Send us a message and
                we will get back to you as soon as possible!
              </Typography>

              <List>
                {contactInfo.map((item, index) => {
                  const isPhone = item.label.toLowerCase() === "phone";
                  const isEmail = item.label.toLowerCase() === "email";

                  // Split the value string by commas for phone/emails
                  const parts =
                    isPhone || isEmail
                      ? item.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];

                  return (
                    <ListItem
                      key={index}
                      sx={{
                        px: { xs: 1, sm: 0 },
                        py: { xs: 1, sm: 1.5 },
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                        },
                        borderRadius: 1,
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        cursor: "default", // no row-level click anymore
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: { xs: "auto", sm: 40 },
                          mb: { xs: 0.5, sm: 0 },
                          mr: { xs: 0, sm: 2 },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        secondary={
                          isPhone || isEmail ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              {parts.map((text, i) => {
                                const href = isEmail
                                  ? `mailto:${text}`
                                  : `tel:${text.replace(/[^\d+]/g, "")}`;
                                return (
                                  <React.Fragment
                                    key={`${item.label}-${text}-${i}`}
                                  >
                                    <Link
                                      href={href}
                                      underline="hover"
                                      color="inherit"
                                      sx={{ whiteSpace: "nowrap" }}
                                    >
                                      {text}
                                    </Link>
                                    {i < parts.length - 1 && (
                                      <span style={{ margin: "0 6px" }}>|</span>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </Box>
                          ) : (
                            <Link
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              color="inherit"
                              sx={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                              }}
                            >
                              {item.value}
                            </Link>
                          )
                        }
                        primaryTypographyProps={{
                          fontWeight: "medium",
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                        }}
                        secondaryTypographyProps={{
                          component: "div", // <- important change to avoid <div> inside <p>
                          fontSize: { xs: "0.8rem", sm: "0.85rem" },
                          sx: { mt: { xs: 0.5, sm: 0 } },
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7} order={{ xs: 2, md: 2 }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h2"
                sx={{
                  mb: 4,
                  color: "#1f3a5f",
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
                }}
              >
                Send a Message/ Enquire Now
              </Typography>

              {submitSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    fontSize: { xs: "0.85rem", sm: "0.875rem" },
                  }}
                >
                  Your message has been sent successfully! We'll get back to you
                  soon.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name/ Business Name"
                          variant="outlined"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email Address"
                          variant="outlined"
                          type="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^[\+]?[1-9][\d]{0,15}$/,
                          message: "Please enter a valid phone number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          variant="outlined"
                          type="tel"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="message"
                      control={control}
                      rules={{
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Your Message/ Enquiry details"
                          variant="outlined"
                          multiline
                          rows={isMobile ? 4 : 5}
                          error={!!errors.message}
                          helperText={errors.message?.message}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#1976d2",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <GradientButton
                      type="submit"
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      startIcon={<MdSend />}
                      fullWidth={isMobile}
                      color="error"
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1.1rem" },
                        fontWeight: "bold",
                        display: "flex",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Send Message
                    </GradientButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Container
        sx={{
          pt: { xs: 4, sm: 5, md: 6 },
          px: { xs: 2, sm: 3, md: "auto" },
          maxWidth: { xs: "100%", sm: "lg", md: "lg" },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
        }}
      >
        <Suspense fallback={<div>Loading Map...</div>}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58944.76800058511!2d88.2798339216797!3d22.577308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277d811c6a099%3A0x35c00f789f0c69da!2sJaypee%20Associates%20(The%20CNC%20Workholding%20Specialists)!5e0!3m2!1sen!2sin!4v1754384707525!5m2!1sen!2sin"
            width="100%"
            height={isMobile ? "300" : "400"}
            style={{ borderRadius: "8px", border: "1px solid #ccc" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Suspense>
      </Container>
    </Box>
  );
};

export default ContactUs;
