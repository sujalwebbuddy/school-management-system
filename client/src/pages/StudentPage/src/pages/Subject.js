import { filter } from "lodash";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStudentClass, getTeachers } from "../../../../slices/studentSlice";
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
} from "@mui/material";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import SearchNotFound from "../components/SearchNotFound";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "subjectName", label: "Subject Name", alignRight: false },
  { id: "class", label: "Class", alignRight: false },
  { id: "teacher", label: "Teacher", alignRight: false },
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

// ----------------------------------------------------------------------

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
      (_subject) => _subject.subjectName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

const Subject = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.student.userInfo);
  const classData = useSelector((state) => state.student.myClass);
  const teachers = useSelector((state) => state?.student?.teachers?.teacherlist);

  const className = userInfo?.user?.classIn;

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("subjectName");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (className && !classData) {
      dispatch(getStudentClass(typeof className === 'object' ? className._id || className.className : className));
    }
    dispatch(getTeachers());
  }, [dispatch, className, classData]);

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

  if (!className) {
    return (
      <Page title="Subject List">
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '400px' }}
          >
            <Typography variant="h6" color="text.secondary">
              No class information available
            </Typography>
          </Stack>
        </Container>
      </Page>
    );
  }

  const subjects = classData?.classroom?.subjects || [];
  const subjectList = subjects.map((subject) => {
    const subjectName = typeof subject === "object" ? subject?.name : subject;
    const myteacher = teachers?.find((el) => {
      const teacherSubject = typeof el.subject === "object" ? el.subject?.name : el.subject;
      return teacherSubject === subjectName;
    });
    return {
      _id: typeof subject === "object" ? subject?._id : subject,
      subjectName,
      className: classData?.classroom?.className || classData?.classroom?.classesName || 'Class',
      teacherName: myteacher ? `${myteacher?.firstName} ${myteacher?.lastName}` : 'Not assigned',
    };
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjectList?.length) : 0;

  const filteredSubjects = applySortFilter(
    subjectList,
    getComparator(order, orderBy),
    filterName
  );

  const isSubjectNotFound = filteredSubjects?.length === 0;

  return (
    <Page title="Subject List">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Subject List
          </Typography>
        </Stack>

        <Card>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Subjects Information</Typography>
              <Label color="info" variant="ghost">
                Total: {subjectList?.length || 0}
              </Label>
            </Stack>
            <OutlinedInput
              value={filterName}
              onChange={handleFilterByName}
              placeholder="Search subjects..."
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
                  {!classData ? (
                    <TableRow>
                      <TableCell align="center" colSpan={3} sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Loading subjects...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredSubjects
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row) => {
                      const { _id, subjectName, className, teacherName } = row;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                        >
                          <TableCell component="th" scope="row" sx={{ px: 3, py: 2 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={4}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {subjectName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="default">
                              {className}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color="info">
                              {teacherName}
                            </Label>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>

                {isSubjectNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={3} sx={{ py: 3 }}>
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
            count={subjectList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
};

export default Subject;
