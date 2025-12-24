import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./auth.css";
import imageforsign from "../images/log.svg";
import imageforsign2 from "../images/register.svg";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Auth = () => {
  const { pathname } = useLocation();
  const [flag, setFlag] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    pathname === "/login" ? setFlag(false) : setFlag(true);
  }, [pathname]);

  return (
    <div className={flag ? "container1  sign-up-mode" : "container1"}>
      <div className="forms-container" style={{ width: "100%" }}>
        <div className="signin-signup">
          <LoginForm />
          <RegisterForm />
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3 style={{ fontFamily: "poppins" }}>New here ?</h3>
            <p style={{ fontFamily: "poppins" }}>Then Sign Up and Start!</p>
            <button
              className="btnauth transparent"
              id="sign-up-btn"
              onClick={()=>nav("/register")}
              style={{ fontFamily: "poppins" }}
            >
              Sign up
            </button>
          </div>
          <img src={imageforsign} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3 style={{ fontFamily: "poppins" }}>One of us ?</h3>
            <p style={{ fontFamily: "poppins" }}>
              Then Sign In and get Started!
            </p>
            <button
              className="btnauth transparent"
              id="sign-in-btn"
              onClick={()=>nav("/login")}
              style={{ fontFamily: "poppins" }}
            >
              Sign in
            </button>
          </div>
          <img src={imageforsign2} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};
export default Auth;
