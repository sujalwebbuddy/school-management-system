import React from 'react';
import {
  Avatar,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import ResponsiveDataView from '../../../../components/ResponsiveDataView/ResponsiveDataView';
import Label from '../components/Label';
import PendingUserMoreMenu from './PendingUserMoreMenu';

export default function ResponsivePendingUserTable({
  users,
  order,
  orderBy,
  selected,
  onRequestSort,
  onSelectAllClick,
  onSelect,
  filterName,
  page,
  rowsPerPage,
}) {
  // Define table columns for desktop view
  const columns = [
    {
      id: 'name',
      label: 'Name',
      render: (value, user) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={user.name} src={user.profileImage} sx={{ width: 40, height: 40 }}>
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              ID: {user._id?.slice(-6)}
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
      id: 'role',
      label: 'Role',
      render: (value) => (
        <Chip
          size="small"
          label={value}
          color="primary"
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
      id: 'status',
      label: 'Status',
      render: (value, user) => (
        <Label
          variant="ghost"
          color={user.isApproved === false ? 'error' : 'success'}
        >
          {user.isApproved ? 'Approved' : 'Pending'}
        </Label>
      ),
    },
  ];

  // Transform users data for the responsive component
  const transformedData = users?.map(user => ({
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber,
    status: user.isApproved ? 'Approved' : 'Pending',
    isApproved: user.isApproved,
    profileImage: user.profileImage,
    firstName: user.firstName,
    lastName: user.lastName,
    ...user, // Include original user data
  })) || [];

  // Custom card content renderer for mobile view
  const renderCardContent = (user) => (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar
          alt={user.name}
          src={user.profileImage}
          sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}
        >
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Label
            variant="ghost"
            color={user.isApproved === false ? 'error' : 'success'}
          >
            {user.isApproved ? 'Approved' : 'Pending'}
          </Label>
          <PendingUserMoreMenu
            id={user._id}
            role={user.role}
            userData={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber
            }}
          />
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2" noWrap>
            {user.email}
          </Typography>
        </Stack>

        {user.phoneNumber && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {user.phoneNumber}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );

  // Handle row click (can be used for selection if needed)
  const handleRowClick = (user) => {
    // Optional: implement selection logic if needed
    if (onSelect) {
      const name = `${user.firstName} ${user.lastName}`;
      onSelect(null, name);
    }
  };

  // Handle action click (for the more menu in table view)
  const handleActionClick = (user) => {
    // This will be handled by the PendingUserMoreMenu component
    // The ResponsiveDataView will pass this to the table view actions
  };

  return (
    <ResponsiveDataView
      data={transformedData}
      columns={columns}
      onRowClick={handleRowClick}
      onActionClick={handleActionClick}
      renderCardContent={renderCardContent}
      title=""
      emptyMessage="No pending users found"
      defaultView="auto"
    />
  );
}