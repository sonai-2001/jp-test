'use client'
import Image from 'next/image'
import React, { useState } from 'react'

function ProductImgSection({ images , alts}: { images: String[], alts: string[] }) {
    const [selectedImage, setSelectedImage] = useState<any>(images[0]||[]);

    return (
        <div className="product_box">
            <div className="topBox">
                <Image
                    src={selectedImage}
                    height={1000}
                    width={1000}
                    alt={alts.length>0 ? alts[0] : "Product Image"}
                />
            </div>

            <div className='scollSlider'>
                <div className='bottomBox'>
                    { images && images?.map((img: any, index: any) => (
                        <div
                            key={index}
                            className={`imgBox  ${selectedImage == img ? "active":""}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <Image
                                src={img}
                                height={1000}
                                width={1000}
                                alt={alts.length>0 ? alts[index] : "Product Image"}
                                className="w-full h-16 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductImgSection