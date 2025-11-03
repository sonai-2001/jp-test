import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  styled,
  Tooltip,
} from "@mui/material";
import { MdArrowForward } from "react-icons/md";
import { ReadBlogButton } from "../Blogs/Blogs";

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

const BestsellerChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 15,
  right: 15,
  zIndex: 1,
  backgroundColor: theme.palette.error.main,
  color: "white",
  fontWeight: "bold",
  fontSize: "0.75rem",
}));

const StyledCardMedia = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 200,
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
}));

const ProductImage = styled(Box)({
  position: "relative",
  width: "80%",
  height: "80%",
});

interface Product {
  images?: string[];
  ProductName: string;
  bestseller?: boolean;
  category?: string | { category?: string; categoryName?: string };
  brand?: string | { brandName?: string };
  slug?: string;
  description?: string;
  altTags: string[];
}

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const MAX_NAME_LENGTH = 50;
  const defaultImage =
    "https://img1.wsimg.com/isteam/ip/9734b9b9-77b7-4d2d-a38e-76dfdded1cd1/t%20bolt.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1250,cg:true";

  const getCategoryName = () => {
    if (!product.category) return "";
    return typeof product.category === "object"
      ? product.category.category || product.category.categoryName || ""
      : product.category;
  };

  const getBrandName = () => {
    if (!product.brand) return "";
    return typeof product.brand === "object"
      ? product.brand.brandName || ""
      : product.brand;
  };
  const displayProductName = product.ProductName.length > MAX_NAME_LENGTH
  ? `${product.ProductName.slice(0, MAX_NAME_LENGTH)}...`
  : product.ProductName;

  return (
    <StyledCard elevation={2}>
      {product.bestseller && <BestsellerChip label="Bestseller" size="small" />}

      <StyledCardMedia>
        <ProductImage>
          <Image
            src={product?.images?.length ? product.images[0] : defaultImage}
            alt={product.altTags.length>0 ? product.altTags[0] : product.ProductName}
            fill
            style={{ 
              objectFit: "contain",  
            }}
            unoptimized
          />
        </ProductImage>
      </StyledCardMedia>

      <CardContent
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column",
          padding: 3,
        }}
      >
        {getCategoryName() && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: 500,
              mb: 1,
            }}
          >
            {getCategoryName()}
          </Typography>
        )}

<Tooltip title={product.ProductName} arrow>
          <Typography
            variant="h6"
            component="h4"
            sx={{
              fontWeight: 600,
              mb: 1,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': {
                textDecoration: 'underline',
                cursor: 'pointer',
              }
            }}
          >
            {displayProductName}
          </Typography>
        </Tooltip>


        {getBrandName() && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mb: 2, 
              fontStyle: "italic",
              minHeight: '1.5em',
            }}
          >
            {getBrandName()}
          </Typography>
        )}

        <Box sx={{ mt: "auto" }}>
          <Link href={`/products/${product.slug}`} passHref legacyBehavior>
            <ReadBlogButton
              variant="outlined"
              endIcon={<MdArrowForward />}
              fullWidth
              sx={{
                mt: 2,
              }}
            >
              View Product
            </ReadBlogButton>
          </Link>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProductItem;