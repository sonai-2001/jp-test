"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./EmblaCarousel.module.scss";
import { Container, Row } from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

const EmblaCarousel = ({
  children = [],
  option,
  displayButtons = true,
}: any) => {
  // Embla options to handle responsiveness
  const options: any = {
    loop: option?.loop !== undefined ? option.loop : false,
    slidesToScroll: 1, // Scroll one slide at a time
    dragFree: false, // Allows smooth drag interactions
    align: "start", // Ensures the first slide aligns perfectly
  };

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [childWidth, setChildWidth] = useState(() => 100);
  const slides = React.Children.toArray(children);
  const [itemGap, setItemGap] = useState(() => option?.gap);
  const [activeNav, setActiveNav] = useState(() => option?.nav || true);
  const [activeDots, setActiveDots] = useState<boolean>(
    () => option?.dots || false
  );
  const [autoplay, setAutoplay] = useState(() =>
    option?.autoplay !== undefined ? option.autoplay : false
  );
  const [autoplayDelay, setAutoplayDelay] = useState(
    () => option?.autoplayDelay || 3000
  );
  const [autoplayInterval, setAutoplayInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Function to handle the select event
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setIsPrevDisabled(!emblaApi.canScrollPrev());
    setIsNextDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  // Add the onSelect event listener and fetch scroll snaps
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    setScrollSnaps(emblaApi.scrollSnapList());

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle autoplay functionality
  useEffect(() => {
    if (!emblaApi || !autoplay) return;

    let autoplayId: NodeJS.Timeout | null = null;

    const autoplayNext = () => {
      if (!emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0); // Loop back to first slide if at the end
      } else {
        emblaApi.scrollNext();
      }
    };

    // Clear any existing interval first
    if (autoplayInterval) {
      clearTimeout(autoplayInterval);
      setAutoplayInterval(null);
    }

    // Start autoplay with the correct delay (in milliseconds)
    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setTimeout(() => {
        autoplayNext();
        startAutoplay(); // Schedule the next slide
      }, autoplayDelay);
      setAutoplayInterval(autoplayId);
    };

    // Stop autoplay
    const stopAutoplay = () => {
      if (autoplayId) {
        clearTimeout(autoplayId);
        autoplayId = null;
      }
    };

    // Pause on user interaction
    const handlePointerDown = () => {
      stopAutoplay();
    };

    // Resume after user interaction
    const handlePointerUp = () => {
      startAutoplay();
    };

    // Set up event listeners
    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    // Start autoplay
    startAutoplay();

    // Clean up
    return () => {
      stopAutoplay();
      if (emblaApi) {
        emblaApi.off("pointerDown", handlePointerDown);
        emblaApi.off("pointerUp", handlePointerUp);
      }
    };
  }, [emblaApi, autoplay, autoplayDelay]);

  useEffect(() => {
    if (option?.responsive) {
      const updateVisibleItems = () => {
        const breakpoints = Object.keys(option.responsive)
          .map(Number)
          .sort((a, b) => b - a);

        const matchedBreakpoint =
          breakpoints.find((breakpoint) => window.innerWidth >= breakpoint) ||
          0;

        const matchedItems = option?.responsive[matchedBreakpoint]?.items;
        const newGap =
          option?.responsive[matchedBreakpoint]?.gap || option?.gap;
        const nav = option?.responsive[matchedBreakpoint]?.nav;
        const dots = option?.responsive[matchedBreakpoint]?.dots;
        const newAutoplay = option?.responsive[matchedBreakpoint]?.autoplay;
        const newAutoplayDelay =
          option?.responsive[matchedBreakpoint]?.autoplayDelay;

        setActiveNav(() => (nav !== undefined ? nav : activeNav));
        setActiveDots(() => (dots !== undefined ? dots : activeDots));
        setItemGap(newGap);

        if (newAutoplay !== undefined) setAutoplay(newAutoplay);
        if (newAutoplayDelay !== undefined) setAutoplayDelay(newAutoplayDelay);

        const totalGapWidth = newGap * (matchedItems - 1);
        const availableWidth = 100 - totalGapWidth;
        const widthWithGap: any = availableWidth / matchedItems;
        setChildWidth(widthWithGap);
      };

      if (typeof window !== "undefined") {
        updateVisibleItems();
        window.addEventListener("resize", updateVisibleItems);
        return () => window.removeEventListener("resize", updateVisibleItems);
      }
    }
  }, [option?.responsive]);

  // Responsive visibility for dots and navigation
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <>
      <Container>
        <Row>
          <div className={styles.embla}>
            <div className={styles.embla__viewport} ref={emblaRef}>
              <div
                className={styles.embla__container}
                style={{ gap: `${itemGap}%` }}
              >
                {slides.map((slide: any, i: number) => (
                  <div
                    className={styles.embla__slide}
                    key={i}
                    style={{
                      minWidth: `${childWidth}%`,
                      maxWidth: `${childWidth}%`,
                    }}
                  >
                    <div className={styles.embla__slide__inner}>{slide}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Navigation Buttons */}
            {activeNav && (!isSmallScreen || !activeDots) && (
              <div className={styles.embla__buttons}>
                {displayButtons && (
                  <button
                    className={`${styles.leftBtn} ${
                      isPrevDisabled ? styles.embla__button__disabled : ""
                    }`}
                    onClick={() => emblaApi && emblaApi.scrollPrev()}
                    disabled={isPrevDisabled}
                  >
                    <MdArrowBackIosNew />
                  </button>
                )}

                {displayButtons && (
                  <button
                    className={`${styles.rightBtn} ${
                      isNextDisabled ? styles.embla__button__disabled : ""
                    }`}
                    onClick={() => emblaApi && emblaApi.scrollNext()}
                    disabled={isNextDisabled}
                  >
                    <MdArrowForwardIos />
                  </button>
                )}
              </div>
            )}
            {/* Dots */}
            {activeDots && (!isSmallScreen || !activeNav) && (
              <div className={styles.embla__dots}>
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.embla__dot} ${
                      i === selectedIndex ? styles.embla__dot__active : ""
                    }`}
                    onClick={() => emblaApi && emblaApi.scrollTo(i)}
                  ></button>
                ))}
              </div>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default EmblaCarousel;
