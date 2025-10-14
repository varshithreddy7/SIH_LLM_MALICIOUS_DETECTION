import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder";
import { SiteHeader } from "@/components/layout/SiteHeader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-dvh bg-gradient-to-br from-background via-background to-background relative">
          <SiteHeader />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/threat-graph" element={<Placeholder title="Threat Intelligence Graph" />} />
              <Route path="/audit-log" element={<Placeholder title="Blockchain Audit Log" />} />
              <Route path="/reports" element={<Placeholder title="Reports & Insights" />} />
              <Route path="/knowledge" element={<Placeholder title="Knowledge Hub / Blog" />} />
              <Route path="/about" element={<Placeholder title="About & Governance" />} />
              {/* Keep last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <a href="/about" className="fixed bottom-6 right-6 rounded-full px-4 py-3 border border-white/10 bg-white/5 text-cyan-200 hover:bg-white/10 transition-colors shadow-lg">
            Contact / Chat
          </a>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
