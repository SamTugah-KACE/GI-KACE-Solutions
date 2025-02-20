import React from 'react';
import MultiStepForm from './MultiStepForm';
import './NewUserModal.css';

const NewUserModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="newuser-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>New User Registration</h2>
        <MultiStepForm />
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NewUserModal;
