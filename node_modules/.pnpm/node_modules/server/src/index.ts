import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import healthRouter from "./routes/health.js";
import menuRouter from "./routes/menu.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    name: "bhukad.sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: false, // set true in production with HTTPS
    },
  })
);

// Routes
app.use("/api", healthRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`\n🍛 Bhukad Hut API Server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/healthz\n`);
});
