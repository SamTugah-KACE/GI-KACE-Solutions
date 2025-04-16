// TourGuide.js
import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { request } from "../request";

const TourGuide = ({ steps, authToken }) => {
  // authToken is assumed to be passed from your global auth context or props.
  const [runTour, setRunTour] = useState(false);

  // Check server stored flag (with localStorage fallback) on mount.
  useEffect(() => {
    const checkTourStatus = async () => {
      try {
        const res = await fetch('/api/users/get-tour-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // include token if needed for authentication, for example:
            'Authorization': `Bearer ${authToken}`
          },
          credentials: 'include', // if you use cookies, etc.
        });
        if (!res.ok) {
          throw new Error('Unable to fetch tour status from server');
        }
        const data = await res.json();
        if (!data.tourCompleted) {
          setRunTour(true);
        }
      } catch (error) {
        console.error('Error fetching tour status:', error);
        // fallback: use localStorage
        const tourCompleted = localStorage.getItem('tourCompleted');
        if (!tourCompleted) {
          setRunTour(true);
        }
      }
    };
    checkTourStatus();
  }, [authToken]);

  // Callback for Joyride events.
  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      // Save to localStorage
      localStorage.setItem('tourCompleted', 'true');

      // Update tour status on server
      try {
        await fetch('/api/users/set-tour-completed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          credentials: 'include',
          body: JSON.stringify({ tourCompleted: true }),
        });
      } catch (error) {
        console.error('Error setting tour status on server:', error);
      }
      setRunTour(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: { zIndex: 10000, primaryColor: '#1E90FF' },
      }}
    />
  );
};

export default TourGuide;
