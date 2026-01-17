import React, { useEffect, Suspense } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import { getUserData } from "./slices/userSlice";
const Auth = React.lazy(() => import("./components/Auth"));
const Admin = React.lazy(() => import("./pages/AdminPage/src/Admin"));
const Student = React.lazy(() => import("./pages/StudentPage/src/Student"));
const Teacher = React.lazy(() => import("./pages/TeacherPage/src/Teacher"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const OrganizationSignup = React.lazy(() => import("./pages/OrganizationSignup"));
const SubscriptionManagement = React.lazy(() => import("./pages/SubscriptionManagement"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Disclaimer = React.lazy(() => import("./pages/Disclaimer"));

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if(localStorage.getItem("token")){
      dispatch(getUserData());
    }
  }, [dispatch]);
  const { isAuth, userInfo } = useSelector((state) => state.user);
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/register-org" element={<OrganizationSignup />} />
          <Route path="/subscription" element={<SubscriptionManagement />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </Suspense>
      {isAuth && userInfo.role === "admin" ? (
        <Suspense fallback={<Loading />}>
          <Admin />
        </Suspense>
      ) : isAuth && userInfo.role === "teacher" ? (
        <Suspense fallback={<Loading />}>
          <Teacher />
        </Suspense>
      ) : isAuth && userInfo.role === "student" ? (
        <Suspense fallback={<Loading />}>
          <Student />
        </Suspense>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
