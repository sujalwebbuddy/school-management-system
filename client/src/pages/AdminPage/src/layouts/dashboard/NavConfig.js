// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = (userInfo) => {
  const baseConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "user",
    path: "/dashboard/user",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "Students",
    path: "/dashboard/students",
    icon: getIcon("ph:student-fill"),
  },
  {
    title: "Teachers",
    path: "/dashboard/teachers",
    icon: getIcon("fa-solid:chalkboard-teacher"),
  },
  {
    title: "Classes",
    path: "/dashboard/classes",
    icon: getIcon("healthicons:i-training-class"),
  },
  {
    title: "Subjects",
    path: "/dashboard/subjects",
    icon: getIcon("ic:round-flight-class"),
  },
  {
    title: "Attendance",
    path: "/dashboard/markattendance",
    icon: getIcon("bxs:hand"),
  },

  {
    title: "Calender",
    path: "/dashboard/calender",
    icon: getIcon("uis:calender"),
  },
  {
    title: "Tasks",
    path: "/dashboard/tasks",
    icon: getIcon("fluent:clipboard-task-24-filled"),
  },
  {
    title: "Chat",
    path: "/dashboard/chat",
    icon: getIcon("eva:message-circle-fill"),
  },
];

  // Filter out chat if feature is not available or user is on primary plan
  const subscriptionTier = userInfo?.organization?.subscriptionTier;
  const hasChatFeature = userInfo?.organization?.features?.includes('chat');
  const isPrimaryPlan = subscriptionTier === 'primary';

  return baseConfig.filter(item => {
    if (item.title === 'Chat' && (isPrimaryPlan || !hasChatFeature)) {
      return false;
    }
    return true;
  });
};

export default navConfig;
