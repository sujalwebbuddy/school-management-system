// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/chart/BaseOptionChart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getExam,
  getHomeworks,
  getStudentClass,
  getTeachers,
  getUserInfo,
} from "../../../slices/studentSlice";
import { getClasses } from "../../../slices/teacherSlice";

// ----------------------------------------------------------------------

export default function Student() {
  const { isAuth, userInfo } = useSelector((state) => state.user);
  const myclass = useSelector((state) => {
    return state?.student?.userInfo?.user?.classIn?.className;
  });
      
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTeachers());
    dispatch(getClasses());
    userInfo && dispatch(getUserInfo(userInfo));
    if( myclass ) {
      dispatch(getStudentClass(myclass));
      dispatch(getHomeworks(myclass));
      dispatch(getExam(myclass));
    }
  }, [dispatch, userInfo, myclass]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router isAuth={isAuth} role={userInfo.role} />
    </ThemeProvider>
  );
}
