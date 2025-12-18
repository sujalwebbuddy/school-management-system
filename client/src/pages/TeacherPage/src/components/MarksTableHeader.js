'use strict';

import { TableHead, TableRow, TableCell } from '@mui/material';

const headerCells = [
  { label: 'Student Name', align: 'left' },
  { label: 'Roll', align: 'left' },
  { label: 'Class', align: 'left' },
  { label: 'Total Marks', align: 'center' },
  { label: 'Marks Obtained', align: 'center' },
  { label: 'Status', align: 'center' },
];

export default function MarksTableHeader() {
  return (
    <TableHead>
      <TableRow>
        {headerCells.map((cell) => (
          <TableCell
            key={cell.label}
            align={cell.align}
            sx={{
              backgroundColor: 'background.neutral',
              fontWeight: 600,
            }}
          >
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

