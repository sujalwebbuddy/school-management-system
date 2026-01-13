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
  const { errors: loginerror, isAuth, userInfo } = useSelector((state) => state.user);
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
      <h2 className="title" style={{ fontFamily: "poppins" }}>
        Sign in
      </h2>
      <div className="input-field">
        <i className="fas fa-building" />
        <input
          name="organizationDomain"
          type="text"
          placeholder="Organization Domain (e.g., springfield-high)"
          {...register("organizationDomain", { required: true })}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-user" />
        <input
          name="email"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock" />
        <input
          name="password"
          placeholder="Password"
          type="password"
          {...register("password", { required: true })}
        />
      </div>
      <p style={{ color: "red" }}>{loginerror && loginerror}</p>
      <input
        type="submit"
        value="Login"
        className="btnauth solid"
        onClick={handleSubmit(onSubmitLogin)}
      />
    </form>
  );
};

export default LoginForm;


