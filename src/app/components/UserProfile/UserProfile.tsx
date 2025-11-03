"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { userUpdate, getOneUser } from '@/app/services/User/User';
import { setUser } from '@/app/services/redux/features/userSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import SignInModel from '../Signin/SignInModel';

function UserProfileBody() {
    const pathname = usePathname();
    const [modelType, setModelType] = useState<string>('');
    const [showModel, setShowModel] = useState<boolean>(false);
    const router = useRouter();
    const closeModel = () => {
        setShowModel(false)
    }
    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();
    const { userData } = useSelector((state: any) => state.user);
    const [image, setImage] = useState<any | null>(null);
    const dispatch = useDispatch();

    const fileInputRef: any = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    };


    const logOut = () => {
        localStorage.removeItem('jtoken');
        localStorage.removeItem('jid');
        localStorage.removeItem('type');
        localStorage.removeItem('image');
        localStorage.removeItem('email');
        dispatch(setUser(null));
        router.push('/');
    };


    const onSubmit = async (data: any) => {

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        if (image && data?.image[0]) {
            formData.append('image', data?.image[0]);
        }

        try {
            const response = await userUpdate(formData);


            if (response) {
                dispatch(setUser(response));
            }

            if (response?.image && response?.image != undefined && response?.image !== 'undefined') {
                localStorage.setItem("image", response?.image);
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }
    };

    const handleGetUser = async () => {
        try {
            const response = await getOneUser(`${localStorage.getItem("jid")}`);
            if (response) {
                dispatch(setUser(response));
                reset({ ...response, id: `${localStorage.getItem("jid")}` });
            }
            if (response?.image && response?.image != undefined && response?.image !== 'undefined') {
                localStorage.setItem("image", response?.image);
            }
        } catch (error) {
            logOut();
            console.error("Error in GET /api/productUser:", error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("jid")) {
            setModelType("SignIn");
            setShowModel(true);
        }
        if (localStorage.getItem("jid")) {
            handleGetUser();
        }
    }, [localStorage.getItem("jid")]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            setValue('image', event.target.files[0])
        }
    };

    const removeImage = () => {
        setImage(null);
        reset({ image: '' });
    };

    const sameAsAddress = watch('sameAsAddress');

    useEffect(() => {
        if (sameAsAddress) {
            setValue('deliveryAddress', watch('address'));
        } else {
            setValue('deliveryAddress', watch('deliveryAddress'));
        }
    }, [sameAsAddress, userData, setValue, watch]);




    return (

        <form onSubmit={handleSubmit(onSubmit)} className='boxShadow_curve'>
            <div className="form-group mb-3 d-flex align-items-end">
                {/* <label htmlFor='image'>Profile</label> */}
                <div className="userProfile_uploadBox">
                    {image ? (
                        <Image src={URL.createObjectURL(image)} alt="Profile" width={1000} height={1000} className="img-thumbnail" />
                    )
                        :
                        userData?.image ?
                            <Image src={userData?.image} alt="Profile" width={1000} height={1000} className="img-thumbnail" />
                            :
                            <FaUserCircle className="img-thumbnail" />
                    }

                    <button type="button" className="btn uploadBtn" onClick={handleClick}>
                        <FaUpload />
                        <input
                            type="file"
                            className="d-none"
                            {...register('image')}
                            onChange={handleImageChange}
                            accept="image/*"
                            ref={fileInputRef}
                        />
                    </button>
                </div>
                {image && <Button variant="danger" className="ms-3" onClick={removeImage}>
                    <FaTrash />
                </Button>}
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group mb-3">
                        <label htmlFor='name'>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register('name')}
                            placeholder="Enter name"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-3">
                        <label htmlFor='email'>Email address</label>
                        <input
                            type="email"
                            readOnly
                            className="form-control"
                            {...register('email', { required: true })}
                            placeholder="Enter email"
                        />
                        {errors.email && <span className='text-danger'>This field is required</span>}
                    </div>
                </div>

                {!pathname.includes("admin") && <div className="col-md-6">
                    <div className="form-group mb-3">
                        <label htmlFor='companyName'>Company Name</label>
                        <input
                            type="text"
                            className="form-control"
                            {...register('companyName')}
                            placeholder="Enter company name"
                        />
                    </div>
                </div>
                }
                <div className="col-md-6">
                    <div className="form-group mb-3">
                        <label htmlFor='mobile'>Mobile</label>
                        <input
                            type="number"
                            className="form-control"
                            {...register('mobile', {
                                required: false,
                                minLength: 10,
                                maxLength: 10
                            })}
                            placeholder="Enter Mobile"
                        />
                        {errors.mobile && <span className='text-danger'>Mobile number must be 10 digits</span>}
                    </div>
                </div>

                {!pathname.includes("admin") &&
                    <>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor='address'>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register('address')}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label htmlFor='gstNumber'>GST Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register('gstNumber')}
                                    placeholder="Enter GST Number"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    {...register('sameAsAddress')}
                                    id="sameAsAddress"
                                />
                                <label className="form-check-label" htmlFor="sameAsAddress">Delivery Address is the same</label>
                            </div>
                        </div>
                        {!sameAsAddress && <div className='col-md-6'>
                            <div className="form-group mb-3">
                                <label htmlFor='deliveryAddress'>Delivery Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register('deliveryAddress')}
                                    placeholder="Enter Delivery Address"
                                    readOnly={sameAsAddress}
                                />
                            </div>
                        </div>}
                    </>
                }


                <div className="col-md-12">
                    <div className="viewAll_box mb-1">
                        <button type="submit" className="btn">
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <SignInModel showModel={showModel} closeModel={closeModel} data={modelType} />
        </form>
    )
}

export default UserProfileBody;