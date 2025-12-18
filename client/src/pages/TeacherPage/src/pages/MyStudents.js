'use strict';

import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  OutlinedInput,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Tooltip,
} from '@mui/material';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../sections/@dashboard/user';
import { useSelector } from 'react-redux';
import api from '../../../../utils/api';
import { formatDate } from '../utils/formatDate';

const TABLE_HEAD = [
  { id: 'name', label: 'Students Name', alignRight: false },
  { id: 'roll', label: 'Roll', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'class', label: 'Class', alignRight: false },
  { id: 'dateOfBirth', label: 'Date of Birth', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false, sortable: false },
];

function descendingComparator(a, b, orderBy) {
  let aValue;
  let bValue;

  switch (orderBy) {
    case 'name':
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
      break;
    case 'roll':
      aValue = a.rollNumber || 0;
      bValue = b.rollNumber || 0;
      break;
    case 'class':
      aValue = a.classIn?.className || '';
      bValue = b.classIn?.className || '';
      break;
    case 'phone':
      aValue = a.phoneNumber || '';
      bValue = b.phoneNumber || '';
      break;
    case 'dateOfBirth':
      aValue = a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : 0;
      bValue = b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : 0;
      break;
    case 'address':
      aValue = a.address || '';
      bValue = b.address || '';
      break;
    default:
      aValue = a[orderBy] || '';
      bValue = b[orderBy] || '';
  }

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => {
        const name = `${_user.firstName} ${_user.lastName}`;
        const roll = `#${String(_user.rollNumber || '').padStart(2, '0')}`;
        return (
          name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          roll.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
      }
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function MyStudents() {
  const classro = useSelector((state) => {
    return state.teacher?.teacherclass?.classro;
  });
  const [USERLIST, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      if (classro?._id) {
        try {
          setLoading(true);
          const res = await api.get('/admin/students');
          const allStudents = res.data.students || [];
          const classStudents = allStudents
            .filter((student) => {
              const studentClassId = student.classIn?._id || student.classIn;
              return (
                studentClassId === classro._id ||
                studentClassId?.toString() === classro._id?.toString()
              );
            })
            .map((student, index) => ({
              ...student,
              rollNumber: student.rollNumber || index + 1,
            }));
          setUserList(classStudents);
        } catch (error) {
          setUserList([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [classro]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST?.map((n) => `${n.firstName} ${n.lastName}`);
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
      newSelected = newSelected.concat(selected?.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected?.slice(0, selectedIndex),
        selected?.slice(selectedIndex + 1)
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

  const handleDeleteStudent = (studentId) => {};

  const handleEditStudent = (studentId) => {};

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST?.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers?.length === 0;

  return (
    <Page title="Students List">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Students List
            </Typography>
          </Stack>
        </Stack>

        <Card
          sx={{
            borderRadius: 2,
            boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Students Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search by name or roll"
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: 'text.disabled', width: 20, height: 20 }}
                      />
                    </InputAdornment>
                  }
                  sx={{
                    width: { xs: '100%', sm: 280 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                  }}
                />
                <FormControl
                  sx={{
                    minWidth: { xs: '100%', sm: 160 },
                  }}
                >
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <Iconify
                          icon="eva:calendar-fill"
                          sx={{ color: 'text.disabled', width: 20, height: 20 }}
                        />
                      </InputAdornment>
                    }
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="30">Last 30 days</MenuItem>
                    <MenuItem value="7">Last 7 days</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Box>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 1200 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row) => {
                      const {
                        _id,
                        firstName,
                        lastName,
                        email,
                        phoneNumber,
                        classIn,
                        profileImage,
                        dateOfBirth,
                        address,
                        rollNumber,
                      } = row;
                      const name = `${firstName} ${lastName}`;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      const roll = `#${String(rollNumber || '').padStart(2, '0')}`;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                              sx={{ py: 2 }}
                            >
                              <Avatar
                                alt={name}
                                src={profileImage}
                                sx={{ width: 40, height: 40 }}
                              />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {roll}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {address || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {classIn?.className || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(dateOfBirth)}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {phoneNumber || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditStudent(_id)}
                                  sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                      color: 'primary.main',
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <Iconify icon="eva:edit-fill" width={20} height={20} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteStudent(_id)}
                                  sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                      color: 'error.main',
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <Iconify icon="eva:trash-2-fill" width={20} height={20} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={USERLIST?.length}
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
