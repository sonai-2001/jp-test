"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { forgotPassword, resetPassword } from '@/app/services/User/User'; // Assuming these functions are defined in your services
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordRecoveryBody({ id, token }: any) {
    const router = useRouter();
    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = (data: any) => {
        if (id && token) {
            resetPasswordHandler(id, token, data.password, data.confirmPassword);
        } else {
            forgotPasswordHandler(data.email);
        }
    };

    const resetPasswordHandler = (id: string, token: string, newPassword: string, confirmPassword: string) => {
        resetPassword(id, token, newPassword, confirmPassword)
            .then(result => {
                router.push("/");
                reset({
                    password: "",
                    confirmPassword: ""
                })
            })
            .catch(error => {
                console.error("Error in resetPassword:", error);
            });
    };

    const forgotPasswordHandler = (email: string) => {
        forgotPassword(email)
            .then(result => {
                reset({ email: "" })
            })
            .catch(error => {
                console.error("Error in forgotPassword:", error);
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {
                            id ? (
                                <>
                                    <div className="form-group mb-3 position-relative">
                                        <label htmlFor='password'>New Password</label>
                                        <input
                                           type={showNewPassword ? "text" : "password"}
                                            className="form-control"
                                            {...register('password', { required: true })}
                                            placeholder="Enter new password"
                                        />
                                        <span
                                            className="position-absolute"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-3%)' }}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.password && <span className='text-danger'>This field is required</span>}
                                    </div>
                                    <div className="form-group mb-3 position-relative">
                                        <label htmlFor='confirmPassword'>Confirm Password</label>
                                        <input
                                           type={showConfirmPassword ? "text" : "password"}
                                            className="form-control"
                                            {...register('confirmPassword', { required: true })}
                                            placeholder="Confirm new password"
                                        />
                                        <span
                                            className="position-absolute"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-3%)' }}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.confirmPassword && <span className='text-danger'>This field is required</span>}
                                    </div>
                                </>
                            ) : (
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
                            )
                        }
                        <div className="btn_box mb-2">
                            <button type="submit" className="btn">{id ? 'Reset' : 'Recover'} Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PasswordRecoveryBody;
