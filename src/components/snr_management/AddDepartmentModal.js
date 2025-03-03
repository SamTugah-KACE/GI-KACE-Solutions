// src/components/AddDepartmentModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useOrganization } from '../../context/OrganizationContext';
import './AddDepartmentModal.css'; // create and style as needed

const AddDepartmentModal = ({ onClose, onDepartmentAdded }) => {
  const { organization } = useOrganization();
  const [departmentName, setDepartmentName] = useState('');
  const [selectedHead, setSelectedHead] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch staff list (for Head of Department)
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          `https://staff-records-backend.onrender.com/api/staff?organization_id=${organization.id}&skip=0&limit=1000`
        );
        const staff = response.data;
        // Map each employee into an option with a concatenated name
        const options = staff.map((employee) => ({
          value: employee.id,
          label: `${employee.title} ${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}`
        }));
        setStaffOptions(options);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    if (organization?.id) {
      fetchStaff();
    }
  }, [organization]);

  // If organization is branch-managed, fetch branches.
  useEffect(() => {
    if (organization && organization.nature.toLowerCase().includes("branch")) {
      const fetchBranches = async () => {
        try {
          // Adjust the endpoint as necessary. For example:
          const response = await axios.get(
            `https://staff-records-backend.onrender.com/api/organizations/${organization.id}/branches`
          );
          const branches = response.data;
          const options = branches.map((branch) => ({
            value: branch.id,
            label: branch.name
          }));
          setBranchOptions(options);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
      fetchBranches();
    }
  }, [organization]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName || !selectedHead) {
      alert("Please provide both the department name and select a head of department.");
      return;
    }
    // For branch-managed organizations, the branch selection is required.
    if (organization.nature.toLowerCase().includes("branch") && !selectedBranch) {
      alert("Please select a branch.");
      return;
    }
    setLoading(true);
    try {
      // Build the payload. Note: adjust property names as expected by your backend.
      const payload = {
        name: departmentName,
        head_of_department_id: selectedHead.value,
        branch_id: organization.nature.toLowerCase().includes("branch")
          ? selectedBranch.value
          : null,
        organization_id: organization.id,
      };
      const response = await axios.post(
        `https://staff-records-backend.onrender.com/api/organizations/${organization.id}/departments`,
        payload
      );
      // Call the callback to update the UI, then close the modal.
      onDepartmentAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Error creating department.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Department</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Department Name *</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Head of Department *</label>
            <Select
              options={staffOptions}
              value={selectedHead}
              onChange={(option) => setSelectedHead(option)}
              placeholder="Select Head of Department"
              isSearchable
            />
          </div>
          {organization.nature.toLowerCase().includes("branch") && (
            <div className="form-group">
              <label>Branch *</label>
              <Select
                options={branchOptions}
                value={selectedBranch}
                onChange={(option) => setSelectedBranch(option)}
                placeholder="Select Branch"
                isSearchable
              />
            </div>
          )}
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
