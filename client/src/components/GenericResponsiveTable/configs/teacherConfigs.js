import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import HomeworkMoreMenu from "../../../pages/TeacherPage/src/components/HomeworkMoreMenu";
import ExamMoreMenu from "../../../pages/TeacherPage/src/components/ExamMoreMenu";
import Iconify from "../../../pages/TeacherPage/src/components/Iconify";
import {
  Assignment as AssignmentIcon,
  Event as EventIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { formatDate } from "../../../pages/TeacherPage/src/utils/formatDate";

function getQuestionCount(homework) {
  if (Array.isArray(homework?.questions)) {
    return homework.questions.length;
  }
  if (
    homework?.optionA &&
    homework?.optionB &&
    homework?.optionC &&
    homework?.optionD
  ) {
    return 1;
  }
  return 0;
}

function renderHomeworkCard(homework) {
  const questionCount = getQuestionCount(homework);

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: "primary.lighter",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AssignmentIcon />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {homework?.name || "Untitled"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block" }}
            >
              {homework?.description || "No description"}
            </Typography>
          </Box>
          <HomeworkMoreMenu homeworkId={homework?._id} />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Chip
            label={`${questionCount} ${questionCount === 1 ? "Question" : "Questions"}`}
            color="primary"
            variant="soft"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ ml: "auto" }}
          >
            <CalendarIcon sx={{ fontSize: 14, color: "error.main" }} />
            <Typography variant="caption" color="error.main" fontWeight={700}>
              {formatDate(homework?.dateOf)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

export const teacherTableConfigs = {
  homework: {
    entityType: "homework",
    title: "Homework",
    searchableFields: [],
    features: {
      sortable: false,
      filterable: false,
      paginated: false,
      rowClickable: false,
    },
    columns: [
      {
        id: "name",
        label: "Name",
        render: (value, homework) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {homework?.name || "Untitled"}
          </Typography>
        ),
      },
      {
        id: "description",
        label: "Description",
        render: (value, homework) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 300 }}
          >
            {homework?.description || "No description"}
          </Typography>
        ),
      },
      {
        id: "questions",
        label: "Questions",
        align: "center",
        render: (value, homework) => {
          const questionCount = getQuestionCount(homework);
          return (
            <Chip
              label={`${questionCount} Question${questionCount !== 1 ? "s" : ""}`}
              color="primary"
              size="small"
            />
          );
        },
      },
      {
        id: "dueDate",
        label: "Due Date",
        align: "center",
        render: (value, homework) => (
          <Chip
            label={formatDate(homework?.dateOf)}
            color="error"
            variant="outlined"
            size="small"
          />
        ),
      },
      {
        id: "actions",
        label: "Action",
        sortable: false,
        align: "right",
        render: (value, homework) => (
          <HomeworkMoreMenu homeworkId={homework?._id} />
        ),
      },
    ],
    cardRenderer: renderHomeworkCard,
    emptyMessage: "No homework found",
  },
  exams: {
    entityType: "exams",
    searchableFields: ["name", "subjectId.name", "classId.className"],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: false,
    },
    columns: [
      {
        id: "name",
        label: "Exam Name",
        render: (value, exam) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {exam?.name || "Untitled"}
          </Typography>
        ),
      },
      {
        id: "class",
        label: "Class",
        render: (value, exam) => {
          const className = exam?.classId?.className || "N/A";
          return <Chip label={className} size="small" variant="outlined" />;
        },
      },
      {
        id: "subject",
        label: "Subject",
        render: (value, exam) => {
          const subjectName = exam?.subjectId?.name || "N/A";
          return (
            <Chip
              label={subjectName}
              size="small"
              color="primary"
              variant="outlined"
            />
          );
        },
      },
      {
        id: "dateOf",
        label: "Date",
        render: (value, exam) => (
          <Typography variant="body2" color="text.secondary">
            {formatDate(exam?.dateOf)}
          </Typography>
        ),
      },
      {
        id: "totalMark",
        label: "Total Marks",
        align: "center",
        render: (value, exam) => (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {exam?.totalMark || 0}
          </Typography>
        ),
      },
      {
        id: "actions",
        label: "Action",
        sortable: false,
        align: "right",
        render: (value, exam) => (
          <ExamMoreMenu
            id={exam?._id}
            name={exam?.name}
            dateOf={exam?.dateOf}
            totalMark={exam?.totalMark}
          />
        ),
      },
    ],
    cardRenderer: (exam) => (
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: "warning.lighter",
            color: "warning.main",
            display: "flex",
          }}
        >
          <EventIcon />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {exam?.name || "Untitled"}
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                <Chip
                  label={exam?.classId?.className || "N/A"}
                  size="small"
                  variant="soft"
                  sx={{ height: 20, fontSize: "0.65rem" }}
                />
                <Chip
                  label={exam?.subjectId?.name || "N/A"}
                  size="small"
                  color="primary"
                  variant="soft"
                  sx={{ height: 20, fontSize: "0.65rem" }}
                />
              </Stack>
            </Box>
            <ExamMoreMenu
              id={exam?._id}
              name={exam?.name}
              dateOf={exam?.dateOf}
              totalMark={exam?.totalMark}
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarIcon sx={{ fontSize: 13, color: "text.disabled" }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(exam?.dateOf)}
              </Typography>
            </Stack>
            <Typography variant="subtitle2" fontWeight={700}>
              Max Marks: {exam?.totalMark || 0}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    ),
    emptyMessage: "No exams found",
  },
  "my-students": {
    entityType: "students",
    searchableFields: [
      "firstName",
      "lastName",
      "rollNumber",
      "address",
      "phoneNumber",
    ],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: false,
    },
    columns: [
      {
        id: "name",
        label: "Students Name",
        render: (value, student) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={`${student.firstName} ${student.lastName}`}
              src={student.profileImage}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle2" noWrap>
              {`${student.firstName} ${student.lastName}`}
            </Typography>
          </Stack>
        ),
      },
      {
        id: "rollNumber",
        label: "Roll",
        render: (value, student) => (
          <Typography variant="body2" color="text.secondary">
            {`#${String(student.rollNumber || "").padStart(2, "0")}`}
          </Typography>
        ),
      },
      {
        id: "address",
        label: "Address",
        render: (value, student) => (
          <Typography variant="body2" color="text.secondary">
            {student.address || "N/A"}
          </Typography>
        ),
      },
      {
        id: "class",
        label: "Class",
        render: (value, student) => (
          <Typography variant="body2" color="text.secondary">
            {student.classIn?.className || "N/A"}
          </Typography>
        ),
      },
      {
        id: "dateOfBirth",
        label: "Date of Birth",
        render: (value, student) => (
          <Typography variant="body2" color="text.secondary">
            {formatDate(student.dateOfBirth)}
          </Typography>
        ),
      },
      {
        id: "phoneNumber",
        label: "Phone",
        render: (value, student) => (
          <Typography variant="body2" color="text.secondary">
            {student.phoneNumber || "N/A"}
          </Typography>
        ),
      },
      {
        id: "actions",
        label: "Action",
        sortable: false,
        align: "right",
        render: (value, student) => (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="Edit">
              <IconButton size="small">
                <Iconify icon="eva:edit-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error">
                <Iconify icon="eva:trash-2-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    cardRenderer: (student) => (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            alt={`${student.firstName} ${student.lastName}`}
            src={student.profileImage}
            sx={{
              width: 56,
              height: 56,
              boxShadow: (theme) => theme.customShadows?.z8,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {`${student.firstName} ${student.lastName}`}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`Roll #${student.rollNumber}`}
                size="small"
                variant="soft"
                color="info"
                sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
              />
              <Typography variant="caption" color="text.secondary">
                • {student.classIn?.className || "N/A"}
              </Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" sx={{ bgcolor: "action.hover" }}>
              <Iconify icon="eva:edit-fill" width={16} height={16} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              sx={{ bgcolor: "error.lighter" }}
            >
              <Iconify icon="eva:trash-2-fill" width={16} height={16} />
            </IconButton>
          </Stack>
        </Stack>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarIcon sx={{ fontSize: 13, color: "text.disabled" }} />
              <Typography variant="caption" color="text.secondary">
                Birth: {formatDate(student.dateOfBirth)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PeopleIcon sx={{ fontSize: 13, color: "text.disabled" }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {student.phoneNumber || "No Phone"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify
                icon="eva:pin-fill"
                width={13}
                height={13}
                sx={{ color: "text.disabled" }}
              />
              <Typography variant="caption" color="text.secondary" noWrap>
                {student.address || "No address provided"}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    ),
    emptyMessage: "No students found",
  },
  "student-marks": {
    entityType: "marks",
    searchableFields: ["firstName", "lastName", "rollNumber"],
    features: {
      sortable: true,
      filterable: true,
      paginated: false,
      rowClickable: false,
    },
    columns: [
      {
        id: "name",
        label: "Student Name",
        render: (value, student) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={`${student.firstName} ${student.lastName}`}
              src={student.profileImage}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle2" noWrap>
              {`${student.firstName} ${student.lastName}`}
            </Typography>
          </Stack>
        ),
      },
      {
        id: "rollNumber",
        label: "Roll",
        render: (value, student) => (
          <Typography variant="body2" color="text.secondary">
            {`#${String(student.rollNumber || "").padStart(2, "0")}`}
          </Typography>
        ),
      },
      {
        id: "class",
        label: "Class",
        render: (value, student) => (
          <Chip
            label={student.classIn?.className || "N/A"}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        id: "totalMarks",
        label: "Total Marks",
        align: "center",
        render: (value, student, index, props) => (
          <Typography variant="body2" fontWeight={600}>
            {props.selectedExamData?.totalMark || "N/A"}
          </Typography>
        ),
      },
      {
        id: "marksObtained",
        label: "Marks Obtained",
        align: "center",
        render: (value, student, index, props) => {
          const MarkInputField =
            require("../../../pages/TeacherPage/src/components/MarkInputField").default;
          return (
            <MarkInputField
              studentId={student._id}
              totalMark={props.selectedExamData?.totalMark}
              register={props.register}
              error={props.errors[student._id]}
              helperText={props.errors[student._id]?.message}
            />
          );
        },
      },
      {
        id: "status",
        label: "Status",
        align: "center",
        render: (value, student, index, props) => {
          const {
            getMarkColor,
            calculateMarkPercentage,
          } = require("../../../pages/TeacherPage/src/utils/markUtils");
          const markValue = props.watchedValues[student._id] || "";
          const markPercentage = calculateMarkPercentage(
            markValue,
            props.selectedExamData?.totalMark,
          );

          if (
            markValue === "" ||
            markValue === null ||
            markValue === undefined
          ) {
            return (
              <Typography variant="body2" color="text.disabled">
                -
              </Typography>
            );
          }

          return (
            <Chip
              label={`${markPercentage}%`}
              color={getMarkColor(markValue, props.selectedExamData?.totalMark)}
              size="small"
            />
          );
        },
      },
    ],
    cardRenderer: (student, actions, props) => {
      const MarkInputField =
        require("../../../pages/TeacherPage/src/components/MarkInputField").default;
      const {
        getMarkColor,
        calculateMarkPercentage,
      } = require("../../../pages/TeacherPage/src/utils/markUtils");
      const markValue = props.watchedValues[student._id] || "";
      const markPercentage = calculateMarkPercentage(
        markValue,
        props.selectedExamData?.totalMark,
      );
      const markColor = getMarkColor(
        markValue,
        props.selectedExamData?.totalMark,
      );

      return (
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={2.5}>
            <Avatar
              alt={`${student.firstName} ${student.lastName}`}
              src={student.profileImage}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid",
                borderColor: markValue === "" ? "divider" : `${markColor}.main`,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {`${student.firstName} ${student.lastName}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Roll #{student.rollNumber} •{" "}
                {student.classIn?.className || "N/A"}
              </Typography>
            </Box>
            {markValue !== "" && (
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h5"
                  color={`${markColor}.main`}
                  fontWeight={800}
                >
                  {markPercentage}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: `${markColor}.main`,
                    opacity: 0.8,
                  }}
                >
                  GRADE
                </Typography>
              </Box>
            )}
          </Stack>

          <Box sx={{ bgcolor: "background.neutral", p: 2, borderRadius: 1.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 700,
                display: "block",
                mb: 1.5,
                textTransform: "uppercase",
              }}
            >
              Enter Marks (Out of {props.selectedExamData?.totalMark || "N/A"})
            </Typography>
            <MarkInputField
              studentId={student._id}
              totalMark={props.selectedExamData?.totalMark}
              register={props.register}
              error={props.errors[student._id]}
              helperText={props.errors[student._id]?.message}
            />
          </Box>
        </Box>
      );
    },
    emptyMessage: "No students found",
  },
};
