// import { Task } from "../models/task";

// export const taskService = {
//   async getAllTasks() {
//     return Task.findAll({ where: { is_deleted: false } });
//   },

//   async getTask(id: string) {
//     return Task.findByPk(id);
//   },

//   async createTask(data: any) {
//     const task = await Task.create({
//       ...data,
//       sync_status: "pending",
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//     return task;
//   },

//   async updateTask(id: string, data: any) {
//     const task = await Task.findByPk(id);
//     if (!task) return null;
//     await task.update({
//       ...data,
//       updated_at: new Date(),
//       sync_status: "pending",
//     });
//     return task;
//   },

//   async deleteTask(id: string) {
//     const task = await Task.findByPk(id);
//     if (!task) return null;
//     await task.update({
//       is_deleted: true,
//       sync_status: "pending",
//       updated_at: new Date(),
//     });
//     return task;
//   },
// };


import { v4 as uuidv4 } from "uuid";
import { initDB } from "../db/database.js";



export const getTaskById = async (id: string) => {
  const db = await initDB();
  return db.get("SELECT * FROM tasks WHERE id = ?", id);
};

export const createTask = async (data: any) => {
  const db = await initDB();
  const id = uuidv4();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO tasks (id, title, description, completed, created_at, updated_at, is_deleted, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, 0, 'pending')`,
    [id, data.title, data.description || "", data.completed ? 1 : 0, now, now]
  );

  const task = await db.get("SELECT * FROM tasks WHERE id = ?", id);
  await addToSyncQueue("create", task);

  return task;
};


export const getAllTasks = async () => {
  const db = await initDB();
  const tasks=await db.all(`SELECT * FROM tasks WHERE is_deleted = 0`);
  return tasks;
  
};

export const updateTask = async (id: string, data: any) => {
  const db = await initDB();
  const now = new Date().toISOString();

  const existing = await db.get("SELECT * FROM tasks WHERE id = ?", id);
  if (!existing) throw new Error("Task not found");

  await db.run(
    `UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
    [
      data.title || existing.title,
      data.description || existing.description,
      data.completed !== undefined ? (data.completed ? 1 : 0) : existing.completed,
      now,
      id,
    ]
  );

  const updated = await db.get("SELECT * FROM tasks WHERE id = ?", id);
  await addToSyncQueue("update", updated);

  return updated;
};

export const deleteTask = async (id: string) => {
  const db = await initDB();
  console.log("🟡 Trying to delete task ID:", id);

  const task = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
  console.log("🔍 Found task:", task);

  if (!task) {
    console.log("❌ Task not found");
    return false;
  }

  await db.run(
    `UPDATE tasks 
     SET is_deleted = 1, 
         sync_status = 'pending', 
         updated_at = ?
     WHERE id = ?`,
    [new Date().toISOString(), id]
  );

  console.log("✅ Task soft deleted successfully!");
  return true;
};




const addToSyncQueue = async (operation_type: string, task: any) => {
  const db = await initDB();
  const id = uuidv4();
  await db.run(
    `INSERT INTO sync_queue (id, operation_type, task_id, task_data)
     VALUES (?, ?, ?, ?)`,
    [id, operation_type, task.id, JSON.stringify(task)]
  );
};


