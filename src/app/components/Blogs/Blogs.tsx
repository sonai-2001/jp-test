import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  styled,
} from "@mui/material";
import { MdArrowForward } from "react-icons/md";
import { BlogType } from "@/types/Blog";

// Styled components for custom styling
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

const NewsChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 15,
  right: 15,
  zIndex: 1,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  fontWeight: "bold",
  fontSize: "0.75rem",
}));

const StyledCardMedia = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  height: 250,
  overflow: "hidden",
}));

export const ReadBlogButton = styled(Button)(({ theme }) => ({
  marginTop: "auto",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  color: "#1f3a5f",
  borderColor: "#1f3a5f",
}));

const BlogContent = styled(Typography)(() => ({
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  lineHeight: 1.5,
}));

const Blogs: React.FC<BlogType> = ({ article }) => {
  const defaultImage = "https://via.placeholder.com/400x250?text=Blog+Image";

  const getExcerpt = () => {
    if (!article.body) return "No content available";

    // Strip HTML tags and get plain text
    const plainText = article.body.replace(/<[^>]*>/g, "");
    return plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;
  };

  return (
    <StyledCard elevation={2}>
      <NewsChip label="News" size="small" />

      <StyledCardMedia>
        <Image
          src={article?.thubnail_image || defaultImage}
          alt={article.title}
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </StyledCardMedia>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          component="h4"
          sx={{
            fontWeight: 600,
            mb: 2,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </Typography>

        <BlogContent variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getExcerpt()}
        </BlogContent>

        <Box sx={{ mt: "auto" }}>
          <Link href={article.url} passHref legacyBehavior>
            <ReadBlogButton
              variant="outlined"
              endIcon={<MdArrowForward />}
              fullWidth
            >
              Read in Blog
            </ReadBlogButton>
          </Link>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default Blogs;
