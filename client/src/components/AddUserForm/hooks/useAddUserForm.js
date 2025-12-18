'use strict';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

export default function useAddUserForm() {
  const location = useLocation();
  const userData = location.state?.userData;
  const isApproval = location.state?.isApproval;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      gender: '',
      classIn: '',
      subject: '',
    },
  });

  useEffect(() => {
    if (userData && isApproval) {
      setValue('firstName', userData.firstName || '');
      setValue('lastName', userData.lastName || '');
      setValue('email', userData.email || '');
      setValue('phoneNumber', userData.phoneNumber || '');
    }
  }, [userData, isApproval, setValue]);

  return {
    register,
    handleSubmit,
    control,
    reset,
    errors,
  };
}

