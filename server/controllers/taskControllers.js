const Task = require("../models/taskModel");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");

// @desc Get all tasks
// @route GET /api/tasks
// @access PRIVATE
exports.getAllTasks = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { status, assignee, priority, page = 1, limit = 50 } = req.query;

    // Build filter object - only show tasks created by current user or assigned to current user
    const filter = {
      organizationId: req.organization._id,
      $or: [
        { createdBy: req.user._id },
        { assignee: req.user._id }
      ]
    };

    // Additional filters
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (priority) filter.priority = priority;

    // Validate assignee belongs to organization if provided
    if (assignee) {
      const assigneeUser = await User.findOne({
        _id: assignee,
        organizationId: req.organization._id
      });
      if (!assigneeUser) {
        return res.status(404).json({ msg: "Assignee not found in your organization" });
      }
    }

    const tasks = await Task.find(filter)
      .populate([
        { path: "assignee", select: "firstName lastName email role" },
        { path: "createdBy", select: "firstName lastName email role" }
      ])
      .sort({ rankId: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// @desc Get single task
// @route GET /api/tasks/:id
// @access PRIVATE
exports.getTask = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.organization._id,
      $or: [
        { createdBy: req.user._id },
        { assignee: req.user._id }
      ]
    })
      .populate([
        { path: "assignee", select: "firstName lastName email role" },
        { path: "createdBy", select: "firstName lastName email role" }
      ]);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// @desc Create new task
// @route POST /api/tasks
// @access PRIVATE
exports.createTask = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, description, status, priority, assignee, tags, estimate, dueDate, color } = req.body;

    if (assignee) {
      const assigneeUser = await User.findOne({
        _id: assignee,
        organizationId: req.organization._id
      });
      if (!assigneeUser) {
        return res.status(400).json({
          success: false,
          message: "Assignee not found in your organization",
        });
      }
    }

    const maxRank = await Task.findOne({
      status: status || "Open",
      organizationId: req.organization._id
    })
      .sort({ rankId: -1 })
      .select("rankId");

    const newRankId = maxRank ? maxRank.rankId + 1 : 1;

    const task = await Task.create({
      title,
      description,
      status: status || "Open",
      priority: priority || "Normal",
      assignee,
      createdBy: req.userId,
      tags: tags || [],
      estimate,
      dueDate,
      rankId: newRankId,
      color: color || "#02897B",
      organizationId: req.organization._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate([
        { path: "assignee", select: "firstName lastName email role" },
        { path: "createdBy", select: "firstName lastName email role" }
      ]);

    res.status(201).json({
      success: true,
      data: populatedTask,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access PRIVATE
exports.updateTask = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, description, status, priority, assignee, tags, estimate, dueDate, color } = req.body;

    if (assignee) {
      const assigneeUser = await User.findOne({
        _id: assignee,
        organizationId: req.organization._id
      });
      if (!assigneeUser) {
        return res.status(400).json({
          success: false,
          message: "Assignee not found in your organization",
        });
      }
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.organization._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee;
    if (tags !== undefined) task.tags = tags;
    if (estimate !== undefined) task.estimate = estimate;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (color !== undefined) task.color = color;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate([
        { path: "assignee", select: "firstName lastName email role" },
        { path: "createdBy", select: "firstName lastName email role" }
      ]);

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// @desc Update task status (for kanban drag and drop)
// @route PATCH /api/tasks/:id/status
// @access PRIVATE
exports.updateTaskStatus = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { status } = req.body;

    if (!status || !["Open", "InProgress", "Testing", "Close"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.organization._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate([
        { path: "assignee", select: "firstName lastName email role" },
        { path: "createdBy", select: "firstName lastName email role" }
      ]);

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task status",
      error: error.message,
    });
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access PRIVATE
exports.deleteTask = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.organization._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organization._id
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// @desc Get tasks by assignee
// @route GET /api/tasks/assignee/:userId
// @access PRIVATE
exports.getTasksByAssignee = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { userId } = req.params;
    const { status } = req.query;

    // Check if current user is accessing their own tasks or is an admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only access your own assigned tasks"
      });
    }

    // Verify assignee belongs to the organization
    const assigneeUser = await User.findOne({
      _id: userId,
      organizationId: req.organization._id
    });
    if (!assigneeUser) {
      return res.status(404).json({
        success: false,
        message: "Assignee not found in your organization"
      });
    }

    const filter = {
      assignee: userId,
      organizationId: req.organization._id
    };
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate([
        { path: "assignee", select: "firstName lastName email role" },
        { path: "createdBy", select: "firstName lastName email role" }
      ])
      .sort({ rankId: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
      organization: req.organization.name
    });
  } catch (error) {
    console.error("Error fetching tasks by assignee:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks by assignee",
      error: error.message,
    });
  }
};

// @desc Get task statistics
// @route GET /api/tasks/stats
// @access PRIVATE
exports.getTaskStats = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const organizationId = req.organization._id;

    const stats = await Task.aggregate([
      {
        $match: {
          organizationId,
          $or: [
            { createdBy: req.user._id },
            { assignee: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      {
        $match: {
          organizationId,
          $or: [
            { createdBy: req.user._id },
            { assignee: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments({
      organizationId,
      $or: [
        { createdBy: req.user._id },
        { assignee: req.user._id }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        statusStats: stats,
        priorityStats,
      },
      organization: req.organization.name
    });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task statistics",
      error: error.message,
    });
  }
};
