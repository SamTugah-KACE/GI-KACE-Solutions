import React, { useState } from 'react';
import BioDataForm from './BioDataForm';
import RoleDataForm from './RoleDataForm';
import CustomDataForm from './CustomDataForm';
import './MultiStepForm.css';

const steps = [
  'Bio-Data',
  'Role',
  'Custom'
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bioData: {},
    roleData: {},
    customData: {}
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  // const handleNext = () => {
  //   if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  // };

  // const handleBack = () => {
  //   if (currentStep > 0) setCurrentStep(prev => prev - 1);
  // };

  // const handleSubmit = () => {
  //   console.log('Submitting New User Data:', formData);
  //   alert('New user created!');
    
  // };

  const handleNext = () => currentStep < steps.length - 1 && setCurrentStep((prev) => prev + 1);
  const handleBack = () => currentStep > 0 && setCurrentStep((prev) => prev - 1);
  const handleSubmit = () => {
    console.log('Submitting New User Data:', formData);
    alert('New user created!');
  };

  const validateStep = () => {
    const key = currentStep === 0 ? 'bioData' : currentStep === 1 ? 'roleData' : 'customData';
    return Object.keys(formData[key]).length > 0;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BioDataForm
            data={formData.bioData}
            updateData={(data) => updateFormData('bioData', data)}
          />
        );
      case 1:
        return (
          <RoleDataForm
            data={formData.roleData}
            updateData={(data) => updateFormData('roleData', data)}
          />
        );
      case 2:
        return (
          <CustomDataForm
            data={formData.customData}
            updateData={(data) => updateFormData('customData', data)}
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
        <div className="progress" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
      </div>
      <form>
        {renderStep()}
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button type="button" onClick={handleBack}>Back</button>
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
