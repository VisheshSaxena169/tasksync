// import express from "express";
// import { syncService } from "../services/syncServices.js";

// const router = express.Router();

// router.post("/trigger", async (req, res) => {
//   const result = await syncService.processSync();
//   res.json({ synced: result.length });
// });

// router.get("/status", async (req, res) => {
//   res.json({ message: "Sync service running" });
// });

// export default router;

import express from "express";
import * as syncService from "../services/syncService";

const router = express.Router();

router.post("/trigger", async (req, res) => {
  const result = await syncService.processSync();
  res.json({ message: "Sync complete", result });
});

router.get("/status", async (req, res) => {
  const status = await syncService.getSyncStatus();
  res.json(status);
});

export default router;

