// // TourGuide.js
// import React, { useState, useEffect } from 'react';
// import Joyride, { STATUS } from 'react-joyride';

// const TourGuide = ({ steps }) => {
//   // Check localStorage on mount to decide if tour should run.
//   const [runTour, setRunTour] = useState(false);

//   useEffect(() => {
//     const tourCompleted = localStorage.getItem('tourCompleted');
//     if (!tourCompleted) {
//       setRunTour(true);
//     }
//   }, []);

//   // When tour is finished or skipped, mark it as completed.
//   const handleJoyrideCallback = (data) => {
//     const { status } = data;
//     const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
//     if (finishedStatuses.includes(status)) {
//       localStorage.setItem('tourCompleted', 'true');
//       setRunTour(false);
//     }
//   };

//   return (
//     <Joyride
//       steps={steps}
//       run={runTour}
//       continuous
//       showSkipButton
//       callback={handleJoyrideCallback}
//       styles={{
//         options: { zIndex: 10000, primaryColor: '#1E90FF' },
//         spotlight: { zIndex: 9999 } // ensure this doesn’t block images
//       }}
//     />
//   );
// };

// export default TourGuide;


// // src/components/guide/TourGuide.js
import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import request from '../request';           // ← your axios instance
// import { getAuthToken } from '../context/auth'; // just in case you want direct access

const TourGuide = ({ steps, onStepCallback }) => {
  const [runTour, setRunTour] = useState(false);
  const shouldRun = process.env.REACT_APP_RUN_TOUR === 'true';

  // On mount: check server-stored flag (with localStorage fallback)
  useEffect(() => {
    if (!shouldRun) return;

    const checkTourStatus = async () => {
      try {
        // GET /users/get-tour-status
        const { data } = await request.get('/users/get-tour-status');
        if (!data.tourCompleted) {
          setRunTour(true);
        }
      } catch (err) {
        // fallback to localStorage if your endpoint isn't live yet
        if (!localStorage.getItem('tourCompleted')) {
          setRunTour(true);
        }
      }
    };

    checkTourStatus();
  }, [shouldRun]);

  // When the tour finishes or is skipped:
  const handleJoyrideCallback = async (data) => {
    onStepCallback?.(data);

    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      // 1) localStorage fallback
      localStorage.setItem('tourCompleted', 'true');

      // 2) persist to server
      try {
        await request.post('/users/set-tour-completed', {
          tourCompleted: true,
        });
      } catch (err) {
        console.error('Error persisting tour flag:', err);
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
        options: {
          zIndex: 10000,                // low enough not to cover your header/profile images
        //   overlayColor: 'rgba(0,0,0,0.4)',
          spotlight: { zIndex: 9999 } // ensure this doesn’t block images
        },
      }}
    />
  );
};

export default TourGuide;



//options: { zIndex: 10000, primaryColor: '#1E90FF' },
//spotlight: { zIndex: 9999 } // ensure this doesn’t block images
//}}