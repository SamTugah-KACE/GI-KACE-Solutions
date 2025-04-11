// // src/components/AddUserForm.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import './AddUserForm.css';
// import request from '../request';
// import {toast} from 'react-toastify';


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
//         if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
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

//   const handleInputChange = useCallback((e, fieldId) => {
//     const value = e.target.type === "file" ? e.target.files : e.target.value;
//     setFieldValues(prev => ({ ...prev, [fieldId]: value }));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
//       toast.info("No form design available. Please contact your administrator.");
//       // console.error("No form design available. Please contact your administrator.");
//       // alert("No form design available. Please contact your administrator.");
//       return;
//     }
//     try {
//       let hasFileField = formDesign.fields.some(field => field.id === 'file');
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
//         response = await request.post(formDesign.submitUrl || '/users/create', formData
//         //   {
//         //   method: 'POST',
//         //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         //   body: formData
//         // }
//       );
//       } else {
//         const payload = { ...fieldValues, organization_id: organizationId };
//         response = await request.post(formDesign.submitUrl || '/users/create', JSON.stringify(payload)
//         //   {
//         //   method: 'POST',
//         //   headers: {
//         //     'Content-Type': 'application/json',
//         //     Authorization: `Bearer ${localStorage.getItem('token')}`
//         //   },
//         //   body: JSON.stringify(payload)
//         // }
//       );
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Submission failed');
//       }
//       if (formDesign && formDesign.submitCode) {
//         try {
//           const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
//           await submitFunc(fieldValues);
//         } catch (error) {
//           console.error("Submission error from submitCode:", error);
//           toast.error(`"Error collecting request form data: "${error.message}`);
//           // alert(error.message);
//         }
//       }
//       onUserAdded();
//       onClose();
//     } catch (error) {
//       console.error("Submit Form Error:", error);
//       toast.error(`"Error submitting request form data: "${error.message}`);
//       // alert(error.message);
//     }
//   };

//   // If formDesign is null, show loading; if design exists but no fields, show friendly message.
//   if (!formDesign) {
//     return <div className="modal-overlay"><div className="modal-content"><p>Loading form…</p></div></div>;
//   }
//   if (!formDesign.fields || formDesign.fields.length === 0) {
//     return <div className="modal-overlay"><div className="modal-content"><p>No form design available.</p></div></div>;
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
//             if (['text', 'email', 'url', 'date', 'phone', 'number'].includes(field.id)) {
//               return (
//                 <div key={index} className="form-group">
//                   <label>{field.label}</label>
//                   <input 
//                     type={field.id === 'number' ? 'number' : field.id}
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



// src/components/AddUserForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './AddUserForm.css';
import request from '../request';
import { toast } from 'react-toastify';
import AddRoleModal from './AddRoleModal'; // Modal to add a new role

/**
 * Helper: split an array into chunks.
 */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Renders a field based on its type.
 * For radio buttons and checkboxes, if there are three or fewer options,
 * they are laid out horizontally; otherwise, they wrap responsively.
 * For role_select fields, role options are taken from `roleOptions` prop.
 */
const renderField = (field, fieldValue, handleChange, roleOptions, openAddRole) => {
  switch (field.id) {
    case 'radio': {
      if (field.options?.choices && field.options.choices.length > 0) {
        const layoutClass =
          field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
        return (
          <div className={layoutClass}>
            {field.options.choices.map((choice, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name={field.id}
                  value={choice}
                  checked={fieldValue === choice}
                  onChange={handleChange}
                />
                {choice}
              </label>
            ))}
          </div>
        );
      }
      return <span className="no-options">No options available</span>;
    }
    case 'checkbox': {
      if (field.options?.choices && field.options.choices.length > 0) {
        const values = Array.isArray(fieldValue) ? fieldValue : [];
        const layoutClass =
          field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
        return (
          <div className={layoutClass}>
            {field.options.choices.map((choice, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="checkbox"
                  name={field.id}
                  value={choice}
                  checked={values.includes(choice)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValues = [...values];
                    if (checked) newValues.push(choice);
                    else newValues = newValues.filter(v => v !== choice);
                    handleChange({
                      target: { name: field.id, value: newValues, type: 'checkbox' },
                    });
                  }}
                />
                {choice}
              </label>
            ))}
          </div>
        );
      }
      return <span className="no-options">No options available</span>;
    }
    case 'select':
    case 'role_select': {
      // For role_select, use fetched roleOptions and append an "Add New Role" option.
      const options =
        field.id === 'role_select'
          ? (roleOptions || []).map((role) => ({
              id: role.id,
              name: role.name,
            }))
          : field.options?.choices?.map(choice => ({ id: choice, name: choice }));
      return (
        <select name={field.id} value={fieldValue || ""} onChange={(e) => {
          const selectedValue = e.target.value;
          // If the "Add New Role" option is chosen, trigger modal.
          if (selectedValue === '__add_new_role__') {
            openAddRole();
          } else {
            handleChange(e);
          }
        }}>
          <option value="">Select an option</option>
          {options &&
            options.map((option, idx) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          {field.id === 'role_select' && <option value="__add_new_role__">Add New Role</option>}
        </select>
      );
    }
    case 'file': {
      return (
        <input
          type="file"
          name={field.id}
          multiple
          onChange={handleChange}
        />
      );
    }
    default: {
      return (
        <input
          type={field.id === 'number' ? 'number' : field.id}
          name={field.id}
          placeholder={field.label}
          value={fieldValue || ''}
          onChange={handleChange}
        />
      );
    }
  }
};

const AddUserForm = ({ organizationId, userId, onClose, onUserAdded }) => {
  const [formDesign, setFormDesign] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);

  // Fetch the precompiled form design via WebSocket.
  useEffect(() => {
    const wsUrl = `wss://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () =>
      console.info("WebSocket connected to form-design endpoint.");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFormDesign(data.formDesign);
        if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
          const initialValues = {};
          data.formDesign.fields.forEach((field) => {
            initialValues[field.id] = field.id === 'checkbox' ? [] : '';
          });
          setFieldValues(initialValues);
          if (data.formDesign.fields.length > 4) {
            setSteps(chunkArray(data.formDesign.fields, 4));
            setCurrentStep(0);
          } else {
            setSteps([data.formDesign.fields]);
          }
        }
      } catch (error) {
        console.error("Error parsing form design:", error);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // In case of error, allow the modal to display with a friendly message.
      setFormDesign({ fields: [] });
    };

    return () => ws.close();
  }, [organizationId, userId]);

  // Fetch role options if the form has a role_select field.
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
        const data =  res.data;
        console.log('response.data:', data);
        console.log('response data.data:', data.data);
        if (data?.data) {
          setRoleOptions(data.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, [organizationId]);

  // Handler for input changes.
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    const newVal = type === 'file' ? e.target.files : value;
    setFieldValues(prev => ({ ...prev, [name]: newVal }));
  }, []);

  // Open the Add New Role modal.
  const openAddRole = () => {
    setShowAddRoleModal(true);
  };

  // Handler for modal form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
      toast.info("No form design available. Please contact your administrator.");
      return;
    }
    try {
      let response;
      const hasFileField = formDesign.fields.some(field => field.id === 'file');
      if (hasFileField) {
        const formData = new FormData();
        Object.entries(fieldValues).forEach(([key, val]) => {
          if (val instanceof FileList) {
            Array.from(val).forEach(file => formData.append(key, file));
          } else {
            formData.append(key, val);
          }
        });
        formData.append('organization_id', organizationId);
        response = await request.post(formDesign.submitUrl || '/users/create', formData);
      } else {
        const payload = { ...fieldValues, organization_id: organizationId };
        response = await request.post(formDesign.submitUrl || '/users/create', JSON.stringify(payload));
      }
      if (!response.ok || response.status !== 200 || response.status !== 201) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Submission failed');
      }
      if (formDesign && formDesign.submitCode) {
        try {
          const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
          await submitFunc(fieldValues);
        } catch (error) {
          console.error("Submission error from submitCode:", error);
          toast.error(`Error executing submit code: ${error.message}`);
        }
      }
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Submit Form Error:", error);
      toast.error(`Error submitting form: ${error.message}`);
    }
  };

  // Multi-step navigation.
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Render fields for the current step.
  const renderFields = () => {
    const fieldsToRender = steps[currentStep];
    return fieldsToRender.map((field, index) => {
      const key = `${currentStep}-${field.id}-${index}`;
      return (
        <div key={key} className="form-group">
          <label>{field.label}</label>
          {renderField(field, fieldValues[field.id], handleInputChange, roleOptions, openAddRole)}
        </div>
      );
    });
  };

  // Friendly messages if no design is retrieved.
  if (!formDesign) {
    return (
      <div className="modal-overlay">
        <div className="modal-content"><p>Loading form…</p></div>
      </div>
    );
  }
  if (!formDesign.fields || formDesign.fields.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content"><p>No form design available. Please contact your administrator.</p></div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {renderFields()}
          {steps.length > 1 && (
            <div className="step-indicator">
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
          )}
          <div className="modal-actions">
            {steps.length > 1 && currentStep > 0 && (
              <button type="button" onClick={prevStep}>Back</button>
            )}
            {steps.length > 1 && currentStep < steps.length - 1 && (
              <button type="button" onClick={nextStep}>Next</button>
            )}
            {(steps.length <= 1 || currentStep === steps.length - 1) && (
              <button type="submit">Submit</button>
            )}
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {showAddRoleModal && (
          <AddRoleModal
            organizationId={organizationId}
            onClose={() => setShowAddRoleModal(false)}
            onRoleAdded={(newRole) => {
              // Update roleOptions state by appending the new role.
              setRoleOptions(prev => [...prev, newRole]);
              // Also update fieldValues for the role_select field if needed.
              setFieldValues(prev => ({ ...prev, role_select: newRole.id }));
              setShowAddRoleModal(false);
            }}
          />
        )}
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

