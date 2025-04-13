// src/components/BioDataSection.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './BioDataSection.css';
import request from "../request"; // Adjust the import based on your project structure

// Enum options defined as per your backend enums:
const TITLE_OPTIONS = [
  'Prof.', 'PhD', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Esq.', 'Hon.', 'Rev.', 'Msgr.', 'Sr.', 'Other'
];
const GENDER_OPTIONS = [
  'Male', 'Female', 'Other'
];
const MARITAL_STATUS_OPTIONS = [
  'Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Other'
];

const BioDataSection = ({ staffId }) => {
  // Local state to hold the fetched bio-data.
  const [bioData, setBioData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    title: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    email: '',
    contact_info: {},
    hire_date: '',
    termination_date: '',
    profile_image_path: ''
  });
  const [dob, setDob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff data from the API when component mounts or staffId changes.
  useEffect(() => {
    const fetchBioData = async () => {
      try {
        const response = await request.get(`/staff/${staffId}`);
        const employee = response.data.main.Employee;
        setBioData(employee);

        if (employee.date_of_birth) {
          setDob(new Date(employee.date_of_birth));
        }
      } catch (err) {
        console.error("Error fetching bio data: ", err);
        setError("Failed to fetch bio data.");
      } finally {
        setLoading(false);
      }
    };

    if (staffId) {
      fetchBioData();
    } else {
      setError("Staff ID not provided.");
      setLoading(false);
    }
  }, [staffId]);

  // Handle text input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  // Handle dropdown change.
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  // Handle date change.
  const handleDateChange = (date) => {
    setDob(date);
    // Update in ISO string format (YYYY-MM-DD)
    setBioData(prev => ({ ...prev, date_of_birth: date.toISOString().split('T')[0] }));
  };

  // Save and Propose Update actions.
  const handleSave = () => {
    // For demo: log the data. In production, send a PUT/PATCH request.
    console.log("Saving bio-data:", bioData);
  };

  const handleProposeUpdate = () => {
    // For demo: log the proposal. In production, trigger the appropriate API endpoint.
    console.log("Proposing bio-data update:", bioData);
  };

  if (loading) return <p>Loading bio-data...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="bio-data-section">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={bioData.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
      </div>
      <div className="form-group">
        <label>Middle Name</label>
        <input
          type="text"
          name="middle_name"
          value={bioData.middle_name}
          onChange={handleChange}
          placeholder="Middle Name"
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={bioData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
      </div>
      <div className="form-group">
        <label>Title</label>
        <select
          name="title"
          value={bioData.title}
          onChange={handleDropdownChange}
        >
          {TITLE_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={bioData.gender}
          onChange={handleDropdownChange}
        >
          {GENDER_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <DatePicker 
          selected={dob} 
          onChange={handleDateChange} 
          dateFormat="yyyy-MM-dd" 
          placeholderText="Select date" 
        />
      </div>
      <div className="form-group">
        <label>Marital Status</label>
        <select
          name="marital_status"
          value={bioData.marital_status}
          onChange={handleDropdownChange}
        >
          {MARITAL_STATUS_OPTIONS.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={bioData.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </div>
      <div className="form-group">
        <label>Contact Information</label>
        <textarea
          name="contact_info"
          value={typeof bioData.contact_info === 'object' ? JSON.stringify(bioData.contact_info) : bioData.contact_info}
          onChange={handleChange}
          placeholder="Contact Information (in JSON format if applicable)"
        />
      </div>

      <div className="section-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleProposeUpdate}>Propose Update</button>
      </div>
    </div>
  );
};

export default BioDataSection;

