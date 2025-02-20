// src/components/OrganizationSignup.js
import React from 'react';
import MultiStepForm from './MultiStepForm';
import request from '../request';
import { useNavigate } from 'react-router-dom';
import './OrganizationSignup.css';

const OrganizationSignup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    // Simple client-side validation (enhance as needed)
    if (!data.name || !data.orgEmail || !data.country || !data.type || !data.nature || !data.employeeRange) {
      alert("Please fill all required fields.");
      return;
    }
    // Organize data into FormData (including file uploads and JSON fields)
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("organizational_email", data.orgEmail);
    fd.append("country", data.country);
    fd.append("type", data.type);
    fd.append("nature", data.nature);
    fd.append("employee_range", data.employeeRange);
    fd.append("subscription_plan", data.subscriptionPlan || "Basic");
    
    if (data.logos && data.logos.length > 0) {
      data.logos.forEach(file => fd.append("logos", file));
    }
    // JSON fields (tenancies, roles, employees, users, settings)
    fd.append("tenancies", JSON.stringify(data.tenancies || []));
    fd.append("roles", JSON.stringify(data.roles || []));
    fd.append("employees", JSON.stringify(data.employees || []));
    fd.append("users", JSON.stringify(data.users || []));
    fd.append("settings", JSON.stringify(data.settings || []));

    try {
      const response = await request.post("/organizations/create-form/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Assume response.data.access_url exists; if not, use default route
      const { access_url } = response.data;
      // Navigate to '/dashboard' (or '/sign-in' appended to the access_url if needed)
      navigate("/signin");
    //   navigate("/dashboard");
    } catch (error) {
      alert("Error during organization signup: " + error.message);
    }
  };

  return (
    <div className="organization-signup">
      <h2>Organization Sign Up</h2>
      <MultiStepForm onSubmit={handleSubmit} />
    </div>
  );
};

export default OrganizationSignup;
