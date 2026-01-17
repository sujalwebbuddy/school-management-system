'use strict';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function SubjectsTable({ subjects }) {
  if (!subjects || subjects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No subjects assigned
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject, idx) => {
            const subjectName = typeof subject === 'object' ? subject.name : subject;
            const subjectCode = typeof subject === 'object' ? subject.code : 'N/A';
            return (
              <TableRow
                key={idx}
                sx={{
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <TableCell>
                  <Chip label={subjectName} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                    {subjectCode}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

