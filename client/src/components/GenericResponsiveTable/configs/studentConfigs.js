import { Typography, Chip, Stack, Box } from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Grade as GradeIcon,
} from "@mui/icons-material";
import { formatDate } from "../../../pages/TeacherPage/src/utils/formatDate";

export const studentTableConfigs = {
  "student-homework": {
    entityType: "homework",
    searchableFields: ["name", "subjectId.name"],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: true,
    },
    columns: [
      {
        id: "name",
        label: "Homework Name",
        render: (value, row) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
        ),
      },
      {
        id: "classId",
        label: "Classroom",
        render: (value) => (
          <Chip
            label={value?.className || "N/A"}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        id: "subjectId",
        label: "Subject",
        render: (value) => (
          <Chip
            label={value?.name || "N/A"}
            size="small"
            color="primary"
            variant="outlined"
          />
        ),
      },
      {
        id: "dateOf",
        label: "Due Date",
        render: (value) => (
          <Typography
            variant="body2"
            color="error.main"
            sx={{ fontWeight: 600 }}
          >
            {formatDate(value)}
          </Typography>
        ),
      },
    ],
    cardRenderer: (row) => (
      <Box sx={{ position: "relative" }}>
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
            >
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {row.name}
              </Typography>
              <ChevronRightIcon sx={{ color: "text.disabled" }} />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {row.classId?.className || "N/A"}
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Chip
                label={row.subjectId?.name || "N/A"}
                size="small"
                color="primary"
                variant="soft"
                sx={{ fontWeight: 600 }}
              />
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarIcon sx={{ fontSize: 14, color: "error.main" }} />
                <Typography
                  variant="caption"
                  color="error.main"
                  fontWeight={700}
                >
                  {formatDate(row.dateOf)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    ),
    emptyMessage: "No homework assigned yet",
  },
  "student-subjects": {
    entityType: "subjects",
    searchableFields: ["subjectName", "teacherName"],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: false,
    },
    columns: [
      {
        id: "subjectName",
        label: "Subject Name",
        render: (value) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        ),
      },
      {
        id: "className",
        label: "Class",
        render: (value) => (
          <Chip label={value} size="small" variant="outlined" />
        ),
      },
      {
        id: "teacherName",
        label: "Teacher",
        render: (value) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon
              sx={{ color: "text.secondary", width: 16, height: 16 }}
            />
            <Typography variant="body2">{value}</Typography>
          </Stack>
        ),
      },
    ],
    cardRenderer: (row) => (
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: "info.lighter",
            color: "info.main",
            display: "flex",
          }}
        >
          <SchoolIcon />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            {row.subjectName}
          </Typography>

          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ClassIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Class:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {row.className}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Teacher:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {row.teacherName}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    ),
  },
  "student-exams": {
    entityType: "exams",
    searchableFields: ["name", "subject"],
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
        render: (value) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        ),
      },
      {
        id: "subject",
        label: "Subject",
        render: (value) => (
          <Chip label={value} size="small" color="primary" variant="outlined" />
        ),
      },
      {
        id: "totalMark",
        label: "Total Mark",
        align: "center",
        render: (value) => (
          <Typography variant="body2" fontWeight={600}>
            {value}
          </Typography>
        ),
      },
      {
        id: "dateOf",
        label: "Date",
        render: (value) => (
          <Typography variant="body2" color="text.secondary">
            {formatDate(value)}
          </Typography>
        ),
      },
      {
        id: "status",
        label: "Status",
        render: (value, row) => {
          const today = new Date();
          const examdate = new Date(row.dateOf);
          const isActive = today.getTime() < examdate.getTime();
          return (
            <Chip
              label={isActive ? "Upcoming" : "Completed"}
              color={isActive ? "info" : "success"}
              variant="soft"
              size="small"
            />
          );
        },
      },
    ],
    cardRenderer: (row) => {
      const today = new Date();
      const examdate = new Date(row.dateOf);
      const isActive = today.getTime() < examdate.getTime();

      return (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: isActive ? "info.lighter" : "success.lighter",
              color: isActive ? "info.main" : "success.main",
              display: "flex",
            }}
          >
            <EventIcon />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {row.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.subject}
                </Typography>
              </Box>
              <Chip
                label={isActive ? "Upcoming" : "Completed"}
                color={isActive ? "info" : "success"}
                size="small"
                variant="soft"
                sx={{ fontSize: "0.65rem", height: 20, fontWeight: 700 }}
              />
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(row.dateOf)}
                </Typography>
              </Stack>
              <Typography variant="subtitle2" fontWeight={700}>
                Max Marks: {row.totalMark}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      );
    },
  },
  "student-marks": {
    entityType: "marks",
    searchableFields: ["examName"],
    features: {
      sortable: true,
      filterable: true,
      paginated: true,
      rowClickable: false,
    },
    columns: [
      {
        id: "examName",
        label: "Exam Name",
        render: (value) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        ),
      },
      {
        id: "totalMark",
        label: "Total Mark",
        align: "center",
        render: (value) => <Typography variant="body2">{value}</Typography>,
      },
      {
        id: "yourMark",
        label: "Your Mark",
        align: "center",
        render: (value) => (
          <Typography variant="body2" fontWeight={700}>
            {value}
          </Typography>
        ),
      },
      {
        id: "percentage",
        label: "Percentage",
        align: "center",
        render: (value) => (
          <Typography
            variant="body2"
            fontWeight={600}
            color={value >= 50 ? "success.main" : "error.main"}
          >
            {value}%
          </Typography>
        ),
      },
      {
        id: "status",
        label: "Status",
        render: (value, row) => (
          <Chip
            label={row.percentage >= 50 ? "Passed" : "Failed"}
            color={row.percentage >= 50 ? "success" : "error"}
            variant="soft"
            size="small"
          />
        ),
      },
    ],
    cardRenderer: (row) => (
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: row.percentage >= 50 ? "success.lighter" : "error.lighter",
            color: row.percentage >= 50 ? "success.main" : "error.main",
            display: "flex",
          }}
        >
          <GradeIcon />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {row.examName}
            </Typography>
            <Chip
              label={row.percentage >= 50 ? "Passed" : "Failed"}
              color={row.percentage >= 50 ? "success" : "error"}
              size="small"
              variant="soft"
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Your Score:
              </Typography>
              <Typography variant="caption" fontWeight={700}>
                {row.yourMark} / {row.totalMark}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: "100%",
                height: 6,
                bgcolor: "grey.100",
                borderRadius: 3,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  width: `${row.percentage}%`,
                  height: "100%",
                  bgcolor: row.percentage >= 50 ? "success.main" : "error.main",
                  borderRadius: 3,
                }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              align="right"
              color={row.percentage >= 50 ? "success.main" : "error.main"}
              fontWeight={800}
              sx={{ mt: 0.5 }}
            >
              {row.percentage}%
            </Typography>
          </Stack>
        </Box>
      </Stack>
    ),
  },
};
