import React, { useState, useEffect } from 'react';
import './ProductDataForm.css'; // add your styling

const ProductDataForm = ({ data, updateData, selectedProduct }) => {
  const [localData, setLocalData] = useState({
    subscriptionPlan: '', // 'Basic' or 'Premium'
    premiumBillingCycle: 'Mid-Year' // default for Premium
  });

  useEffect(() => {
    updateData(localData);
  }, [localData, updateData]);

  const handlePlanSelection = (plan) => {
    setLocalData((prev) => ({
      ...prev,
      subscriptionPlan: plan
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="product-data-form">
      <div className="subscription-cards">
        <div
          className={`subscription-card ${localData.subscriptionPlan === 'Basic' ? 'selected' : ''}`}
          onClick={() => handlePlanSelection('Basic')}
        >
          <h3>Basic</h3>
          <p>Features: Basic features</p>
          <p>Billing Cycle: Monthly</p>
        </div>
        <div
          className={`subscription-card ${localData.subscriptionPlan === 'Premium' ? 'selected' : ''}`}
          onClick={() => handlePlanSelection('Premium')}
        >
          <h3>Premium</h3>
          <p>Features: Premium features</p>
          <div className="billing-cycle-select">
            <label>Billing Cycle:</label>
            <select name="premiumBillingCycle" value={localData.premiumBillingCycle} onChange={handleChange}>
              <option value="Mid-Year">Mid-Year</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDataForm;
