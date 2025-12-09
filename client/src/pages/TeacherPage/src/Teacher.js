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
  getUserInfo,
  getClasses,
  myClass,
  getExams,
  getHomeworks,
} from "../../../slices/teacherSlice";

// ----------------------------------------------------------------------

export default function Teacher() {
  const { isAuth, userInfo } = useSelector((state) => state.user);

  const mySubjectRaw = useSelector((state) => {
    return state.teacher?.userInfo?.user?.subject;
  });

  const mySubject = typeof mySubjectRaw === "object"
    ? mySubjectRaw?.name || mySubjectRaw?._id
    : mySubjectRaw;

  const dispatch = useDispatch();
  useEffect(() => {
    userInfo && dispatch(getUserInfo(userInfo));
    dispatch(getClasses());
    if ( mySubject ) {
      dispatch(myClass(mySubject));
      dispatch(getExams(mySubject));
      dispatch(getHomeworks(mySubject));
    };
  }, [dispatch, userInfo, mySubject]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router isAuth={isAuth} role={userInfo.role} />
    </ThemeProvider>
  );
}
