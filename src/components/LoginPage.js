// src/components/LoginPage.js
import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import request from './request';
import { useParams, useNavigate } from 'react-router-dom';
import FacialAuth from './FacialAuth';
import useValidateSlug from '../hooks/useValidateSlug';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import stockPhoto from '../assets/images/stock-photo.jpg'; // Import the default background image



const LoginPage = () => {
  const navigate = useNavigate();
  const { orgSlug } = useParams();
  const { loadin: slugLoading, org, error:slugError } = useValidateSlug(orgSlug);

  const { login } = useAuth();
  const { setOrgData } = useOrganization();


  
  const [orgLogo, setOrgLogo] = useState(null);
  const [loginMode, setLoginMode] = useState("password"); // "password" or "facial"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [facialImage, setFacialImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount (or when org data is available), try to get the logo:
  useEffect(() => {
    if (org) {
      setOrgData(org);
    // Try localStorage first
    let logo = localStorage.getItem('orgLogo');
    if (!logo && org && org.logos) {
      // org.logos is a dictionary; choose one of the logos (for example, the first one)
      const logos = Object.values(org.logos);
      if (logos.length > 0) {
        logo = logos[0];
        // Optionally store it for future visits:
        localStorage.setItem('orgLogo', logo);
      }
    }
    if (logo) {
      // setOrgLogo(logo);
      const safeLogoUrl = logo ? encodeURI(logo) : null;
      console.log("safe logo uirl: ", safeLogoUrl)
     setOrgLogo(encodeURI(logo));
     console.log("\norgLogo: ", orgLogo)
     console.log("\nencodinURL: ", encodeURI(orgLogo))
    }
  }
  }, [org, setOrgData]);


  if (slugLoading) return <div>Loading organization info...</div>;
  if (slugError) return <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>This site can't be reached</h1>
    
    {slugError}
    
    </div>;
  
  // Add a safeguard in case org is still null (should not happen if slugError is false)
  if (!org) return <div style={{ padding: '40px', textAlign: 'center' }}>No organization information available.</div>;

  // Use a fallback for org.name if org is null.
  const organizationName = org?.name || "";
 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Username is required.");
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append("username", username);

    let url = "/auth/login"; // Base endpoint


    if (loginMode === "password") {
      if (!password) {
        alert("Password is required for traditional login.");
        setLoading(false);
        return;
      }
      // formData.append("password", password);
       // If your backend expects the password as a query parameter, append it here
       url += `?password=${encodeURIComponent(password)}`;
       // Do NOT append password to formData in this case.
    } else {
      if (!facialImage) {
        alert("Please capture your facial image for authentication.");
        setLoading(false);
        return;
      }
      // Convert facialImage dataURL to Blob then File
      const blob = await (await fetch(facialImage)).blob();
      const file = new File([blob], "facial.jpg", { type: blob.type });
      formData.append("facial_image", file);
    }

    try {
      // const response = await request.post("/auth/login", formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // });.
      // const response = await request.post("/auth/login", formData);

      const response = await request.post(url, formData);
      // Assume the API returns a token and user info
      const { token, user } = response.data;
      login(token, user);
      // In LoginPage.js, after successful login:
       localStorage.setItem('orgData', JSON.stringify(org));


      

       // Decide which dashboard to navigate to based on user's permissions.
      // Adjust these keys as per your backend response.
      let targetRoute = "";
      const perms = user.permissions || {};
      if (
        perms["admin"]     ||
        perms.add_new_staff ||
        perms['Add New Role'] ||
        perms['Approve|Decline Requests']
      ) {
        targetRoute = "/dashboard";
      } else if (
        perms.view_security_logs ||
        perms.systems_administration
      ) {
        targetRoute = "/systems";
      } else {
        targetRoute = "/staff";
      }
      // Navigate to the appropriate route using the orgSlug and replace the history entry.
      navigate(`/${orgSlug}${targetRoute}`, { replace: true });


      




      // navigate(`/${orgSlug}/dashboard`, { replace: true }); 
      // navigate(`/${orgSlug}/dashboard`, {state: {org} });

    } catch (error) {
      alert("Login failed: " + error.message);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" 
    style={{
      backgroundImage: orgLogo ? `url(${orgLogo})` : `url(${stockPhoto})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="login-container">
        <h2> {organizationName}</h2>
        <form onSubmit={handleLogin}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="login-mode-toggle">
            <label>
              <input
                type="radio"
                value="password"
                checked={loginMode === "password"}
                onChange={() => setLoginMode("password")}
              /> Password
            </label>
            <label>
              <input
                type="radio"
                value="facial"
                checked={loginMode === "facial"}
                onChange={() => setLoginMode("facial")}
              /> Facial Authentication
            </label>
          </div>

          {loginMode === "password" ? (
            <>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <FacialAuth onCapture={setFacialImage} />
          )}

          <button type="submit" className="login-btn" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Login"}

          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;






// // src/components/LoginPage.js
// import React, { useState, useRef } from 'react';
// import './LoginPage.css';
// import request from './request';
// import { useNavigate } from 'react-router-dom';
// import Webcam from 'react-webcam';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [loginMode, setLoginMode] = useState("password"); // "password" or "facial"
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [capturedImage, setCapturedImage] = useState(null);
//   const webcamRef = useRef(null);

//   const videoConstraints = {
//     width: 300,
//     height: 300,
//     facingMode: "user"
//   };

//   const captureImage = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!username) {
//       alert("Username is required.");
//       return;
//     }
//     let formData = new FormData();
//     formData.append("username", username);
//     if (loginMode === "password") {
//       if (!password) {
//         alert("Password is required for traditional login.");
//         return;
//       }
//       formData.append("password", password);
//     } else {
//       if (!capturedImage) {
//         alert("Please capture your facial image for authentication.");
//         return;
//       }
//       // Convert captured image (data URL) to Blob and then File
//       const blob = await (await fetch(capturedImage)).blob();
//       const file = new File([blob], "facial.jpg", { type: blob.type });
//       formData.append("facial_image", file);
//     }

//     try {
//       const response = await request.post("/login", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       // On success, navigate to dashboard
//       navigate("/dashboard");
//     } catch (error) {
//       alert("Login failed: " + error.message);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2>Sign In</h2>
//         <form onSubmit={handleLogin}>
//           <label>Username:</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />

//           <div className="login-mode-toggle">
//             <label>
//               <input
//                 type="radio"
//                 value="password"
//                 checked={loginMode === "password"}
//                 onChange={() => setLoginMode("password")}
//               /> Password
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value="facial"
//                 checked={loginMode === "facial"}
//                 onChange={() => setLoginMode("facial")}
//               /> Facial Authentication
//             </label>
//           </div>

//           {loginMode === "password" ? (
//             <>
//               <label>Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </>
//           ) : (
//             <div className="facial-auth">
//               <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 videoConstraints={videoConstraints}
//                 className="webcam-video"
//               />
//               <button type="button" onClick={captureImage} className="capture-btn">
//                 {capturedImage ? "Re-capture" : "Capture"}
//               </button>
//               {capturedImage && (
//                 <img src={capturedImage} alt="Captured" className="captured-image" />
//               )}
//             </div>
//           )}

//           <button type="submit" className="login-btn">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
