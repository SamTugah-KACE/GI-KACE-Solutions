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


// // src/components/AddUserForm.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import './AddUserForm.css';
// import request from '../request';
// import { toast } from 'react-toastify';
// import AddRoleModal from './AddRoleModal';

// /**
//  * Helper function to split an array into chunks.
//  */
// const chunkArray = (arr, size) => {
//   const chunks = [];
//   for (let i = 0; i < arr.length; i += size) {
//     chunks.push(arr.slice(i, i + size));
//   }
//   return chunks;
// };

// /**
//  * Fetch department options for a given organization.
//  */
// const fetchDepartmentOptions = async (organizationId) => {
//   try {
//     const res = await request.get(`/organizations/${organizationId}/departments?skip=0&limit=100`);
//     const data = await res.json();
//     if (data.departments && Array.isArray(data.departments)) {
//       // Return options in { id, name } format.
//       return data.departments.map(dep => ({ id: dep.id, name: dep.name }));
//     }
//     return [];
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     return [];
//   }
// };

// /**
//  * Renders a field based on its type.
//  * For radio and checkbox, if options count ≤ 3, they are displayed horizontally;
//  * otherwise, they wrap responsively.
//  * For role_select, and department fields the options are fetched dynamically.
//  */
// const renderField = async (field, fieldValue, handleChange, organizationId, roleOptions) => {
//   // Special handling for department dropdown: if the field label contains "department" (case-insensitive)
//   if (/department/i.test(field.label)) {
//     // Fetch department options.
//     const deptOptions = await fetchDepartmentOptions(organizationId);
//     return (
//       <select name={field.label} value={fieldValue || ""} onChange={handleChange}>
//         <option value="">Select a Department</option>
//         {deptOptions.map((dep) => (
//           <option key={dep.id} value={dep.id}>
//             {dep.name}
//           </option>
//         ))}
//       </select>
//     );
//   }

//   switch (field.id) {
//     case 'radio': {
//       if (field.options?.choices && field.options.choices.length > 0) {
//         const layoutClass =
//           field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
//         return (
//           <div className={layoutClass}>
//             {field.options.choices.map((choice, idx) => (
//               <label key={idx} className="option-label">
//                 <input
//                   type="radio"
//                   name={field.label}
//                   value={choice}
//                   checked={fieldValue === choice}
//                   onChange={handleChange}
//                 />
//                 {choice}
//               </label>
//             ))}
//           </div>
//         );
//       }
//       return <span className="no-options">No options available</span>;
//     }
//     case 'checkbox': {
//       if (field.options?.choices && field.options.choices.length > 0) {
//         const values = Array.isArray(fieldValue) ? fieldValue : [];
//         const layoutClass =
//           field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
//         return (
//           <div className={layoutClass}>
//             {field.options.choices.map((choice, idx) => (
//               <label key={idx} className="option-label">
//                 <input
//                   type="checkbox"
//                   name={field.label}
//                   value={choice}
//                   checked={values.includes(choice)}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     let newValues = [...values];
//                     if (checked) newValues.push(choice);
//                     else newValues = newValues.filter(v => v !== choice);
//                     handleChange({
//                       target: { name: field.label, value: newValues, type: 'checkbox' },
//                     });
//                   }}
//                 />
//                 {choice}
//               </label>
//             ))}
//           </div>
//         );
//       }
//       return <span className="no-options">No options available</span>;
//     }
//     case 'select':
//     case 'role_select': {
//       // For role_select field, use fetched roleOptions.
//       const options =
//         field.id === 'role_select' ? roleOptions || [] : (field.options?.choices || []).map(choice => ({ id: choice, name: choice }));
//       return (
//         <select name={field.label} value={fieldValue || ""} onChange={handleChange}>
//           <option value="">Select an option</option>
//           {options.map((option, idx) => (
//             <option key={option.id || idx} value={option.id || option.name}>
//               {option.name || option}
//             </option>
//           ))}
//           {field.id === 'role_select' && (
//             <option value="__add_new_role__">Add New Role</option>
//           )}
//         </select>
//       );
//     }
//     case 'file': {
//       return (
//         <input
//           type="file"
//           name={field.label}
//           multiple
//           onChange={handleChange}
//         />
//       );
//     }
//     case 'submit': {
//       // Render the submit button as defined in the form design.
//       // return <button type="submit">{field.label}</button>;
//       return null;
//     }
//     default: {
//       return (
//         <input
//           type={field.id === 'number' ? 'number' : field.id}
//           name={field.label}
//           placeholder={field.label}
//           value={fieldValue || ''}
//           onChange={handleChange}
//         />
//       );
//     }
//   }
// };

// const AddUserForm = ({ organizationId, userId, onClose, onUserAdded }) => {
//   const [formDesign, setFormDesign] = useState(null);
//   // Use field labels as keys to ensure atomicity.
//   const [fieldValues, setFieldValues] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [steps, setSteps] = useState([]); // Each step contains an array of fields
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//   const [roleOptions, setRoleOptions] = useState([]);

//   // Establish WebSocket connection to fetch precompiled form design.
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
//           data.formDesign.fields.forEach((field) => {
//             // Use the field's label as the unique key.
//             initialValues[field.label] = field.id === 'checkbox' ? [] : '';
//           });
//           setFieldValues(initialValues);
//           if (data.formDesign.fields.length > 4) {
//             setSteps(chunkArray(data.formDesign.fields, 4));
//             setCurrentStep(0);
//           } else {
//             setSteps([data.formDesign.fields]);
//           }
//         }
//       } catch (error) {
//         console.error("Error parsing form design:", error);
//       }
//     };
//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       // In case of error, set an empty design so that a message is displayed.
//       setFormDesign({ fields: [] });
//     };
//     return () => ws.close();
//   }, [organizationId, userId]);

//   // Fetch role options for dropdowns labeled "Role Selection".
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
//         const data = await res.json();
//         if (data?.data) {
//           setRoleOptions(data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching roles:', error);
//       }
//     };
//     fetchRoles();
//   }, [organizationId]);

//   // Handle input changes (using field labels as keys).
//   const handleInputChange = useCallback((e) => {
//     const { name, value, type } = e.target;
//     const newVal = type === 'file' ? e.target.files : value;
//     setFieldValues(prev => ({ ...prev, [name]: newVal }));
//   }, []);

//   // Open Add New Role modal.
//   const openAddRole = () => {
//     setShowAddRoleModal(true);
//   };

//   // Submission: Build payload so that keys are field labels.
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
//       toast.info("No form design available. Please contact your administrator.");
//       return;
//     }
//     try {
//       let response;
//       const hasFileField = formDesign.fields.some(field => field.id === 'file');
//       if (hasFileField) {
//         const formData = new FormData();
//         Object.entries(fieldValues).forEach(([key, val]) => {
//           if (val instanceof FileList) {
//             Array.from(val).forEach(file => formData.append(key, file));
//           } else {
//             formData.append(key, val);
//           }
//         });
//         formData.append('organization_id', organizationId);
//         response = await request.post(formDesign.submitUrl || '/users/create', formData);
//       } else {
//         // Build payload mapping field labels to their values.
//         const payload = { organization_id: organizationId };
//         Object.entries(fieldValues).forEach(([label, value]) => {
//           payload[label] = value;
//         });
//         response = await request.post(formDesign.submitUrl || '/users/create', JSON.stringify(payload));
//       }
//       if (!response.ok || (response.status !== 200 && response.status !== 201)) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Submission failed');
//       }
//       if (formDesign && formDesign.submitCode) {
//         try {
//           const submitFunc = new Function(`"use strict"; return (${formDesign.submitCode})`)();
//           await submitFunc(fieldValues);
//         } catch (error) {
//           console.error("Submission error from submitCode:", error);
//           toast.error(`Error executing submit code: ${error.message}`);
//         }
//       }
//       onUserAdded();
//       onClose();
//     } catch (error) {
//       console.error("Submit Form Error:", error);
//       toast.error(`Error submitting form: ${error.message}`);
//     }
//   };

//   // Multi-step navigation.
//   const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
//   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

//   // Render fields for the current step.
//   const renderFields = () => {
//     const fieldsToRender = steps[currentStep];
//     return fieldsToRender.map((field, index) => {
//       const key = `${currentStep}-${field.id}-${index}`;
//       return (
//         <div key={key} className="form-group">
//           <label>{field.label}</label>
//           {/*
//             Note: For fields that require asynchronous rendering (like department or role_select),
//             we call our renderField function. For simplicity, we assume renderField returns a React element.
//             In a production app, you might pre-fetch department data and pass it in as a prop.
//           */}
//           {renderField(field, fieldValues[field.label], handleInputChange, organizationId, roleOptions)}
//         </div>
//       );
//     });
//   };

//   // If no design is received.
//   if (!formDesign) {
//     return (
//       <div className="modal-overlay">
//         <div className="modal-content"><p>Loading form…</p></div>
//       </div>
//     );
//   }
//   if (!formDesign.fields || formDesign.fields.length === 0) {
//     return (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <p>No form design available. Please contact your administrator.</p>
//         </div>
//       </div>
//     );
//   }

//   // Determine if a submit field exists in the design.
//   const hasSubmitField = formDesign.fields.some(f => f.id === 'submit');

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <form onSubmit={handleSubmit}>
//           {renderFields()}
//           {steps.length > 1 && (
//             <div className="step-indicator">
//               <span>Step {currentStep + 1} of {steps.length}</span>
//             </div>
//           )}
//           <div className="modal-actions">
//             {steps.length > 1 && currentStep > 0 && (
//               <button type="button" onClick={prevStep}>Back</button>
//             )}
//             {steps.length > 1 && currentStep < steps.length - 1 && (
//               <button type="button" onClick={nextStep}>Next</button>
//             )}
//             {/* Only render a submit button if there is no submit field from the design */}
//             {!hasSubmitField && (steps.length <= 1 || currentStep === steps.length - 1) && (
//               <button type="submit">Submit</button>
//             )}
//             <button type="button" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//         {showAddRoleModal && (
//           <AddRoleModal
//             organizationId={organizationId}
//             onClose={() => setShowAddRoleModal(false)}
//             onRoleAdded={(newRole) => {
//               setRoleOptions(prev => [...prev, newRole]);
//               setFieldValues(prev => ({ ...prev, role_select: newRole.id }));
//               setShowAddRoleModal(false);
//             }}
//           />
//         )}
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
import AddRoleModal from './AddRoleModal';

/**
 * Helper function: split an array into chunks.
 */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Custom hook to fetch and cache department options for an organization.
 */
const useDepartments = (organizationId) => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await request.get(`/organizations/${organizationId}/departments?skip=0&limit=100`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data.departments) {
          setDepartments(data.departments);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [organizationId]);
  return departments;
};

/**
 * Renders a field based on its type.
 * • For fields whose label contains "department" (case-insensitive), render a dynamic dropdown.
 * • Radio and checkbox options are laid out horizontally if ≤ 3 options, else wrapped.
 * • For role_select, role options are used and an extra "Add New Role" option is appended.
 */
const renderField = (field, fieldValue, handleChange, organizationId, roleOptions, departments, openAddRole) => {
  if (/department/i.test(field.label)) {
    return (
      <select name={field.label} value={fieldValue || ""} onChange={handleChange}>
        <option value="">Select a Department</option>
        {departments.map(dep => (
          <option key={dep.id} value={dep.id}>
            {dep.name}
          </option>
        ))}
      </select>
    );
  }
  switch (field.id) {
    case 'radio': {
      if (field.options?.choices && field.options.choices.length > 0) {
        const layoutClass = field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
        return (
          <div className={layoutClass}>
            {field.options.choices.map((choice, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="radio"
                  name={field.label}
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
        const layoutClass = field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
        return (
          <div className={layoutClass}>
            {field.options.choices.map((choice, idx) => (
              <label key={idx} className="option-label">
                <input
                  type="checkbox"
                  name={field.label}
                  value={choice}
                  checked={values.includes(choice)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValues = [...values];
                    if (checked) newValues.push(choice);
                    else newValues = newValues.filter(v => v !== choice);
                    handleChange({
                      target: { name: field.label, value: newValues, type: 'checkbox' },
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
      const options =
        field.id === 'role_select'
          ? roleOptions || []
          : (field.options?.choices || []).map(choice => ({ id: choice, name: choice }));
      return (
        <select
          name={field.label}
          value={fieldValue || ""}
          onChange={(e) => {
            const selected = e.target.value;
            if (field.id === 'role_select' && selected === '__add_new_role__') {
              openAddRole();
            } else {
              handleChange(e);
            }
          }}
        >
          <option value="">Select an option</option>
          {options.map((option, idx) => (
            <option key={option.id || idx} value={option.id || option.name}>
              {option.name || option}
            </option>
          ))}
          {field.id === 'role_select' && (
            <option value="__add_new_role__">Add New Role</option>
          )}
        </select>
      );
    }
    case 'file': {
      return (
        <input
          type="file"
          name={field.label}
          multiple
          onChange={handleChange}
        />
      );
    }
    case 'submit': {
      // Do not render a submit control from the design—submission is handled in the modal's actions.
      return null;
    }
    default: {
      return (
        <input
          type={field.id === 'number' ? 'number' : field.id}
          name={field.label}
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
  // Use field labels as keys for independent control.
  const [fieldValues, setFieldValues] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const departments = useDepartments(organizationId);
  const [isLoading, setIsLoading] = useState(true);

  // WebSocket: fetch precompiled form design.
  useEffect(() => {
    const wsUrl = `wss://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => console.info("WebSocket connected to form-design endpoint.");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFormDesign(data.formDesign);
        if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
          const initValues = {};
          data.formDesign.fields.forEach((field) => {
            initValues[field.label] = field.id === 'checkbox' ? [] : '';
          });
          setFieldValues(initValues);
          if (data.formDesign.fields.length > 4) {
            setSteps(chunkArray(data.formDesign.fields, 4));
            setCurrentStep(0);
          } else {
            setSteps([data.formDesign.fields]);
          }
        }
      } catch (error) {
        console.error("Error parsing form design:", error);
      } finally {
        setIsLoading(false);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setFormDesign({ fields: [] });
      setIsLoading(false);
    };
    return () => ws.close();
  }, [organizationId, userId]);

  // Fetch role options.
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
        const data = await res.json();
        if (data?.data) {
          setRoleOptions(data.data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [organizationId]);

  // Handle controlled input changes.
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    const newVal = type === 'file' ? e.target.files : value;
    setFieldValues(prev => ({ ...prev, [name]: newVal }));
  }, []);

  const openAddRole = () => {
    setShowAddRoleModal(true);
  };

  // Submit: build payload where keys are the field labels.
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
        const payload = { organization_id: organizationId };
        Object.entries(fieldValues).forEach(([label, value]) => {
          payload[label] = value;
        });
        response = await request.post(formDesign.submitUrl || '/users/create', JSON.stringify(payload));
      }
      if (!response.ok || ![200, 201].includes(response.status)) {
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderFields = () => {
    const fieldsToRender = steps[currentStep];
    return fieldsToRender.map((field, index) => {
      const key = `${currentStep}-${field.id}-${index}`;
      return (
        <div key={key} className="form-group">
          <label>{field.label}</label>
          {renderField(field, fieldValues[field.label], handleInputChange, organizationId, roleOptions, departments, openAddRole)}
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading form…</p>
          {/* You can replace the text below with a spinner graphic for production */}
        </div>
      </div>
    );
  }
  if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>No form design available. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  // Check if the precompiled design already contains a submit field.
  const hasSubmitField = formDesign.fields.some(f => f.id === 'submit');

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
            {/* Render submit button only if there is no submit field */}
            {!hasSubmitField && (steps.length <= 1 || currentStep === steps.length - 1) && (
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
              setRoleOptions(prev => [...prev, newRole]);
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

