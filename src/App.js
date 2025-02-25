import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/LoginPage'
import Dashboard from './components/snr_management/Dashboard';
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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />}   />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route element={<AlertNotifier />}  /> */}
    </Routes>
  );

  // return ( 
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
