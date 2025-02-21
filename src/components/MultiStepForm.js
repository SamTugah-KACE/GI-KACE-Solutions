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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {},
    organization: {},
    product: {},
    billing: {},
    payment: {}
  });
  const [isStepValid, setIsStepValid] = useState(false);

  const updateData = (step, data, isValid = false) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
    setIsStepValid(isValid);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDataForm 
          data={formData.personal} 
          updateData={(data, isValid) => updateData('personal', data, isValid)} 
        />;
      case 2:
        return <OrganizationDataForm 
          data={formData.organization} 
          updateData={(data, isValid) => updateData('organization', data, isValid)} 
        />;
      case 3:
        return <ProductDataForm 
          data={formData.product} 
          updateData={(data, isValid) => updateData('product', data, isValid)}
          selectedProduct={selectedProduct} 
        />;
      case 4:
        return <BillingForm 
          data={formData.billing} 
          updateData={(data, isValid) => updateData('billing', data, isValid)}
          productData={formData.product}
        />;
      case 5:
        return <PaymentForm 
          data={formData.payment} 
          updateData={(data, isValid) => updateData('payment', data, isValid)}
          billingData={formData.billing} 
        />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      setIsStepValid(false); // Reset validation for new step
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setIsStepValid(false); // Reset validation for new step
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="multi-step-form">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      {renderStep()}
      <div className="navigation-buttons">
        {currentStep > 1 && (
          <button 
            onClick={handlePrevious}
          >
            Back
          </button>
        )}
        {currentStep < 5 ? (
          <button 
            onClick={handleNext}
            disabled={!isStepValid}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={!isStepValid}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
