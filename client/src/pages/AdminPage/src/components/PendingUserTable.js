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
import PendingUserTableRow from './PendingUserTableRow';

export default function PendingUserTable({
  users,
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
  const isUserNotFound = users?.length === 0;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users?.length) : 0;

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <UserListHead
            order={order}
            orderBy={orderBy}
            headLabel={[
              { id: 'name', label: 'Name', alignRight: false },
              { id: 'email', label: 'Email', alignRight: false },
              { id: 'role', label: 'Role', alignRight: false },
              { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
              { id: 'status', label: 'Status', alignRight: false },
              { id: 'action', label: 'Action', alignRight: false, sortable: false },
            ]}
            rowCount={users?.length}
            numSelected={selected?.length}
            onRequestSort={onRequestSort}
            onSelectAllClick={onSelectAllClick}
          />
          <TableBody>
            {users
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((user) => {
                const name = `${user.firstName} ${user.lastName}`;
                const isItemSelected = selected.indexOf(name) !== -1;

                return (
                  <PendingUserTableRow
                    key={user._id}
                    user={user}
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

          {isUserNotFound && (
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

