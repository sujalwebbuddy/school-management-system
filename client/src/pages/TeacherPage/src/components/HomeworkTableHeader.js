'use strict';

import { TableHead, TableRow, TableCell } from '@mui/material';

const headerCells = [
  { label: 'Name', align: 'left' },
  { label: 'Description', align: 'left' },
  { label: 'Options', align: 'left' },
  { label: 'Correct Answer', align: 'center' },
  { label: 'Due Date', align: 'center' },
  { label: 'Action', align: 'right', sortable: false },
];

export default function HomeworkTableHeader() {
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

