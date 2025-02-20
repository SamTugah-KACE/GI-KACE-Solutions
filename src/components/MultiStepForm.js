import React, { useState } from 'react';
import PersonalDataForm from './PersonalDataForm';
import OrganizationDataForm from './OrganizationDataForm';
import ProductDataForm from './ProductDataForm';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';
import './MultiStepForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const steps = [
  'Personal Data',
  'Organization Data',
  'Product Data',
  'Billing',
  'Payment'
];


// Utility function: Check that DOB makes user at least 18 years old.
const isAdult = (dob) => {
  if (!dob) return false;
  const birthDate = new Date(dob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
};

// Yup validation schemas for each step
const validationSchemas = [
  // Step 0: Personal Data
  Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    dob: Yup.date()
      .required('Date of birth is required')
      .test('is-adult', 'You must be at least 18 years old', (value) => isAdult(value)),
    profileImage: Yup.mixed().required('Profile image is required'),
  }),
  // Step 1: Organization Data
  Yup.object().shape({
    name: Yup.string().required('Organization name is required'),
    orgEmail: Yup.string().email('Invalid email').required('Organization email is required'),
    country: Yup.string().required('Country is required'),
    type: Yup.string().required('Organization type is required'),
    nature: Yup.string().required('Organization nature is required'),
    employeeRange: Yup.string().required('Employee range is required'),
    orgLogo: Yup.mixed().required('Organization logo is required'),
  }),
  // Step 2: Product Data (optional)
  Yup.object().shape({}),
  // Step 3: Billing
  Yup.object().shape({
    billingInfo: Yup.string().required('Billing info is required'),
  }),
  // Step 4: Payment
  Yup.object().shape({
    paymentMethod: Yup.string().required('Payment method is required'),
  }),
];


// Default onSubmit function to prevent errors if not provided.
const MultiStepForm = ({ selectedProduct, onSubmit = (data) => console.log("Submitted:", data) }) => {
  const navigate = useNavigate();
  // const location = useLocation();

  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalData: {},
    organizationData: {},
    productData: {},
    billingData: {},
    paymentData: {}
  });

  const updateFormData = (section, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], ...data }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Basic per-step validation for required fields.
  const validateStep = () => {
    const sectionKey =
      currentStep === 0 ? 'personalData' :
      currentStep === 1 ? 'organizationData' :
      currentStep === 2 ? 'productData' :
      currentStep === 3 ? 'billingData' :
      currentStep === 4 ? 'paymentData' : '';
    const data = formData[sectionKey] || {};
    let errors = {};

    // Example validations for each step:
    // if (sectionKey === 'personalData') {
    //   if (!data.firstName || data.firstName.trim() === "") {
    //     errors.firstName = "First name is required";
    //   }
    //   if (!data.lastName || data.lastName.trim() === "") {
    //     errors.lastName = "Last name is required";
    //   }
    //   if (!data.dob || !isAdult(data.dob)) {
    //     errors.dob = "Valid Date of Birth is required and user should be exactly or more than 18yrs of age.";
    //   }
    //   if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    //     errors.email = "Valid email is required";
    //   }
    // } else if (sectionKey === 'organizationData') {
    //   if (!data.name || data.name.trim() === "") {
    //     errors.name = "Organization name is required";
    //   }
    //   if (!data.orgEmail || !/^\S+@\S+\.\S+$/.test(data.orgEmail)) {
    //     errors.orgEmail = "Valid organization email is required";
    //   }
    //   if (!data.country || data.country.trim() === "") {
    //     errors.country = "Country is required";
    //   }
    //   if (!data.type || data.type.trim() === "") {
    //     errors.type = "Organization type is required";
    //   }
    //   if (!data.nature || data.nature.trim() === "") {
    //     errors.nature = "Organization nature is required";
    //   }
    //   if (!data.employeeRange || data.employeeRange.trim() === "") {
    //     errors.employeeRange = "Employee range is required";
    //   }
    // }
    // Add similar validations for productData, billingData, paymentData if needed.

    // For now, if there are no errors, return true.
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    // Merge all sections into one object
    const combinedData = {
      ...formData.personalData,
      ...formData.organizationData,
      ...formData.productData,
      ...formData.billingData,
      ...formData.paymentData,
    };
    // Call the onSubmit prop (or default function)
    onSubmit(combinedData);
    // Optionally navigate, reload, etc.
    navigate('/signin');
    window.location.reload();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDataForm
            data={formData.personalData}
            updateData={(data) => updateFormData('personalData', data)}
          />
        );
      case 1:
        return (
          <OrganizationDataForm
            data={formData.organizationData}
            updateData={(data) => updateFormData('organizationData', data)}
          />
        );
      case 2:
        return (
          <ProductDataForm
            data={formData.productData}
            updateData={(data) => updateFormData('productData', data)}
            selectedProduct={selectedProduct}
          />
        );
      case 3:
        return (
          <BillingForm
            data={formData.billingData}
            updateData={(data) => updateFormData('billingData', data)}
            productData={formData.productData}
          />
        );
      case 4:
        return (
          <PaymentForm
            data={formData.paymentData}
            updateData={(data) => updateFormData('paymentData', data)}
            billingData={formData.billingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-form">
      <h2>{steps[currentStep]}</h2>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      <form>
        {renderStep()}
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button type="button" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button type="button" onClick={handleNext} disabled={!validateStep()}>
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button type="button" onClick={handleSubmit} disabled={!validateStep()}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;


















// import React, { useState } from 'react';
// import PersonalDataForm from './PersonalDataForm';
// import OrganizationDataForm from './OrganizationDataForm';
// import ProductDataForm from './ProductDataForm';
// import BillingForm from './BillingForm';
// import PaymentForm from './PaymentForm';
// import './MultiStepForm.css'; // add your styling
// import { useNavigate, useLocation } from 'react-router-dom';

// const steps = [
//   'Personal Data',
//   'Organization Data',
//   'Product Data',
//   'Billing',
//   'Payment'
// ];

// const MultiStepForm = ({ selectedProduct, onSubmit = (data) => console.log("Submitted:", data) }) => {
//   // const navigate = useNavigate();
//   // const location = useLocation();

//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({
//     personalData: {},
//     organizationData: {},
//     productData: {},
//     billingData: {},
//     paymentData: {}
//   });

//   const updateFormData = (section, data) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [section]: { ...prevData[section], ...data }
//     }));
//   };

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const handleSubmit = () => {

//     // Merge all sections into one object
//     const combinedData = {
//       ...formData.personalData,
//       ...formData.organizationData,
//       ...formData.productData,
//       ...formData.billingData,
//       ...formData.paymentData,
//     };
//     onSubmit(combinedData);

//     if (typeof onSubmit === 'function') {
//       onSubmit(combinedData);
//     }
//     // Securely submit the data to your backend
//     // console.log('Form Data Submitted:', formData);
//     // alert('Form submitted successfully!');
//     // navigate('/dashboard');
//     // window.location.reload();
//     // Reset or redirect as needed
//   };

//   // Basic validation: here we simply check that the current section has some data.
//   const validateStep = () => {
//     const sectionKey = 
//       currentStep === 0 ? 'personalData' :
//       currentStep === 1 ? 'organizationData' :
//       currentStep === 2 ? 'productData' :
//       currentStep === 3 ? 'billingData' :
//       currentStep === 4 ? 'paymentData' : '';
//     return formData[sectionKey] && Object.keys(formData[sectionKey]).length > 0;
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <PersonalDataForm
//             data={formData.personalData}
//             updateData={(data) => updateFormData('personalData', data)}
//           />
//         );
//       case 1:
//         return (
//           <OrganizationDataForm
//             data={formData.organizationData}
//             updateData={(data) => updateFormData('organizationData', data)}
//           />
//         );
//       case 2:
//         return (
//           <ProductDataForm
//             data={formData.productData}
//             updateData={(data) => updateFormData('productData', data)}
//             selectedProduct={selectedProduct}
//           />
//         );
//       case 3:
//         return (
//           <BillingForm
//             data={formData.billingData}
//             updateData={(data) => updateFormData('billingData', data)}
//             productData={formData.productData}
//           />
//         );
//       case 4:
//         return (
//           <PaymentForm
//             data={formData.paymentData}
//             updateData={(data) => updateFormData('paymentData', data)}
//             billingData={formData.billingData}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="multi-step-form">
//       <h2>{steps[currentStep]}</h2>
//       <div className="progress-bar">
//         <div
//           className="progress"
//           style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
//         ></div>
//       </div>
//       <form>
//         {renderStep()}
//         <div className="navigation-buttons">
//           {currentStep > 0 && (
//             <button type="button" onClick={handleBack}>
//               Back
//             </button>
//           )}
//           {currentStep < steps.length - 1 && (
//             <button type="button" onClick={handleNext} disabled={!validateStep()}>
//               Next
//             </button>
//           )}
//           {currentStep === steps.length - 1 && (
//             <button type="button" onClick={handleSubmit} disabled={!validateStep()}>
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MultiStepForm;
