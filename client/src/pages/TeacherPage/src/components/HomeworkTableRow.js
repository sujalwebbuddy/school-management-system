'use strict';

import { TableRow, TableCell, Chip, Stack, Typography } from '@mui/material';
import { formatDate } from '../utils/formatDate';
import HomeworkMoreMenu from './HomeworkMoreMenu';

function getQuestionCount(homework) {
  if (homework.questions && Array.isArray(homework.questions)) {
    return homework.questions.length;
  }
  if (homework.optionA && homework.optionB && homework.optionC && homework.optionD) {
    return 1;
  }
  return 0;
}

export default function HomeworkTableRow({ homework }) {
  const { _id, name, description, dateOf } = homework;
  const questionCount = getQuestionCount(homework);

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
      <TableCell align="center">
        <Chip label={`${questionCount} Question${questionCount !== 1 ? 's' : ''}`} color="primary" size="small" />
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

