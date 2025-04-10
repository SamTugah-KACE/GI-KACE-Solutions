
import React, { useEffect, useState } from 'react';
import './Modal.css';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import Select from 'react-select';
import request from '../request';
// import { useOrganization } from '../../context/OrganizationContext';


// Modal for Bulk Insert Users
const BulkInsertUsersModal = ({ organizationId, onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
  
    const handleFileChange = e => {
      setSelectedFile(e.target.files[0]);
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('organization_id', organizationId);
      console.log("\n\nFormData: ", formData.get('file'));
      console.log("Organization ID: ", formData.get('organization_id'));
      setUploading(true);
      try {
        const response = await request.post('/users/bulk_insert_employee_data_api', {
          method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   },
          body: formData
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Bulk insert failed");
        }
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Bulk Insert Error:", error);
        alert(error.message);
      } finally {
        setUploading(false);
      }
    };
  
    const handleDownloadSample = () => {
      // In production, the sample file URL might be dynamic.
      window.open('/sample/bulk_insert_template.csv', '_blank');
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Bulk Insert Users</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="bulkFile">Upload CSV File</label>
              <input 
                type="file" 
                id="bulkFile" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange} 
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={handleDownloadSample}>
                Download Sample File
              </button>
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Submit'}
              </button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default BulkInsertUsersModal;