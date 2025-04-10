import React, { useEffect, useState } from 'react';
import './Modal.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import request from '../request';


// Modal for Existing Users
const ExistingUsersModal = ({ organizationId, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    // In production you would also manage pagination state here.
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await request.get(`/users?organizationId=${organizationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
  
    React.useEffect(() => {
      fetchUsers();
    }, [organizationId]);
  
    const handleUpdate = (user) => {
      // Logic to update user – update button remains disabled until changes.
      alert(`Update user ${user.name}`);
    };
  
    const handleArchive = (user) => {
      if (window.confirm(`Archive user ${user.name}?`)) {
        alert(`User ${user.name} archived (soft delete).`);
      }
    };
  
    const handleDelete = (user) => {
      if (window.confirm(`Delete user ${user.name}? This is permanent.`)) {
        alert(`User ${user.name} deleted.`);
      }
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content large-modal">
          <h2>Existing Users</h2>
          {loading ? (
            <p>Loading users…</p>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    {/*
                      Conditionally render Branch if organization is branch managed.
                    */}
                    {users.some(u => u.branch) && <th>Branch</th>}
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => {
                    // Compose full name from available title, first, middle, last names.
                    const fullName = [user.title, user.firstName, user.middleName, user.lastName]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <tr key={user.id || idx}>
                        <td>{user.staffId || 'N/A'}</td>
                        <td>{fullName}</td>
                        <td>
                          <select defaultValue={user.department}>
                            {/* Options should be dynamically generated */}
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                          </select>
                        </td>
                        {users.some(u => u.branch) && (
                          <td>
                            <select defaultValue={user.branch}>
                              <option value="Main">Main</option>
                              <option value="Secondary">Secondary</option>
                            </select>
                          </td>
                        )}
                        <td>
                          <select defaultValue={user.role}>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={() => handleUpdate(user)} disabled>
                            Update
                          </button>
                          <button onClick={() => handleArchive(user)}>Archive</button>
                          <button onClick={() => handleDelete(user)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Pagination controls would be inserted here */}
            </div>
          )}
          <div className="modal-actions">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );

};

export default ExistingUsersModal;