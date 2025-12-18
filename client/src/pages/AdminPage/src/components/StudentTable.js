'use strict';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
} from '@mui/material';
import Scrollbar from './Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import SearchNotFound from './SearchNotFound';
import StudentTableRow from './StudentTableRow';

export default function StudentTable({
  students,
  order,
  orderBy,
  selected,
  onRequestSort,
  onSelectAllClick,
  onSelect,
  filterName,
  page,
  rowsPerPage,
}) {
  const isStudentNotFound = students?.length === 0;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students?.length) : 0;

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 1000 }}>
        <Table>
          <UserListHead
            order={order}
            orderBy={orderBy}
            headLabel={[
              { id: 'name', label: 'Student Name', alignRight: false },
              { id: 'email', label: 'Email', alignRight: false },
              { id: 'gender', label: 'Gender', alignRight: false },
              { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
              { id: 'class', label: 'Class', alignRight: false },
              { id: 'action', label: 'Action', alignRight: false, sortable: false },
            ]}
            rowCount={students?.length}
            numSelected={selected?.length}
            onRequestSort={onRequestSort}
            onSelectAllClick={onSelectAllClick}
          />
          <TableBody>
            {students
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((student) => {
                const name = `${student.firstName} ${student.lastName}`;
                const isItemSelected = selected.indexOf(name) !== -1;

                return (
                  <StudentTableRow
                    key={student._id}
                    student={student}
                    isItemSelected={isItemSelected}
                    onSelect={onSelect}
                  />
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>

          {isStudentNotFound && (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                  <SearchNotFound searchQuery={filterName} />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}


