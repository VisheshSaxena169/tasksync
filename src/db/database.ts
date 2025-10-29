
// import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "./database.sqlite",
//   logging: false,
// });


import sqlite3 from "sqlite3";
import { open } from "sqlite";

// open DB connection
export const initDB = async () => {
  const db = await open({
    filename: "./tasks.db",
    driver: sqlite3.Database,
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT,
      updated_at TEXT,
      is_deleted INTEGER DEFAULT 0,
      sync_status TEXT DEFAULT 'pending',
      server_id TEXT,
      last_synced_at TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      operation_type TEXT NOT NULL,
      task_id TEXT NOT NULL,
      task_data TEXT NOT NULL,
      retry_attempts INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
};
