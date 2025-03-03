// src/components/AddBranchModal.js
import React, { useEffect, useState } from 'react';
import './AddBranchModal.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import request from '../request';
import { useOrganization } from '.././context/OrganizationContext';

const AddBranchModal = ({ onClose, onBranchAdded }) => {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const [staffOptions, setStaffOptions] = useState([]);

  // Fetch staff list for Branch Manager
  useEffect(() => {
    if (orgId) {
      request
        .get(`/api/staff?organization_id=${orgId}&skip=0&limit=1000`)
        .then((response) => {
          const options = response.data.map((emp) => ({
            value: emp.id,
            label: `${emp.title} ${emp.first_name}${emp.middle_name ? ' ' + emp.middle_name : ''} ${emp.last_name}`,
          }));
          setStaffOptions(options);
        })
        .catch((err) => console.error('Error fetching staff for branch manager:', err));
    }
  }, [orgId]);

  const initialValues = {
    branchName: '',
    location: '',
    branchManager: null,
  };

  const validationSchema = Yup.object({
    branchName: Yup.string().required('Branch name is required'),
    location: Yup.string().required('Location is required'),
    branchManager: Yup.object().nullable().required('Branch Manager is required'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      name: values.branchName,
      location: values.location,
      manager_id: values.branchManager.value,
    };

    request
      .post(`/api/organizations/${orgId}/branches`, payload)
      .then((response) => {
        onBranchAdded(response.data);
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error('Error creating branch:', error);
        alert(
          'Error creating branch: ' +
            (error.response?.data?.detail || error.message)
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content add-branch-modal">
        <h3>Add New Branch</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, errors, touched, values }) => (
            <Form>
              <div className="form-group">
                <label>Branch Name *</label>
                <Field type="text" name="branchName" placeholder="Enter branch name" />
                {errors.branchName && touched.branchName && (
                  <div className="error-message">{errors.branchName}</div>
                )}
              </div>
              <div className="form-group">
                <label>Location *</label>
                <Field type="text" name="location" placeholder="Enter location" />
                {errors.location && touched.location && (
                  <div className="error-message">{errors.location}</div>
                )}
              </div>
              <div className="form-group">
                <label>Branch Manager *</label>
                <Select
                  name="branchManager"
                  options={staffOptions}
                  value={values.branchManager}
                  onChange={(option) => setFieldValue('branchManager', option)}
                  placeholder="Select branch manager..."
                  isClearable
                />
                {errors.branchManager && touched.branchManager && (
                  <div className="error-message">{errors.branchManager}</div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? 'Submitting...' : 'Add Branch'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddBranchModal;
