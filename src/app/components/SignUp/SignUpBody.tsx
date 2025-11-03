"use client";
import { setUser } from "@/app/services/redux/features/userSlice";
import { UserRegister } from "@/app/services/User/User";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import loader_img from "../../../../public/assets/img/loader_img.png";
import { getAuth } from "@/app/services/Auth/auth";
import GradientButton from "../buttons/GradientButton";

interface authType {
  type: string;
  email: string;
  action: string;
}

function SignUpBody({
  changeData,
  closeModel,
  intervalTime,
  setIntervalTime,
}: {
  changeData: any;
  closeModel: () => void;
  intervalTime: NodeJS.Timeout | null;
  setIntervalTime: (timer: NodeJS.Timeout) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");
  const dispatch = useDispatch();

  const [showAutoLogin, setShowAutoLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const handleGetUser = async () => {
    const body: authType = {
      email: `${localStorage.getItem("email")}`,
      action: "auth",
      type: "user",
    };
    try {
      const response = await getAuth(`${localStorage.getItem("jid")}`, body);

      if (response.data) {
        dispatch(setUser(response.data));
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("jtoken", response.token);
        localStorage.setItem("jid", response.data._id);
        if (intervalTime) {
          clearInterval(intervalTime);
        }
        closeModel();
      }
    } catch (error) {
      if (intervalTime) {
        clearInterval(intervalTime);
      }
      console.error("Error in GET /api/productUser:", error);
    }
  };

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const body = {
        type: "user",
        email: data.email,
        password: data.password,
        action: "register",
      };
      const response = await UserRegister(body);
      if (response) {
        setAuthMessage(response.message);
        localStorage.setItem("jtoken", response.token);
        localStorage.setItem("jid", response.data._id);
        localStorage.setItem("email", response.data.email);
        setShowAutoLogin(false);

        const newInterval = setInterval(() => {
          handleGetUser();
        }, 1000);
        setIntervalTime(newInterval);
      }
    } catch (error) {
      console.error("Error in POST /api/productUser:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalTime) {
        clearInterval(intervalTime);
      }
    };
  }, [intervalTime]);

  return (
    <div className="container">
      <div className="row">
        {showAutoLogin ? (
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
              <div className="form-group mb-3 position-relative">
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
              <div className="form-group mb-3 position-relative">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm Password"
                />
                <span
                  className="position-absolute"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    cursor: "pointer",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-3%)",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.confirmPassword && (
                  <span className="text-danger">
                    {errors.confirmPassword.message as string}
                  </span>
                )}
              </div>

              <div className="btn_box">
                <GradientButton type="submit" className="btn">
                  Sign-Up
                </GradientButton>
              </div>

              <div className="dontHaveAccount_box">
                Already have an account?
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #2b4a84 0%, #1a365d 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => changeData("SignIn")}
                >
                  Sign-in
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div className="col-md-12">
            <div className="text-center">
              <div
                className="text-center position-relative d-flex justify-content-center align-items-center"
                style={{ height: "150px" }}
              >
                <Spinner
                  animation="border"
                  role="status"
                  style={{ width: "100px", height: "100px" }}
                />
                <Image
                  src={loader_img}
                  className="position-absolute"
                  alt="loader_img"
                  width={80}
                  height={80}
                />
              </div>
              <h4>Please check your email for authorization.</h4>
              <p>{authMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUpBody;
