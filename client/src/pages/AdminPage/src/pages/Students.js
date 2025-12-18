'use strict';

import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  TablePagination,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { useSelector, useDispatch } from 'react-redux';
import { getApprovedUsers } from '../../../../slices/adminSlice';
import StudentTable from '../components/StudentTable';
import useStudentsTable from '../hooks/useStudentsTable';

export default function Students() {
  const dispatch = useDispatch();
  const students = useSelector((state) => {
    return state?.admin?.usersApproved?.student || [];
  });

  useEffect(() => {
    dispatch(getApprovedUsers());
  }, [dispatch]);

  const {
    page,
    order,
    selected,
    orderBy,
    filterName,
    rowsPerPage,
    filteredStudents,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilterByName,
  } = useStudentsTable(students);

  return (
    <Page title="Students">
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
              Student List
            </Typography>
            <Button
              component={RouterLink}
              to="/dashboard/newuser"
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
              New Student
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
                Students Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`Total: ${students.length}`} color="primary" variant="outlined" />
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search students..."
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

          <StudentTable
            students={filteredStudents}
            order={order}
            orderBy={orderBy}
            selected={selected}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
            onSelect={handleClick}
            filterName={filterName}
            page={page}
            rowsPerPage={rowsPerPage}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={students?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
                {
                  fontWeight: 500,
                },
            }}
          />
        </Card>
      </Container>
    </Page>
  );
}
