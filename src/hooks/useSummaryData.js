// // src/hooks/useSummaryData.js
// import { useState, useEffect } from 'react';
// import request from '../components/request';

// export default function useSummaryData(orgId) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!orgId) return;

//     const fetchData = async () => {
//       try {
//         const response = await request.get(`/organizations/${orgId}/summary`);
//         setData(response.data.counts);
//         console.log("Summary data fetched:", response.data.counts);

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orgId]);

//   console.log("useSummaryData hook called with orgId:", orgId);
//   console.log("Current summary data:", data);
//   console.log("Loading state:", loading);
//   return { data, loading, error };
// }


// src/hooks/useSummaryData.js
import { useState, useEffect, useRef, useCallback } from 'react';
import {useAuth} from '../context/AuthContext'; // Adjust the import path as needed

export default function useSummaryData(orgId, userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  const { auth } = useAuth(); // Get auth context
  const { token } = localStorage.getItem('authToken') || auth?.token  || auth.token; // Extract the token from auth context
  // Fetch the JWT from wherever you store it (e.g., localStorage)
  // const token = localStorage.getItem('authToken');

  console.log('useSummaryData called with orgId:', orgId, 'userId:', userId, 'token:', token);
  // Function to send a "refresh" message over the socket
  const refresh = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('refresh');
    }
  }, []);

  useEffect(() => {
    // Only attempt to open a WebSocket when we have all three:
    // organization ID, user ID, and a JWT token.
    if (!orgId || !userId || !token) {
      setLoading(false);
      setError('Missing orgId, userId, or auth token');
      return;
    }

    const tokenParam = encodeURIComponent(token);
    console.log('Connecting to WebSocket with token:', tokenParam);
    const wsUrl = `${process.env.REACT_APP_API_WS_URL || 'ws://localhost:8000'}/ws/summary/${orgId}/${userId}?token=${tokenParam}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      // Connection established; we expect the server to send an "initial" message immediately.
      console.log('WebSocket connected to', wsUrl);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log('Raw WebSocket message:', event.data);
        if (msg.type === 'initial' || msg.type === 'update') {
          console.log('Received WebSocket message:', msg);
          // The server payload is { counts: { ... } }
          setData(msg.payload.counts);
          setError(null);
          setLoading(false);
        } else {
          console.warn('Unknown WS message type:', msg.type);
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
        setError('Invalid data from server');
        setLoading(false);
      }
    };

    ws.onerror = (ev) => {
      console.error('WebSocket error:', ev);
      setError('WebSocket error');
      setLoading(false);
    };

    ws.onclose = (ev) => {
      console.log('WebSocket closed:', ev.code, ev.reason);
      if (ev.code === 1008) {
        // Policy violation: likely invalid token or unauthorized
        setError('Unauthorized or session expired. Please log in again.');
      } else if (!error) {
        // Unexpected close; if we didn’t already have an error, mark as closed
        setError('Connection closed unexpectedly');
      }
      setLoading(false);
    };

    return () => {
      // Clean up on unmount or whenever orgId/userId/token changes
      if (wsRef.current) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [orgId, userId, token, error]);

  return { data, loading, error, refresh };

}
