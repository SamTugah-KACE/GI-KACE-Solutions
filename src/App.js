import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/LoginPage'
import Dashboard from './components/snr_management/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import { AuthProvider } from './context/AuthContext';
// import AlertNotifier from './components/AlertNotifier';



// A simple hook to set a dark/light theme based on time
function useTheme() {
  useEffect(() => {
    const hour = new Date().getHours();
    // Example: if between 7am and 7pm use light theme, otherwise dark theme
    if (hour >= 7 && hour < 17) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }, []);
}





function App() {
  useTheme();
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/:orgSlug/signin" element={<SigninPage />}   />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
       {/* Wrap protected routes */}
       <Route element={<ProtectedRoute />}>
          <Route path="/:orgSlug/dashboard" element={<Dashboard />} />
        </Route>
    </Routes>
     </AuthProvider>
  );

}

export default App;
