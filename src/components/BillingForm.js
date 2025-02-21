import React, { useState, useEffect } from 'react';
import './BillingForm.css'; // add your styling

const BillingForm = ({ data, updateData, productData }) => {
  const [localData, setLocalData] = useState({
    termsAccepted: data?.termsAccepted || false,
    billAmount: 0
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Calculate bill amount based on selected plan
  useEffect(() => {
    let amount = 0;
    if (productData.subscriptionPlan === 'Basic') {
      amount = 20;
    } else if (productData.subscriptionPlan === 'Premium') {
      amount = productData.premiumBillingCycle === 'Annual' ? 200 : 120;
    }
    setLocalData(prev => ({ ...prev, billAmount: amount }));
  }, [productData]);

  const validateForm = () => {
    const validationErrors = {};
    
    if (!localData.termsAccepted) {
      validationErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setLocalData(prev => ({
      ...prev,
      [name]: checked
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
    <div className="billing-form">
      <div className="billing-details">
        <h3>Billing Details</h3>
        <div className="details-box">
          <p>Selected Plan: {productData.subscriptionPlan || 'None'}</p>
          <p>Bill Amount: ${localData.billAmount}</p>
          <p>Terms and Conditions: [Insert T&C details here]</p>
        </div>
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            name="termsAccepted" 
            checked={localData.termsAccepted} 
            onChange={handleChange}
            className={touched.termsAccepted && errors.termsAccepted ? 'error-border' : ''}
          />
          <span>I accept the terms and conditions*</span>
        </label>
        {touched.termsAccepted && errors.termsAccepted && 
          <span className="error">{errors.termsAccepted}</span>
        }
      </div>
    </div>
  );
};

export default BillingForm;
