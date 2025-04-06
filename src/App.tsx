import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Dashboard as Index } from "./pages/Index";
import Manage from "./pages/Manage";
import Map from "./pages/Map";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import Artisans from "./pages/Artisans";
import ArtisanDetail from "./pages/ArtisanDetail";

const queryClient = new QueryClient();

const ArtisanDetailWrapper = () => {
  const { id } = useParams();
  return <ArtisanDetail artisan_id={id} />;
};

const ProtectedRoute = ({ children }) => {
  // return true;
  const user = localStorage.getItem('ussr');
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes><Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/artisans" element={<ProtectedRoute><Artisans /></ProtectedRoute>} />
          <Route path="/artisans/:id" element={<ProtectedRoute><ArtisanDetailWrapper /></ProtectedRoute>} />
          <Route path="/artisans/:id/:p" element={<ProtectedRoute><ArtisanDetailWrapper /></ProtectedRoute>} />
          <Route path="/manage" element={<ProtectedRoute><Manage /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;