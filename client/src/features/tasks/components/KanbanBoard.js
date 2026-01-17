import React, { useEffect } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-layouts/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-kanban/styles/material.css";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus, updateTaskStatusOptimistic } from '../../../slices/taskSlice';
import { selectTasks, selectTasksLoading, selectTasksError } from '../../../slices/taskSlice';

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

  // Handle card actions (including drag and drop)
  const onActionComplete = async (args) => {
    // Check if this is a card drop action
    if (args.requestType === 'cardMoved' || args.requestType === 'cardDropped') {
      if (args.changedRecords && args.changedRecords.length > 0) {
        const changedRecord = args.changedRecords[0];

        // Get the new status from the changed record
        const newStatus = changedRecord.Status;

        if (!newStatus) {
          console.error('Could not determine new status from changed record');
          return;
        }

        // Find the original task to get its ID
        const originalTask = tasks.find(task => task._id === changedRecord.taskId);

        if (originalTask && originalTask.status !== newStatus) {
          try {
            // Optimistic update for immediate UI feedback
            dispatch(updateTaskStatusOptimistic({
              taskId: originalTask._id,
              status: newStatus
            }));

            // API call to persist the change
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
    }
  };
  if (loading && tasks.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="500px"
      >
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="500px"
        p={3}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Tasks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="500px"
        p={4}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h2" color="text.disabled">
            📋
          </Typography>
        </Box>
        <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
          No Tasks Available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
          Create your first task to see it appear on the Kanban board. Drag and drop tasks between columns to update their status.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '600px' }}>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={kanbanData}
        cardSettings={{ contentField: "Summary", headerField: "Id" }}
        actionComplete={onActionComplete}
        allowDragAndDrop={true}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {kanbanGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </Box>
  );
};

export default Kanban;
