import React, { useState, useEffect } from 'react';
import './PaymentForm.css'; // add your styling

const PaymentForm = ({ data, updateData, billingData }) => {
  const [localData, setLocalData] = useState({
    amountToBePaid: billingData.billAmount || 0,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: ''
  });

  useEffect(() => {
    // Update the amount when billingData changes
    setLocalData((prev) => ({
      ...prev,
      amountToBePaid: billingData.billAmount || 0
    }));
  }, [billingData.billAmount]);

  useEffect(() => {
    updateData(localData);
  }, [localData, updateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="payment-form">
      <div className="form-group">
        <label>Amount to be paid:</label>
        <input type="number" name="amountToBePaid" value={localData.amountToBePaid} readOnly />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input type="date" name="paymentDate" value={localData.paymentDate} readOnly />
      </div>
      <div className="form-group">
        <label>Payment Methods*:</label>
        <input
          type="text"
          name="paymentMethod"
          value={localData.paymentMethod}
          onChange={handleChange}
          required
          placeholder="e.g., Credit Card, PayPal"
        />
      </div>
    </div>
  );
};

export default PaymentForm;
