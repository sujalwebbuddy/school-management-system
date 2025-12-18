'use strict';

import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';

export default function AttendanceRoleToggle({ role, onChange }) {
  const handleChange = (event, newRole) => {
    if (newRole !== null) {
      onChange(newRole);
    }
  };

  return (
    <ToggleButtonGroup
      value={role}
      exclusive
      onChange={handleChange}
      size="medium"
      sx={{
        '& .MuiToggleButton-root': {
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <ToggleButton value="teacher" aria-label="teachers">
        <PersonIcon sx={{ mr: 1 }} />
        <Typography variant="body2">Teachers</Typography>
      </ToggleButton>
      <ToggleButton value="student" aria-label="students">
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography variant="body2">Students</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

