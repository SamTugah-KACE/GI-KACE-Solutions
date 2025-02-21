import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './PersonalDataForm.css'; // add your styling

const titles = ["Prof.", "PhD", "Dr.", "Mr.", "Mrs.", "Ms.", "Esq.", "Hon.", "Rev.", "Msgr.", "Other"];
const genders = ["Male", "Female", "Other"];

const PersonalDataForm = ({ data, updateData }) => {
  const [localData, setLocalData] = useState({
    title: data?.title || '',
    otherTitle: '',
    firstName: data?.firstName || '',
    middleName: data?.middleName || '',
    lastName: data?.lastName || '',
    dateOfBirth: data?.dateOfBirth || '',
    gender: data?.gender || '',
    email: data?.email || '',
    contactInfo: data?.contactInfo || '',
    profileImageOption: '',
    capturedImage: null,
    uploadedImage: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [useWebcam, setUseWebcam] = useState(false);
  const webcamRef = React.useRef(null);

  const validateForm = () => {
    const validationErrors = {};
    
    if (!localData.title) {
      validationErrors.title = 'Title is required';
    }
    if (localData.title === 'Other' && !localData.otherTitle) {
      validationErrors.otherTitle = 'Please specify title';
    }
    if (!localData.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    if (!localData.lastName.trim()) {
      validationErrors.lastName = 'Last name is required';
    }
    if (!localData.dateOfBirth) {
      validationErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!localData.gender) {
      validationErrors.gender = 'Gender is required';
    }
    if (!localData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(localData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    if (!localData.contactInfo.trim()) {
      validationErrors.contactInfo = 'Contact information is required';
    }
    if (!localData.profileImageOption) {
      validationErrors.profileImageOption = 'Profile image option is required';
    }
      
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    if (name === 'title' && value !== 'Other') {
      setLocalData((prev) => ({ ...prev, otherTitle: '' }));
    }
    if (name === 'profileImageOption') {
      setUseWebcam(value === 'capture');
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateForm();
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

  useEffect(() => {
    const isValid = validateForm();
    updateData(localData, isValid);
  }, [localData]);

  return (
    <div className="personal-data-form">
      <div className="form-group">
        <label>Title*:</label>
        <select
          name="title"
          value={localData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.title && errors.title ? 'error-border' : ''}
        >
          <option value="">Select Title</option>
          {titles.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
        {touched.title && errors.title && <span className="error">{errors.title}</span>}
      </div>
      {localData.title === 'Other' && (
        <div className="form-group">
          <label>Please specify:</label>
          <input type="text" name="otherTitle" value={localData.otherTitle} onChange={handleChange} onBlur={handleBlur} />
          {touched.otherTitle && errors.otherTitle && <span className="error">{errors.otherTitle}</span>}
        </div>
      )}
      <div className="form-group">
        <label>First Name*:</label>
        <input
          type="text"
          name="firstName"
          value={localData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.firstName && errors.firstName ? 'error-border' : ''}
        />
        {touched.firstName && errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>
      <div className="form-group">
        <label>Middle Name:</label>
        <input
          type="text"
          name="middleName"
          value={localData.middleName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div className="form-group">
        <label>Last Name*:</label>
        <input
          type="text"
          name="lastName"
          value={localData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.lastName && errors.lastName ? 'error-border' : ''}
        />
        {touched.lastName && errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>
      <div className="form-group">
        <label>Date of Birth*:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={localData.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.dateOfBirth && errors.dateOfBirth ? 'error-border' : ''}
        />
        {touched.dateOfBirth && errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
      </div>
      <div className="form-group">
        <label>Gender*:</label>
        <select
          name="gender"
          value={localData.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.gender && errors.gender ? 'error-border' : ''}
        >
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {touched.gender && errors.gender && <span className="error">{errors.gender}</span>}
      </div>
      <div className="form-group">
        <label>Email*:</label>
        <input
          type="email"
          name="email"
          value={localData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.email && errors.email ? 'error-border' : ''}
        />
        {touched.email && errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Contact | Residential Addr. | GPS Info*:</label>
        <textarea
          name="contactInfo"
          value={localData.contactInfo}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.contactInfo && errors.contactInfo ? 'error-border' : ''}
        />
        {touched.contactInfo && errors.contactInfo && <span className="error">{errors.contactInfo}</span>}
      </div>
      <div className="form-group">
        <label>Profile Image*:</label>
        <select name="profileImageOption" value={localData.profileImageOption} onChange={handleChange} onBlur={handleBlur} required>
          <option value="">Select Option</option>
          <option value="capture">Real time capture of user facial image</option>
          <option value="upload">Upload latest image</option>
        </select>
        {touched.profileImageOption && errors.profileImageOption && <span className="error">{errors.profileImageOption}</span>}
      </div>
      {localData.profileImageOption === 'capture' && (
        <div className="form-group">
          <Webcam
            audio={false}
            ref={webcamRef}
            width="100px"
            height="100px"
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button type="button" onClick={handleCapture}>Capture Image</button>
          {localData.capturedImage && (
            <img src={localData.capturedImage} alt="Captured"  width="100px"  height="100px" className="preview-image" />
          )}
        </div>
      )}
      {localData.profileImageOption === 'upload' && (
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleFileUpload} onBlur={handleBlur} required />
          {localData.uploadedImage && (
            <img src={localData.uploadedImage} alt="Uploaded" width="50px"  height="50px" className="preview-image" />
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalDataForm;
