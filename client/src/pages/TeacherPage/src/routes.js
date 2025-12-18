import { useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";

import DashboardApp from "./pages/DashboardApp";
import Page404 from "./pages/Page404";

import Calender from "../../../components/Calender";

import MyStudents from "./pages/MyStudents";
import Attendance from "./pages/Attendance";
import Exam from "./pages/Exam";
import Marks from "./pages/Marks";
import Homework from "./pages/Homework";
import EditAccount from "./pages/EditProfile";
import ChatPage from "../../../features/chat/pages/ChatPage";
import { TaskPage } from "../../../features/tasks";

// ----------------------------------------------------------------------

export default function Router({ isAuth, role }) {
  return useRoutes([
    {
      path: "/teacherDashboard",
      element: isAuth && role === "teacher" ? <DashboardLayout /> : <Page404 />,
      children: [
        { path: "", element: <DashboardApp /> },
        { path: "students", element: <MyStudents /> },
        { path: "attendance", element: <Attendance /> },
        { path: "exam", element: <Exam /> },
        { path: "marks", element: <Marks /> },
        { path: "homework", element: <Homework /> },
        { path: "editprofile", element: <EditAccount /> },
        { path: "chat", element: <ChatPage /> },
        { path: "tasks", element: <TaskPage /> },

        { path: "calender", element: <Calender /> },
        { path: "*", element: <Page404 /> },
      ],
    },
  ]);
}
