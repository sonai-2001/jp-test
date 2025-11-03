"use client";
import { increment } from "@/app/services/redux/features/counterSlice";
import { setUser } from "@/app/services/redux/features/userSlice";
import { userLogin } from "@/app/services/User/User";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import GradientButton from "../buttons/GradientButton";

function SignInBody({
  changeData,
  closeModel,
}: {
  changeData: any;
  closeModel: () => void;
}) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    const body = {
      email: data.email,
      password: data.password,
      action: "login",
      type: "user",
    };
    try {
      const response = await userLogin(body);

      if (response) {
        localStorage.setItem("jtoken", response.token);
        localStorage.setItem("jid", response.data._id);
        localStorage.setItem("type", response.data.type);
        localStorage.setItem("image", response.data.image);
        dispatch(setUser(response.data));
        dispatch(increment());
        closeModel();
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
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                {...register("email", { required: true })}
                placeholder="Enter email"
              />
              {errors.email && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
            <div className="form-group mb-1 position-relative">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                {...register("password", { required: true })}
                placeholder="Password"
              />
              <span
                className="position-absolute"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-3%)",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
            <div className="forgotBtn_box">
              <Link
                href="/password-recovery"
                onClick={() => closeModel()}
                className="forgot"
                style={{
                  background:
                    "linear-gradient(135deg, #2b4a84 0%, #1a365d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* <Link href="/signup" className="forgot">Don't have an account?</Link> */}
            <div className="btn_box">
              <GradientButton type="submit" className="btn">
                Sign-In
              </GradientButton>
            </div>
            <div className="dontHaveAccount_box">
              Don't have an account?
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #2b4a84 0%, #1a365d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => changeData("SignUp")}
              >
                Sign-up
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInBody;
