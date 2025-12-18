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
            p: 4,
            borderRadius: 2,
            boxShadow:
              '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
            {UserRole === 'student' ? 'Add New Student' : 'Add New Teacher'}
          </Typography>
          <Divider sx={{ mb: 4 }} />

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
                mt: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
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

