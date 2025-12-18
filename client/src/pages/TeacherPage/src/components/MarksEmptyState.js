'use strict';

import { Card, Typography } from '@mui/material';
import Iconify from './Iconify';

export default function MarksEmptyState() {
  return (
    <Card
      sx={{
        borderRadius: 2,
        p: 6,
        textAlign: 'center',
        boxShadow:
          '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
      }}
    >
      <Iconify
        icon="eva:file-text-outline"
        sx={{ width: 80, height: 80, color: 'text.disabled', mb: 2 }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Select an exam to enter marks
      </Typography>
      <Typography variant="body2" color="text.disabled">
        Choose an exam from the dropdown above to start entering marks for your
        students.
      </Typography>
    </Card>
  );
}

