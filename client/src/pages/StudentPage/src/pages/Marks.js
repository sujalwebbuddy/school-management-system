import { filter } from "lodash";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  OutlinedInput,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Page from "../components/Page";
import Iconify from "../components/Iconify";
import GenericResponsiveTable, {
  getTableConfig,
} from "../../../../components/GenericResponsiveTable";

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
  const [filterName, setFilterName] = useState("");

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setFilterName("");
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const examList = useMemo(() => {
    if (!selectedSubject || !exams) {
      return [];
    }

    const subjectId =
      typeof selectedSubject === "object"
        ? selectedSubject._id
        : selectedSubject;
    const filteredExams = exams.filter((el) => {
      const examSubjectId =
        typeof el.subject === "object" ? el.subject._id : el.subject;
      return examSubjectId === subjectId;
    });

    return filteredExams.map((exam) => {
      const yourMark = exam?.marks?.[myid] || 0;
      const totalMark = exam?.totalMark || 0;
      const percentage =
        totalMark > 0 ? Math.round((yourMark / totalMark) * 100) : 0;

      return {
        _id: exam._id,
        examName: exam?.name || "Unnamed Exam",
        totalMark,
        yourMark,
        percentage,
      };
    });
  }, [selectedSubject, exams, myid]);

  const filteredExams = filterName
    ? filter(examList, (exam) => {
        const searchQuery = filterName.toLowerCase();
        return exam.examName.toLowerCase().indexOf(searchQuery) !== -1;
      })
    : examList;

  const config = getTableConfig("student-marks");

  return (
    <Page title="Marks">
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Marks
          </Typography>
        </Stack>

        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: (theme) => theme.customShadows?.z8,
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <FormControl fullWidth sx={{ maxWidth: 320 }}>
              <InputLabel id="subject-select-label">Select Subject</InputLabel>
              <Select
                labelId="subject-select-label"
                id="subject-select"
                value={selectedSubject || ""}
                label="Select Subject"
                onChange={handleSubjectChange}
              >
                {subjects?.map((subject, index) => {
                  const subjectName =
                    typeof subject === "object" ? subject?.name : subject;
                  const subjectId =
                    typeof subject === "object" ? subject?._id : subject;
                  return (
                    <MenuItem key={subjectId || index} value={subject}>
                      {subjectName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Card>

        {selectedSubject ? (
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
                  Marks Information
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  <Chip
                    label={`Total Exams: ${examList.length}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, bgcolor: "background.paper" }}
                  />
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
              data={filteredExams}
              actions={{}}
              filters={{
                filterName,
              }}
              pagination={{}}
            />
          </Card>
        ) : (
          <Card
            sx={{
              borderRadius: 2,
              p: 10,
              textAlign: "center",
              boxShadow: (theme) => theme.customShadows?.z8,
            }}
          >
            <Iconify
              icon="eva:info-outline"
              sx={{ width: 64, height: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Please select a subject to view your marks
            </Typography>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default Marks;
