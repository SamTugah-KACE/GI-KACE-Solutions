import React from 'react';
import './SummaryCard.css';
import { FaUserCheck, FaUserTimes, FaBuilding } from 'react-icons/fa'; // using react-icons

const SummaryCards = () => {
  // Dummy data
  const accountSummary = {
    active: { male: 20, female: 25 },
    inactive: { male: 5, female: 7 },
    total: 57
  };
  const departmentSummary = {
    departments: ['HR', 'IT', 'Finance', 'Sales'],
    total: 4
  };

  return (
    <div className="summary-cards">
      <div className="card">
        <h3>
          <FaUserCheck className="icon" /> Accounts
        </h3>
        <div className="card-details">
          <div>
            <strong>Active:</strong>
            <br />
            Male: {accountSummary.active.male}
            <br />
            Female: {accountSummary.active.female}
          </div>
          <div>
            <strong>Inactive:</strong>
            <br />
            Male: {accountSummary.inactive.male}
            <br />
            Female: {accountSummary.inactive.female}
          </div>
        </div>
        <p>
          <strong>Total: {accountSummary.total}</strong>
        </p>
      </div>
      <div className="card">
        <h3>
          <FaBuilding className="icon" /> Departments
        </h3>
        <ul>
          {departmentSummary.departments.map((dept, i) => (
            <li key={i}>{dept}</li>
          ))}
        </ul>
        <p>
          <strong>Total: {departmentSummary.total}</strong>
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
