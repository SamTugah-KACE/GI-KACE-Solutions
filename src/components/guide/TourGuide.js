import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import request from '../request';

const TourGuide = ({ steps, onStepCallback, onTourEnd }) => {
  const [runTour, setRunTour] = useState(false);
  const checkServer = process.env.REACT_APP_RUN_TOUR === 'true';

  useEffect(() => {
    const init = async () => {
      // If they've already done the tour on this device, never run it.
      if (localStorage.getItem('tourCompleted')) return;

      if (checkServer) {
        try {
          const { data } = await request.get('/users/get-tour-status');
          if (!data.tourCompleted) {
            setRunTour(true);
          }
        } catch {
          // server not ready → fallback immediately
          setRunTour(true);
        }
      } else {
        // env says "don't hit server" but still use localStorage fallback
        setRunTour(true);
      }
    };
    init();
  }, [checkServer]);

  const handleCallback = async (data) => {
    // Expand submenu on any step ≥ 3
    if (data.index >= 3 && data.index <= 6) {
      onStepCallback?.();
    }

    // If user finishes or skips, persist and stop
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      localStorage.setItem('tourCompleted', 'true');
      if (checkServer) {
        try {
          await request.post('/users/set-tour-completed', {
            tourCompleted: true,
          });
        } catch {
          /* silent */
        }
      }
      setRunTour(false);
      onTourEnd?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      callback={handleCallback}
      styles={{
        options: { zIndex: 1000 },
      }}
    />
  );
};

export default TourGuide;




//options: { zIndex: 10000, primaryColor: '#1E90FF' },
//spotlight: { zIndex: 9999 } // ensure this doesn’t block images
//}}