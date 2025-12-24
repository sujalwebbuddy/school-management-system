import {  useRoutes } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";
import User from "./pages/User";
import Students from "./pages/Students";
import Dashboard from "./pages/DashboardApp";
import Page404 from "./pages/Page404";
import AddUserForm from "../../../components/AddUserForm";
import Teachers from "./pages/Teachers";
import Calender from "../../../components/Calender";
import UserInfo from "../../../components/UserInfo";
import Subjects from "./pages/Subjects";
import Classes from "./pages/Classes";
import ClassStudentList from "../../../components/ClassStudentList";
import EditAccount from "../../../components/EditAccount";
import Attendance from "./pages/Attendance";
import { TaskPage } from "../../../features/tasks";
import ChatPage from "../../../features/chat/pages/ChatPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function Router({ isAuth, role }) {
  return useRoutes([
    {
      path: "/dashboard",
      element: isAuth && role === "admin" ? <DashboardLayout /> : <Page404 />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "user", element: <User /> },
        { path: "students", element: <Students /> },

        { path: "newuser", element: <AddUserForm UserRole="student" /> },
        { path: "newusert", element: <AddUserForm UserRole="teacher" /> },
        { path: ":id", element: <UserInfo /> },
        { path: "teachers", element: <Teachers /> },
        { path: "classes", element: <Classes /> },
        { path: "subjects", element: <Subjects /> },
        { path: "calender", element: <Calender /> },
        { path: "classes/class/:id", element: <ClassStudentList /> },
        { path: "students/profile/:id", element: <EditAccount /> },
        { path: "teachers/profile/:id", element: <EditAccount /> },
        { path: "markattendance", element: <Attendance /> },
        { path: "tasks", element: <TaskPage /> },
        { path: "chat", element: <ChatPage /> },
        { path: "profile", element: <Profile /> },
        { path: "settings", element: <Settings /> },
        { path: "*", element: <Page404 /> },
      ],
    },
  ]);
}
