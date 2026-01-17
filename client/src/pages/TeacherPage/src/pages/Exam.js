'use strict';

import { useState } from 'react';
import {
  Card,
  Table,
  Stack,
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
  Chip,
  Paper,
} from '@mui/material';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../sections/@dashboard/user';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/formatDate';
import { getComparator, applySortFilter } from '../utils/tableUtils';
import AddExamModal from '../components/AddExamModal';
import ExamMoreMenu from '../components/ExamMoreMenu';

const TABLE_HEAD = [
  { id: 'name', label: 'Exam Name', alignRight: false },
  { id: 'class', label: 'Class', alignRight: false },
  { id: 'subject', label: 'Subject', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'totalMark', label: 'Total Marks', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false, sortable: false },
];

export default function Exam() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const exams = useSelector((state) => {
    return state.teacher?.exams?.exams || [];
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = exams?.map((n) => n.name);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - exams?.length) : 0;

  const filteredExams = applySortFilter(
    exams,
    getComparator(order, orderBy),
    filterName
  );

  const isExamNotFound = filteredExams?.length === 0;
  const hasNoExams = exams?.length === 0;
  const hasSearchFilter = filterName.trim().length > 0;

  return (
    <Page title="Exams">
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
              Exam List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpen}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              New Exam
            </Button>
          </Stack>
        </Stack>

        <AddExamModal open={open} onClose={handleClose} />

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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Exams Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`Total: ${exams.length}`}
                  color="primary"
                  variant="outlined"
                />
                <OutlinedInput
                  value={filterName}
                  onChange={handleFilterByName}
                  placeholder="Search exams..."
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
              </Stack>
            </Stack>
          </Box>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={exams?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredExams
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => {
                      const { _id, name, totalMark, dateOf } = row;
                      const subject = row.subjectId?.name || row.subjectId;
                      const className = row.classId?.className || row.classId;
                      const isItemSelected = selected.indexOf(name) !== -1;

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
                            <Typography variant="subtitle2" sx={{ py: 2 }}>
                              {name}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Chip
                              label={className || 'N/A'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Chip
                              label={subject || 'N/A'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(dateOf)}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" fontWeight={600}>
                              {totalMark || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <ExamMoreMenu
                              id={_id}
                              name={name}
                              dateOf={dateOf}
                              totalMark={totalMark}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>

                {isExamNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 6 }}>
                        {hasNoExams ? (
                          <Paper
                            sx={{
                              textAlign: 'center',
                              py: 5,
                              px: 3,
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 2,
                              }}
                            >
                              <Iconify
                                icon="eva:file-text-outline"
                                sx={{
                                  width: 80,
                                  height: 80,
                                  color: 'text.disabled',
                                }}
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ color: 'text.primary', fontWeight: 600 }}
                            >
                              No Exams Yet
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary', mb: 3, maxWidth: 400, mx: 'auto' }}
                            >
                              You haven't created any exams yet. Click the "New Exam" button to get started and create your first exam.
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<Iconify icon="eva:plus-fill" />}
                              onClick={handleOpen}
                              sx={{
                                textTransform: 'none',
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                              }}
                            >
                              Create Your First Exam
                            </Button>
                          </Paper>
                        ) : hasSearchFilter ? (
                          <SearchNotFound searchQuery={filterName} />
                        ) : (
                          <Paper
                            sx={{
                              textAlign: 'center',
                              py: 5,
                              px: 3,
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 2,
                              }}
                            >
                              <Iconify
                                icon="eva:search-outline"
                                sx={{
                                  width: 80,
                                  height: 80,
                                  color: 'text.disabled',
                                }}
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ color: 'text.primary', fontWeight: 600 }}
                            >
                              No Exams Found
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}
                            >
                              We couldn't find any exams matching your search criteria. Try adjusting your search or create a new exam.
                            </Typography>
                          </Paper>
                        )}
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
            count={exams?.length}
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
