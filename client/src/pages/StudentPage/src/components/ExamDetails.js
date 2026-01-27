import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Box,
  Alert,
  Container,
  Divider,
  Grid,
} from "@mui/material";
import {
  Event,
  Abc,
  Class,
  Grade,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Page from "../components/Page";
import Label from "../components/Label";
import { formatDate } from "../../../../pages/TeacherPage/src/utils/formatDate";

export default function ExamDetails() {
  const location = useLocation();
  const { id } = useParams();
  const examId = location.state || id;
  const examList = useSelector((state) => {
    return state?.student?.exams?.examlist;
  });
  const userInfo = useSelector((state) => {
    return state?.user?.userInfo;
  });
  const studentId = userInfo?._id || userInfo?.id;

  const exam = examList?.find((el) => el._id === examId);

  const getStudentMark = () => {
    if (!exam?.marks || !studentId) {
      return null;
    }
    const marks = exam.marks;
    if (marks instanceof Map) {
      return marks.get(studentId);
    }
    if (typeof marks === "object" && marks !== null) {
      return marks[studentId];
    }
    return null;
  };

  const studentMark = getStudentMark();
  const markValue = studentMark?.mark || studentMark;
  const hasMark = markValue !== undefined && markValue !== null;

  const today = new Date();
  const examDate = exam?.dateOf ? new Date(exam.dateOf) : null;
  const isActive = examDate && today.getTime() < examDate.getTime();
  const isPast = examDate && today.getTime() >= examDate.getTime();

  if (!exam) {
    return (
      <Page title="Exam Details">
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 5 }}
          >
            Exam information not found.
          </Typography>
        </Container>
      </Page>
    );
  }

  const DetailItem = ({ icon: Icon, label, value, color = "primary" }) => (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Box
        sx={{
          bgcolor: `${color}.lighter`,
          color: `${color}.main`,
          p: 1.5,
          borderRadius: 1.5,
          display: "flex",
          height: "fit-content",
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, textTransform: "uppercase" }}
        >
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {value || "N/A"}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Page title="Exam Details">
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Exam Details
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows?.z16,
              }}
            >
              <CardHeader
                title={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {exam.name}
                    </Typography>
                    <Label
                      variant="soft"
                      color={isActive ? "info" : "success"}
                      sx={{ textTransform: "uppercase", py: 2, px: 2 }}
                    >
                      {isActive ? "Upcoming" : "Completed"}
                    </Label>
                  </Stack>
                }
                sx={{ p: 4, bgcolor: "background.neutral" }}
              />
              <Divider />
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DetailItem
                      icon={Event}
                      label="Exam Date"
                      value={formatDate(exam.dateOf)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DetailItem
                      icon={Abc}
                      label="Subject"
                      value={exam?.subjectId?.name || exam?.subject}
                      color="info"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DetailItem
                      icon={Class}
                      label="Classroom"
                      value={exam?.classId?.className || exam?.classname}
                      color="warning"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DetailItem
                      icon={Grade}
                      label="Total Marks"
                      value={exam.totalMark}
                      color="error"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {hasMark ? (
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: (theme) => theme.customShadows?.primary,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <CheckCircle sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
                    <Typography
                      variant="h6"
                      sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}
                    >
                      Your Score
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                      {markValue}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                      out of {exam.totalMark}
                    </Typography>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {Math.round((markValue / exam.totalMark) * 100)}%
                      </Typography>
                      <Typography variant="caption">EXAM PERCENTAGE</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : isActive ? (
                <Alert
                  severity="info"
                  variant="outlined"
                  icon={<Schedule fontSize="inherit" />}
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="subtitle1" fontWeight={700}>
                    Upcoming Exam
                  </Typography>
                  This exam hasn't taken place yet. Results will be available
                  after the exam date.
                </Alert>
              ) : (
                <Alert
                  severity="warning"
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="subtitle1" fontWeight={700}>
                    Marks Pending
                  </Typography>
                  This exam is completed. Your marks are currently being graded
                  by the teacher.
                </Alert>
              )}

              {hasMark && studentMark?.submittedAt && (
                <Card
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700, display: "block", mb: 1 }}
                  >
                    RESULT METADATA
                  </Typography>
                  <Typography variant="body2">
                    Graded on:{" "}
                    {new Date(studentMark.submittedAt).toLocaleDateString()}
                  </Typography>
                </Card>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
