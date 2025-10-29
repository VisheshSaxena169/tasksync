// import express from "express";
// import { taskService } from "../services/taskServices.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   const tasks = await taskService.getAllTasks();
//   res.json(tasks);
// });

// router.get("/:id", async (req, res) => {
//   const task = await taskService.getTask(req.params.id);
//   if (!task) return res.status(404).json({ message: "Task not found" });
//   res.json(task);
// });

// router.post("/", async (req, res) => {
//   try {
//     const task = await taskService.createTask(req.body);
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid data" });
//   }
// });

// router.put("/:id", async (req, res) => {
//   const task = await taskService.updateTask(req.params.id, req.body);
//   if (!task) return res.status(404).json({ message: "Task not found" });
//   res.json(task);
// });

// router.delete("/:id", async (req, res) => {
//   const task = await taskService.deleteTask(req.params.id);
//   if (!task) return res.status(404).json({ message: "Task not found" });
//   res.json({ message: "Task deleted" });
// });

// export default router;



// import express from "express";
// import { createTask, getAllTasks } from "../services/taskServices.js";

// const router = express.Router();

// // ✅ Create a new task
// router.post("/", async (req, res) => {
//   try {
//     const task = await createTask(req.body);
//     res.status(201).json(task);
//   } catch (err) {
//     console.error("Error creating task:", err);
//     res.status(500).json({ error: "Failed to create task" });
//   }
// });

// // ✅ Get all tasks
// router.get("/", async (_req, res) => {
//   try {
//     const tasks = await getAllTasks();
//     res.json(tasks);
//   } catch (err) {
//     console.error("Error fetching tasks:", err);
//     res.status(500).json({ error: "Failed to fetch tasks" });
//   }
// });

// export default router;

import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/taskService";

const router = Router();

// ✅ GET /api/tasks - Get all non-deleted tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ GET /api/tasks/:id - Get a specific task
router.get("/:id", async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// ✅ POST /api/tasks - Create a new task
router.post("/", async (req, res) => {
  try {
    const newTask = await createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ✅ PUT /api/tasks/:id - Update an existing task
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateTask(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ✅ DELETE /api/tasks/:id - Soft delete a task
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteTask(req.params.id);
    if (!deleted ) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
