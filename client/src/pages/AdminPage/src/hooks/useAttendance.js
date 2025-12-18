'use strict';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getApprovedUsers } from '../../../../slices/adminSlice';
import api from '../../../../utils/api';

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
};

export default function useAttendance() {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => {
    return state?.admin?.usersApproved || {};
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const users = selectedRole === 'teacher' 
    ? (allUsers.teacher || [])
    : (allUsers.student || []);

  useEffect(() => {
    dispatch(getApprovedUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchAttendance = async (date, role) => {
      if (!date || users.length === 0) {
        return;
      }

      try {
        setLoading(true);
        const formattedDate = date.toISOString().split('T')[0];
        const response = await api.get(`/admin/attendance?date=${formattedDate}&role=${role}`);
        const savedAttendance = response.data.attendance || {};

        const mergedAttendance = {};
        users.forEach((user) => {
          const userId = user._id;
          if (savedAttendance[userId]) {
            mergedAttendance[userId] = savedAttendance[userId].status;
          } else {
            mergedAttendance[userId] = ATTENDANCE_STATUS.PRESENT;
          }
        });

        setAttendanceData(mergedAttendance);
        setIsSubmitted(Object.keys(savedAttendance).length > 0);
        setHasChanges(false);
      } catch (error) {
        const initialAttendance = {};
        users.forEach((user) => {
          initialAttendance[user._id] = ATTENDANCE_STATUS.PRESENT;
        });
        setAttendanceData(initialAttendance);
        setIsSubmitted(false);
      } finally {
        setLoading(false);
      }
    };

    if (users.length > 0 && selectedDate) {
      fetchAttendance(selectedDate, selectedRole);
    }
  }, [users, selectedDate, selectedRole]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsSubmitted(false);
    setHasChanges(false);
  };

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setIsSubmitted(false);
    setHasChanges(false);
    setAttendanceData({});
  };

  const handleAttendanceChange = (userId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [userId]: status,
    }));
    setHasChanges(true);
    setIsSubmitted(false);
  };

  const presentCount = Object.values(attendanceData).filter(
    (status) => status === ATTENDANCE_STATUS.PRESENT
  ).length;
  const absentCount = users.length - presentCount;

  const refetchAttendance = async () => {
    if (!selectedDate || users.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/admin/attendance?date=${formattedDate}&role=${selectedRole}`);
      const savedAttendance = response.data.attendance || {};

      const mergedAttendance = {};
      users.forEach((user) => {
        const userId = user._id;
        if (savedAttendance[userId]) {
          mergedAttendance[userId] = savedAttendance[userId].status;
        } else {
          mergedAttendance[userId] = ATTENDANCE_STATUS.PRESENT;
        }
      });

      setAttendanceData(mergedAttendance);
      setIsSubmitted(Object.keys(savedAttendance).length > 0);
      setHasChanges(false);
    } catch (error) {
      const initialAttendance = {};
      users.forEach((user) => {
        initialAttendance[user._id] = ATTENDANCE_STATUS.PRESENT;
      });
      setAttendanceData(initialAttendance);
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}

