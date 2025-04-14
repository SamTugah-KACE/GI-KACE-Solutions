// src/components/AddRoleModal.jsx
import React, { useState, useEffect } from 'react';
import './AddRoleModal.css'; // Use dedicated CSS for this modal
import request from '../request';
import { toast } from 'react-toastify';

const AddRoleModal = ({ organizationId, onClose, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Fetch permission options from the API and cache them.
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await request.get('/default/fetch-all/?skip=0&limit=100');
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        // Find object where data_name equals "permissions" (case-insensitive)
        const permissionObj = data.find(
          (item) => item.data_name && item.data_name.toLowerCase() === 'permissions'
        );
        if (permissionObj && Array.isArray(permissionObj.data)) {
          setPermissions(permissionObj.data);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Error fetching permissions.');
      }
    };
    fetchPermissions();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((perm) => perm !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.info('Role name is required.');
      return;
    }
    const payload = {
      name: roleName,
      permissions: selectedPermissions,
      organization_id: organizationId,
    };
    try {
      const res = await request.post('/role', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok || res.status !== 201) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to add role');
      }
      const newRole = await res.json();
      toast.success('Role added successfully!');
      onRoleAdded(newRole);
      onClose();
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error(`Error adding role: ${error.message}`);
    }
  };

  return (
    <div className="role-modal-overlay">
      <div className="role-modal-content">
        <div className="role-modal-header">
          <h2>Add New Role</h2>
          <button className="role-close-btn" onClick={onClose} title="Close">
            &times;
          </button>
        </div>
        <div className="role-modal-body">
          <form onSubmit={handleSubmit} className="role-form">
            <div className="form-group">
              <label>Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-container">
                {permissions.length > 0 ? (
                  permissions.map((perm, idx) => (
                    <label key={idx} className="permission-label">
                      <input
                        type="checkbox"
                        value={perm}
                        checked={selectedPermissions.includes(perm)}
                        onChange={handleCheckboxChange}
                      />
                      {perm}
                    </label>
                  ))
                ) : (
                  <span className="no-permissions">No permissions available</span>
                )}
              </div>
            </div>
            <div className="role-modal-actions">
              <button type="submit">Add Role</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
