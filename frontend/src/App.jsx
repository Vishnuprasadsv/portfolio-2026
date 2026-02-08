import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CaseStudies from './components/CaseStudies';
import CaseStudyDetail from './components/CaseStudyDetail';
import ProjectDetail from './components/ProjectDetail';
import Contact from './components/Contact';

function SessionWatcher() {
  const location = useLocation();

  useEffect(() => {
    // If we are NOT on a login page AND NOT on an admin page
    // Then we clear the session to enforce "auto-logout" on exit
    if (!location.pathname.startsWith('/admin') && location.pathname !== '/login') {
      sessionStorage.removeItem('token');
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <SessionWatcher />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;