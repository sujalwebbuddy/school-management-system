'use strict';

import { useEffect, useState } from 'react';
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  TablePagination,
  Chip,
} from '@mui/material';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { getNoApprovedUsers } from '../../../../slices/adminSlice';
import { getComparator, applySortFilter } from '../utils/tableUtils';
import { UserListToolbar } from '../sections/@dashboard/user';
import PendingUserTable from '../components/PendingUserTable';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false, sortable: false },
];

export default function User() {
  const dispatch = useDispatch();
  const users = useSelector((state) => {
    const usersData = state?.admin?.usersNotApproved;
    return Array.isArray(usersData) ? usersData : [];
  });

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getNoApprovedUsers());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users?.map((n) => `${n.firstName} ${n.lastName}`);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  return (
    <Page title="Pending Users">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Pending Users
            </Typography>
            <Chip label={`Total: ${users.length}`} color="primary" variant="outlined" />
          </Stack>
        </Stack>

        <Card
          sx={{
            borderRadius: 2,
            boxShadow:
              '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <UserListToolbar
              numSelected={selected?.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </Box>

          <PendingUserTable
            users={filteredUsers}
            order={order}
            orderBy={orderBy}
            selected={selected}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
            onSelect={handleClick}
            filterName={filterName}
            page={page}
            rowsPerPage={rowsPerPage}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={users?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
                {
                  fontWeight: 500,
                },
            }}
          />
        </Card>
      </Container>
    </Page>
  );
}
