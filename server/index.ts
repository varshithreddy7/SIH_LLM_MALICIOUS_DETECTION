import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import type { VerifyRequest, VerifyResponse, AnalyticsResponse, ReportsResponse } from "@shared/api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Content verification -> Python ML layer
  app.post("/api/verify", async (req, res) => {
    try {
      const mlUrl = process.env.ML_API_URL;
      if (!mlUrl) {
        return res.status(501).json({ message: "ML service not configured. Set ML_API_URL to your FastAPI/Flask endpoint." });
      }
      const payload = req.body as VerifyRequest;
      const mlRes = await fetch(new URL("/verify", mlUrl).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await mlRes.json()) as VerifyResponse;
      return res.status(mlRes.status).json(data);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || "Verification failed" });
    }
  });

  // Analytics & reports (MongoDB-backed expected)
  app.get("/api/analytics", async (_req, res) => {
    if (!process.env.MONGODB_URI) {
      return res.status(501).json({ message: "Analytics not available. Connect MongoDB and implement aggregations." });
    }
    try {
      // Intentionally not implemented here to avoid bundling DB drivers.
      // A proper implementation should connect to MongoDB and aggregate detection metrics.
      const resp: AnalyticsResponse = { weekly: [], aiVsHuman: [] };
      return res.json(resp);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || "Failed to load analytics" });
    }
  });

  app.get("/api/reports", async (_req, res) => {
    if (!process.env.MONGODB_URI) {
      return res.status(501).json({ message: "Reports not available. Connect MongoDB and implement queries." });
    }
    try {
      const resp: ReportsResponse = { recent: [] };
      return res.json(resp);
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || "Failed to load reports" });
    }
  });

  return app;
}
