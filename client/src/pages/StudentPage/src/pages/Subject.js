import { filter } from "lodash";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStudentClass, getTeachers } from "../../../../slices/studentSlice";
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  Chip,
} from "@mui/material";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import GenericResponsiveTable, {
  getTableConfig,
} from "../../../../components/GenericResponsiveTable";

const Subject = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.student.userInfo);
  const classData = useSelector((state) => state.student.myClass);
  const teachers = useSelector(
    (state) => state?.student?.teachers?.teacherlist,
  );

  const classroom = userInfo?.user?.classIn;

  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    if (classroom && !classData) {
      dispatch(
        getStudentClass(
          typeof classroom === "object"
            ? classroom._id || classroom.className
            : classroom,
        ),
      );
    }
    dispatch(getTeachers());
  }, [dispatch, classroom, classData]);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  if (!classroom) {
    return (
      <Page title="Subject List">
        <Container maxWidth="xl">
          <Card sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              No class information available
            </Typography>
          </Card>
        </Container>
      </Page>
    );
  }

  const subjects = classData?.classroom?.subjects || [];
  const subjectList = subjects.map((subject) => {
    const subjectName = typeof subject === "object" ? subject?.name : subject;
    const myteacher = teachers?.find((el) => {
      const teacherSubject =
        typeof el.subject === "object" ? el.subject?.name : el.subject;
      return teacherSubject === subjectName;
    });
    return {
      _id: typeof subject === "object" ? subject?._id : subject,
      subjectName,
      className:
        classData?.classroom?.className ||
        classData?.classroom?.classesName ||
        "Class",
      teacherName: myteacher
        ? `${myteacher?.firstName} ${myteacher?.lastName}`
        : "Not assigned",
    };
  });

  const filteredSubjects = filterName
    ? filter(subjectList, (subject) => {
        const searchQuery = filterName.toLowerCase();
        return (
          subject.subjectName.toLowerCase().indexOf(searchQuery) !== -1 ||
          subject.teacherName.toLowerCase().indexOf(searchQuery) !== -1
        );
      })
    : subjectList;

  const config = getTableConfig("student-subjects");

  return (
    <Page title="Subject List">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Subject List
          </Typography>
        </Stack>

        <Card
          sx={{
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.customShadows?.z16 ||
              "0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.neutral",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Subjects Information
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`Total: ${subjectList.length}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600, bgcolor: "background.paper" }}
                />
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
                  sx={{
                    width: { xs: "100%", sm: 300 },
                    bgcolor: "background.paper",
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <GenericResponsiveTable
            config={config}
            data={filteredSubjects}
            loading={!classData}
            actions={{}}
            filters={{
              filterName,
            }}
            pagination={{}}
          />
        </Card>
      </Container>
    </Page>
  );
};

export default Subject;
