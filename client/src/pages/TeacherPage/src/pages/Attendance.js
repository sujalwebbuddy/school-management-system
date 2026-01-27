import { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Chip,
  Alert,
  TextField,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/lab";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import { useSelector } from "react-redux";
import api from "../../../../utils/api";
import Swal from "sweetalert2";
import GenericAttendanceTable from "../../../../components/GenericResponsiveTable/GenericAttendanceTable";

const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
};

export default function Attendance() {
  const classro = useSelector((state) => {
    return state.teacher?.teacherclass?.classroom;
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (classro?._id) {
        try {
          setLoading(true);
          const res = await api.get("/admin/students");
          const allStudents = res.data.students || [];
          const classStudents = allStudents
            .filter((student) => {
              const studentClassId = student.classIn?._id || student.classIn;
              return (
                studentClassId === classro._id ||
                studentClassId?.toString() === classro._id?.toString()
              );
            })
            .map((student, index) => ({
              ...student,
              rollNumber: student.rollNumber || index + 1,
            }));
          setStudents(classStudents);

          const initialAttendance = {};
          classStudents.forEach((student) => {
            initialAttendance[student._id] = ATTENDANCE_STATUS.ABSENT;
          });
          setAttendanceData(initialAttendance);
        } catch (error) {
          setStudents([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [classro]);
  useEffect(() => {
    const fetchAttendance = async () => {
      if (classro?._id && selectedDate && students.length > 0) {
        try {
          const formattedDate = selectedDate.toISOString().split("T")[0];
          const res = await api.get("/teacher/attendance", {
            params: {
              date: formattedDate,
              classId: classro._id,
            },
          });

          const records = res.data.attendance || res.data;
          const data = {};

          if (Array.isArray(records)) {
            records.forEach((record) => {
              const studentId = record.studentId?._id || record.studentId;
              if (studentId) {
                data[studentId] = record.status;
              }
            });
          } else if (records && typeof records === "object") {
            Object.keys(records).forEach((studentId) => {
              data[studentId] = records[studentId].status || records[studentId];
            });
          }

          if (Object.keys(data).length > 0) {
            const updatedAttendance = {};
            students.forEach((student) => {
              updatedAttendance[student._id] =
                data[student._id] || ATTENDANCE_STATUS.ABSENT;
            });

            setAttendanceData(updatedAttendance);
            setIsSubmitted(true);
            setHasChanges(false);
          } else {
            const initialAttendance = {};
            students.forEach((student) => {
              initialAttendance[student._id] = ATTENDANCE_STATUS.ABSENT;
            });
            setAttendanceData(initialAttendance);
            setIsSubmitted(false);
            setHasChanges(false);
          }
        } catch (error) {
          console.error("Failed to fetch attendance:", error);
        }
      }
    };

    fetchAttendance();
  }, [classro, selectedDate, students]);

  const handleDateChange = (newDate) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setHasChanges(true);
    setIsSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      Swal.fire({
        icon: "warning",
        title: "Date Required",
        text: "Please select a date before submitting attendance.",
      });
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const attendancePayload = {
        date: formattedDate,
        classId: classro._id,
        attendance: Object.keys(attendanceData).map((studentId) => ({
          studentId,
          status: attendanceData[studentId],
        })),
      };

      await api.post("/teacher/attendance", attendancePayload);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Attendance marked successfully for ${formattedDate}`,
      });

      setIsSubmitted(true);
      setHasChanges(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to submit attendance. Please try again.",
      });
    }
  };

  const presentCount = Object.values(attendanceData).filter(
    (status) => status === ATTENDANCE_STATUS.PRESENT,
  ).length;
  const absentCount = students.length - presentCount;

  return (
    <Page title="Attendance">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Mark Student Attendance
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                inputFormat="MM/dd/yyyy"
                renderInput={(params) => (
                  <TextField {...params} sx={{ minWidth: 250 }} />
                )}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>

        {selectedDate && (
          <Card
            sx={{
              borderRadius: 2,
              boxShadow:
                "0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Attendance for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                    label={`Present: ${presentCount}`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Iconify icon="eva:close-circle-2-fill" />}
                    label={`Absent: ${absentCount}`}
                    color="error"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Box>

            {isSubmitted && (
              <Box sx={{ p: 2 }}>
                <Alert severity="success" sx={{ borderRadius: 1 }}>
                  Attendance has been successfully submitted for this date.
                </Alert>
              </Box>
            )}

            <GenericAttendanceTable
              role="student"
              users={students}
              attendanceData={attendanceData}
              onAttendanceChange={handleAttendanceChange}
            />

            <Box
              sx={{
                p: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitted || !hasChanges || loading}
                startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 1,
                }}
              >
                {isSubmitted ? "Submitted" : "Submit Attendance"}
              </Button>
            </Box>
          </Card>
        )}

        {!selectedDate && (
          <Card
            sx={{
              borderRadius: 2,
              p: 6,
              textAlign: "center",
              boxShadow:
                "0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)",
            }}
          >
            <Iconify
              icon="eva:calendar-outline"
              sx={{ width: 80, height: 80, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Select a date to mark attendance
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Choose a date from the date picker above to start marking
              attendance for your students.
            </Typography>
          </Card>
        )}
      </Container>
    </Page>
  );
}
