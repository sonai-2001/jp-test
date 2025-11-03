"use client"
import { ChangePasswordApi } from '@/app/services/User/User';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ChangePassword() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            const result = await ChangePasswordApi(`${localStorage.getItem("jid")}`, data.oldPassword, data.newPassword, data.confirmPassword);
            if (result) {
                reset({ confirmPassword: "", newPassword: "", oldPassword: "" });
            }
        } catch (error) {
            console.error("Error in POST /api/changePassword:", error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className='boxShadow_curve'>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                            <label htmlFor="oldPassword">Old Password</label>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                className="form-control"
                                {...register('oldPassword', { required: true })}
                                placeholder="Enter old password"
                            />
                            <span
                                className="position-absolute"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-3%)' }}
                            >
                                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.oldPassword && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="form-control"
                                {...register('newPassword', { required: true })}
                                placeholder="Enter new password"
                            />
                            <span
                                className="position-absolute"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-3%)' }}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.newPassword && <span className='text-danger'>This field is required</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                            <label htmlFor="confirmPassword">Confirm Password</label>
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
                    </div>
                    <div className="col-md-12">
                        <div className="viewAll_box mb-1">
                            <button type="submit" className="btn">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword;