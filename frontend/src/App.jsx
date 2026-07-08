import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PortfolioHome from './pages/portfolio/PortfolioHome';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Skills from './pages/admin/Skills';
import Projects from './pages/admin/Projects';
import Certificates from './pages/admin/Certificates';
import Achievements from './pages/admin/Achievements';
import Media from './pages/admin/Media';
import Messages from './pages/admin/Messages';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Experiences from './pages/admin/Experiences';
import VoiceAssistant from './components/portfolio/VoiceAssistant';
import SplashCursor from './components/SplashCursor';

function App() {
  return (
    <Router>
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING={true}
        RAINBOW_MODE={false}
        COLOR="#A855F7"
      />
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800 text-sm font-semibold rounded-xl',
          duration: 3500,
        }} 
      />
      <Routes>
        {/* Public Portfolio (Single Scroll Page) */}
        <Route path="/" element={<PortfolioHome />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="media" element={<Media />} />
          <Route path="messages" element={<Messages />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <VoiceAssistant />
    </Router>
  );
}

export default App;
