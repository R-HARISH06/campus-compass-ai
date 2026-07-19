import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/PageWrapper";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Faculty from "./pages/Faculty";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import React, { useState, useEffect } from "react";
import CanteenMenu from "./pages/CanteenMenu";
import CampusMap from "./pages/CampusMap";
import { onMessageListener } from "./firebase";
import { ToastContainer, Toast } from "react-bootstrap";
import AdminDashboard from "./pages/AdminDashboard";
import AiAssistant from "./pages/AiAssistant";
import Timetable from "./pages/Timetable";
import Announcements from "./pages/Announcements";

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
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
            <Route path="/timetable" element={<PageWrapper><Timetable /></PageWrapper>} />
            <Route path="/clubs" element={<PageWrapper><Clubs /></PageWrapper>} />
            <Route path="/canteen" element={<PageWrapper><CanteenMenu /></PageWrapper>} />
            <Route path="/map" element={<PageWrapper><CampusMap /></PageWrapper>} />
            <Route path="/faculty" element={<PageWrapper><Faculty /></PageWrapper>} />
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