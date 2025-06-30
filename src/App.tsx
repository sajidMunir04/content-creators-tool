import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import TimeTracking from './pages/TimeTracking';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
          {/* Logo - Positioned at the far right with increased scale */}
<div className="flex items-center ml-4 mt-10 absolute">
  <img 
    src="/logo.png" 
    alt="CreatorFlow Logo" 
    className="h-14 w-auto sm:h-16 md:h-20 lg:h-24 xl:h-28 object-contain transition-all duration-200 hover:scale-110"
    style={{ marginRight: '-1rem' }}
    onError={(e) => {
      // Fallback if logo doesn't load
      e.currentTarget.style.display = 'none';
    }}
  />
</div>
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected App Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <AppLayout>
                <Projects />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects/new" element={
            <ProtectedRoute>
              <AppLayout>
                <CreateProject />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <AppLayout>
                <ProjectDetail />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <AppLayout>
                <Tasks />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <AppLayout>
                <Calendar />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/time-tracking" element={
            <ProtectedRoute>
              <AppLayout>
                <TimeTracking />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/team" element={
            <ProtectedRoute>
              <AppLayout>
                <Team />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/goals" element={
            <ProtectedRoute>
              <AppLayout>
                <Goals />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;