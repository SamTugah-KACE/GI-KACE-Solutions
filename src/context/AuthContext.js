import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // For user notifications


// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // The auth state might include a token and user information.
  const [auth, setAuth] = useState({ token: null, user: null, user_name: null, role: null });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserStr = localStorage.getItem('authUser');
    const storedUserName = localStorage.getItem('authUserName');
    const storedUserRole = localStorage.getItem('authUserRole');

    let storedUser = null;
    if (storedUserStr) {
        try {
          storedUser = JSON.parse(storedUserStr);
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }

    if (storedToken && storedUser && storedUserName && storedUserRole) {
      setAuth({ token: storedToken, user: storedUser, user_name: storedUserName, role: storedUserRole });
    }
  }, []);

  // Function to log in a user
  const login = (token, user, user_name, role) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    localStorage.setItem('authUserName', user_name);
    localStorage.setItem('authUserRole', role);

    setAuth({ token, user, user_name, role });
    toast.success('Login successful.');
  };

  // Function to log out a user
  const logout = () => {
    try{
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authUserName')
    localStorage.removeItem('authUserRole');

    setAuth({ token: null, user: null, user_name: null, role: null });
    toast.info('Logged out successfully.');
    }catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      // Sentry.captureException(error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);
