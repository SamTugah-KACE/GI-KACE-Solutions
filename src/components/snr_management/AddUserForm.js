

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
//  * Custom hook to fetch and cache department options.
//  */
// const useDepartments = (organizationId) => {
//   const [departments, setDepartments] = useState([]);
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await request.get(`/organizations/${organizationId}/departments?skip=0&limit=100`);
//         const data = res.data || await res.json();
//         if (Array.isArray(data)) {
//           setDepartments(data);
//         } else if (data.departments) {
//           setDepartments(data.departments);
//         }
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, [organizationId]);
//   return departments;
// };

// const AddUserForm = ({ organizationId, userId, onClose, onUserAdded }) => {
//   const [formDesign, setFormDesign] = useState(null);
//   // Using field labels as keys for atomic control.
//   const [fieldValues, setFieldValues] = useState({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [steps, setSteps] = useState([]);
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//   const [roleOptions, setRoleOptions] = useState([]);
//   const departments = useDepartments(organizationId);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRolesLoading, setIsRolesLoading] = useState(true);

//   // --- WebSocket: Fetch precompiled form design ---
//   useEffect(() => {
//     const wsUrl = `wss://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
//     const ws = new WebSocket(wsUrl);
//     let timeoutId = null;

//     ws.onopen = () => {
//       console.info("WebSocket connected to form-design endpoint.");
//       // Set a fallback timeout in case no message is received within 10 seconds.
//       timeoutId = setTimeout(() => {
//         toast.error("Form design load timeout. Please try again later.");
//         setIsLoading(false);
//       }, 10000);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         setFormDesign(data.formDesign);
//         if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
//           const initValues = {};
//           data.formDesign.fields.forEach((field) => {
//             // Use field label as the unique key; for checkboxes, initialize as an array.
//             initValues[field.label] = field.id === 'checkbox' ? [] : '';
//           });
//           setFieldValues(initValues);
//           if (data.formDesign.fields.length > 4) {
//             setSteps(chunkArray(data.formDesign.fields, 4));
//             setCurrentStep(0);
//           } else {
//             setSteps([data.formDesign.fields]);
//           }
//         }
//       } catch (error) {
//         console.error("Error parsing form design:", error);
//       } finally {
//         setIsLoading(false);
//         if (timeoutId) clearTimeout(timeoutId);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setFormDesign({ fields: [] });
//       setIsLoading(false);
//       if (timeoutId) clearTimeout(timeoutId);
//     };

//     ws.onclose = () => {
//       console.info("WebSocket closed.");
//       setIsLoading(false);
//       if (timeoutId) clearTimeout(timeoutId);
//     };

//     return () => {
//       if (timeoutId) clearTimeout(timeoutId);
//       ws.close();
//     };
//   }, [organizationId, userId]);

//   // --- Fetch role options ---
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
//         const data = res.data;
//         console.log("data: ", data);
        
//         if (data) {
//           setRoleOptions(data);
//         }
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//       } finally {
//         setIsRolesLoading(false);
//       }
//     };
//     fetchRoles();
//   }, [organizationId]);

//   // Handler for controlled inputs.
//   const handleInputChange = useCallback((e) => {
//     const { name, value, type } = e.target;
//     const newVal = type === 'file' ? e.target.files : value;
//     setFieldValues((prev) => ({ ...prev, [name]: newVal }));
//   }, []);

//   const openAddRole = () => {
//     setShowAddRoleModal(true);
//   };

//   /**
//    * Renders a field based on its type.
//    * • For fields with "department" in the label, render a dynamic dropdown using fetched departments.
//    * • For role_select, use the fetched roleOptions (with an "Add New Role" option) and display a loading message if roles are still loading.
//    */
//   const renderField = (field, fieldValue) => {
//     if (/department/i.test(field.label)) {
//       return (
//         <select name={field.label} value={fieldValue || ""} onChange={handleInputChange}>
//           <option value="">Select a Department</option>
//           {departments.map(dep => (
//             <option key={dep.id} value={dep.id}>
//               {dep.name}
//             </option>
//           ))}
//         </select>
//       );
//     }
//     switch (field.id) {
//       case 'radio': {
//         if (field.options?.choices && field.options.choices.length > 0) {
//           const layoutClass = field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
//           return (
//             <div className={layoutClass}>
//               {field.options.choices.map((choice, idx) => (
//                 <label key={idx} className="option-label">
//                   <input
//                     type="radio"
//                     name={field.label}
//                     value={choice}
//                     checked={fieldValue === choice}
//                     onChange={handleInputChange}
//                   />
//                   {choice}
//                 </label>
//               ))}
//             </div>
//           );
//         }
//         return <span className="no-options">No options available</span>;
//       }
//       case 'checkbox': {
//         if (field.options?.choices && field.options.choices.length > 0) {
//           const values = Array.isArray(fieldValue) ? fieldValue : [];
//           const layoutClass = field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
//           return (
//             <div className={layoutClass}>
//               {field.options.choices.map((choice, idx) => (
//                 <label key={idx} className="option-label">
//                   <input
//                     type="checkbox"
//                     name={field.label}
//                     value={choice}
//                     checked={values.includes(choice)}
//                     onChange={(e) => {
//                       const checked = e.target.checked;
//                       let newValues = [...values];
//                       if (checked) newValues.push(choice);
//                       else newValues = newValues.filter(v => v !== choice);
//                       handleInputChange({
//                         target: { name: field.label, value: newValues, type: 'checkbox' },
//                       });
//                     }}
//                   />
//                   {choice}
//                 </label>
//               ))}
//             </div>
//           );
//         }
//         return <span className="no-options">No options available</span>;
//       }
//       case 'select':
//       case 'role_select': {
//         if (field.id === 'role_select' && isRolesLoading) {
//           return <span>Loading roles…</span>;
//         }
//         const options =
//           field.id === 'role_select'
//             ? roleOptions || []
//             : (field.options?.choices || []).map(choice => ({ id: choice, name: choice }));
//         return (
//           <select
//             name={field.label}
//             value={fieldValue || ""}
//             onChange={(e) => {
//               const selected = e.target.value;
//               if (field.id === 'role_select' && selected === '__add_new_role__') {
//                 openAddRole();
//               } else {
//                 handleInputChange(e);
//               }
//             }}
//           >
//             <option value="">Select an option</option>
//             {options.map((option, idx) => (
//               <option key={option.id || idx} value={option.id || option.name}>
//                 {option.name || option}
//               </option>
//             ))}
//             {field.id === 'role_select' && (
//               <option value="__add_new_role__">Add New Role</option>
//             )}
//           </select>
//         );
//       }
//       case 'file': {
//         return (
//           <input
//             type="file"
//             name={field.label}
//             multiple
//             onChange={handleInputChange}
//           />
//         );
//       }
//       case 'submit': {
//         // Do not render any submit control from design.
        
//         return null;
//       }
//       default: {
//         return (
//           <input
//             type={field.id === 'number' ? 'number' : field.id}
//             name={field.label}
//             placeholder={field.label}
//             value={fieldValue || ''}
//             onChange={handleInputChange}
//           />
//         );
//       }
//     }
//   };

//   // Build payload using field labels as keys.
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
//         const payload = { organization_id: organizationId };
//         Object.entries(fieldValues).forEach(([label, value]) => {
//           payload[label] = value;
//         });
//         response = await request.post(formDesign.submitUrl || '/users/create', JSON.stringify(payload));
//       }
//       if (!response.ok || ![200, 201].includes(response.status)) {
//         const errorData = response.data;
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

//   const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
//   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

//   const renderFields = () => {
//     const fieldsToRender = steps[currentStep];
//     return fieldsToRender.map((field, index) => {
//       const key = `${currentStep}-${field.id}-${index}`;
//       return (
//         <div key={key} className="form-group">
//           <label>{field.label}</label>
//           {renderField(field, fieldValues[field.label], handleInputChange, organizationId, roleOptions, departments, openAddRole)}
//         </div>
//       );
//     });
//   };

//   if (isLoading || isRolesLoading) {
//     return (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <p>Loading form…</p>
//           {/* Optionally, insert a spinner graphic */}
//         </div>
//       </div>
//     );
//   }
//   if (!formDesign || !formDesign.fields || formDesign.fields.length === 0) {
//     return (
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <p>No form design available. Please contact your administrator.</p>
//         </div>
//       </div>
//     );
//   }

//   // Check if design already includes a submit field.
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
//             {/* Render a submit button only if no submit field exists in the design */}
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
 * Helper to split an array into chunks.
 */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Custom hook to fetch and cache department options.
 */
const useDepartments = (organizationId) => {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await request.get(
          `/organizations/${organizationId}/departments?skip=0&limit=100`
        );
        const data = res.data;
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data.departments) {
          setDepartments(data.departments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, [organizationId]);
  return departments;
};

/**
 * Renders a field based on its type.
 * • If the field label contains "department" (case-insensitive), renders a dynamic dropdown.
 * • For 'role_select', uses fetched role options (or shows a "Loading roles…" message).
 * • Radio and checkbox fields are rendered with horizontal layout if ≤3 options.
 * • The submit field is not rendered (submission is handled via modal actions).
 */
const renderField = (
  field,
  fieldValue,
  handleChange,
  organizationId,
  roleOptions,
  departments,
  openAddRole,
  isRolesLoading
) => {
  if (/department/i.test(field.label)) {
    return (
      <select name={field.label} value={fieldValue || ""} onChange={handleChange}>
        <option value="">Select a Department</option>
        {departments.map((dep) => (
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
        const layoutClass =
          field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
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
        const layoutClass =
          field.options.choices.length <= 3 ? 'options-horizontal' : 'options-group';
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
                    else newValues = newValues.filter((v) => v !== choice);
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
      if (field.id === 'role_select' && isRolesLoading) {
        return <span>Loading roles…</span>;
      }
      const options =
        field.id === 'role_select'
          ? roleOptions || []
          : (field.options?.choices || []).map((choice) => ({ id: choice, name: choice }));
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
      // Do not render a submit control from design.
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
  // Using field labels as keys for independent (atomic) control.
  const [fieldValues, setFieldValues] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const departments = useDepartments(organizationId);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolesLoading, setIsRolesLoading] = useState(true);

  // --- WebSocket: Fetch precompiled form design ---
  useEffect(() => {
    const wsUrl = `wss://staff-records-backend.onrender.com/ws/form-design/${organizationId}/${userId}`;
    const ws = new WebSocket(wsUrl);
    let timeoutId = setTimeout(() => {
      toast.error("Form design load timeout. Please try again later.");
      setIsLoading(false);
    }, 10000); // 10-second timeout
    ws.onopen = () => console.info("WebSocket connected to form-design endpoint.");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFormDesign(data.formDesign);
        if (data.formDesign?.fields && data.formDesign.fields.length > 0) {
          const initValues = {};
          data.formDesign.fields.forEach((field) => {
            // Use field.label as the key; for checkboxes initialize as an array.
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
        clearTimeout(timeoutId);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setFormDesign({ fields: [] });
      setIsLoading(false);
      clearTimeout(timeoutId);
    };
    ws.onclose = () => {
      console.info("WebSocket closed.");
      setIsLoading(false);
      clearTimeout(timeoutId);
    };
    return () => {
      clearTimeout(timeoutId);
      ws.close();
    };
  }, [organizationId, userId]);

  // --- Fetch role options ---
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
        const data = res.data;
        if (data) {
          setRoleOptions(data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsRolesLoading(false);
      }
    };
    fetchRoles();
  }, [organizationId]);

  // Controlled input handler.
  const handleInputChange = useCallback((e) => {
    const { name, value, type } = e.target;
    const newVal = type === 'file' ? e.target.files : value;
    setFieldValues((prev) => ({ ...prev, [name]: newVal }));
  }, []);

  const openAddRole = () => {
    setShowAddRoleModal(true);
  };

  // --- Submit handler builds payload using field labels as keys ---
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
        const errorData = response.data;
        throw new Error(errorData.detail || 'Submission failed');
      }
      // If the form design has embedded submit code (compiled from the builder), execute it.
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
          {renderField(
            field,
            fieldValues[field.label],
            handleInputChange,
            organizationId,
            roleOptions,
            departments,
            openAddRole,
            isRolesLoading
          )}
        </div>
      );
    });
  };

  if (isLoading || isRolesLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading form…</p>
          {/* Optionally, replace with a spinner graphic */}
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

  // Check if the precompiled design already has a submit field.
  const hasSubmitField = formDesign.fields.some(f => f.id === 'submit');
 console.log("hasSubmitField: ", hasSubmitField);
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
            {/* Render submit button if there is no submit field precompiled */}
            {!hasSubmitField && (steps.length <= 1 || currentStep === steps.length - 1) && (
              <button type="submit">Submit</button>
            )}
            <button type="submit">Submit</button>
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














