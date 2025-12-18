'use strict';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../utils/api';

export default function useUserSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitUser = async (formData, userRole) => {
    setIsSubmitting(true);
    try {
      const input = { ...formData, role: userRole };
      await api.post('/admin/newUser', input);
      await Swal.fire({
        title: 'Success!',
        text: 'User has been added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/dashboard/user');
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to add user';
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitUser, isSubmitting };
}

