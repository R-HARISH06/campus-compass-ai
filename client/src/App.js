import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/PageWrapper";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { onMessageListener } from "./firebase";
import { ToastContainer, Toast, Spinner } from "react-bootstrap";

const Dashboard = lazy(() => import("./components/Dashboard"));
const Events = lazy(() => import("./pages/Events"));
const Clubs = lazy(() => import("./pages/Clubs"));
const Faculty = lazy(() => import("./pages/Faculty"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const CanteenMenu = lazy(() => import("./pages/CanteenMenu"));
const CampusMap = lazy(() => import("./pages/CampusMap"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AiAssistant = lazy(() => import("./pages/AiAssistant"));
const Timetable = lazy(() => import("./pages/Timetable"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Admissions = lazy(() => import("./pages/Admissions"));

// Protected route: must be logged in
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && (user.role === "student" || user.role === "faculty")) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="primary" /></div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
              <Route path="/timetable" element={<PageWrapper><Timetable /></PageWrapper>} />
              <Route path="/clubs" element={<PageWrapper><Clubs /></PageWrapper>} />
              <Route path="/canteen" element={<PageWrapper><CanteenMenu /></PageWrapper>} />
              <Route path="/map" element={<PageWrapper><CampusMap /></PageWrapper>} />
              <Route path="/faculty" element={<PageWrapper><Faculty /></PageWrapper>} />
              <Route path="/admissions" element={<PageWrapper><Admissions /></PageWrapper>} />
              <Route path="/announcements" element={<PageWrapper><Announcements /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
              <Route
                path="/ai"
                element={
                  <ProtectedRoute>
                    <PageWrapper><AiAssistant /></PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <PageWrapper><Profile /></PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin" 
                element={user && user.role !== 'student' && user.role !== 'faculty' ? <PageWrapper><AdminDashboard /></PageWrapper> : <Navigate to="/" />} 
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const [showToast, setShowToast] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});

  useEffect(() => {
    onMessageListener().then(payload => {
      setNotification({title: payload.notification.title, body: payload.notification.body});
      setShowToast(true);
      console.log(payload);
    }).catch(err => console.log('failed: ', err));
  }, [notification]); // Re-bind after a notification

  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <AppRoutes />
          <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position: 'fixed' }}>
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={10000} autohide bg="info">
              <Toast.Header>
                <strong className="me-auto text-dark">{notification.title}</strong>
              </Toast.Header>
              <Toast.Body className="text-white">{notification.body}</Toast.Body>
            </Toast>
          </ToastContainer>
        </>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;