// src/components/LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';
import request from './request';
import { useNavigate } from 'react-router-dom';
import FacialAuth from './FacialAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState("password"); // "password" or "facial"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [facialImage, setFacialImage] = useState(null);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Username is required.");
      return;
    }
    let formData = new FormData();
    formData.append("username", username);
    if (loginMode === "password") {
      if (!password) {
        alert("Password is required for traditional login.");
        return;
      }
      formData.append("password", password);
    } else {
      if (!facialImage) {
        alert("Please capture your facial image for authentication.");
        return;
      }
      // Convert facialImage dataURL to Blob then File
      const blob = await (await fetch(facialImage)).blob();
      const file = new File([blob], "facial.jpg", { type: blob.type });
      formData.append("facial_image", file);
    }

    try {
      const response = await request.post("/login", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // On success, navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Sign In</h2>
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

          <button type="submit" className="login-btn">Login</button>
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
