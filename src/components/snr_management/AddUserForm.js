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

/**
 * Helper function to split an array into chunks.
 */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Render a field based on its type.
 */
const renderField = (field, fieldValue, handleChange) => {
  switch (field.id) {
    case 'radio': {
      // Render radio buttons for each option.
      if (field.options?.choices && field.options.choices.length > 0) {
        return (
          <div className="options-group">
            {field.options.choices.map((choice, idx) => (
              <label key={idx}>
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
      return <span>No options available</span>;
    }
    case 'checkbox': {
      // Render a set of checkboxes. For simplicity, assume multiple can be chosen.
      if (field.options?.choices && field.options.choices.length > 0) {
        // If no value, initialize with an empty array.
        const values = Array.isArray(fieldValue) ? fieldValue : [];
        return (
          <div className="options-group">
            {field.options.choices.map((choice, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  name={field.id}
                  value={choice}
                  checked={values.includes(choice)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValues = [...values];
                    if (checked) {
                      newValues.push(choice);
                    } else {
                      newValues = newValues.filter(item => item !== choice);
                    }
                    handleChange({ target: { name: field.id, value: newValues } });
                  }}
                />
                {choice}
              </label>
            ))}
          </div>
        );
      }
      return <span>No options available</span>;
    }
    case 'select':
    case 'role_select': {
      // Render a dropdown select. Options should be an array of objects; here assume each option is a string.
      if (field.options?.choices && field.options.choices.length > 0) {
        return (
          <select name={field.id} value={fieldValue} onChange={handleChange}>
            <option value="">Select an option</option>
            {field.options.choices.map((choice, idx) => (
              <option key={idx} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        );
      }
      return <span>No options available</span>;
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
    // For most other types, render a simple input.
    default: {
      return (
        <input
          type={field.id === 'number' ? 'number' : field.id}
          name={field.id}
          placeholder={field.label}
          value={fieldValue}
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
  const [steps, setSteps] = useState([]); // Each step is an array of fields

  // Establish WebSocket connection to fetch precompiled form design.
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
            // For checkboxes, initialize to an array.
            initialValues[field.id] =
              field.id === 'checkbox' ? [] : '';
          });
          setFieldValues(initialValues);
          // If more than 4 fields, split into steps.
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
    };
    return () => {
      ws.close();
    };
  }, [organizationId, userId]);

  // Handler for input changes in the form.
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    const newVal = type === 'file' ? e.target.files : value;
    setFieldValues((prev) => ({ ...prev, [name]: newVal }));
  }, []);

  // Submit handler; creates FormData if file field exists.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
      toast.info("No form design available. Please contact your administrator.");
      return;
    }
    try {
      let response;
      const hasFileField = formDesign.fields.some(
        (field) => field.id === 'file'
      );
      if (hasFileField) {
        const formData = new FormData();
        Object.entries(fieldValues).forEach(([key, val]) => {
          if (val instanceof FileList) {
            Array.from(val).forEach((file) => formData.append(key, file));
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
      if (!response.ok || response.status !== 200) {
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

  // Navigation for multi-step form.
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Render the form fields based on step.
  const renderFields = () => {
    const fieldsToRender = steps[currentStep];
    return fieldsToRender.map((field, index) => {
      // Determine a unique key that combines step and field id.
      const key = `${currentStep}-${field.id}-${index}`;
      switch (field.id) {
        case 'radio':
          return (
            <div key={key} className="form-group">
              <label>{field.label}</label>
              {field.options?.choices ? (
                <div className="options-group">
                  {field.options.choices.map((choice, idx) => (
                    <label key={idx}>
                      <input
                        type="radio"
                        name={field.id}
                        value={choice}
                        checked={fieldValues[field.id] === choice}
                        onChange={handleInputChange}
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              ) : (
                <span>No options available</span>
              )}
            </div>
          );
        case 'checkbox':
          return (
            <div key={key} className="form-group">
              <label>{field.label}</label>
              {field.options?.choices ? (
                <div className="options-group">
                  {field.options.choices.map((choice, idx) => {
                    const currentValues = Array.isArray(fieldValues[field.id])
                      ? fieldValues[field.id]
                      : [];
                    return (
                      <label key={idx}>
                        <input
                          type="checkbox"
                          name={field.id}
                          value={choice}
                          checked={currentValues.includes(choice)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let newValues = [...currentValues];
                            if (checked) newValues.push(choice);
                            else newValues = newValues.filter((v) => v !== choice);
                            handleInputChange({
                              target: { name: field.id, value: newValues, type: 'checkbox' },
                            });
                          }}
                        />
                        {choice}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <span>No options available</span>
              )}
            </div>
          );
        case 'select':
        case 'role_select':
          return (
            <div key={key} className="form-group">
              <label>{field.label}</label>
              <select
                name={field.id}
                value={fieldValues[field.id] || ""}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                {field.options?.choices && field.options.choices.map((choice, idx) => (
                  <option key={idx} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </div>
          );
        case 'file':
          return (
            <div key={key} className="form-group">
              <label>{field.label}</label>
              <input
                type="file"
                name={field.id}
                multiple
                onChange={handleInputChange}
              />
            </div>
          );
        default:
          // Render text-based input for all other types.
          return (
            <div key={key} className="form-group">
              <label>{field.label}</label>
              <input
                type={field.id === 'number' ? 'number' : field.id}
                name={field.id}
                placeholder={field.label}
                value={fieldValues[field.id] || ""}
                onChange={handleInputChange}
              />
            </div>
          );
      }
    });
  };

  // If no design is fetched, display appropriate message.
  if (!formDesign) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading form…</p>
        </div>
      </div>
    );
  }
  if (!formDesign.fields || formDesign.fields.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>No form design available. Please contact your administrator.</p>
        </div>
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
            {steps.length <= 1 || currentStep === steps.length - 1 ? (
              <button type="submit">Submit</button>
            ) : null}
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

