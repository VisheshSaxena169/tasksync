import { v4 as uuidv4 } from "uuid";
import { initDB } from "../db/database";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  sync_status: string;
  server_id?: string | null;        // allow null
  last_synced_at?: string | null;  // allow null
}


// Create a new task
export const createTask = async (taskData: Partial<Task>) => {
  const db = await initDB();
  const id = uuidv4();
  const now = new Date().toISOString();

  const newTask: Task = {
    id,
    title: taskData.title!,
    description: taskData.description || "",
    completed: taskData.completed || false,
    created_at: now,
    updated_at: now,
    is_deleted: false,
    sync_status: "pending",
    server_id: null,
    last_synced_at: null,
  };

  await db.run(
    `INSERT INTO tasks 
    (id, title, description, completed, created_at, updated_at, is_deleted, sync_status, server_id, last_synced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newTask.id,
      newTask.title,
      newTask.description,
      newTask.completed ? 1 : 0,
      newTask.created_at,
      newTask.updated_at,
      newTask.is_deleted ? 1 : 0,
      newTask.sync_status,
      newTask.server_id,
      newTask.last_synced_at,
    ]
  );

  return newTask;
};
