'use strict';

import { useForm, useFieldArray } from 'react-hook-form';

const defaultQuestion = {
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: '',
};

const defaultValues = {
  name: '',
  dateOf: '',
  subject: '',
  classname: '',
  description: '',
  questions: [defaultQuestion],
};

export function useHomeworkForm() {
  const form = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  const addQuestion = () => {
    append({ ...defaultQuestion });
  };

  const removeQuestion = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return {
    ...form,
    resetForm,
    questions: {
      fields,
      addQuestion,
      removeQuestion,
    },
  };
}

