'use strict';

import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Alert,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import { useSelector } from 'react-redux';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
};

export default function Attendance() {
  const classro = useSelector((state) => {
    return state.teacher?.teacherclass?.classro;
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (classro?._id) {
        try {
          setLoading(true);
          const res = await api.get('/admin/students');
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
            initialAttendance[student._id] = ATTENDANCE_STATUS.PRESENT;
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

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsSubmitted(false);
    setHasChanges(false);

    const initialAttendance = {};
    students.forEach((student) => {
      initialAttendance[student._id] = ATTENDANCE_STATUS.PRESENT;
    });
    setAttendanceData(initialAttendance);
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
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select a date before submitting attendance.',
      });
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const attendancePayload = {
        date: formattedDate,
        classId: classro._id,
        attendance: Object.keys(attendanceData).map((studentId) => ({
          studentId,
          status: attendanceData[studentId],
        })),
      };

      await api.post('/teacher/attendance', attendancePayload);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Attendance marked successfully for ${formattedDate}`,
      });

      setIsSubmitted(true);
      setHasChanges(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit attendance. Please try again.',
      });
    }
  };

  const getStatusColor = (status) => {
    return status === ATTENDANCE_STATUS.PRESENT ? 'success' : 'error';
  };

  const getStatusLabel = (status) => {
    return status === ATTENDANCE_STATUS.PRESENT ? 'Present' : 'Absent';
  };

  const presentCount = Object.values(attendanceData).filter(
    (status) => status === ATTENDANCE_STATUS.PRESENT
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
                '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
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
                  Attendance for {selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
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

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
            <TableHead>
              <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: 'background.neutral',
                          fontWeight: 600,
                        }}
                      >
                        Student Name
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: 'background.neutral',
                          fontWeight: 600,
                        }}
                      >
                        Roll
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: 'background.neutral',
                          fontWeight: 600,
                        }}
                      >
                        Status
                      </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                    {students.map((student) => {
                      const studentId = student._id;
                      const currentStatus =
                        attendanceData[studentId] || ATTENDANCE_STATUS.PRESENT;
                      const name = `${student.firstName} ${student.lastName}`;
                      const roll = `#${String(student.rollNumber || '').padStart(2, '0')}`;

                      return (
                        <TableRow
                          key={studentId}
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                alt={name}
                                src={student.profileImage}
                                sx={{ width: 40, height: 40 }}
                              />
                              <Typography variant="subtitle2">{name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {roll}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <ToggleButtonGroup
                              value={currentStatus}
                              exclusive
                              onChange={(event, newStatus) => {
                                if (newStatus !== null) {
                                  handleAttendanceChange(studentId, newStatus);
                                }
                              }}
                              size="small"
                              sx={{
                                '& .MuiToggleButton-root': {
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  px: 2,
                                  py: 0.5,
                                  '&.Mui-selected': {
                                    borderColor: 'primary.main',
                                  },
                                },
                              }}
                            >
                              <ToggleButton
                                value={ATTENDANCE_STATUS.PRESENT}
                                disabled={isSubmitted}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Iconify
                                    icon="eva:checkmark-circle-2-fill"
                                    width={18}
                                    height={18}
                                    sx={{ color: 'success.main' }}
                                  />
                                  <Typography variant="body2">Present</Typography>
                                </Stack>
                              </ToggleButton>
                              <ToggleButton
                                value={ATTENDANCE_STATUS.ABSENT}
                                disabled={isSubmitted}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Iconify
                                    icon="eva:close-circle-2-fill"
                                    width={18}
                                    height={18}
                                    sx={{ color: 'error.main' }}
                                  />
                                  <Typography variant="body2">Absent</Typography>
                                </Stack>
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </TableCell>
                        </TableRow>
                      );
                    })}
            </TableBody>
          </Table>
              </TableContainer>
            </Scrollbar>

            <Box
              sx={{
                p: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'flex-end',
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
                  textTransform: 'none',
                  borderRadius: 1,
                }}
              >
                {isSubmitted ? 'Submitted' : 'Submit Attendance'}
              </Button>
            </Box>
          </Card>
        )}

        {!selectedDate && (
          <Card
            sx={{
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              boxShadow:
                '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
            }}
          >
            <Iconify
              icon="eva:calendar-outline"
              sx={{ width: 80, height: 80, color: 'text.disabled', mb: 2 }}
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
