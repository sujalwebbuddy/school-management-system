'use strict';

import { Card, CardContent, CardHeader, Typography, Chip } from '@mui/material';
import SubjectsTable from './SubjectsTable';

export default function ClassSubjectCard({ classData }) {
  const className = classData.className || classData.classesName || 'N/A';
  const subjects = classData.subjects || classData.subject || [];
  const subjectCount = subjects.length;

  return (
    <Card
      sx={{
        minWidth: 320,
        maxWidth: 400,
        borderRadius: 2,
        boxShadow:
          '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow:
            '0 8px 16px 0 rgba(145, 158, 171, 0.24), 0 0 0 1px rgba(145, 158, 171, 0.08)',
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {className}
          </Typography>
        }
        subheader={
          <Chip
            label={`${subjectCount} Subject${subjectCount !== 1 ? 's' : ''} Assigned`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        }
        sx={{
          pb: 1,
          '& .MuiCardHeader-title': {
            fontSize: '1.25rem',
          },
        }}
      />
      <CardContent sx={{ pt: 0 }}>
        <SubjectsTable subjects={subjects} />
      </CardContent>
    </Card>
  );
}

