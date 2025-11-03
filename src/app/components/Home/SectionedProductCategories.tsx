"use client"

import { useEffect, useRef, useState } from "react"
import { Box, Button, Container, Typography } from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { useRouter } from "next/navigation"
import { getCategories } from "@/app/services/Category/CategoryApi"

type CategoryDoc = {
  _id: string
  category: string
  categoryImage?: string
  slug?: string
  description?: string
  categoryImageAlt?: string
}

export default function SectionProductCategories() {
  const [items, setItems] = useState<CategoryDoc[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getCategories()
        if (!mounted) return
        const arr = Array.isArray(data) ? data : []
        setItems(arr.slice(0, 5)) // only first 5
      } catch (e) {
        if (mounted) setItems([])
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const scrollByCards = (dir: "left" | "right") => {
    const track = trackRef.current
    if (!track) return
    const rail = track.parentElement as HTMLElement | null
    if (!rail) return
    const firstCard = track.querySelector<HTMLElement>(".cardWidthProbe") || undefined
    const cardWidth = firstCard ? firstCard.offsetWidth : 320
    const delta = (dir === "left" ? -1 : 1) * (cardWidth + 16) * 1.2
    rail.scrollBy({ left: delta, behavior: "smooth" })
  }

  const handleViewProducts = (cat: CategoryDoc) => {
    if (cat.slug) {
      router.push(`/categories/${cat.slug}`)
    } else {
      // Fallback if slug isn’t present
      router.push(`/categories?category=${encodeURIComponent(cat.category)}`)
    }
  }

  return (
    <Box component="section" className="section" aria-labelledby="categories-title">
      <Container maxWidth="lg">
        <div className="sectionHeader">
          <Typography id="categories-title" variant="h4" component={"h2"} className="sectionTitle" sx={{ color: "#0E3A66" }}>
            Our Comprehensive Product Catalogue
          </Typography>
          <Typography variant="body1" component={"p"} className="sectionSubtitle">
            As an authorised CNC tools seller, we offer a broad and meticulously curated catalogue of CNC workholding and toolholding products. Each category features a range of tools from reputable brands, specifically designed to meet the precise and demanding needs of modern manufacturing. Explore to find the essentials for your needs.
          </Typography>
        </div>

        <div className="sliderWrap">
          <button
            className={`sliderArrow sliderArrowLeft`}
            aria-label="Previous categories"
            onClick={() => scrollByCards("left")}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>

          <div className="sliderRail">
            <div className="sliderTrack" ref={trackRef}>
              {items.map((cat) => (
                <div className={`cardCat cardWidthProbe`} key={cat._id} role="group" aria-label={cat.category}>
                  <img
                    className="cardCatImg"
                    src={cat.categoryImage || "/placeholder.svg"}
                    alt={cat?.categoryImageAlt||cat.category}
                  />
                  <div className="cardCatFooter">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {cat.category}
                    </Typography>

                    {cat.description && (
                      <Typography variant="body2" className="cardCatDesc">
                        {cat.description}
                      </Typography>
                    )}

                    <div className="cardActions">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewProducts(cat)}
                      >
                        View Products
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`sliderArrow sliderArrowRight`}
            aria-label="Next categories"
            onClick={() => scrollByCards("right")}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>

        <Box mt={3} textAlign="center">
          <Button onClick={() => router.push("/categories")} variant="contained" color="primary" size="medium">
            VIEW ALL CATEGORIES
          </Button>
        </Box>
      </Container>

      <style jsx>{`
        /* Shared section styles */
        .section {
          padding: 48px 0;
          background: #ffffff;
          color: #111827;
        }
        .sectionHeader {
          text-align: center;
          margin-bottom: 20px;
        }
        .sectionTitle {
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .sectionSubtitle {
          max-width: 900px;
          margin: 8px auto 0;
          color: #4b5563;
        }

        /* Slider */
        .sliderWrap {
          position: relative;
          margin-top: 16px;
        }
        .sliderRail {
          overflow: hidden;
        }
        .sliderTrack {
          display: flex;
          gap: 16px;
          padding: 6px;
          scroll-behavior: smooth;
          will-change: transform;
        }
        .cardCat {
          min-width: 280px;
          max-width: 320px;
          flex: 0 0 80%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }
        @media (min-width: 520px) {
          .cardCat {
            flex-basis: 45%;
          }
        }
        @media (min-width: 900px) {
          .cardCat {
            flex-basis: 30%;
          }
        }
        .cardCatImg {
          width: 100%;
          height: 170px;
          object-fit: cover;
          display: block;
          background: #f3f4f6;
        }
        .cardCatFooter {
          background: #f7ead6; /* beige footer */
          padding: 12px 14px;
          display: grid;
          gap: 8px;
        }
        .cardCatDesc {
          color: #4b5563;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 40px; /* keeps height consistent even if short */
        }
        .cardActions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        /* Arrows */
        .sliderArrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          display: grid;
          place-items: center;
          color: #111827;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
        .sliderArrow:hover {
          background: #f9fafb;
        }
        .sliderArrow:focus-visible {
          outline: 2px solid #0e3c6e;
          outline-offset: 2px;
        }
        .sliderArrowLeft {
          left: -6px;
        }
        .sliderArrowRight {
          right: -6px;
        }
        @media (min-width: 1024px) {
          .sliderArrowLeft {
            left: -18px;
          }
          .sliderArrowRight {
            right: -18px;
          }
        }
      `}</style>
    </Box>
  )
}