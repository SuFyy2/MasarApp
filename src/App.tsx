
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import our screens
import SplashScreen from "./components/SplashScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import AuthScreen from "./components/AuthScreen";
import HomeScreen from "./components/HomeScreen";
import PassportScreen from "./components/PassportScreen";
import ScannerScreen from "./components/ScannerScreen";
import StampEarnedScreen from "./components/StampEarnedScreen";
import ProfileScreen from "./components/ProfileScreen";
import StampDetailScreen from "./components/StampDetailScreen";
import RewardsScreen from "./components/RewardsScreen";
import NotFound from "./pages/NotFound";

// Authentication guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/login" element={<AuthScreen />} />
          
          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          } />
          <Route path="/passport" element={
            <ProtectedRoute>
              <PassportScreen />
            </ProtectedRoute>
          } />
          <Route path="/passport/:emirateId" element={
            <ProtectedRoute>
              <PassportScreen />
            </ProtectedRoute>
          } />
          <Route path="/scan" element={
            <ProtectedRoute>
              <ScannerScreen />
            </ProtectedRoute>
          } />
          <Route path="/stamp-earned" element={
            <ProtectedRoute>
              <StampEarnedScreen />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute>
              <RewardsScreen />
            </ProtectedRoute>
          } />
          <Route path="/stamp/:emirateId/:stampId" element={
            <ProtectedRoute>
              <StampDetailScreen />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
