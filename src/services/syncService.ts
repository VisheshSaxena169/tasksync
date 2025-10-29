// import { Task } from "../models/task.js";

// export const syncService = {
//   async processSync(batchSize = 50) {
//     const pendingTasks = await Task.findAll({
//       where: { sync_status: "pending" },
//       limit: batchSize,
//     });

//     const results = [];
//     for (const task of pendingTasks) {
//       try {
//         // Simulate sync logic (in real case, send to remote API)
//         task.sync_status = "synced";
//         task.last_synced_at = new Date();
//         await task.save();
//         results.push({ id: task.id, status: "success" });
//       } catch (error) {
//         task.sync_status = "error";
//         await task.save();
//         results.push({ id: task.id, status: "failed" });
//       }
//     }

//     return results;
//   },
// };


import { initDB } from "../db/database.js";

export const processSync = async () => {
  const db = await initDB();
  const BATCH_SIZE = Number(process.env.BATCH_SIZE || 50);

  const pendingOps = await db.all(
    `SELECT * FROM sync_queue WHERE status = 'pending' LIMIT ?`,
    [BATCH_SIZE]
  );

  const results: any[] = [];

  for (const op of pendingOps) {
    try {
      const task = JSON.parse(op.task_data);
      const now = new Date().toISOString();

      // Simulate sync success (normally you'd call an external API)
      await db.run(
        `UPDATE tasks SET sync_status = 'synced', last_synced_at = ? WHERE id = ?`,
        [now, task.id]
      );

      await db.run(`UPDATE sync_queue SET status = 'done' WHERE id = ?`, op.id);

      results.push({ task_id: task.id, status: "synced" });
    } catch (error) {
      const attempts = (op.retry_attempts || 0) + 1;
      if (attempts >= 3) {
        await db.run(
          `UPDATE sync_queue SET status = 'failed' WHERE id = ?`,
          op.id
        );
        await db.run(
          `UPDATE tasks SET sync_status = 'error' WHERE id = ?`,
          op.task_id
        );
      } else {
        await db.run(
          `UPDATE sync_queue SET retry_attempts = ? WHERE id = ?`,
          [attempts, op.id]
        );
      }

      results.push({ task_id: op.task_id, status: "error" });
    }
  }

  return results;
};

export const getSyncStatus = async () => {
  const db = await initDB();
  const pending = await db.get(
    `SELECT COUNT(*) as count FROM sync_queue WHERE status = 'pending'`
  );
  const failed = await db.get(
    `SELECT COUNT(*) as count FROM sync_queue WHERE status = 'failed'`
  );
  return { pending: pending.count, failed: failed.count };
};
