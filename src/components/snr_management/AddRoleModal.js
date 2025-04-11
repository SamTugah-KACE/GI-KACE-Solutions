// src/components/AddRoleModal.jsx
import React, { useState, useEffect } from 'react';
import './Modal.css';
import request from '../request';
import { toast } from 'react-toastify';

const AddRoleModal = ({ organizationId, onClose, onRoleAdded }) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Fetch permission options from API.
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await request.get('/default/fetch-all/?skip=0&limit=100');
        const data =  res.data;
        console.log('response.json():', res.json);
        console.log('response.data:', res.data);
        console.log('response data:', data);
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format received from API');
        }
        // Assume the response is an array and find the object where data_name === 'permissions'
        const permissionObj = data.find(item => item.data_name && item.data_name.toLowerCase() === 'permissions');
        console.log('permissionObj:', permissionObj.data);
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
    setSelectedPermissions((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(perm => perm !== value);
      }
    });
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
      const res = await request.post('/role', JSON.stringify(payload),
    //    {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //   }
    );
      if (!res.ok || res.status !== 201) {
        // Handle error response from the server.
        const errorData = await res.json() || res.data;
        console.error('Error response:', errorData);
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Role</h2>
        <form onSubmit={handleSubmit}>
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
            <div className="options-group">
              {permissions.length > 0 ? (
                permissions.map((perm, idx) => (
                  <label key={idx} className="option-label">
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
                <span>No permissions available</span>
              )}
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit">Add Role</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
