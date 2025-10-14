import "./global.css";

import { createRoot } from "react-dom/client";
import React, { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import ThreatGraph from "./pages/ThreatGraph";
import AuditLog from "./pages/AuditLog";
import Reports from "./pages/Reports";
import Knowledge from "./pages/Knowledge";
import About from "./pages/About";
import { Login, Register } from "./pages/auth";
import Placeholder from "./pages/Placeholder";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollTop } from "@/components/ScrollTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class">
      <TooltipProvider>
        <BrowserRouter>
        <div className="min-h-dvh bg-gradient-to-br from-background via-background to-background relative">
          <SiteHeader />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/threat-graph" element={<ThreatGraph />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              {/* Keep last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ScrollTop />
          <a href="/about" className="fixed bottom-6 right-6 rounded-full px-4 py-3 border border-white/10 bg-white/5 text-cyan-200 hover:bg-white/10 transition-colors shadow-lg">Contact / Chat</a>
        </div>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
