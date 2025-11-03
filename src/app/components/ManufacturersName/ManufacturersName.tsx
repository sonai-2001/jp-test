"use client"
import React, { useEffect, useState } from 'react'
import EmblaCarousel from '../CustomCarousel'
import Image from 'next/image'
import { getBrands } from '@/app/services/Brands/BrandApi';

function ManufacturersName() {

    const [getBrandList, setBrandList] = useState([])

    const getBrandsList = async () => {
        try {
            const data = await getBrands();
            setBrandList(
                data?.map((item: any, i: number) => ({
                    ...item,
                    index: i + 1,
                    id: item?._id,
                }))
            );
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };


    useEffect(() => {
        getBrandsList();
    }, []);
    
    const option = {
        items: 4,
        gap: 2.5,
        nav: true,
        dots: false,
        loop: true,         // Enable loop for smooth autoplay
        autoplay: true,     // Enable autoplay
        autoplayDelay: 2000, // 5 seconds delay between slides
        responsive: {
            0: {
                items: 1,
                dots: false,
                gap: 4.2,
                autoplay: true,
                nav: false,
            },
            480: {
                items: 2,
                gap: 3.2,
                dots: false,
                autoplay: true,
                nav: false,
            },
            767: {
                items: 3,
                gap: 2.4,
                autoplay: true,
                nav: false,
            },
            991: {
                items: 4,
                gap: 1.8,
                autoplay: true,
                nav: true,
            },
            1200: {
                items: 5,
                gap: 1.8,
                autoplay: true,
                nav: true,
            },
        }
    }

    return (
        <div className='hero_banner_title'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className='title'>
                            <h2>Machine tools accessories from manufacturers like</h2>
                        </div>
                        {getBrandList?.length ?
                            <EmblaCarousel option={option} displayButtons={false}>
                                {getBrandList?.filter((fItem:any)=>fItem?.brandImage)?.map((item: any, i: number) => {
                                    return (
                                        <div className="item" key={i}>
                                            <div className='carouselCard'>
                                                <Image
                                                    src={item?.brandImage}
                                                    alt="image"
                                                    width={1000}
                                                    height={100}
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </EmblaCarousel>
                            : <h3>No Data Found</h3>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManufacturersName