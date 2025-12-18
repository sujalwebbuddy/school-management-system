'use strict';

import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Chip,
} from '@mui/material';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { useSelector, useDispatch } from 'react-redux';
import { getClasses } from '../../../../slices/adminSlice';
import AddClassModal from '../components/AddClassModal';
import ClassCard from '../components/ClassCard';

export default function Classes() {
  const dispatch = useDispatch();
  const classes = useSelector((state) => {
    return state?.admin?.classrooms?.classes || [];
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Page title="Classes">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Class List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              New Class
            </Button>
          </Stack>
        </Stack>

        <Card
          sx={{
            borderRadius: 2,
            boxShadow:
              '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Classes Information
              </Typography>
              <Chip label={`Total: ${classes.length}`} color="primary" variant="outlined" />
            </Stack>

            {classes.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No Classes Yet
                </Typography>
                <Typography variant="body2">
                  Please add a class to get started
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {classes.map((classItem) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={classItem._id}>
                    <ClassCard classData={classItem} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Card>

        <AddClassModal open={open} onClose={handleClose} />
      </Container>
    </Page>
  );
}
