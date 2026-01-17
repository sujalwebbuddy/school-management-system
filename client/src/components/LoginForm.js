import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { loginUser } from "../slices/userSlice";
import "./auth.css";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { errors: loginerror, isAuth, userInfo, loading } = useSelector((state) => state.user);
  const nav = useNavigate();

  useEffect(() => {
    if (isAuth && userInfo.role === "admin") nav("/dashboard");
    else if (isAuth && userInfo.role === "student") nav("/studentDashboard");
    else if (isAuth && userInfo.role === "teacher") nav("/teacherDashboard");
  }, [isAuth, nav, userInfo.role]);

  const onSubmitLogin = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <form className="sign-in-form">
      <div className="form-header">
        <h2 className="title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to continue to your account</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <div className={`input-field ${errors.organizationDomain ? "error" : ""}`}>
            <i className="fas fa-building" />
            <input
              name="organizationDomain"
              type="text"
              placeholder="Organization Domain"
              {...register("organizationDomain", { required: true })}
            />
          </div>
          {errors.organizationDomain?.type === "required" && (
            <span className="error-message">Organization Domain is required</span>
          )}
        </div>

        <div className="form-group">
          <div className={`input-field ${errors.email ? "error" : ""}`}>
            <i className="fas fa-user" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              {...register("email", { required: true })}
            />
          </div>
          {errors.email?.type === "required" && (
            <span className="error-message">Email is required</span>
          )}
        </div>

        <div className="form-group">
          <div className={`input-field ${errors.password ? "error" : ""}`}>
            <i className="fas fa-lock" />
            <input
              name="password"
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
          </div>
          {errors.password?.type === "required" && (
            <span className="error-message">Password is required</span>
          )}
        </div>

        {loginerror && (
          <div className="form-group">
            <span className="error-message" style={{ marginLeft: "0", fontSize: "0.85rem" }}>
              {loginerror}
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`btnauth btn-primary ${loading ? "loading" : ""}`}
        onClick={handleSubmit(onSubmitLogin)}
        disabled={loading}
      >
        {loading ? (
          <>
            <span>Signing In...</span>
            <i className="fas fa-spinner fa-spin" />
          </>
        ) : (
          <>
            <span>Sign In</span>
            <i className="fas fa-arrow-right" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;



