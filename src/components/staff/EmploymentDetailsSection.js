// src/components/EmploymentDetailsSection.js
import React, { useState } from 'react';
import './EmploymentDetailsSection.css';

const EmploymentDetailsSection = () => {
  const [empDetails, setEmpDetails] = useState({
    branch: 'Main Branch',
    department: 'Engineering',
    rank: 'Manager'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving employment details: ", empDetails);
  };

  const handleProposeUpdate = () => {
    console.log("Proposing update for employment details: ", empDetails);
  };

  return (
    <div className="employment-details-section">
      {/* Conditionally render branch if applicable */}
      {empDetails.branch && (
        <div className="form-group">
          <label>Branch</label>
          <input type="text" name="branch" value={empDetails.branch} onChange={handleChange} />
        </div>
      )}
      <div className="form-group">
        <label>Department</label>
        <input type="text" name="department" value={empDetails.department} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Rank</label>
        <input type="text" name="rank" value={empDetails.rank} onChange={handleChange} />
      </div>
      <div className="section-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleProposeUpdate}>Propose Update</button>
      </div>
    </div>
  );
};

export default EmploymentDetailsSection;

