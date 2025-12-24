// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = (userInfo) => {
  const baseConfig = [
  {
    title: "dashboard",
    path: "/teacherDashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "Students",
    path: "/teacherDashboard/students",
    icon: getIcon("ph:student-bold"),
  },
  {
    title: "Attendance",
    path: "/teacherDashboard/attendance",
    icon: getIcon("fluent:presenter-24-filled"),
  },
  {
    title: "Exams",
    path: "/teacherDashboard/exam",
    icon: getIcon("healthicons:i-exam-multiple-choice"),
  },
  {
    title: "Marks",
    path: "/teacherDashboard/marks",
    icon: getIcon("ph:exam-fill"),
  },
  {
    title: "Homework",
    path: "/teacherDashboard/homework",
    icon: getIcon("icon-park-solid:notebook-and-pen"),
  },
  {
    title: "Calender",
    path: "/teacherDashboard/calender",
    icon: getIcon("uis:calender"),
  },
  {
    title: "Tasks",
    path: "/teacherDashboard/tasks",
    icon: getIcon("fluent:clipboard-task-24-filled"),
  },
  {
    title: "Chat",
    path: "/teacherDashboard/chat",
    icon: getIcon("eva:message-circle-fill"),
  },
];

  // Filter out features if not available or user is on primary plan
  const subscriptionTier = userInfo?.organization?.subscriptionTier;
  const features = userInfo?.organization?.features || [];
  const isPrimaryPlan = subscriptionTier === 'primary';

  return baseConfig.filter(item => {
    if (item.title === 'Chat' && (isPrimaryPlan || !features.includes('chat'))) {
      return false;
    }
    if (item.title === 'Exams' && !features.includes('exams')) {
      return false;
    }
    if (item.title === 'Homework' && !features.includes('homework')) {
      return false;
    }
    return true;
  });
};

export default navConfig;
