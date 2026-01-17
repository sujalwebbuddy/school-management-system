'use strict';

import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Divider,
} from '@mui/material';
import Page from '../../pages/AdminPage/src/components/Page';
import { useSelector } from 'react-redux';
import { extractSubjects } from './utils/extractSubjects';
import UserFormFields from './components/UserFormFields';
import useAddUserForm from './hooks/useAddUserForm';
import useUserSubmission from './hooks/useUserSubmission';

export default function AddUserForm({ UserRole }) {
  const classrooms = useSelector((state) => {
    return state?.admin?.classrooms?.classes || [];
  });

  const subjects = extractSubjects(classrooms);
  const { register, handleSubmit, control, errors } = useAddUserForm();
  const { submitUser, isSubmitting } = useUserSubmission();

  const onSubmit = async (data) => {
    try {
      await submitUser(data, UserRole);
    } catch (error) {
      // Error is already handled in useUserSubmission
    }
  };

  return (
    <Page title={UserRole === 'student' ? 'Add Student' : 'Add Teacher'}>
      <Container maxWidth="md">
        <Card
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: '0 24px 48px -12px rgba(16, 24, 40, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, textAlign: 'center', color: '#101828' }}>
            {UserRole === 'student' ? 'Add New Student' : 'Add New Teacher'}
          </Typography>
          <Divider sx={{ mb: 4, borderColor: 'rgba(0,0,0,0.06)' }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <UserFormFields
              register={register}
              errors={errors}
              control={control}
              userRole={UserRole}
              classrooms={classrooms}
              subjects={subjects}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              sx={{
                mt: 4,
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)',
                background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1D4ED8, #4338CA)',
                  boxShadow: '0 12px 24px -6px rgba(37, 99, 235, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isSubmitting ? 'Adding User...' : 'Add User'}
            </Button>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

