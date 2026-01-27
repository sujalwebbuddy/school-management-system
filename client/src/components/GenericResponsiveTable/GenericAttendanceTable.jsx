import { Box, Typography } from "@mui/material";
import GenericResponsiveTable, { getTableConfig } from "./index";

const GenericAttendanceTable = ({
  users,
  attendanceData,
  onAttendanceChange,
  role,
}) => {
  if (!users || users.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
          No {role === "teacher" ? "Teachers" : "Students"} Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please ensure {role === "teacher" ? "teachers" : "students"} are added
          to the system
        </Typography>
      </Box>
    );
  }

  const config = getTableConfig(`${role}Attendance`);

  return (
    <GenericResponsiveTable
      config={config}
      data={users}
      actions={{}}
      filters={{}}
      pagination={{}}
      attendanceData={attendanceData}
      onAttendanceChange={onAttendanceChange}
    />
  );
};

export default GenericAttendanceTable;
