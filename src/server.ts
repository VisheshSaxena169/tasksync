// import app from "./app";

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// import express from "express";
// import dotenv from "dotenv";
// import tasksRouter from "./routes/tasks.js";
// import syncRouter from "./routes/sync.js";

// dotenv.config();

// const app = express();
// app.use(express.json());

// app.use("/api/tasks", tasksRouter);
// app.use("/api/sync", syncRouter);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
