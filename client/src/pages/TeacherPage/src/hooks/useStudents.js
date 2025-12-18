'use strict';

import { useEffect, useState } from 'react';
import api from '../../../../utils/api';

export function useStudents(classro) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        } catch (error) {
          setStudents([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [classro]);

  return { students, loading };
}

