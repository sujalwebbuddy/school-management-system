'use strict';

import { useState } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceHeader from '../components/AttendanceHeader';
import AttendanceEmptyState from '../components/AttendanceEmptyState';
import AttendanceRoleToggle from '../components/AttendanceRoleToggle';
import useAttendance from '../hooks/useAttendance';
import useAttendanceSubmission from '../hooks/useAttendanceSubmission';

export default function Attendance() {
  const {
    users,
    selectedDate,
    selectedRole,
    attendanceData,
    isSubmitted,
    hasChanges,
    presentCount,
    absentCount,
    loading,
    handleDateChange,
    handleRoleChange,
    handleAttendanceChange,
    setIsSubmitted,
    setHasChanges,
    refetchAttendance,
  } = useAttendance();

  const { submitAttendance, isSubmitting } = useAttendanceSubmission();

  const handleSubmit = async () => {
    const result = await submitAttendance(selectedDate, attendanceData, selectedRole);
    if (result.success) {
      setIsSubmitted(true);
      setHasChanges(false);
      refetchAttendance();
    }
  };

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
              Mark Attendance
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <AttendanceRoleToggle role={selectedRole} onChange={handleRoleChange} />
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
              <AttendanceHeader
                selectedDate={selectedDate}
                presentCount={presentCount}
                absentCount={absentCount}
                totalCount={users.length}
              />
            </Box>

            {isSubmitted && (
              <Box sx={{ p: 2 }}>
                <Alert severity="success" sx={{ borderRadius: 1 }}>
                  Attendance has been successfully submitted for this date.
                </Alert>
              </Box>
            )}

            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading attendance data...
                </Typography>
              </Box>
            ) : (
              <AttendanceTable
                users={users}
                attendanceData={attendanceData}
                onAttendanceChange={handleAttendanceChange}
                role={selectedRole}
              />
            )}

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
                disabled={!hasChanges || isSubmitted || isSubmitting}
                startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit Attendance'}
              </Button>
            </Box>
          </Card>
        )}

        {!selectedDate && (
          <Card
            sx={{
              borderRadius: 2,
              boxShadow:
                '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
            }}
          >
            <AttendanceEmptyState />
          </Card>
        )}
      </Container>
    </Page>
  );
}
