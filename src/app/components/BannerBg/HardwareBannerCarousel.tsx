import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react'; // Import EmblaOptionsType
import Autoplay from 'embla-carousel-autoplay';
import styles from './HardwareBannerCarousel.module.scss';
import banner1 from "../../../../public/assets/img/bannerImage.webp"
import banner2 from "../../../../public/assets/img/banner2.png"
import banner3 from "../../../../public/assets/img/banner3.png"

import type { StaticImageData } from 'next/image';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface SlideContent {
    id: number;
    heading: string;
    subheading: string;
    imageSrc: string | StaticImageData; // Path to the image in the public folder or imported image
    altText: string;  // Alt text for the image
}

const slideContents: SlideContent[] = [
    {
        id: 1,
        heading: 'Jaypee Associates – The CNC Work Holding Specialists, Building Trust for 25 Years.',
        subheading: 'Authorised dealer of CNC precision tools and expert guidance, helping manufacturers optimise their processes.',
        imageSrc: banner1.src,
        altText: 'CNC Work Holding and Tool Holding Products Banner',
    },
    {
        id: 2,
        heading: 'Accelerate Innovation and Efficiency with Tailored Work Holding Solutions based on your Needs',
        subheading: 'We are committed to providing you with premier hardware solutions and technical expertise.',
        imageSrc: banner2,
        altText: 'Innovative Tooling Solutions Banner',
    },
    {
        id: 3,
        heading: '',
        subheading: '',
        imageSrc: banner3,
        altText: 'Quality and Durability Guaranteed Banner',
    },
];

interface HardwareBannerCarouselProps {
    options?: any; // Use the imported EmblaOptionsType
}

const HardwareBannerCarousel: React.FC<HardwareBannerCarouselProps> = ({ options }) => {
    const autoplayOptions = {
        delay: 3000,
        stopOnInteraction: true, // Typically better UX to stop on interaction
        stopOnMouseEnter: false, // Set to true if you want to stop autoplay on mouse enter
    };

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: slideContents.length > 1,
            ...options,
        },
        [Autoplay(autoplayOptions)]
    );

    useEffect(() => {
        if (!emblaApi) return;

        // The Autoplay plugin's stopOnMouseEnter option handles this well.
        // This explicit useEffect for mouse enter/leave is often not needed
        // if stopOnMouseEnter is true.
        const autoplay = emblaApi.plugins().autoplay;
        if (!autoplay) return;

        const viewportNode = emblaApi.containerNode(); // Use containerNode instead of viewportNode

        const onMouseEnter = () => {
            // If stopOnMouseEnter is true, plugin handles this.
            // If false, and you want this behavior: autoplay.stop();
        };
        const onMouseLeave = () => {
            // If stopOnMouseEnter is true, plugin handles this.
            // If false, and you want this behavior: autoplay.play();
        };

        viewportNode.addEventListener('mouseenter', onMouseEnter);
        viewportNode.addEventListener('mouseleave', onMouseLeave);

        return () => {
            viewportNode.removeEventListener('mouseenter', onMouseEnter);
            viewportNode.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [emblaApi]);


    return (
        <div className={styles.embla}>
            <div className={styles.embla__viewport} ref={emblaRef}>
                <div className={styles.embla__container}>
                    {slideContents.map((slide) => (
                        <div className={styles.embla__slide} key={slide.id}>
                            <div className={styles.slideImageContainer}>
                                <img
                                    src={typeof slide.imageSrc === 'string' ? slide.imageSrc : slide.imageSrc.src}
                                    alt={slide.altText}
                                />
                            </div>
                            <div className={styles.embla__slide__content_overlay}></div> {/* Overlay for readability */}

                            <div className={styles.embla__slide__content}>
                                <div className="container">
                                    <h1 className={styles.slide__heading}>{slide.heading}</h1>
                                    <p className={styles.slide__subheading}>{slide.subheading}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {emblaApi && slideContents.length > 1 && (
                <>
                    <button
                        className={`${styles.embla__button} ${styles.embla__button_prev}`}
                        onClick={() => { emblaApi.scrollPrev(); emblaApi.plugins().autoplay?.reset(); }}
                    >
                        <IoIosArrowBack />
                    </button>
                    <button
                        className={`${styles.embla__button} ${styles.embla__button_next}`}
                        onClick={() => { emblaApi.scrollNext(); emblaApi.plugins().autoplay?.reset(); }}
                    >
                        <IoIosArrowForward />
                    </button>
                </>
            )}

        </div>
    );
};

export default HardwareBannerCarousel;