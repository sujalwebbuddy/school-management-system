'use strict';

import { useEffect } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { useSelector, useDispatch } from 'react-redux';
import { getApprovedUsers } from '../../../../slices/adminSlice';
import GenericResponsiveTable, { getTableConfig } from '../../../../components/GenericResponsiveTable';
import useTeachersTable from '../hooks/useTeachersTable';

export default function Teachers() {
  const dispatch = useDispatch();
  const teachers = useSelector((state) => {
    return state?.admin?.usersApproved?.teacher || [];
  });

  useEffect(() => {
    dispatch(getApprovedUsers());
  }, [dispatch]);

  const {
    page,
    order,
    orderBy,
    filterName,
    rowsPerPage,
    filteredTeachers,
    handleFilterByName,
  } = useTeachersTable(teachers);

  const config = getTableConfig('teachers');

  return (
    <Page title="Teachers">
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
              Teacher List
            </Typography>
            <Button
              component={RouterLink}
              to="/dashboard/newusert"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              New Teacher
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
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Teachers Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`Total: ${teachers.length}`} color="primary" variant="outlined" />
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search teachers..."
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: 'text.disabled', width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    width: { xs: '100%', sm: 280 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <GenericResponsiveTable
            config={config}
            data={filteredTeachers}
            actions={{}}
            filters={{
              filterName,
              order,
              orderBy,
            }}
            pagination={{
              page,
              rowsPerPage,
            }}
          />

        </Card>
      </Container>
    </Page>
  );
}
