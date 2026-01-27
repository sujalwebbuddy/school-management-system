// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography, Card } from "@mui/material";
// components
import Page from "../components/Page";
// sections
import {
  AppTasks,
  AppWidgetSummary,
  AppCurrentSubject,
} from "../sections/@dashboard/app";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getApprovedUsers } from "../../../../slices/adminSlice";
import { TaskDialog } from "../../../../features/tasks";

// ----------------------------------------------------------------------
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import "../../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";

export default function DashboardApp() {
  var todayDate = new Date().toISOString().slice(0, 10).split("-");
  const dispatch = useDispatch();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(getApprovedUsers());
  }, [dispatch]);

  const users = useSelector((state) => state.admin.usersApproved);
  const allUsers =
    users?.student?.concat(users?.teacher || [], users?.admin || []) || [];

  const handleOpenTaskDialog = (task = null) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const data = [];
  const theme = useTheme();
  const teacher = useSelector((state) => {
    return state?.student?.teachers?.teacherlist;
  });
  const classrom = useSelector((state) => {
    return state?.student?.myClass?.classr;
  });
  const allclasses = useSelector((state) => {
    return state?.teacher?.classrooms?.classes;
  });

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Teachers"
              total={teacher?.length}
              icon={"fa-solid:chalkboard-teacher"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Subjects"
              total={classrom?.subject?.length}
              color="info"
              icon={"bx:math"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Classmates"
              total={classrom?.students?.length}
              color="warning"
              icon={"fa-solid:user-friends"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Classrooms"
              total={allclasses?.length}
              color="error"
              icon={"simple-icons:googleclassroom"}
            />
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: (theme) =>
                  theme.customShadows?.z16 || theme.shadows[10],
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Study Schedule
              </Typography>
              <ScheduleComponent
                height="500px"
                selectedDate={
                  new Date(+todayDate[0], +todayDate[1], +todayDate[2])
                }
                eventSettings={{
                  dataSource: data,
                  fields: {
                    id: "Id",
                    subject: { name: "Subject" },
                    isAllDay: { name: "IsAllDay" },
                    startTime: { name: "StartTime" },
                    endTime: { name: "EndTime" },
                  },
                }}
              >
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
              </ScheduleComponent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentSubject
              title="My Attendance"
              chartData={[
                { title: "Present", value: 85, color: "#88B04B" },
                { title: "Absent", value: 15, color: "#955251" },
              ]}
              chartColors={[...Array(6)].map(
                () => theme.palette.text.secondary,
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentSubject
              title="Gender Percentage"
              chartData={[
                { title: "Male", value: 60, color: "#E38627" },
                { title: "Female", value: 40, color: "#C13C37" },
              ]}
              chartColors={[...Array(6)].map(
                () => theme.palette.text.secondary,
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              onAddTask={() => handleOpenTaskDialog()}
              onEditTask={(task) => handleOpenTaskDialog(task)}
            />
          </Grid>
        </Grid>
      </Container>

      <TaskDialog
        open={taskDialogOpen}
        onClose={handleCloseTaskDialog}
        task={editingTask}
        users={allUsers}
      />
    </Page>
  );
}
