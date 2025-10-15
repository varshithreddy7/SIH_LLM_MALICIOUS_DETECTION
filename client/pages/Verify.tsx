import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Link as LinkIcon,
  ScanEye,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VerifyResponse {
  label: "fake" | "real" | "ai-generated" | string;
  confidence: number; // 0..1
  reason?: string;
  probabilities?: Record<string, number>;
}

type State = {
  text: string;
  url: string;
  loading: boolean;
  result: VerifyResponse | null;
  error: string | null;
};

export default class Verify extends React.Component<{}, State> {
  state: State = {
    text: "",
    url: "",
    loading: false,
    result: null,
    error: null,
  };

  onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ loading: true, error: null, result: null });
    try {
      const { text, url } = this.state;
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Verification failed");
      this.setState({ result: data as VerifyResponse });
    } catch (err: any) {
      const demo: VerifyResponse = {
        label: Math.random() > 0.5 ? "ai-generated" : "real",
        confidence: 0.6 + Math.random() * 0.35,
        reason:
          "Demo mode: ML_API_URL not configured. Showing simulated output.",
        probabilities: {
          fake: Math.random(),
          real: Math.random(),
          "ai-generated": Math.random(),
        },
      };
      this.setState({ result: demo, error: null });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { text, url, loading, result, error } = this.state;
    const badgeColor =
      result?.label === "fake"
        ? "text-red-400"
        : result?.label === "ai-generated"
          ? "text-purple-400"
          : "text-green-400";

    return (
      <div className="relative py-14">
        <div className="container grid gap-8 md:grid-cols-2 items-start">
          <form
            onSubmit={this.onSubmit}
            className="glass neon-border rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-heading text-2xl text-cyan-300 flex items-center gap-2">
              <ScanEye className="text-cyan-400" /> Content Verification
            </h2>
            <div>
              <label className="text-sm text-foreground/70 flex items-center gap-2">
                <LinkIcon className="size-4" /> News URL (optional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => this.setState({ url: e.target.value })}
                placeholder="https://example.com/article"
                className="mt-1 w-full rounded-md bg-white/5 border border-white/10 p-2 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm text-foreground/70 flex items-center gap-2">
                <Upload className="size-4" /> Paste Text
              </label>
              <textarea
                value={text}
                onChange={(e) => this.setState({ text: e.target.value })}
                rows={8}
                placeholder="Paste article or social post content here"
                className="mt-1 w-full rounded-md bg-white/5 border border-white/10 p-3 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button
              disabled={loading || (!text && !url)}
              className="w-full rounded-md px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-colors"
            >
              {loading ? "Analyzing…" : "Verify Now"}
            </button>
            <p className="text-xs text-foreground/60">
              We route your request to our ML service (Hugging Face models) via
              a secure backend.
            </p>
          </form>
          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass neon-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
                >
                  <div className="relative">
                    <div className="size-28 rounded-full border-2 border-cyan-400/40 animate-pulse" />
                    <div className="absolute inset-2 rounded-full border-2 border-purple-500/40 animate-[spin_2s_linear_infinite]" />
                    <div className="absolute inset-6 rounded-full border-2 border-cyan-400/30 animate-[spin_3s_linear_infinite]" />
                  </div>
                  <p className="text-foreground/70">Scanning content…</p>
                </motion.div>
              )}
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass neon-border rounded-2xl p-6 text-red-300"
                >
                  <div className="flex items-center gap-2">
                    <TriangleAlert /> {error}
                  </div>
                </motion.div>
              )}
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass neon-border rounded-2xl p-6 space-y-4"
                >
                  <div
                    className={`font-heading text-2xl ${badgeColor} flex items-center gap-2`}
                  >
                    <ShieldCheck /> {result.label.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">Confidence</div>
                    <Progress
                      value={Math.round((result.confidence || 0) * 100)}
                      className="h-3"
                    />
                  </div>
                  {result.probabilities && (
                    <div className="space-y-2">
                      {Object.entries(result.probabilities).map(([k, v]) => (
                        <div key={k}>
                          <div className="text-xs text-foreground/60">{k}</div>
                          <Progress
                            value={Math.round((v || 0) * 100)}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {result.reason && (
                    <p className="text-sm text-foreground/80">
                      <span className="text-foreground/60">Reason:</span>{" "}
                      {result.reason}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
}
