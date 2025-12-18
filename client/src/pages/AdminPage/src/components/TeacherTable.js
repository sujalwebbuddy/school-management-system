'use strict';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import Scrollbar from './Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import SearchNotFound from './SearchNotFound';
import TeacherTableRow from './TeacherTableRow';

export default function TeacherTable({
  teachers,
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
  const isTeacherNotFound = teachers?.length === 0;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - teachers?.length) : 0;

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 1000 }}>
        <Table>
          <UserListHead
            order={order}
            orderBy={orderBy}
            headLabel={[
              { id: 'name', label: 'Teacher Name', alignRight: false },
              { id: 'email', label: 'Email', alignRight: false },
              { id: 'gender', label: 'Gender', alignRight: false },
              { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
              { id: 'subject', label: 'Subject', alignRight: false },
              { id: 'action', label: 'Action', alignRight: false, sortable: false },
            ]}
            rowCount={teachers?.length}
            numSelected={selected?.length}
            onRequestSort={onRequestSort}
            onSelectAllClick={onSelectAllClick}
          />
          <TableBody>
            {teachers
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((teacher) => {
                const name = `${teacher.firstName} ${teacher.lastName}`;
                const isItemSelected = selected.indexOf(name) !== -1;

                return (
                  <TeacherTableRow
                    key={teacher._id}
                    teacher={teacher}
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

          {isTeacherNotFound && (
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

