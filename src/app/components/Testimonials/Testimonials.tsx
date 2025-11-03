"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Box, IconButton, Typography, SxProps, Theme } from "@mui/material";
import { ChevronLeft, ChevronRight, Star } from "@mui/icons-material";
import { getTestimonials } from "@/app/services/Testimonial/TestimonialApi";
import DOMPurify from "dompurify";


// Type definitions
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

interface TestimonialsSectionProps {
  title?: string;
  testimonials?: Testimonial[]; // optional: if provided, skip fetching
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

// TestimonialCard Component
export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const safeHtml = DOMPurify.sanitize(testimonial.content || "");

  return (
    <Box sx={styles.testimonialCard}>
      <Avatar sx={styles.avatar} src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name}>
        {testimonial.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </Avatar>

      <Box sx={styles.contentContainer}>
        <Typography variant="h3" sx={styles.company as SxProps<Theme>}>
          {testimonial.company}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={styles.content as SxProps<Theme>}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </Box>

      <Box sx={styles.footerContainer}>
        <Typography variant="body1" sx={styles.name as SxProps<Theme>}>
          {testimonial.name}
        </Typography>
        <Box sx={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              sx={{
                ...styles.star,
                ...(i < (testimonial.rating || 0) ? styles.filledStar : styles.emptyStar),
              } as SxProps<Theme>}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// TestimonialCarousel Component
export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextTestimonial = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevTestimonial = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const goToTestimonial = (index: number): void => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(nextTestimonial, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  if (!testimonials.length) return null;

  return (
    <Box sx={styles.carouselContainer}>
      {/* Navigation Arrows */}
      <IconButton sx={styles.navButtonLeft} onClick={prevTestimonial} disabled={testimonials.length <= 1}>
        <ChevronLeft />
      </IconButton>

      <IconButton sx={styles.navButtonRight} onClick={nextTestimonial} disabled={testimonials.length <= 1}>
        <ChevronRight />
      </IconButton>

      {/* Testimonial Container */}
      <Box sx={styles.carouselContent}>
        <Box
          sx={{
            ...styles.carouselTrack,
            transform: `translateX(-${currentIndex * 100}%)`,
          } as SxProps<Theme>}
        >
          {testimonials.map((testimonial) => (
            <Box key={testimonial.id} sx={styles.carouselSlide}>
              <TestimonialCard testimonial={testimonial} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <Box sx={styles.dotsContainer}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              sx={{
                ...styles.dot,
                ...(index === currentIndex ? styles.activeDot : {}),
              } as SxProps<Theme>}
              onClick={() => goToTestimonial(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// TestimonialsSection Component (dynamic fetch, no static defaults)
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = "Our Testimonials",
  testimonials, // if provided, skip fetching
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
}) => {
  const [data, setData] = useState<Testimonial[]>(testimonials || []);
  const [loading, setLoading] = useState<boolean>(!testimonials || testimonials.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTestimonials = async () => {
      if (testimonials && testimonials.length) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getTestimonials(); // fetch all (schema no longer has published)
        const mapped: Testimonial[] = (res || []).map((t: any) => ({
          id: t._id,
          name: t.name,
          company: t.company,
          content: t.content,
          avatar: t.avatar || "",
          rating: Math.max(1, Math.min(5, Number.isFinite(t.rating) ? t.rating : 5)),
        }));
        if (isMounted) setData(mapped);
      } catch (e) {
        if (isMounted) setError("Failed to load testimonials.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, [testimonials]);

  if (loading) {
    return (
      <Box className={className} sx={{ padding: "64px 16px", textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Loading testimonials...
        </Typography>
      </Box>
    );
  }

  if (error || !data.length) {
    return null;
  }

  return (
    <Box className={className} sx={styles.section as SxProps<Theme>}>
      <Box sx={styles.sectionContent}>
        <Typography variant="h2" component={'h2'} sx={styles.sectionTitle as SxProps<Theme>}>
          {title}
        </Typography>

        <TestimonialCarousel testimonials={data} autoPlay={autoPlay} autoPlayInterval={autoPlayInterval} />
      </Box>
    </Box>
  );
};

// CSS Styles
const styles = {
  section: {
    padding: "64px 16px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  sectionContent: {
    maxWidth: "896px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center" as const,
    color: "#2563eb",
    marginBottom: "48px",
    "@media (min-width: 600px)": {
      fontSize: "2.5rem",
    },
  },
  carouselContainer: {
    position: "relative" as const,
    width: "100%",
  },
  navButtonLeft: {
    position: "absolute" as const,
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(4px)",
    "&:disabled": {
      opacity: 0.5,
    },
  },
  navButtonRight: {
    position: "absolute" as const,
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(4px)",
    "&:disabled": {
      opacity: 0.5,
    },
  },
  carouselContent: {
    overflow: "hidden" as const,
  },
  carouselTrack: {
    display: "flex",
    transition: "transform 0.5s ease-in-out",
    width: "100%",
  },
  carouselSlide: {
    width: "100%",
    flexShrink: 0,
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "24px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  activeDot: {
    backgroundColor: "#2563eb",
  },
  testimonialCard: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    gap: "16px",
    padding: "0 32px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    backgroundColor: "#10b981",
    color: "white",
    fontSize: "1.125rem",
    fontWeight: "bold",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  company: {
    fontWeight: 600,
    fontSize: "1.125rem",
    color: "text.primary",
  },
  content: {
    color: "text.secondary",
    maxWidth: "672px",
    lineHeight: 1.625,
  },
  footerContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  name: {
    fontWeight: 500,
    color: "text.primary",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },
  star: {
    width: "16px",
    height: "16px",
  },
  filledStar: {
    fill: "#facc15",
    color: "#facc15",
  },
  emptyStar: {
    fill: "#e5e7eb",
    color: "#e5e7eb",
  },
};

export default TestimonialsSection;