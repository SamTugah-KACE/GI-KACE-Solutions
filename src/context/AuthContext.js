import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // The auth state might include a token and user information.
  const [auth, setAuth] = useState({ token: null, user: null });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserStr = localStorage.getItem('authUser');
    let storedUser = null;
    if (storedUserStr) {
        try {
          storedUser = JSON.parse(storedUserStr);
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }

    if (storedToken && storedUser) {
      setAuth({ token: storedToken, user: storedUser });
    }
  }, []);

  // Function to log in a user
  const login = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuth({ token, user });
  };

  // Function to log out a user
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);
