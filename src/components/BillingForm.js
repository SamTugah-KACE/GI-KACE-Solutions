import React, { useState, useEffect } from 'react';
import './BillingForm.css'; // add your styling

const BillingForm = ({ data, updateData, productData }) => {
  const [localData, setLocalData] = useState({
    termsAccepted: false,
    billAmount: 0
  });

  // Example: calculate bill amount based on selected plan.
  useEffect(() => {
    let amount = 0;
    if (productData.subscriptionPlan === 'Basic') {
      amount = 20; // example amount for Basic
    } else if (productData.subscriptionPlan === 'Premium') {
      amount = localData.premiumBillingCycle === 'Annual' ? 200 : 120;
    }
    setLocalData((prev) => ({ ...prev, billAmount: amount }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, localData.premiumBillingCycle]);

  useEffect(() => {
    updateData(localData);
  }, [localData, updateData]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="billing-form">
      <div className="billing-details">
        <p>Selected Plan: {productData.subscriptionPlan || 'None'}</p>
        <p>Bill Amount: ${localData.billAmount}</p>
        <p>Terms and Conditions: [Insert T&C details here]</p>
      </div>
      <div className="form-group">
        <label>
          <input type="checkbox" name="termsAccepted" checked={localData.termsAccepted} onChange={handleChange} required />
          I accept the terms and conditions*
        </label>
      </div>
    </div>
  );
};

export default BillingForm;
