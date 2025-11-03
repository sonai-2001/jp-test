"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Visibility, Info } from "@mui/icons-material";
import { Box, IconButton, Typography, Skeleton } from "@mui/material";
import { getProductsFilter } from "@/app/services/Product/ProductApi";
import { useRouter } from "next/navigation";

// API Product shape
export interface Product {
  id: string;
  _id: string;
  ProductName: string;
  companyName: string;
  description: string;
  images: string[];
  model: string[];
  category: {
    categoryName: string;
    subcategoryName: string;
  };
  slug?: string;
}

interface ProductCarouselProps {
  ProductCategory: string; // category ID (Mongo) or category slug
  itemsPerView?: number;   // default 3 on desktop
  limit?: number;          // fetch count
  title?: string;
  product_id: string;      // current product id to exclude
}

const isObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val || "");

// layout constants
const GAP_PX = 20; // must match styles.track gap

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  ProductCategory,
  itemsPerView = 3, // desktop default
  limit = 1000,
  title = "Related Products",
  product_id,
}) => {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef<number>(0); // px to scroll per click (1 card + gap)

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const total = products.length;

  // Responsive itemsPerView: 1 on mobile (<600px), else prop value (default 3)
  const [perView, setPerView] = useState<number>(itemsPerView);
  useEffect(() => {
    const computePerView = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      setPerView(w < 600 ? 1 : itemsPerView);
    };
    computePerView();
    window.addEventListener("resize", computePerView);
    return () => window.removeEventListener("resize", computePerView);
  }, [itemsPerView]);

  // Fetch related products
  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        if (!ProductCategory) {
          if (!ignore) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        const key = isObjectId(ProductCategory) ? "category" : "slug";
        const qs = `?${key}=${encodeURIComponent(ProductCategory)}&page=1&limit=${limit}`;
        const data: any = await getProductsFilter(qs);

        const list: any[] = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        const filtered = list.filter((p: any) => p?._id !== product_id);

        const mapped: Product[] = filtered.map((p: any) => ({
          id: p._id,
          _id: p._id,
          ProductName: p.ProductName || p.title || "Product",
          companyName: p.brand || p.companyName || "",
          description: p.description || "",
          images: Array.isArray(p.images) ? p.images : [],
          model: Array.isArray(p.productModel) ? p.productModel.map((m: any) => m?.modelName).filter(Boolean) : [],
          category: {
            categoryName:
              typeof p.category === "string"
                ? p.category
                : p.category?.category || p.category?.categoryName || "",
            subcategoryName: p.category?.subcategoryName || "",
          },
          slug: p.slug,
        }));

        if (!ignore) setProducts(mapped);
      } catch (error) {
        console.error("Error fetching related products:", error);
        if (!ignore) setProducts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [ProductCategory, limit, product_id]);

  // Compute per-card scroll step in px (1 card + gap)
  const computeStep = () => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    if (!firstCard) return;

    const gapStr =
      getComputedStyle(track).columnGap ||
      (getComputedStyle(track) as any).gap ||
      `${GAP_PX}px`;
    const gap = parseFloat(gapStr) || GAP_PX;

    stepRef.current = firstCard.getBoundingClientRect().width + gap;
  };

  // Recompute step when products render or perView changes
  useEffect(() => {
    computeStep();
    const onResize = () => computeStep();
    window.addEventListener("resize", onResize);
    const t = setTimeout(computeStep, 0); // after layout
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [products, perView]);

  // Update nav states based on scroll position
  const updateNav = () => {
    const el = viewportRef.current;
    if (!el) return;
    const atStartNow = el.scrollLeft <= 1;
    const atEndNow = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setAtStart(atStartNow);
    setAtEnd(atEndNow);
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateNav();
    const onScroll = () => updateNav();
    el.addEventListener("scroll", onScroll, { passive: true });
    // also update after content/layout changes
    const t = setTimeout(() => updateNav(), 0);
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [products, perView]);

  const handlePrev = () => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: -stepRef.current, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: stepRef.current, behavior: "smooth" });
  };

  // Shimmer while loading (perView placeholders)
  if (loading) {
    return (
      <Box sx={styles.section}>
        <Typography variant="h3" sx={styles.title}>
          {title}
        </Typography>

        <Box sx={styles.wrapper}>
          <IconButton sx={styles.nav} disabled>
            <ChevronLeft sx={{ fontSize: "2rem", color: "#fff" }} />
          </IconButton>

          <Box sx={styles.viewport} ref={viewportRef}>
            <Box sx={styles.track} ref={trackRef}>
              {Array.from({ length: perView }).map((_, i) => (
                <Box key={`skeleton-${i}`} sx={{ ...styles.card, flexBasis: cardBasis(perView) }} data-card>
                  <Box sx={styles.cardContainer}>
                    <Box sx={styles.imageWrap}>
                      <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
                    </Box>
                    <Box sx={{ padding: "16px" }}>
                      <Skeleton variant="text" width="80%" height={24} animation="wave" />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <IconButton sx={styles.nav} disabled>
            <ChevronRight sx={{ fontSize: "2rem", color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>
    );
  }

  if (!total) return null;

  // Only show arrows if there's overflow beyond visible
  const showNav = products.length > perView;

  return (
    <Box sx={styles.section}>
      <Typography variant="h3" sx={styles.title}>
        {title}
      </Typography>

      <Box sx={styles.wrapper}>
        <IconButton sx={styles.nav} onClick={handlePrev} disabled={!showNav || atStart}>
          <ChevronLeft sx={{ fontSize: "2rem", color: "#fff" }} />
        </IconButton>

        <Box sx={styles.viewport} ref={viewportRef}>
          <Box sx={styles.track} ref={trackRef}>
            {products.map((product, idx) => {
              const image = (Array.isArray(product.images) && product.images[0]) || "/placeholder.svg";
              const titleText = product.ProductName || "Product";

              return (
                <Box
                  key={product._id || idx}
                  sx={{ ...styles.card, flexBasis: cardBasis(perView) }}
                  data-card
                >
                  <Box sx={styles.cardContainer}>
                    <Box sx={styles.imageWrap}>
                      <img
                        src={image}
                        alt={titleText}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "10px",
                        }}
                      />
                      <Box sx={styles.actions}>
                        <IconButton
                          sx={{ ...styles.actionBtn, ...styles.downloadBtn }}
                          onClick={() => console.log("Download clicked", product._id)}
                          title="Download"
                          size="small"
                        >
                          <Download fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ ...styles.actionBtn, ...styles.viewBtn }}
                          onClick={() => router.push(`/products/${product.slug || product._id}`)}
                          title="View"
                          size="small"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ ...styles.actionBtn, ...styles.infoBtn }}
                          onClick={() => router.push(`/products/${product.slug || product._id}`)}
                          title="Info"
                          size="small"
                        >
                          <Info fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={styles.cardTitle}>
                      {titleText}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <IconButton sx={styles.nav} onClick={handleNext} disabled={!showNav || atEnd}>
          <ChevronRight sx={{ fontSize: "2rem", color: "#fff" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

// helper: compute exact card basis so exactly N items fit across the viewport
const cardBasis = (visible: number) => `calc((100% - ${(visible - 1) * GAP_PX}px) / ${visible})`;

const styles = {
  section: {
    padding: "40px 0",
    width: "100%",
    position: "relative" as const,
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "40px",
    fontWeight: "bold",
    color: "#333",
    fontSize: { xs: "1.8rem", md: "2.5rem" },
  },
  wrapper: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "20px",
  },
  viewport: {
    overflowX: "auto" as const,
    overflowY: "hidden" as const,
    width: "100%",
    flex: 1,
    scrollBehavior: "smooth" as const,
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
    "&::-webkit-scrollbar": { display: "none" },
  },
  track: {
    display: "flex",
    gap: `${GAP_PX}px`,
    paddingBottom: "2px",
  },
  card: {
    flex: "0 0 auto",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)",
    },
  },
  imageWrap: {
    position: "relative" as const,
    overflow: "hidden",
    height: "200px",
    backgroundColor: "#f8f9fa",
  },
  actions: {
    position: "absolute" as const,
    top: "12px",
    right: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    transition: "opacity 0.3s ease",
  },
  actionBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    width: "32px",
    height: "32px",
    minWidth: "unset",
    "&:hover": {
      backgroundColor: "#fff",
      transform: "scale(1.1)",
    },
  },
  downloadBtn: {
    color: "#e53e3e",
    "&:hover": { backgroundColor: "#e53e3e", color: "#fff" },
  },
  viewBtn: {
    color: "#3182ce",
    "&:hover": { backgroundColor: "#3182ce", color: "#fff" },
  },
  infoBtn: {
    color: "#ed8936",
    "&:hover": { backgroundColor: "#ed8936", color: "#fff" },
  },
  cardTitle: {
    padding: "16px",
    textAlign: "center" as const,
    fontWeight: 500,
    fontSize: "1rem",
    color: "#2d3748",
    lineHeight: 1.3,
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nav: {
    backgroundColor: "#4a90e2",
    width: "50px",
    height: "50px",
    boxShadow: "0 4px 12px rgba(74, 144, 226, 0.4)",
    "&:hover": {
      backgroundColor: "#357abd",
      transform: "scale(1.05)",
    },
    "&:disabled": {
      backgroundColor: "#cbd5e0",
      boxShadow: "none",
    },
    "&:disabled .MuiSvgIcon-root": {
      color: "#a0aec0",
    },
  },
};

export default ProductCarousel;