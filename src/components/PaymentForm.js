import React, { useState, useEffect } from 'react';
import './PaymentForm.css'; // add your styling

const PaymentForm = ({ data, updateData, billingData }) => {
  const [localData, setLocalData] = useState({
    amountToBePaid: billingData.billAmount || 0,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const validationErrors = {};
    
    if (!localData.paymentMethod.trim()) {
      validationErrors.paymentMethod = 'Payment method is required';
    }

    if (!localData.amountToBePaid || localData.amountToBePaid <= 0) {
      validationErrors.amountToBePaid = 'Invalid payment amount';
    }

    if (!localData.paymentDate) {
      validationErrors.paymentDate = 'Payment date is required';
    }

    setErrors(validationErrors);
    const isValid = Object.keys(validationErrors).length === 0;
    return isValid;
  };

  useEffect(() => {
    setLocalData(prev => ({
      ...prev,
      amountToBePaid: billingData?.billAmount || 0
    }));
  }, [billingData?.billAmount]);

  useEffect(() => {
    const isValid = validateForm();
    updateData(localData, isValid);
  }, [localData]);

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateForm();
  };

  return (
    <div className="payment-form">
      <div className="form-group">
        <label>Amount to be paid:</label>
        <input 
          type="number" 
          name="amountToBePaid" 
          value={localData.amountToBePaid} 
          readOnly 
        />
        {touched.amountToBePaid && errors.amountToBePaid && 
          <span className="error">{errors.amountToBePaid}</span>
        }
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input 
          type="date" 
          name="paymentDate" 
          value={localData.paymentDate} 
          readOnly 
        />
        {touched.paymentDate && errors.paymentDate && 
          <span className="error">{errors.paymentDate}</span>
        }
      </div>
      <div className="form-group">
        <label>Payment Methods*:</label>
        <input
          type="text"
          name="paymentMethod"
          value={localData.paymentMethod}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="e.g., Credit Card, PayPal"
        />
        {touched.paymentMethod && errors.paymentMethod && 
          <span className="error">{errors.paymentMethod}</span>
        }
      </div>
    </div>
  );
};

export default PaymentForm;
