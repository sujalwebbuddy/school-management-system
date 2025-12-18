'use strict';

import { TableRow, TableCell, Stack, Avatar, Chip, Typography } from '@mui/material';
import { getMarkColor, calculateMarkPercentage } from '../utils/markUtils';
import MarkInputField from './MarkInputField';

export default function MarksTableRow({
  student,
  selectedExamData,
  register,
  errors,
  watchedValues,
}) {
  const studentId = student._id?.toString();
  const name = `${student.firstName} ${student.lastName}`;
  const roll = `#${String(student.rollNumber || '').padStart(2, '0')}`;
  const className =
    typeof student.classIn === 'object'
      ? student.classIn?.className || student.classIn?.classesName
      : student.classIn;
  const markValue = watchedValues[studentId] || '';
  const markError = errors[studentId];
  const markPercentage = calculateMarkPercentage(
    markValue,
    selectedExamData?.totalMark
  );

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
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={student.profileImage} sx={{ width: 40, height: 40 }} />
          <Typography variant="subtitle2">{name}</Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.secondary">
          {roll}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Chip label={className || 'N/A'} size="small" variant="outlined" />
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2" fontWeight={600}>
          {selectedExamData?.totalMark || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <MarkInputField
          studentId={studentId}
          totalMark={selectedExamData?.totalMark}
          register={register}
          error={markError}
          helperText={markError?.message}
        />
      </TableCell>
      <TableCell align="center">
        {markValue !== '' && markValue !== null && markValue !== undefined ? (
          <Chip
            label={`${markPercentage}%`}
            color={getMarkColor(markValue, selectedExamData?.totalMark)}
            size="small"
          />
        ) : (
          <Typography variant="body2" color="text.disabled">
            -
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

