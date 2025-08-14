import express from "express";
import cors from "cors";
import otpRoutes from "./routes/otp.routes.js";
import applicationRoutes from "./routes/application.routes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL (Vite example)
  credentials: true
}));
app.use(express.json());

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/otp", otpRoutes);
app.use("/api/application", applicationRoutes);

// basic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
