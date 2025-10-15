import type { IncomingMessage, ServerResponse } from "http";
import type { VerifyRequest, VerifyResponse } from "../shared/api";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const token = process.env.HF_TOKEN;
    if (!token) {
      res
        .status(501)
        .json({
          message:
            "HF_TOKEN not configured. Set HF_TOKEN in your Vercel project settings.",
        });
      return;
    }

    const payload: VerifyRequest = req.body || {};

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
        // ignore URL fetch errors and require text
      }
    }

    if (!input) {
      res.status(400).json({ message: "Provide text or url" });
      return;
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
        (json && (json.error || json.message)) || "Hugging Face request failed";
      res.status(hfRes.status).json({ message: msg });
      return;
    }

    const normalizeLabel = (value: string) => {
      const normalized = value.toLowerCase();
      if (normalized === "label_0" || normalized.includes("fake")) {
        return "fake";
      }
      if (normalized === "label_1" || normalized.includes("real")) {
        return "real";
      }
      if (normalized.includes("ai")) {
        return "ai-generated";
      }
      if (normalized.includes("human")) {
        return "human";
      }
      return normalized || "unknown";
    };

    let topLabel = "unknown";
    let topScore = 0;
    const probabilities: Record<string, number> = {};

    const arr = Array.isArray(json) ? json : [];
    const first = arr[0];
    const items = Array.isArray(first) ? first : arr;
    if (Array.isArray(items)) {
      for (const it of items) {
        if (it && typeof it === "object") {
          const rawLabel = (it.label || it.class || it.category || "").toString();
          const label = normalizeLabel(rawLabel);
          const score =
            typeof it.score === "number"
              ? it.score
              : typeof it.confidence === "number"
                ? it.confidence
                : 0;
          if (label) {
            const current = probabilities[label];
            probabilities[label] = current !== undefined
              ? Math.max(current, score)
              : score;
            if (score > topScore) {
              topLabel = label;
              topScore = score;
            }
          }
        }
      }
    }

    const resp: VerifyResponse = {
      label: normalizeLabel(topLabel),
      confidence: topScore || 0,
      probabilities: Object.keys(probabilities).length
        ? probabilities
        : undefined,
    };

    res.status(200).json(resp);
  } catch (e: any) {
    res.status(500).json({ message: e?.message || "Verification failed" });
  }
}
