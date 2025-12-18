'use strict';

import { useState } from 'react';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';

export function useMarksSubmission(selectedExam, setHasChanges) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMarks = async (data) => {
    if (!selectedExam) {
      Swal.fire({
        icon: 'warning',
        title: 'Exam Required',
        text: 'Please select an exam before submitting marks.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const input = { examname: selectedExam, exammarks: data };
      await api.put('/teacher/submitmarks', input);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: "Exam's marks have been submitted successfully!",
      });
      setHasChanges(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit marks. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitMarks };
}

