import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdRemoveRedEye } from "react-icons/md";
import Image from 'next/image';
import { setAddToCart } from '@/app/services/redux/features/addToCartSlice';
import { useDispatch } from 'react-redux';
function CartItem({ enquiry, update, addToCartData }: any) {
    const router = useRouter();
    const dispatch = useDispatch();
    const data = new Date(enquiry?.createdAt);
    const [quantity, setQuantity] = React.useState<any>(enquiry?.quantity || 1);

    const updatedata = (q: number) => {
        update((data: any) => {
            const product = data.filter((item: any) => item.index === enquiry?.index)
            // const productList = data.filter((item: any) => item.index !== enquiry?.index)
            const newProductList = data?.map((item: any) => {
                if (item.index === enquiry?.index) {
                    return { ...product[0], quantity: q }
                } else {
                    return item
                }
            })

            return newProductList
        })
    }

    const removeCart = () => {
        update((data: any) => {
            const product = data.filter((item: any) => item.index !== enquiry?.index)
            dispatch(setAddToCart(product))
            return product
        })
    }

    const addQuantity = () => {
        setQuantity(quantity + 1);
        updatedata(quantity + 1);
    }

    const removeQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            updatedata(quantity - 1);
        }
    }

    const getEnquiry = (id: string) => {
        router.push(`/${enquiry?.isCart ? "my-cart" : "my-enquiry"}/${id}`)

    }


    useEffect(() => {
        dispatch(setAddToCart([...addToCartData]))
        localStorage.setItem("addToCartData",JSON.stringify([...addToCartData]))
    }, [quantity])
// console.log(JSON.parse(localStorage.getItem("addToCartData")),"1111111111111addToCartData");


    return (
        <>
            <div className="enquiryCards">
                <div className="card-header">
                    <h2>{enquiry?.productName}</h2>
                    {
                        !enquiry?.isCart ? <span className={`status`}>{enquiry?.status}</span> : <span style={{ cursor: "pointer" }} className={`status`} onClick={() => removeCart()}>Remove</span>
                    }
                </div>

                {enquiry?.isCart ?
                    <div className="w-100 d-xl-flex">
                        <div className="w-50 card-content">
                            <Image src={enquiry?.productImage} height={150} width={300} alt={enquiry?.productName} />
                        </div>
                        <div className="w-50 card-content">
                            {!enquiry?.isCart && <div className="info">
                                <span className="label">Created At</span>
                                <span className="value">{data.toLocaleString()}</span>
                            </div>}
                            <div className="info">
                                <span className="label">Model</span>
                                <span className="value">{enquiry?.productModel?.modelName}</span>
                            </div>
                            <div className="info">
                                <span className="label">Quantity</span>
                                <span className="value d-flex gap-3 align-items-center">
                                    <button type="button" className="btn btn-secondary px-3" onClick={removeQuantity}>-</button>
                                    <span style={{ minWidth: '16px', display: 'inline-flex', justifyContent:'center' }}>
                                        {enquiry?.quantity}
                                    </span>
                                    <button type="button" className="btn btn-secondary px-3" onClick={addQuantity}>+</button>
                                </span>
                            </div>
                            {enquiry?.category && <div className="info">
                                <span className="label">Category</span>
                                <span className="value">{enquiry?.category?.categoryName ? enquiry?.category?.categoryName : enquiry?.category}</span>
                            </div>}
                            {enquiry?.product?.brand && <div className="info">
                                <span className="label">Brand</span>
                                <span className="value">{enquiry?.product?.brand}</span>
                            </div>}
                        </div>
                    </div>
                    :
                    <div className="card-content">

                        <div className="info">
                            <span className="label">Created At</span>
                            <span className="value">{data.toLocaleString()}</span>
                        </div>
                        <div className="info">
                            <span className="label">Model</span>
                            <span className="value">{enquiry?.productModel?.modelName}</span>
                        </div>
                        {enquiry?.category && <div className="info">
                            <span className="label">Category</span>
                            <span className="value">{enquiry?.category?.categoryName ? enquiry?.category?.categoryName : enquiry?.category}</span>
                        </div>}
                        {enquiry?.product?.brand && <div className="info">
                            <span className="label">Brand</span>
                            <span className="value">{enquiry?.product?.brand}</span>
                        </div>}
                    </div>

                }
                {!enquiry?.isCart && <div className="card-footer">
                    <button onClick={() => getEnquiry(enquiry?._id)} className="view-details">
                        View Details
                        <MdRemoveRedEye />
                    </button>
                </div>}
            </div >
        </>
    )
}

export default CartItem