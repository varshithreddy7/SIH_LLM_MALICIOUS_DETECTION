import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import type {
  VerifyRequest,
  VerifyResponse,
  AnalyticsResponse,
  ReportsResponse,
} from "@shared/api";

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

  // Content verification -> Hugging Face Inference API
  app.post("/api/verify", async (req, res) => {
    try {
      const token = process.env.HF_TOKEN;
      if (!token) {
        return res
          .status(501)
          .json({
            message:
              "HF_TOKEN not configured. Set HF_TOKEN in your environment.",
          });
      }
      const payload = req.body as VerifyRequest;

      let input = (payload.text || "").trim();
      if (!input && payload.url) {
        try {
          const page = await fetch(payload.url);
          const html = await page.text();
          input = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 4000);
        } catch {
          // ignore URL fetch errors and fall back to require text
        }
      }

      if (!input) {
        return res.status(400).json({ message: "Provide text or url" });
      }

      const hfRes = await fetch(
        "https://api-inference.huggingface.co/models/Pulk17/Fake-News-Detection",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: input }),
        },
      );

      const json = await hfRes.json();
      if (!hfRes.ok) {
        const msg =
          (json && (json.error || json.message)) ||
          "Hugging Face request failed";
        return res.status(hfRes.status).json({ message: msg });
      }

      let topLabel = "unknown";
      let topScore = 0;
      const probabilities: Record<string, number> = {};

      const arr = Array.isArray(json) ? json : [];
      const first = arr[0];
      const items = Array.isArray(first) ? first : arr;
      if (Array.isArray(items)) {
        for (const it of items) {
          if (it && typeof it === "object") {
            const label = (
              it.label ||
              it.class ||
              it.category ||
              ""
            ).toString();
            const score =
              typeof it.score === "number"
                ? it.score
                : typeof it.confidence === "number"
                  ? it.confidence
                  : 0;
            if (label) {
              probabilities[label] = score;
              if (score > topScore) {
                topLabel = label;
                topScore = score;
              }
            }
          }
        }
      }

      const resp: VerifyResponse = {
        label: topLabel.toLowerCase().includes("fake") ? "fake" : topLabel,
        confidence: topScore || 0,
        probabilities: Object.keys(probabilities).length
          ? probabilities
          : undefined,
      };

      return res.json(resp);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: e?.message || "Verification failed" });
    }
  });

  // Analytics & reports (MongoDB-backed expected)
  app.get("/api/analytics", async (_req, res) => {
    if (!process.env.MONGODB_URI) {
      return res
        .status(501)
        .json({
          message:
            "Analytics not available. Connect MongoDB and implement aggregations.",
        });
    }
    try {
      // Intentionally not implemented here to avoid bundling DB drivers.
      // A proper implementation should connect to MongoDB and aggregate detection metrics.
      const resp: AnalyticsResponse = { weekly: [], aiVsHuman: [] };
      return res.json(resp);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: e?.message || "Failed to load analytics" });
    }
  });

  app.get("/api/reports", async (_req, res) => {
    if (!process.env.MONGODB_URI) {
      return res
        .status(501)
        .json({
          message:
            "Reports not available. Connect MongoDB and implement queries.",
        });
    }
    try {
      const resp: ReportsResponse = { recent: [] };
      return res.json(resp);
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: e?.message || "Failed to load reports" });
    }
  });

  return app;
}
