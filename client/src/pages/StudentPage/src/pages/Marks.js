import { filter } from "lodash";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
// material
import {
  Card,
  Table,
  Stack,
  Box,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableSortLabel,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import SearchNotFound from "../components/SearchNotFound";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "examName", label: "Exam Name", alignRight: false },
  { id: "totalMark", label: "Total Mark", alignRight: false },
  { id: "yourMark", label: "Your Mark", alignRight: false },
  { id: "percentage", label: "Percentage", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
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
      (_exam) => _exam.examName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

const Marks = () => {
  const subjects = useSelector((state) => {
    return state?.student?.myClass?.classr?.subjects;
  });

  const exams = useSelector((state) => {
    return state?.student?.exams?.examlist;
  });

  const myid = useSelector((state) => {
    return state?.student?.userInfo?.user?._id;
  });

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("examName");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setPage(0);
    setFilterName("");
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
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

  const examList = useMemo(() => {
    if (!selectedSubject || !exams) {
      return [];
    }

    const subjectId = typeof selectedSubject === "object" ? selectedSubject._id : selectedSubject;
    const filteredExams = exams.filter((el) => {
      const examSubjectId = typeof el.subject === "object" ? el.subject._id : el.subject;
      return examSubjectId === subjectId;
    });

    return filteredExams.map((exam) => {
      const yourMark = exam?.marks?.[myid] || 0;
      const totalMark = exam?.totalMark || 0;
      const percentage = totalMark > 0 ? Math.round((yourMark / totalMark) * 100) : 0;
      const isPassed = percentage >= 50;

      return {
        _id: exam._id,
        examName: exam?.name || 'Unnamed Exam',
        totalMark,
        yourMark,
        percentage,
        status: isPassed ? 'Passed' : 'Failed',
        isPassed,
      };
    });
  }, [selectedSubject, exams, myid]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - examList?.length) : 0;

  const filteredExams = applySortFilter(
    examList,
    getComparator(order, orderBy),
    filterName
  );

  const isExamNotFound = filteredExams?.length === 0 && selectedSubject;

  return (
    <Page title="Marks">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Marks
          </Typography>
        </Stack>

        <Card sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 3 }}
          >
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel id="subject-select-label">Select Subject</InputLabel>
              <Select
                labelId="subject-select-label"
                id="subject-select"
                value={selectedSubject || ""}
                label="Select Subject"
                onChange={handleSubjectChange}
              >
                {subjects?.map((subject, index) => {
                  const subjectName = typeof subject === "object" ? subject?.name : subject;
                  const subjectId = typeof subject === "object" ? subject?._id : subject;
                  return (
                    <MenuItem key={subjectId || index} value={subject}>
                      {subjectName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {selectedSubject && (
          <Card>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 3 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Marks Information</Typography>
                <Label color="info" variant="ghost">
                  Total: {examList?.length || 0}
                </Label>
              </Stack>
              <OutlinedInput
                value={filterName}
                onChange={handleFilterByName}
                placeholder="Search exams..."
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
                sx={{ width: 300 }}
              />
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {TABLE_HEAD.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.alignRight ? 'right' : 'left'}
                          sortDirection={orderBy === headCell.id ? order : false}
                        >
                          <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                          >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                              <Box sx={{ ...visuallyHidden }}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExams
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      ?.map((row) => {
                        const { _id, examName, totalMark, yourMark, percentage, status, isPassed } = row;

                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                          >
                            <TableCell component="th" scope="row" sx={{ px: 3, py: 2 }}>
                              <Typography variant="subtitle2" noWrap>
                                {examName}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {totalMark}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="medium">
                                {yourMark}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {percentage}%
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Label
                                variant="ghost"
                                color={isPassed ? "success" : "error"}
                              >
                                {status}
                              </Label>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={5} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isExamNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={5} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={examList?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}

        {!selectedSubject && (
          <Card>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '400px' }}
            >
              <Typography variant="h6" color="text.secondary">
                Please select a subject to view marks
              </Typography>
            </Stack>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default Marks;
