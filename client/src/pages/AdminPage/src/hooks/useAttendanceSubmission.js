'use strict';

import { useState } from 'react';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';

export default function useAttendanceSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAttendance = async (selectedDate, attendanceData, role = 'student') => {
    if (!selectedDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select a date before submitting attendance.',
      });
      return { success: false };
    }

    setIsSubmitting(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const attendancePayload = {
        date: formattedDate,
        role,
        attendance: Object.keys(attendanceData).map((userId) => ({
          userId,
          status: attendanceData[userId],
        })),
      };

      const response = await api.post('/admin/attendance', attendancePayload);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Attendance marked successfully for ${formattedDate}`,
      });

      return { success: true, data: response?.data };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit attendance. Please try again.',
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitAttendance, isSubmitting };
}

