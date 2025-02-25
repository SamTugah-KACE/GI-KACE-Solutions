// // src/components/PersonalDataForm.js
// import React, { useEffect, useState } from 'react';
// import { Field, ErrorMessage, useFormikContext } from 'formik';
// import Webcam from 'react-webcam';
// import './PersonalDataForm.css';

// const titles = ["Prof.", "PhD", "Dr.", "Mr.", "Mrs.", "Ms.", "Esq.", "Hon.", "Rev.", "Msgr.", "Other"];
// const genders = ["Male", "Female", "Other"];
// const roles = ["CEO", "Manager", "HR Manager"];

// const PersonalDataForm = () => {
//   const { values, setFieldValue } = useFormikContext();
//   const webcamRef = React.useRef(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   // Update preview when profileImage changes.
//   useEffect(() => {
//     if (values.profileImage) {
//       if (typeof values.profileImage === 'string') {
//         setPreviewImage(values.profileImage);
//       } else if (values.profileImage instanceof File) {
//         const objectUrl = URL.createObjectURL(values.profileImage);
//         setPreviewImage(objectUrl);
//         return () => URL.revokeObjectURL(objectUrl);
//       }
//     } else {
//       setPreviewImage(null);
//     }
//   }, [values.profileImage]);

//   const handleCapture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setFieldValue("profileImage", imageSrc);
//     }
//   };

//   const handleUploadChange = (e) => {
//     setFieldValue("profileImage", e.currentTarget.files[0]);
//   };

//   return (
//     <div className="personal-data-form">
//       <div className="form-group">
//         <label>Title*:</label>
//         <Field as="select" name="title" required>
//           <option value="">Select Title</option>
//           {titles.map((title, index) => (
//             <option key={`${title}-${index}`} value={title}>{title}</option>
//           ))}
//         </Field>
//         <ErrorMessage name="title" style={{"color":"red"}} component="div" className="error" />
//       </div>
//       {values.title === 'Other' && (
//         <div className="form-group">
//           <label>Please specify*:</label>
//           <Field name="otherTitle" type="text" required />
//           <ErrorMessage name="otherTitle" style={{"color":"red"}}  component="div" className="error" />
//         </div>
//       )}
//       <div className="form-group">
//         <label>First Name*:</label>
//         <Field name="firstName" type="text" required />
//         <ErrorMessage name="firstName" style={{"color":"red"}}  component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Middle Name:</label>
//         <Field name="middleName" type="text" />
//       </div>
//       <div className="form-group">
//         <label>Last Name*:</label>
//         <Field name="lastName" type="text" required />
//         <ErrorMessage name="lastName"  style={{"color":"red"}} component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Date of Birth*:</label>
//         <Field name="dob" type="date" required />
//         <ErrorMessage name="dob" style={{"color":"red"}} component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Gender*:</label>
//         <Field as="select" name="gender" required>
//           <option value="">Select Gender</option>
//           {genders.map((gender, index) => (
//             <option key={`${gender}-${index}`} value={gender}>{gender}</option>
//           ))}
//         </Field>
//         <ErrorMessage name="gender"  style={{"color":"red"}} component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Email*:</label>
//         <Field name="email" type="email" required />
//         <ErrorMessage name="email" style={{"color":"red"}} component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Contact | Residential Addr. | GPS Info*:</label>
//         <Field as="textarea" name="contactInfo" required />
//         <ErrorMessage name="contactInfo"  style={{"color":"red"}} component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Role*:</label>
//         <Field as="select" name="role" required>
//           <option value="">Select Your Role</option>
//           {roles.map((role, index) => (
//             <option key={`${role}-${index}`} value={role}>{role}</option>
//           ))}
//         </Field>
//         <ErrorMessage name="role"  style={{"color":"red"}} component="div" className="error" />
//       </div>
//       <div className="form-group">
//         <label>Profile Image Option*:</label>
//         <Field as="select" name="profileImageOption" required>
//           <option value="">Select Option</option>
//           <option value="capture">Real time capture of user facial image</option>
//           <option value="upload">Upload latest image</option>
//         </Field>
//         <ErrorMessage name="profileImageOption"  style={{"color":"red"}} component="div" className="error" />
//       </div>
//       {values.profileImageOption === 'capture' && (
//         <div className="form-group">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             width="100px"
//             height="100px"
//             margin-left="45px"
//             // margin-top="10px"
//             screenshotFormat="image/jpeg"
//             videoConstraints={{ facingMode: 'user' }}
//           />
//           <button type="button" onClick={handleCapture}>Capture Image</button>
//           {previewImage && (
//             <div className="image-preview">
//               <img src={previewImage} alt="Captured" width="64" style={{"margin-left":"45%"}} height="64" />
//             </div>
//           )}
//         </div>
//       )}
//       {values.profileImageOption === 'upload' && (
//         <div className="form-group">
//           <input type="file" accept="image/*" onChange={handleUploadChange} required />
//           {previewImage && (
//             <div className="image-preview">
//               <img src={previewImage} alt="Uploaded" width="64" style={{"margin-top":"10px", "margin-left":"45%"}} height="64" />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonalDataForm;





// src/components/PersonalDataForm.js
import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import Webcam from 'react-webcam';
import './PersonalDataForm.css';

const titles = ["Prof.", "PhD", "Dr.", "Mr.", "Mrs.", "Ms.", "Esq.", "Hon.", "Rev.", "Msgr.", "Other"];
const genders = ["Male", "Female", "Other"];

const PersonalDataForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const webcamRef = React.useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fetchedRoles, setFetchedRoles] = useState([]);

  // Fetch default roles from API
  useEffect(() => { 
    fetch('https://staff-records-backend.onrender.com/api/default/fetch-all/?skip=0&limit=100')
      .then((res) => res.json())
      .then((data) => {
        const rolesItem = data.find(item => item.data_name === "roles");
        console.log("roles: ", rolesItem);
        if (rolesItem && rolesItem.data && rolesItem.data.length > 0) {
          setFetchedRoles(rolesItem.data);
          // If no role is already selected, auto-set the role field to the first fetched role.
          if (!values.role) {
            setFieldValue("role", rolesItem.data[0].name);
            // Also store the permissions (you can later use this in the submission transformation)
            setFieldValue("role_permissions", rolesItem.data[0].permissions);
          }
        }
      })
      .catch(err => console.error("Error fetching roles:", err));
  }, [setFieldValue, values.role]);

  // Update preview when user_images changes.
  useEffect(() => {
    if (values.user_images) {
      if (typeof values.user_images === 'string') {
        setPreviewImage(values.user_images);
      } else if (values.user_images instanceof File) {
        const objectUrl = URL.createObjectURL(values.user_images);
        setPreviewImage(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewImage(null);
    }
  }, [values.user_images]);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setFieldValue("user_images", imageSrc);
    }
  };

  const handleUploadChange = (e) => {
    setFieldValue("user_images", e.currentTarget.files[0]);
  };

  return (
    <div className="personal-data-form">
      <div className="form-group">
        <label>Title*:</label>
        <Field as="select" name="title" required>
          <option value="">Select Title</option>
          {titles.map((title, index) => (
            <option key={`${title}-${index}`} value={title}>{title}</option>
          ))}
        </Field>
        <ErrorMessage name="title" style={{"color":"red"}} component="div" className="error" />
      </div>
      {values.title === 'Other' && (
        <div className="form-group">
          <label>Please specify*:</label>
          <Field name="otherTitle" type="text" required />
          <ErrorMessage name="otherTitle" style={{"color":"red"}} component="div" className="error" />
        </div>
      )}
      <div className="form-group">
        <label>First Name*:</label>
        <Field name="firstName" type="text" required />
        <ErrorMessage name="firstName"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Middle Name:</label>
        <Field name="middleName" type="text" />
      </div>
      <div className="form-group">
        <label>Last Name*:</label>
        <Field name="lastName" type="text" required />
        <ErrorMessage name="lastName"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Date of Birth*:</label>
        <Field name="dob" type="date" required />
        <ErrorMessage name="dob"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Gender*:</label>
        <Field as="select" name="gender" required>
          <option value="">Select Gender</option>
          {genders.map((gender, index) => (
            <option key={`${gender}-${index}`} value={gender}>{gender}</option>
          ))}
        </Field>
        <ErrorMessage name="gender" style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Email*:</label>
        <Field name="email" type="email" required />
        <ErrorMessage name="email"  style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Contact | Residential Addr. | GPS Info*:</label>
        <Field as="textarea" name="contactInfo"  required  placeholder={`Contact: \nResidential Addr.: \nGPS: \netc. in that order`} />
        <ErrorMessage name="contactInfo" style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Role*:</label>
        <Field as="select" name="role" required>
          <option value="">Select Your Role</option>
          {fetchedRoles.length > 0 ? (
            fetchedRoles.map((roleObj, index) => (
              <option key={`${roleObj.name}-${index}`} value={roleObj.name}>{roleObj.name}</option>
            ))
          ) : (
            <>
              <option value="CEO">CEO</option>
              <option value="Manager">Manager</option>
              <option value="HR Manager">HR Manager</option>
            </>
          )}
        </Field>
        <ErrorMessage name="role" style={{"color":"red"}} component="div" className="error" />
      </div>
      <div className="form-group">
        <label>Profile Image Option*:</label>
        <Field as="select" name="profileImageOption" required>
          <option value="">Select Option</option>
          <option value="capture">Real time capture of user facial image</option>
          <option value="upload">Upload latest image</option>
        </Field>
        <ErrorMessage name="profileImageOption" style={{"color":"red"}} component="div" className="error" />
      </div>
      {values.profileImageOption === 'capture' && (
        <div className="form-group">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="64"
            height="64"
            style={{"margin-left":"45%"}}
            videoConstraints={{ facingMode: 'user' }}
          />
          <button type="button" onClick={handleCapture}>Capture Image</button>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Captured" width="64" height="64" style={{ marginLeft: '45%' }} />
            </div>
          )}
        </div>
      )}
      {values.profileImageOption === 'upload' && (
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleUploadChange} required />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Uploaded" width="64" height="64" style={{ marginTop: '10px', marginLeft: '45%' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalDataForm;









// import React, { useState, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import './PersonalDataForm.css'; // add your styling

// const titles = ["Prof.", "PhD", "Dr.", "Mr.", "Mrs.", "Ms.", "Esq.", "Hon.", "Rev.", "Msgr.", "Other"];
// const genders = ["Male", "Female", "Other"];
// const roles = ["CEO", "Manager", "HR Manager"];

// const PersonalDataForm = ({ data, updateData }) => {
//   const [localData, setLocalData] = useState({
//     title: '',
//     otherTitle: '',
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     email: '',
//     contactInfo: '',
//     profileImageOption: '',
//     capturedImage: null,
//     uploadedImage: null
//   });

//   const [useWebcam, setUseWebcam] = useState(false);
//   const webcamRef = React.useRef(null);

//   useEffect(() => {
//     updateData(localData);
//   }, [localData, updateData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     if (name === 'title' && value !== 'Other') {
//       setLocalData((prev) => ({ ...prev, otherTitle: '' }));
//     }
//     if (name === 'profileImageOption') {
//       setUseWebcam(value === 'capture');
//     }
//   };

//   const handleCapture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setLocalData((prev) => ({ ...prev, capturedImage: imageSrc }));
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setLocalData((prev) => ({ ...prev, uploadedImage: imageUrl }));
//     }
//   };

//   return (
//     <div className="personal-data-form">
//       <div className="form-group">
//         <label>Title*:</label>
//         <select name="title" value={localData.title} onChange={handleChange} required>
//           <option value="">Select Title</option>
//           {titles.map((title, index) => (
//             <option key={`${title}-${index}`} value={title}>{title}</option>
//           ))}
//         </select>
//       </div>
//       {localData.title === 'Other' && (
//         <div className="form-group">
//           <label>Please specify:</label>
//           <input type="text" name="otherTitle" value={localData.otherTitle} onChange={handleChange} required />
//         </div>
//       )}
//       <div className="form-group">
//         <label>First Name*:</label>
//         <input type="text" name="firstName" value={localData.firstName} onChange={handleChange} required />
//       </div>
//       <div className="form-group">
//         <label>Middle Name:</label>
//         <input type="text" name="middleName" value={localData.middleName} onChange={handleChange} />
//       </div>
//       <div className="form-group">
//         <label>Last Name*:</label>
//         <input type="text" name="lastName" value={localData.lastName} onChange={handleChange} required />
//       </div>
//       <div className="form-group">
//         <label>Date of Birth*:</label>
//         <input type="date" name="dateOfBirth" value={localData.dateOfBirth} onChange={handleChange} required />
//       </div>
//       <div className="form-group">
//         <label>Gender*:</label>
//         <select name="gender" value={localData.gender} onChange={handleChange} required>
//           <option value="">Select Gender</option>
//           {genders.map((k,g) => (
//             <option key={`${k}-${g}`} value={k}>{k}</option>
//           ))}
//         </select>
//       </div>
//       <div className="form-group">
//         <label>Email*:</label>
//         <input type="email" name="email" value={localData.email} onChange={handleChange} required />
//       </div>
//       <div className="form-group">
//         <label>Contact | Residential Addr. | GPS Info*:</label>
//         <textarea name="contactInfo" value={localData.contactInfo} onChange={handleChange} required></textarea>
//       </div>
//       <div className="form-group">
//         <label>Role*:</label>
//         <select name="role" value={localData.role} onChange={handleChange} required>
//           <option value="">Select Your Role</option>
//           {roles.map((k, g) => (
//             <option key={`${k}-${g}`} value={k}>{k}</option>
//           ))}
//         </select>
//       </div>
//       <div className="form-group">
//         <label>Profile Image*:</label>
//         <select name="profileImageOption" value={localData.profileImageOption} onChange={handleChange} required>
//           <option value="">Select Option</option>
//           <option value="capture">Real time capture of user facial image</option>
//           <option value="upload">Upload latest image</option>
//         </select>
//       </div>
//       {localData.profileImageOption === 'capture' && (
//         <div className="form-group">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             width="100px"
//             margin-left="45%"
//             height="100px"
//             screenshotFormat="image/jpeg"
//             videoConstraints={{ facingMode: 'user' }}
//           />
//           <button type="button" onClick={handleCapture}>Capture Image</button>
//           {localData.capturedImage && (
//             <img src={localData.capturedImage} alt="Captured"  width="100px"  style={{"margin-left":"45%"}}  height="100px" className="preview-image" />
//           )}
//         </div>
//       )}
//       {localData.profileImageOption === 'upload' && (
//         <div className="form-group">
//           <input type="file" accept="image/*" onChange={handleFileUpload} required />
//           {localData.uploadedImage && (
//             <img src={localData.uploadedImage} alt="Uploaded" width="64px" style={{"margin-left":"45%"}}  height="64px" className="preview-image" />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonalDataForm;
