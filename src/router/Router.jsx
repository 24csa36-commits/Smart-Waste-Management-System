import { Route, Routes, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Home from "../pages/Home.jsx";
import AuthLogin from "../AuthPages/AuthLogin.jsx";
import AuthRegister from "../AuthPages/AuthRegister.jsx";
import PublicLogin from "../AuthPages/PublicLogin.jsx";
import PublicRegister from "../AuthPages/PublicRegister.jsx";
import WorkerLogin from "../AuthPages/WorkerLogin.jsx";
import AuthorityDashboard from "../pages/AuthorityDashboard.jsx";
import AssignmentDispatch from "../pages/AssignmentDispatch.jsx";
import PublicDashboard from "../pages/PublicDashboard.jsx";
import WorkerDashboard from "../pages/WorkerDashboard.jsx";

// Auth Guard for Role-based access
const ProtectedRoute = ({ children, allowedType }) => {
  const { currentUser, userType } = useApp();
  
  if (!currentUser || userType !== allowedType) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Redirect logged-in users away from auth forms
const AuthGuard = ({ children, type }) => {
  const { currentUser, userType } = useApp();
  
  if (currentUser && userType === type) {
    return <Navigate to={`/dashboard/${type}`} replace />;
  }
  
  return children;
};

const Router = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Home />} />

      {/* Authority Auth */}
      <Route path="/auth/login" element={
        <AuthGuard type="authority">
          <AuthLogin />
        </AuthGuard>
      } />
      <Route path="/auth/register" element={
        <AuthGuard type="authority">
          <AuthRegister />
        </AuthGuard>
      } />

      {/* Citizen Auth */}
      <Route path="/public/login" element={
        <AuthGuard type="public">
          <PublicLogin />
        </AuthGuard>
      } />
      <Route path="/public/register" element={
        <AuthGuard type="public">
          <PublicRegister />
        </AuthGuard>
      } />

      {/* Worker Auth */}
      <Route path="/worker/login" element={
        <AuthGuard type="worker">
          <WorkerLogin />
        </AuthGuard>
      } />

      {/* Dashboards */}
      <Route path="/dashboard/authority/assignment-dispatch" element={
        <ProtectedRoute allowedType="authority">
          <AssignmentDispatch />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/authority/*" element={
        <ProtectedRoute allowedType="authority">
          <AuthorityDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/public/*" element={
  <ProtectedRoute allowedType="public">
    <PublicDashboard />
  </ProtectedRoute>
} />
      
      <Route path="/dashboard/worker/*" element={
        <ProtectedRoute allowedType="worker">
          <WorkerDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all fallback redirects to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;