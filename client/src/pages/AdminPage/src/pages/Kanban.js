import React, { useEffect } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import "../../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-layouts/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../../../node_modules/@syncfusion/ej2-react-kanban/styles/material.css";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus, updateTaskStatusOptimistic } from '../../../../slices/taskSlice';
import { selectTasks, selectTasksLoading, selectTasksError } from '../../../../slices/taskSlice';

const Kanban = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  const kanbanGrid = [
    { headerText: "To Do", keyField: "Open", allowToggle: true },
    { headerText: "In Progress", keyField: "InProgress", allowToggle: true },
    {
      headerText: "Testing",
      keyField: "Testing",
      allowToggle: true,
      isExpanded: false,
    },
    { headerText: "Done", keyField: "Close", allowToggle: true },
  ];
  // Transform tasks data for Kanban component
  const kanbanData = tasks.map(task => ({
    Id: task.title,
    Title: task.title,
    Status: task.status,
    Summary: task.description || task.title,
    Type: "Task",
    Priority: task.priority,
    Tags: task.tags?.join(',') || '',
    Estimate: task.estimate || 0,
    Assignee: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned',
    RankId: task.rankId,
    Color: task.color || "#02897B",
    ClassName: `e-task, e-${task.priority.toLowerCase()}`,
    taskId: task._id, // Keep the original task ID for API calls
  }));

  useEffect(() => {
    // Fetch tasks when component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  // Handle card drag and drop
  const onCardDragEnd = async (args) => {
    const { data, dropIndex } = args;

    if (data && data.length > 0) {
      const taskData = data[0];
      const newStatus = args.columnKey; // The status column where the card was dropped

      // Find the original task to get its ID
      const originalTask = tasks.find(task => task.title === taskData.Id);

      if (originalTask && originalTask.status !== newStatus) {
        try {
          // Optimistic update
          dispatch(updateTaskStatusOptimistic({
            taskId: originalTask._id,
            status: newStatus
          }));

          // API call
          await dispatch(updateTaskStatus({
            taskId: originalTask._id,
            status: newStatus
          })).unwrap();
        } catch (error) {
          console.error('Failed to update task status:', error);
          // The optimistic update will be reverted by the rejected action
        }
      }
    }
  };
  if (loading && tasks.length === 0) {
    return (
      <>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom style={{ color: "#ff808b" }}>
            Kanban App
          </Typography>
        </Stack>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={48} />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom style={{ color: "#ff808b" }}>
            Kanban App
          </Typography>
        </Stack>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">Error loading tasks: {error}</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom style={{ color: "#ff808b" }}>
          Kanban App
        </Typography>
      </Stack>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={kanbanData}
        cardSettings={{ contentField: "Summary", headerField: "Id" }}
        dragEnd={onCardDragEnd}
        allowDragAndDrop={true}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {kanbanGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </>
  );
};

export default Kanban;
