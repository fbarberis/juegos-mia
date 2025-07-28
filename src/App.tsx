
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";
import Index from "./pages/Index";
import ScratchCardPage from "./pages/ScratchCardPage";
import RoulettePage from "./pages/RoulettePage";
import MemoryPage from "./pages/MemoryPage";
import DicePage from "./pages/DicePage";
import PuzzlePage from "./pages/PuzzlePage";
import SimonPage from "./pages/SimonPage";
import WordGuessPage from "./pages/WordGuessPage";
import ColorMatchPage from "./pages/ColorMatchPage";
import NumberSequencePage from "./pages/NumberSequencePage";
import ReactionTimePage from "./pages/ReactionTimePage";
import MusicQuizPage from "./pages/MusicQuizPage";
import TriviaPage from "./pages/TriviaPage";
import NotFound from "./pages/NotFound";
import LogoHuntPage from "./pages/LogoHuntPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scratch-card" element={<ScratchCardPage />} />
            <Route path="/roulette" element={<RoulettePage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/dice" element={<DicePage />} />
            <Route path="/puzzle" element={<PuzzlePage />} />
            <Route path="/logo-hunt" element={<LogoHuntPage />} />
            <Route path="/simon" element={<SimonPage />} />
            <Route path="/word-guess" element={<WordGuessPage />} />
            <Route path="/color-match" element={<ColorMatchPage />} />
            <Route path="/number-sequence" element={<NumberSequencePage />} />
            <Route path="/reaction-time" element={<ReactionTimePage />} />
            <Route path="/music-quiz" element={<MusicQuizPage />} />
            <Route path="/trivia" element={<TriviaPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
