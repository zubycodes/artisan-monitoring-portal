import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Index from "./pages/Index";
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
          <Route path="/dashboard" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisans/:id" element={<ArtisanDetailWrapper />} />
          <Route path="/artisans/:id/:p" element={<ArtisanDetailWrapper />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/map" element={<Map />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;