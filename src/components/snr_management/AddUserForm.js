// file: src/components/AddUserForm.jsx
import React, { useState, useEffect } from 'react';
import './AddUserForm.css';

const AddUserForm = ({ organizationId, userId }) => {
  const [formDesign, setFormDesign] = useState(null);

  useEffect(() => {
    const wsUrl = `ws://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.info("WebSocket connected to form-design endpoint.");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFormDesign(data.formDesign);
      } catch (error) {
        console.error("Error parsing form design:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [organizationId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gather form data using a robust approach – ideally using controlled components or refs.
    const formData = {};
    formDesign.fields.forEach((field) => {
      const el = document.getElementById(field.id);
      if (el) {
        // If file input, collect FileList; else, get the value.
        if (field.id === 'file') {
          formData[field.id] = el.files;
        } else {
          formData[field.id] = el.value;
        }
      }
    });

    // In production, avoid eval() if possible.
    // Here we use the Function constructor in strict mode as a slightly safer alternative.
    if (formDesign && formDesign.submitCode) {
      try {
        // Create a new function from the precompiled code.
        const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
        await submitFunc(formData);
      } catch (error) {
        console.error("Submission error:", error);
        alert(error.message);
      }
    }
  };

  if (!formDesign) {
    return <div>Loading form...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {formDesign.fields.map((field, index) => {
        // Render dynamic fields based on type.
        if (field.id === 'role_select') {
          return (
            <div key={index}>
              <label>{field.label}</label>
              <select id={field.id}>
                {/* Assume role options are now embedded in formDesign for simplicity.
                    In production, you might fetch these separately. */}
                {field.options && field.options.length > 0 ? (
                  field.options.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))
                ) : (
                  <option value="">No roles available</option>
                )}
              </select>
            </div>
          );
        }
        // Basic render for other field types.
        if (['text', 'email', 'url', 'date', 'phone'].includes(field.id)) {
          return (
            <div key={index}>
              <label>{field.label}</label>
              <input type={field.id} id={field.id} placeholder={field.label} />
            </div>
          );
        }
        // For radio/checkbox: render an input to enter options.
        if (['radio', 'checkbox'].includes(field.id)) {
          return (
            <div key={index}>
              <label>{field.label}</label>
              <input type="text" id={field.id} placeholder="Comma separated options" />
            </div>
          );
        }
        // For file upload:
        if (field.id === 'file') {
          return (
            <div key={index}>
              <label>{field.label}</label>
              <input type="file" id={field.id} multiple />
            </div>
          );
        }
        return null;
      })}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddUserForm;
