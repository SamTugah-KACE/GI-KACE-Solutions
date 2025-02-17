import React, { useState } from 'react';
import PersonalDataForm from './PersonalDataForm';
import OrganizationDataForm from './OrganizationDataForm';
import ProductDataForm from './ProductDataForm';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';
import './MultiStepForm.css'; // add your styling

const steps = [
  'Personal Data',
  'Organization Data',
  'Product Data',
  'Billing',
  'Payment'
];

const MultiStepForm = ({ selectedProduct }) => {
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

  const handleSubmit = () => {
    // Securely submit the data to your backend
    console.log('Form Data Submitted:', formData);
    alert('Form submitted successfully!');
    // Reset or redirect as needed
  };

  // Basic validation: here we simply check that the current section has some data.
  const validateStep = () => {
    const sectionKey = 
      currentStep === 0 ? 'personalData' :
      currentStep === 1 ? 'organizationData' :
      currentStep === 2 ? 'productData' :
      currentStep === 3 ? 'billingData' :
      currentStep === 4 ? 'paymentData' : '';
    return formData[sectionKey] && Object.keys(formData[sectionKey]).length > 0;
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
