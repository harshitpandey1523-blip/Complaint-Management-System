import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// CORS configuration to enable frontend Next.js interactions
app.use("/*", cors({
  origin: "http://localhost:3000",
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Route imports
import complaintsRouter from "./routes/complaints";
import dashboardRouter from "./routes/dashboard";
import usersRouter from "./routes/users";

app.route("/api/complaints", complaintsRouter);
app.route("/api/dashboard", dashboardRouter);
app.route("/api/users", usersRouter);

// Global error handler
app.onError((err, c) => {
  console.error("🔴 Server Error:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

const port = 4000;
console.log(`🚀 Standalone Backend is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
