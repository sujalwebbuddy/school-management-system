'use strict';

import React from 'react';
import {
  Avatar,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import ResponsiveDataView from '../../../../components/ResponsiveDataView/ResponsiveDataView';

export default function StudentTable({
  students,
  order,
  orderBy,
  selected,
  onRequestSort,
  onSelectAllClick,
  onSelect,
  filterName,
  page,
  rowsPerPage,
  loading = false,
  onRowClick,
  onActionClick,
}) {
  const columns = [
    {
      id: 'name',
      label: 'Student Name',
      render: (value, student) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {`${student.firstName} ${student.lastName}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              ID: {student._id?.slice(-6)}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      render: (value) => (
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      ),
    },
    {
      id: 'gender',
      label: 'Gender',
      render: (value) => (
        <Chip
          size="small"
          label={value}
          color={value === 'Male' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      ),
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      render: (value) => (
        <Typography variant="body2" noWrap>
          {value || 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'class',
      label: 'Class',
      render: (value, student) => (
        <Chip
          size="small"
          label={student.class?.className || 'No Class'}
          color="default"
          variant="filled"
        />
      ),
    },
  ];

  // Transform students data for the responsive component
  const transformedData = students?.map(student => ({
    id: student._id,
    name: `${student.firstName} ${student.lastName}`,
    email: student.email,
    gender: student.gender,
    phoneNumber: student.phoneNumber,
    class: student.class?.className || 'No Class',
    ...student, // Include original student data
  })) || [];

  // Custom card content renderer for mobile view
  const renderCardContent = (student) => (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" noWrap>
            {`${student.firstName} ${student.lastName}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {student.gender}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>
            {student.email}
          </Typography>
        </Stack>
        
        {student.phoneNumber && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {student.phoneNumber}
            </Typography>
          </Stack>
        )}
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <SchoolIcon fontSize="small" color="action" />
          <Chip
            size="small"
            label={student.class?.className || 'No Class'}
            color="default"
            variant="outlined"
          />
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <ResponsiveDataView
      data={transformedData}
      columns={columns}
      loading={loading}
      onRowClick={onRowClick}
      onActionClick={onActionClick}
      renderCardContent={renderCardContent}
      title="Students"
      emptyMessage="No students found"
      defaultView="auto"
    />
  );
}