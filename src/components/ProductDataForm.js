import React, { useState, useEffect } from 'react';
import './ProductDataForm.css'; // add your styling

const ProductDataForm = ({ data, updateData, selectedProduct }) => {
  const [localData, setLocalData] = useState({
    subscriptionPlan: '', // 'Basic' or 'Premium'
    premiumBillingCycle: 'Mid-Year' // default for Premium
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // Initialize with selected product if available
    if (selectedProduct) {
      setLocalData(prev => ({
        ...prev,
        subscriptionPlan: selectedProduct.type || ''
      }));
    }
  }, [selectedProduct]);

  const validateForm = () => {
    const validationErrors = {};
    let isValid = true;

    // Required field validation
    if (!localData.subscriptionPlan) {
      validationErrors.subscriptionPlan = 'Please select a subscription plan';
      isValid = false;
    }

    // Conditional validation for Premium plan
    if (localData.subscriptionPlan === 'Premium') {
      if (!localData.premiumBillingCycle) {
        validationErrors.premiumBillingCycle = 'Please select a billing cycle';
        isValid = false;
      }
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handlePlanSelection = (plan) => {
    setLocalData(prev => ({
      ...prev,
      subscriptionPlan: plan,
      // Reset billing cycle if switching from Premium to Basic
      premiumBillingCycle: plan === 'Basic' ? '' : prev.premiumBillingCycle
    }));
    setTouched(prev => ({
      ...prev,
      subscriptionPlan: true
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  useEffect(() => {
    const isValid = validateForm();
    updateData(localData, isValid);
  }, [localData]);

  return (
    <div className="product-data-form">
      <div className="subscription-cards">
        <div
          className={`subscription-card ${
            localData.subscriptionPlan === 'Basic' ? 'selected' : ''
          } ${touched.subscriptionPlan && !localData.subscriptionPlan ? 'error-border' : ''}`}
          onClick={() => handlePlanSelection('Basic')}
        >
          <h3>Basic</h3>
          <p>Features: Basic features</p>
          <p>Billing Cycle: Monthly</p>
        </div>
        <div
          className={`subscription-card ${
            localData.subscriptionPlan === 'Premium' ? 'selected' : ''
          } ${touched.subscriptionPlan && !localData.subscriptionPlan ? 'error-border' : ''}`}
          onClick={() => handlePlanSelection('Premium')}
        >
          <h3>Premium</h3>
          <p>Features: Premium features</p>
          <div className="billing-cycle-select">
            <label>Billing Cycle:</label>
            <select
              name="premiumBillingCycle"
              value={localData.premiumBillingCycle}
              onChange={handleChange}
              disabled={localData.subscriptionPlan !== 'Premium'}
            >
              <option value="Mid-Year">Mid-Year</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
        </div>
      </div>
      {touched.subscriptionPlan && errors.subscriptionPlan && (
        <span className="error">{errors.subscriptionPlan}</span>
      )}
      {touched.premiumBillingCycle && errors.premiumBillingCycle && (
        <span className="error">{errors.premiumBillingCycle}</span>
      )}
    </div>
  );
};

export default ProductDataForm;
