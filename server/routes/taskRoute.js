const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

// Import controllers
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTasksByAssignee,
  getTaskStats,
} = require("../controllers/taskControllers");

// Import middleware
const authMiddleware = require("../middlewares/authMiddleware");
const tenantMiddleware = require("../middlewares/tenantMiddleware");

// Validation rules
const taskValidationRules = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("status")
    .optional()
    .isIn(["Open", "InProgress", "Testing", "Close"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["Low", "Normal", "High", "Critical"])
    .withMessage("Invalid priority"),
  body("assignee")
    .optional()
    .isMongoId()
    .withMessage("Invalid assignee ID"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("estimate")
    .optional()
    .isNumeric()
    .withMessage("Estimate must be a number"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date format"),
  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("Color must be a valid hex color"),
];

// Routes
router.use(authMiddleware); // All task routes require authentication
router.use(tenantMiddleware); // All task routes require organization context

// GET /api/tasks - Get all tasks with optional filters
router.get("/", getAllTasks);

// GET /api/tasks/stats - Get task statistics
router.get("/stats", getTaskStats);

// GET /api/tasks/assignee/:userId - Get tasks by assignee
router.get("/assignee/:userId", getTasksByAssignee);

// GET /api/tasks/:id - Get single task
router.get("/:id", getTask);

// POST /api/tasks - Create new task
router.post("/", taskValidationRules, createTask);

// PUT /api/tasks/:id - Update task
router.put("/:id", updateTask);

// PATCH /api/tasks/:id/status - Update task status (for kanban)
router.patch("/:id/status", [
  body("status")
    .isIn(["Open", "InProgress", "Testing", "Close"])
    .withMessage("Invalid status"),
], updateTaskStatus);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", deleteTask);

module.exports = router;
