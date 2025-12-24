// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = (userInfo) => {
  const baseConfig = [
  {
    title: "dashboard",
    path: "/studentDashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "My Subjects",
    path: "/studentDashboard/subject",
    icon: getIcon("ic:sharp-school"),
  },
  {
    title: "Homeworks",
    path: "/studentDashboard/homework",
    icon: getIcon("fluent:clipboard-text-edit-24-filled"),
  },
  {
    title: "Exams",
    path: "/studentDashboard/exam",
    icon: getIcon("ph:exam-fill"),
  },
  {
    title: "Marks",
    path: "/studentDashboard/marks",
    icon: getIcon("file-icons:a"),
  },
  {
    title: "Calender",
    path: "/studentDashboard/calender",
    icon: getIcon("uis:calender"),
  },
  {
    title: "Tasks",
    path: "/studentDashboard/tasks",
    icon: getIcon("fluent:clipboard-task-24-filled"),
  },
  {
    title: "Chat",
    path: "/studentDashboard/chat",
    icon: getIcon("eva:message-circle-fill"),
  },
];

  // Filter out features if not available
  const features = userInfo?.organization?.features || [];

  return baseConfig.filter(item => {
    if (item.title === 'Chat' && !features.includes('chat')) {
      return false;
    }
    if (item.title === 'Exams' && !features.includes('exams')) {
      return false;
    }
    if (item.title === 'Homeworks' && !features.includes('homework')) {
      return false;
    }
    return true;
  });
};

export default navConfig;
