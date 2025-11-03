"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import { getIndustries } from "@/app/services/Industry/IndustryApi";
import { getProductsFilters } from "@/app/services/Product/ProductApi";

interface IIndustry {
  id: string;
  industry: string;
  slug: string;
  description?: string;
  industryImage?: string;
  hasProducts?: boolean;
}

interface FilterIndustry {
  _id?: string;
  industry?: string;
  slug?: string;
}

export default function SectionIndustries() {
  const [items, setItems] = useState<IIndustry[]>([]);
  console.log("🚀 ~ SectionIndustries ~ items:", items)
  const [loading, setLoading] = useState(true);
  // const router = useRouter();

  const loadData = async () => {
    setLoading(true);

    try {
      const [allIndsRaw, filters] = await Promise.all([getIndustries(), getProductsFilters()]);

      const allInds: IIndustry[] = (allIndsRaw || []).map((item: any) => ({
        id: (item?.id || item?._id || "").toString(),
        industry: item?.industry,
        slug: item?.slug,
        description: item?.description,
        industryImage: item?.industryImage,
        industryImageAlt: item?.industryImageAlt,
      }));

      const filterInds: FilterIndustry[] = filters?.industries || [];

      // Build lookup sets
      const idSet = new Set(
        filterInds.map((i) => (i?._id || "").toString().trim()).filter(Boolean)
      );
      const slugSet = new Set(
        filterInds.map((i) => (i?.slug || "").toString().trim().toLowerCase()).filter(Boolean)
      );

      // Merge and mark hasProducts
      const merged = allInds.map((ind) => {
        const hasById = idSet.has((ind.id || "").toString().trim());
        const hasBySlug = slugSet.has((ind.slug || "").toString().trim().toLowerCase());
        return { ...ind, hasProducts: hasById || hasBySlug };
      });

      setItems(merged);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // const handleViewProducts = (industry: IIndustry) => {
  //   if (industry.hasProducts && industry.slug) {
  //     router.push(`/industries/${industry.slug}`);
  //   }
  // };

  return (
    <Box
      component="section"
      className="section"
      aria-labelledby="industries-title"
    >
      <Container maxWidth="lg">
        <div className="sectionHeader">
          <Typography
            id="industries-title"
            variant="h4"
            component={"h2"}
            className="sectionTitle"
            sx={{ color: "#0E3A66" }}
          >
            Industries We Serve
          </Typography>
        </div>

        <div className="industriesGrid">
          {(loading ? Array.from({ length: 6 }) : items).map(
            (ind: any, i: number) => {
              const title = loading ? "Loading..." : ind.industry;
              const description = loading ? " " : ind.description || "";
              const imgSrc = loading ? "" : ind.industryImage;
              // const hasProducts = loading ? false : ind.hasProducts || false;
              const altTag = loading ? "" : ind.industryImageAlt || "";

              return (
                <div
                  key={loading ? i : ind.id || i}
                  className="industryCard"
                >
                  <div className="imgHolder">
                    {!loading && imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={altTag || `${title} image`}
                        width={56}
                        height={56}
                        className="industryImg"
                        unoptimized
                      />
                    ) : (
                      <div className="imgPlaceholder" />
                    )}
                  </div>

                  <div className="cardContent">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                      className="cardTitle"
                    >
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {description}
                    </Typography>
                  </div>
                  
                  {/* <Button
                    variant={hasProducts ? "contained" : "outlined"}
                    color="primary"
                    size="small"
                    onClick={() => handleViewProducts(ind)}
                    disabled={loading || !hasProducts}
                    className="cardButton"
                    sx={{
                      minHeight: '36px',
                      width: '100%',
                      maxWidth: '140px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      ...(hasProducts ? {
                        background: 'linear-gradient(135deg, #e46a25 0%, #ff7b36 100%)',
                        color: 'white',
                        border: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #d15a1f 0%, #e66b30 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 4px rgba(228, 106, 37, 0.3)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        }
                      } : {
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        backgroundColor: 'transparent',
                        cursor: 'not-allowed',
                        '&:hover': {
                          borderColor: '#d1d5db',
                          backgroundColor: 'transparent',
                        }
                      })
                    }}
                  >
                    {loading 
                      ? "Loading..." 
                      : hasProducts 
                        ? "View Products" 
                        : "No Products"
                    }
                  </Button> */}
                </div>
              );
            }
          )}

          {!loading && items.length === 0 && (
            <div className="industryCard emptyState">
              <div className="imgHolder">
                <div className="imgPlaceholder" />
              </div>
              <div className="emptyStateContent">
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  No industries found
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Please add industries in the admin panel.
                </Typography>
              </div>
              
              <Button
                variant="outlined"
                disabled
                size="small"
                sx={{
                  minHeight: '36px',
                  width: '100%',
                  maxWidth: '140px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Add Industry
              </Button>
            </div>
          )}
        </div>
      </Container>

      <style jsx>{`
        .section {
          padding: 48px 0;
          background: #ffffff;
          color: #111827;
        }
        
        .sectionHeader {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .sectionTitle {
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        
        .industriesGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        @media (min-width: 640px) {
          .industriesGrid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (min-width: 768px) {
          .industriesGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .industriesGrid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .industryCard {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 16px;
          min-height: 220px;
          background: #fff;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .industryCard:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .cardContent {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .cardTitle {
          line-height: 1.3;
          min-height: 2.6em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Remove right border from last column items */
        @media (min-width: 1024px) {
          .industryCard:nth-child(4n) {
            border-right: none;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .industryCard:nth-child(3n) {
            border-right: none;
          }
        }
        
        @media (min-width: 640px) and (max-width: 767px) {
          .industryCard:nth-child(2n) {
            border-right: none;
          }
        }
        
        @media (max-width: 639px) {
          .industryCard {
            border-right: none;
          }
        }
        
        /* Remove bottom border from last row items */
        .industryCard:last-child,
        .industryCard:nth-last-child(-n+4):nth-child(4n+1) ~ .industryCard {
          border-bottom: none;
        }
        
        @media (max-width: 1023px) {
          .industryCard:nth-last-child(-n+3):nth-child(3n+1) ~ .industryCard {
            border-bottom: none;
          }
        }
        
        @media (max-width: 767px) {
          .industryCard:nth-last-child(-n+2):nth-child(2n+1) ~ .industryCard {
            border-bottom: none;
          }
        }
        
        @media (max-width: 639px) {
          .industryCard:last-child {
            border-bottom: none;
          }
        }
        
        .imgHolder {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 64px;
          height: 64px;
          margin-bottom: 8px;
        }
        
        .industryImg {
          width: 56px;
          height: 56px;
          object-fit: contain;
          display: block;
        }
        
        .imgPlaceholder {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .imgPlaceholder::before {
          content: "";
          width: 24px;
          height: 24px;
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .emptyState {
          grid-column: 1 / -1;
          min-height: 220px;
          justify-content: center;
        }
        
        .emptyStateContent {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }
      `}</style>
    </Box>
  );
}