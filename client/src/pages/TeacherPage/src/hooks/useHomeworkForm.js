'use strict';

import { useForm } from 'react-hook-form';

const defaultValues = {
  name: '',
  dateOf: '',
  subject: '',
  classname: '',
  description: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: '',
};

export function useHomeworkForm() {
  const form = useForm({
    defaultValues,
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  return {
    ...form,
    resetForm,
  };
}

