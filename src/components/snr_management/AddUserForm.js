// src/components/AddUserForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './AddUserForm.css';
import request from '../request';

const AddUserForm = ({ organizationId, userId, onClose, onUserAdded }) => {
  const [formDesign, setFormDesign] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  // Establish websocket connection to prefetch the form design.
  useEffect(() => {
    const wsUrl = `ws://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.info("WebSocket connected to form-design endpoint.");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFormDesign(data.formDesign);
        if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
          const initialValues = {};
          data.formDesign.fields.forEach(field => {
            initialValues[field.id] = '';
          });
          setFieldValues(initialValues);
        }
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

  const handleInputChange = useCallback((e, fieldId) => {
    const value = e.target.type === "file" ? e.target.files : e.target.value;
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
      alert("No form design available. Please contact your administrator.");
      return;
    }
    try {
      let hasFileField = formDesign.fields.some(field => field.id === 'file');
      let response;
      if (hasFileField) {
        const formData = new FormData();
        Object.entries(fieldValues).forEach(([key, value]) => {
          if (value instanceof FileList) {
            Array.from(value).forEach(file => formData.append(key, file));
          } else {
            formData.append(key, value);
          }
        });
        formData.append('organization_id', organizationId);
        response = await request.post(formDesign.submitUrl || '/users/create', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData
        });
      } else {
        const payload = { ...fieldValues, organization_id: organizationId };
        response = await request.post(formDesign.submitUrl || '/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Submission failed');
      }
      if (formDesign && formDesign.submitCode) {
        try {
          const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
          await submitFunc(fieldValues);
        } catch (error) {
          console.error("Submission error from submitCode:", error);
          alert(error.message);
        }
      }
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Submit Form Error:", error);
      alert(error.message);
    }
  };

  // If formDesign is null, show loading; if design exists but no fields, show friendly message.
  if (!formDesign) {
    return <div className="modal-overlay"><div className="modal-content"><p>Loading form…</p></div></div>;
  }
  if (!formDesign.fields || formDesign.fields.length === 0) {
    return <div className="modal-overlay"><div className="modal-content"><p>No form design available.</p></div></div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {formDesign.fields.map((field, index) => {
            if (field.id === 'role_select') {
              return (
                <div key={index} className="form-group">
                  <label>{field.label}</label>
                  <select 
                    id={field.id}
                    value={fieldValues[field.id]}
                    onChange={(e) => handleInputChange(e, field.id)}
                  >
                    <option value="">Select a Role</option>
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
            if (['text', 'email', 'url', 'date', 'phone', 'number'].includes(field.id)) {
              return (
                <div key={index} className="form-group">
                  <label>{field.label}</label>
                  <input 
                    type={field.id === 'number' ? 'number' : field.id}
                    id={field.id}
                    placeholder={field.label}
                    value={fieldValues[field.id] || ''}
                    onChange={(e) => handleInputChange(e, field.id)}
                  />
                </div>
              );
            }
            if (['radio', 'checkbox'].includes(field.id)) {
              return (
                <div key={index} className="form-group">
                  <label>{field.label}</label>
                  <input 
                    type="text"
                    id={field.id}
                    placeholder="Comma separated options"
                    value={fieldValues[field.id] || ''}
                    onChange={(e) => handleInputChange(e, field.id)}
                  />
                </div>
              );
            }
            if (field.id === 'file') {
              return (
                <div key={index} className="form-group">
                  <label>{field.label}</label>
                  <input 
                    type="file"
                    id={field.id}
                    multiple
                    onChange={(e) => handleInputChange(e, field.id)}
                  />
                </div>
              );
            }
            return null;
          })}
          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;



// // src/components/AddUserForm.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import './AddUserForm.css';
// import request from '../request';

// const AddUserForm = ({ organizationId, userId, onClose, onUserAdded }) => {
//   const [formDesign, setFormDesign] = useState(null);
//   const [fieldValues, setFieldValues] = useState({});

//   // Establish websocket connection to prefetch the form design.
//   useEffect(() => {
//     const wsUrl = `wss://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => console.info("WebSocket connected to form-design endpoint.");
//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         setFormDesign(data.formDesign);
//         // Initialize controlled state for each field.
//         if (data.formDesign?.fields) {
//           const initialValues = {};
//           data.formDesign.fields.forEach(field => {
//             initialValues[field.id] = '';
//           });
//           setFieldValues(initialValues);
//         }
//       } catch (error) {
//         console.error("Error parsing form design:", error);
//       }
//     };
//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       ws.close();
//     };
//   }, [organizationId, userId]);

//   // Handler for changes in the dynamic inputs.
//   const handleInputChange = useCallback((e, fieldId) => {
//     const value = e.target.type === "file" ? e.target.files : e.target.value;
//     setFieldValues(prev => ({
//       ...prev,
//       [fieldId]: value
//     }));
//   }, []);

//   // Submit the form by gathering the controlled input values.
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare data: if any field is a file input, prepare FormData.
//       let hasFileField = false;
//       formDesign.fields.forEach(field => {
//         if (field.id === 'file') {
//           hasFileField = true;
//         }
//       });
//       let response;
//       if (hasFileField) {
//         const formData = new FormData();
//         Object.entries(fieldValues).forEach(([key, value]) => {
//           if (value instanceof FileList) {
//             Array.from(value).forEach(file => formData.append(key, file));
//           } else {
//             formData.append(key, value);
//           }
//         });
//         formData.append('organization_id', organizationId);
//         response = await request.post(formDesign.submitUrl || '/users/create', {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           body: formData
//         });
//       } else {
//         const payload = { ...fieldValues, organization_id: organizationId };
//         response = await request.post(formDesign.submitUrl || '/users/create', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           },
//           body: JSON.stringify(payload)
//         });
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Submission failed');
//       }
//       // Execute the precompiled submission code if provided.
//       if (formDesign && formDesign.submitCode) {
//         try {
//           const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
//           await submitFunc(fieldValues);
//         } catch (error) {
//           console.error("Submission error from submitCode:", error);
//           alert(error.message);
//         }
//       }
//       onUserAdded();
//       onClose();
//     } catch (error) {
//       console.error("Submit Form Error:", error);
//       alert(error.message);
//     }
//   };

//   if (!formDesign) {
//     return <div>Loading form…</div>;
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <form onSubmit={handleSubmit}>
//           {formDesign.fields.map((field, index) => {
//             if (field.id === 'role_select') {
//               return (
//                 <div key={index} className="form-group">
//                   <label>{field.label}</label>
//                   <select 
//                     id={field.id}
//                     value={fieldValues[field.id]}
//                     onChange={(e) => handleInputChange(e, field.id)}
//                   >
//                     <option value="">Select a Role</option>
//                     {field.options && field.options.length > 0 ? (
//                       field.options.map(option => (
//                         <option key={option.id} value={option.id}>
//                           {option.name}
//                         </option>
//                       ))
//                     ) : (
//                       <option value="">No roles available</option>
//                     )}
//                   </select>
//                 </div>
//               );
//             }
//             if (['text', 'email', 'url', 'date', 'phone'].includes(field.id)) {
//               return (
//                 <div key={index} className="form-group">
//                   <label>{field.label}</label>
//                   <input 
//                     type={field.id}
//                     id={field.id}
//                     placeholder={field.label}
//                     value={fieldValues[field.id] || ''}
//                     onChange={(e) => handleInputChange(e, field.id)}
//                   />
//                 </div>
//               );
//             }
//             if (['radio', 'checkbox'].includes(field.id)) {
//               return (
//                 <div key={index} className="form-group">
//                   <label>{field.label}</label>
//                   <input 
//                     type="text"
//                     id={field.id}
//                     placeholder="Comma separated options"
//                     value={fieldValues[field.id] || ''}
//                     onChange={(e) => handleInputChange(e, field.id)}
//                   />
//                 </div>
//               );
//             }
//             if (field.id === 'file') {
//               return (
//                 <div key={index} className="form-group">
//                   <label>{field.label}</label>
//                   <input 
//                     type="file"
//                     id={field.id}
//                     multiple
//                     onChange={(e) => handleInputChange(e, field.id)}
//                   />
//                 </div>
//               );
//             }
//             return null;
//           })}
//           <div className="modal-actions">
//             <button type="submit">Submit</button>
//             <button type="button" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddUserForm;

