'use strict';

import { useState, useEffect } from 'react';
import api from '../../../../utils/api';

export default function useClassStudentCount(classId) {
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await api.get('/admin/students');
        const allStudents = res.data.students || [];
        const classStudents = allStudents.filter((student) => {
          const studentClassId = student.classIn?._id || student.classIn;
          return (
            studentClassId === classId ||
            studentClassId?.toString() === classId?.toString()
          );
        });
        setStudentCount(classStudents.length);
      } catch (error) {
        setStudentCount(0);
      } finally {
        setLoading(false);
      }
    };
    if (classId) {
      fetchStudentCount();
    }
  }, [classId]);

  return { studentCount, loading };
}

