import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './PersonalDataForm.css'; // add your styling

const titles = ["Prof.", "PhD", "Dr.", "Mr.", "Mrs.", "Ms.", "Esq.", "Hon.", "Rev.", "Msgr.", "Other"];
const genders = ["Male", "Female", "Other"];
const roles = ["CEO", "Manager", "HR Manager"];

const PersonalDataForm = ({ data, updateData }) => {
  const [localData, setLocalData] = useState({
    title: '',
    otherTitle: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contactInfo: '',
    profileImageOption: '',
    capturedImage: null,
    uploadedImage: null
  });

  const [useWebcam, setUseWebcam] = useState(false);
  const webcamRef = React.useRef(null);

  useEffect(() => {
    updateData(localData);
  }, [localData, updateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'title' && value !== 'Other') {
      setLocalData((prev) => ({ ...prev, otherTitle: '' }));
    }
    if (name === 'profileImageOption') {
      setUseWebcam(value === 'capture');
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setLocalData((prev) => ({ ...prev, capturedImage: imageSrc }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLocalData((prev) => ({ ...prev, uploadedImage: imageUrl }));
    }
  };

  return (
    <div className="personal-data-form">
      <div className="form-group">
        <label>Title*:</label>
        <select name="title" value={localData.title} onChange={handleChange} required>
          <option value="">Select Title</option>
          {titles.map((title, index) => (
            <option key={`${title}-${index}`} value={title}>{title}</option>
          ))}
        </select>
      </div>
      {localData.title === 'Other' && (
        <div className="form-group">
          <label>Please specify:</label>
          <input type="text" name="otherTitle" value={localData.otherTitle} onChange={handleChange} required />
        </div>
      )}
      <div className="form-group">
        <label>First Name*:</label>
        <input type="text" name="firstName" value={localData.firstName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Middle Name:</label>
        <input type="text" name="middleName" value={localData.middleName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Last Name*:</label>
        <input type="text" name="lastName" value={localData.lastName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Date of Birth*:</label>
        <input type="date" name="dateOfBirth" value={localData.dateOfBirth} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Gender*:</label>
        <select name="gender" value={localData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          {genders.map((k,g) => (
            <option key={`${k}-${g}`} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Email*:</label>
        <input type="email" name="email" value={localData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Contact | Residential Addr. | GPS Info*:</label>
        <textarea name="contactInfo" value={localData.contactInfo} onChange={handleChange} required></textarea>
      </div>
      <div className="form-group">
        <label>Role*:</label>
        <select name="role" value={localData.role} onChange={handleChange} required>
          <option value="">Select Your Role</option>
          {roles.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Profile Image*:</label>
        <select name="profileImageOption" value={localData.profileImageOption} onChange={handleChange} required>
          <option value="">Select Option</option>
          <option value="capture">Real time capture of user facial image</option>
          <option value="upload">Upload latest image</option>
        </select>
      </div>
      {localData.profileImageOption === 'capture' && (
        <div className="form-group">
          <Webcam
            audio={false}
            ref={webcamRef}
            width="100px"
            margin-left="45%"
            height="100px"
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button type="button" onClick={handleCapture}>Capture Image</button>
          {localData.capturedImage && (
            <img src={localData.capturedImage} alt="Captured"  width="100px"  style={{"margin-left":"45%"}}  height="100px" className="preview-image" />
          )}
        </div>
      )}
      {localData.profileImageOption === 'upload' && (
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleFileUpload} required />
          {localData.uploadedImage && (
            <img src={localData.uploadedImage} alt="Uploaded" width="64px" style={{"margin-left":"45%"}}  height="64px" className="preview-image" />
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalDataForm;
