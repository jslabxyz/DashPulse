
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Stocks from "./pages/Stocks";
import Markets from "./pages/Markets";
import Currencies from "./pages/Currencies";
import Performance from "./pages/Performance";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
            <Route path="/stocks" element={
              <ErrorBoundary>
                <Stocks />
              </ErrorBoundary>
            } />
            <Route path="/markets" element={
              <ErrorBoundary>
                <Markets />
              </ErrorBoundary>
            } />
            <Route path="/currencies" element={
              <ErrorBoundary>
                <Currencies />
              </ErrorBoundary>
            } />
            <Route path="/performance" element={
              <ErrorBoundary>
                <Performance />
              </ErrorBoundary>
            } />
            <Route path="/analysis" element={
              <ErrorBoundary>
                <Analysis />
              </ErrorBoundary>
            } />
            <Route path="/inventory" element={
              <ErrorBoundary>
                <Inventory />
              </ErrorBoundary>
            } />
            <Route path="/settings" element={
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
