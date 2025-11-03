"use client"
import { setUser } from '@/app/services/redux/features/userSlice';
import { userLogin } from '@/app/services/User/User';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

function LoginBody() {
    const dispatch = useDispatch();
    const route = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    
    const onSubmit = async (data: any) => {

        try {
            const response = await userLogin({ ...data, action: "login", type: "admin" });

            if (response) {
                localStorage.setItem('jtoken', response.token);
                localStorage.setItem("jid", response.data._id);
                localStorage.setItem("type", response.data.type);
                dispatch(setUser(response.data));
                route.push('/admin/dashboard')
            }
        } catch (error) {
            console.error("Error in POST /api/productUser:", error);
        }
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-group mb-3">
                            <label htmlFor='email'>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                {...register('email', { required: true })}
                                placeholder="Enter email"
                            />
                            {errors.email && <span className='text-danger'>This field is required</span>}
                        </div>
                        {/* <div className="form-group mb-3">
                            <label htmlFor='password'>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                {...register('password', { required: true })}
                                placeholder="Enter password"
                            />
                            {errors.password && <span className='text-danger'>This field is required</span>}
                        </div> */}
                        <div className="form-group mb-1 position-relative">
                            <label htmlFor="password">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                {...register('password', { required: true })}
                                placeholder="Password"
                            />
                            <span
                                className="position-absolute"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-3%)' }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.password && <span className='text-danger'>This field is required</span>}
                        </div>

                        <div className="btn_box mb-2">
                            <button type="submit" className="btn">Sign-In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginBody
