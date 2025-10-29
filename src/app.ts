// import express from "express";
// import taskRoutes from "./routes/tasks.js";
// import syncRoutes from "./routes/sync.js";
// import { initDB } from "./db/database.js";

// const app = express();
// app.use(express.json());

// // Initialize database
// initDB()
//   .then(() => console.log("SQLite database initialized successfully."))
//   .catch((err) => console.error("Database initialization failed:", err));

// app.use("/api/tasks", taskRoutes);
// app.use("/api/sync", syncRoutes);

// export default app;


import express from "express";
import taskRoutes from "./routes/tasks.js";  // 👈 important: add .js if using tsx
import syncRoutes from "./routes/sync.js";   // 👈 add .js here too

const app = express();
app.use(express.json());

console.log("✅ Registering /api/tasks routes...");
app.use("/api/tasks", taskRoutes);
console.log("✅ Registering /api/sync routes...");
app.use("/api/sync", syncRoutes);

app.get("/", (req, res) => {
  res.send("Server is working!");
});


export default app;


