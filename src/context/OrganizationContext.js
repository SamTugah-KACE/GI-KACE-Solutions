// src/context/OrganizationContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context.
const OrganizationContext = createContext();

// Provider component.
export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);

  // Function to set organization data.
  const setOrgData = (orgData) => {
    setOrganization(orgData);
    // Optionally store in localStorage for persistence across sessions.
    localStorage.setItem('orgData', JSON.stringify(orgData));
  };

  // Function to clear organization data.
  const clearOrgData = () => {
    setOrganization(null);
    localStorage.removeItem('orgData');
  };

  return (
    <OrganizationContext.Provider value={{ organization, setOrgData, clearOrgData }}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Custom hook to easily access the context.
export const useOrganization = () => useContext(OrganizationContext);
