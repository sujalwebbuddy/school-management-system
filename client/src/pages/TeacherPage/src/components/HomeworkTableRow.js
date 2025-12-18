'use strict';

import { TableRow, TableCell, Chip, Stack, Typography } from '@mui/material';
import { formatDate } from '../utils/formatDate';
import HomeworkMoreMenu from './HomeworkMoreMenu';

export default function HomeworkTableRow({ homework }) {
  const { _id, name, description, optionA, optionB, optionC, optionD, correct, dateOf } =
    homework;

  return (
    <TableRow
      hover
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
          {description}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            A: {optionA}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            B: {optionB}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            C: {optionC}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            D: {optionD}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Chip label={correct} color="success" size="small" />
      </TableCell>
      <TableCell align="center">
        <Chip label={formatDate(dateOf)} color="error" variant="outlined" size="small" />
      </TableCell>
      <TableCell align="right">
        <HomeworkMoreMenu homeworkId={_id} />
      </TableCell>
    </TableRow>
  );
}

