'use strict';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { initializeMarksForm } from '../utils/markUtils';

export function useMarksForm(students, selectedExamData) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    if (selectedExamData && students.length > 0) {
      const initialValues = initializeMarksForm(students, selectedExamData);
      reset(initialValues);
    } else {
      reset({});
    }
  }, [selectedExamData, students, reset]);

  return {
    register,
    handleSubmit,
    reset,
    errors,
    watch,
  };
}

