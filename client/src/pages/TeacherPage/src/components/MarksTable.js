'use strict';

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  CircularProgress,
} from '@mui/material';
import Scrollbar from './Scrollbar';
import MarksTableRow from './MarksTableRow';
import MarksTableHeader from './MarksTableHeader';

export default function MarksTable({
  students,
  loading,
  selectedExamData,
  register,
  errors,
  watchedValues,
}) {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
          <CircularProgress />
        </TableCell>
      </TableRow>
    );
  }

  if (students.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
          <Typography variant="body2" color="text.secondary">
            No students found in this class.
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <MarksTableHeader />
          <TableBody>
            {students.map((student) => (
              <MarksTableRow
                key={student._id}
                student={student}
                selectedExamData={selectedExamData}
                register={register}
                errors={errors}
                watchedValues={watchedValues}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}

