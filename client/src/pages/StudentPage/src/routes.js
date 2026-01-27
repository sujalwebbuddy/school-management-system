import { useRoutes } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";
import DashboardApp from "./pages/DashboardApp";
import Page404 from "./pages/Page404";
import Calender from "../../../components/Calender";
import Homework from "./pages/Homework";
import HomeworkDetails from "./components/HomeworkDetails";
import ExamDetails from "./components/ExamDetails";
import Subject from "./pages/Subject";
import Teacher from "./pages/Teacher";
import Exam from "./pages/Exam";
import Marks from "./pages/Marks";
import EditAccount from "./pages/EditAccount";
import ChatPage from "../../../features/chat/pages/ChatPage";
import { TaskPage } from "../../../features/tasks";
import FeatureGuard from "../../../components/FeatureGuard";

export default function Router({ isAuth, role }) {
  return useRoutes([
    {
      path: "/studentDashboard",
      element: isAuth && role === "student" ? <DashboardLayout /> : <Page404 />,
      children: [
        { path: "", element: <DashboardApp /> },
        { path: "calender", element: <Calender /> },
        { path: "homework", element: <FeatureGuard feature="homework"><Homework /></FeatureGuard> },
        { path: "subject", element: <Subject /> },
        { path: "homework/:id", element: <FeatureGuard feature="homework"><HomeworkDetails /></FeatureGuard> },
        { path: "examdetails/:id", element: <FeatureGuard feature="exams"><ExamDetails /></FeatureGuard> },
        { path: "teacher/:id", element: <Teacher /> },
        { path: "exam", element: <FeatureGuard feature="exams"><Exam /></FeatureGuard> },
        { path: "marks", element: <FeatureGuard feature="exams"><Marks /></FeatureGuard> },
        { path: "editprofile", element: <EditAccount /> },
        { path: "chat", element: <ChatPage /> },
        { path: "tasks", element: <TaskPage /> },
        { path: "*", element: <Page404 /> },
      ],
    },
  ]);
}
