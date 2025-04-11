// src/components/snr_management/ExistingUsersModal.js
import React, { useEffect, useState } from 'react';
import './Modal.css';
import './ExistingUsersModal.css'; // Additional styles defined below
import request from '../request';
import { toast } from 'react-toastify';

// Configure page size for pagination
const ITEMS_PER_PAGE = 10;

// Example static role options; in production, you may retrieve these via API.
const ROLE_OPTIONS_STATIC = [
  { id: "62d3cf05-0e58-4a3c-a0c2-cf43a5cef454", name: "Staff" },
  { id: "083d84cf-11b8-4219-a3e1-23d616503516", name: "Manager" },
  // You can add others such as Admin, etc.
];

const ExistingUsersModal = ({ organizationId, onClose }) => {
  const [usersData, setUsersData] = useState({
    employees: [],
    departmentOptions: [],
    branchOptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // Track row changes; key=user id, value object with updated values
  const [updatedRows, setUpdatedRows] = useState({});

  // Fetch users and summary data from the API.
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `/users/employees?organization_id=${organizationId}&skip=0&limit=1&sort=asc`
      );
      const data = await response.json();

      // Extract summary details
      const { summary = {}, employees = [] } = data;
      // Build department options from summary.department_summary
      const departmentOptions = Object.keys(summary.department_summary || {}).map(depName => ({
        id: depName, name: depName
      }));
      // Build branch options from summary.branch_summary
      const branchOptions = Object.keys(summary.branch_summary || {}).map(branchName => ({
        id: branchName, name: branchName
      }));

      // Process each employee record.
      const processed = employees.map((entry, idx) => {
        // Employee data is stored under a key starting with "employee_row"
        const empKey = Object.keys(entry).find(key => key.startsWith("employee_row"));
        const emp = entry[empKey];
        // Compose full name.
        const fullName = [emp.first_name, emp.middle_name, emp.last_name].filter(Boolean).join(' ');
        // Department from entry.department.
        const dept = entry.department || {};
        // Branch: if available from department.
        const branch = dept.branch_name ? { id: dept.branch_name, name: dept.branch_name } : null;
        // Role now exists as a property within the employee data.
        const role = emp.role || { id: ROLE_OPTIONS_STATIC[0].id, name: ROLE_OPTIONS_STATIC[0].name };

        return {
          id: emp.id,
          staffId: emp.staffId || 'N/A',
          name: fullName,
          department: dept,
          branch: branch,
          role: role,
          // Store original values for comparison.
          original: {
            department: dept.name || '',
            branch: branch ? branch.name : '',
            role: role.name || '',
          },
        };
      });

      setUsersData({
        employees: processed,
        departmentOptions,
        branchOptions,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [organizationId]);

  // Pagination
  const totalPages = Math.ceil(usersData.employees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = usersData.employees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // When a dropdown value changes, update the corresponding row change.
  const handleSelectChange = (userId, field, value) => {
    setUpdatedRows(prev => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value }
    }));
  };

  // Determine if a row has changes compared to its original values.
  const isRowDirty = (user) => {
    const updates = updatedRows[user.id];
    if (!updates) return false;
    if (updates.department && updates.department !== user.original.department) return true;
    if (updates.branch && updates.branch !== user.original.branch) return true;
    if (updates.role && updates.role !== user.original.role) return true;
    return false;
  };

  // Send PATCH request to update the user record.
  const handleUpdateRow = async (user) => {
    const updates = updatedRows[user.id];
    if (!updates) return;
    try {
      const response = await request.patch(`/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        // In this example, the update payload includes the new department name,
        // branch name, and role id (looked up from the static options).
        body: JSON.stringify({
          department: updates.department || user.department?.name,
          branch: updates.branch || user.branch?.name,
          role_id: ROLE_OPTIONS_STATIC.find((r) => r.name === (updates.role || user.role?.name))?.id || user.role.id,
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Update failed');
      }
      toast.success(`User ${user.name} updated successfully`);
      // Clear the dirty state for that row.
      setUpdatedRows(prev => {
        const newState = { ...prev };
        delete newState[user.id];
        return newState;
      });
      // Optionally, refetch users.
      fetchUsers();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message);
    }
  };

  // Archive (soft delete) and Delete actions.
  const handleArchive = async (user) => {
    if (window.confirm(`Archive (soft delete) user ${user.name}?`)) {
      try {
        const response = await request.delete(`/users/${user.id}?deleteType=soft`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Archive failed');
        }
        toast.success(`User ${user.name} archived successfully`);
        fetchUsers();
      } catch (error) {
        console.error("Archive Error:", error);
        toast.error(error.message);
      }
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Delete user ${user.name}? This is permanent.`)) {
      try {
        const response = await request.delete(`/users/${user.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Deletion failed');
        }
        toast.success(`User ${user.name} deleted successfully`);
        fetchUsers();
      } catch (error) {
        console.error("Deletion Error:", error);
        toast.error(error.message);
      }
    }
  };

  // Pagination control
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
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
                  {usersData.branchOptions.length > 0 && <th>Branch</th>}
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map(user => (
                  <tr key={user.id}>
                    <td>{user.staffId}</td>
                    <td>{user.name}</td>
                    <td>
                      <select
                        value={updatedRows[user.id]?.department || user.department?.name || ''}
                        onChange={(e) => handleSelectChange(user.id, 'department', e.target.value)}
                      >
                        <option value={user.department?.name || ''}>
                          {user.department?.name || 'Select Department'}
                        </option>
                        {usersData.departmentOptions
                          .filter(opt => opt.name !== user.department?.name)
                          .map(opt => (
                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                          ))}
                      </select>
                    </td>
                    {usersData.branchOptions.length > 0 && (
                      <td>
                        <select
                          value={updatedRows[user.id]?.branch || user.branch?.name || ''}
                          onChange={(e) => handleSelectChange(user.id, 'branch', e.target.value)}
                        >
                          {user.branch ? (
                            <option value={user.branch.name}>{user.branch.name}</option>
                          ) : (
                            <option value="">Select Branch</option>
                          )}
                          {usersData.branchOptions
                            .filter(opt => opt.name !== user.branch?.name)
                            .map(opt => (
                              <option key={opt.id} value={opt.name}>{opt.name}</option>
                            ))}
                        </select>
                      </td>
                    )}
                    <td>
                      <select
                        value={updatedRows[user.id]?.role || user.role?.name || ''}
                        onChange={(e) => handleSelectChange(user.id, 'role', e.target.value)}
                      >
                        <option value={user.role?.name}>{user.role?.name}</option>
                        {ROLE_OPTIONS_STATIC
                          .filter(opt => opt.name !== user.role?.name)
                          .map(opt => (
                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleUpdateRow(user)} disabled={!isRowDirty(user)}>
                        Update
                      </button>
                      <button onClick={() => handleArchive(user)}>Archive</button>
                      <button onClick={() => handleDelete(user)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-controls">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
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


// import React, { useEffect, useState } from 'react';
// import './Modal.css';
// // import { Formik, Form, Field } from 'formik';
// // import * as Yup from 'yup';
// // import Select from 'react-select';
// import request from '../request';
// import { toast } from 'react-toastify';


// // Modal for Existing Users
// const ExistingUsersModal = ({ organizationId, onClose }) => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     // In production you would also manage pagination state here.
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await request.get(`/users/employees?organizationId=${organizationId}&skip=0&limit=100&sort=asc`, 
//         //     {
//         //   headers: {
//         //     Authorization: `Bearer ${localStorage.getItem('token')}`
//         //   }
//         // }
//     );
//         const data = await response.json();
//         setUsers(data.users || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Error fetching users.");
//         // alert("Failed to load users.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     React.useEffect(() => {
//       fetchUsers();
//     }, [organizationId]);
  
//     const handleUpdate = (user) => {
//       // Logic to update user – update button remains disabled until changes.
//       toast.info(`Update user ${user.name}`);
//     //   alert(`Update user ${user.name}`);
//     };
  
//     const handleArchive = (user) => {
//       if (window.confirm(`Archive user ${user.name}?`)) {
//         // alert(`User ${user.name} archived (soft delete).`);
//         toast.info(`User ${user.name} archived (soft delete).`);
//       }
//     };
  
//     const handleDelete = (user) => {
//       if (window.confirm(`Delete user ${user.name}? This is permanent.`)) {
//         toast.info(`User ${user.name} deleted.`);
//         // alert(`User ${user.name} deleted.`);
//       }
//     };
  
//     return (
//       <div className="modal-overlay">
//         <div className="modal-content large-modal">
//           <h2>Existing Users</h2>
//           {loading ? (
//             <p>Loading users…</p>
//           ) : (
//             <div className="table-container">
//               <table className="users-table">
//                 <thead>
//                   <tr>
//                     <th>Staff ID</th>
//                     <th>Name</th>
//                     <th>Department</th>
//                     {/*
//                       Conditionally render Branch if organization is branch managed.
//                     */}
//                     {users.some(u => u.branch) && <th>Branch</th>}
//                     <th>Role</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user, idx) => {
//                     // Compose full name from available title, first, middle, last names.
//                     const fullName = [user.title, user.firstName, user.middleName, user.lastName]
//                       .filter(Boolean)
//                       .join(' ');
//                     return (
//                       <tr key={user.id || idx}>
//                         <td>{user.staffId || 'N/A'}</td>
//                         <td>{fullName}</td>
//                         <td>
//                           <select defaultValue={user.department}>
//                             {/* Options should be dynamically generated */}
//                             <option value="Sales">Sales</option>
//                             <option value="HR">HR</option>
//                             <option value="IT">IT</option>
//                           </select>
//                         </td>
//                         {users.some(u => u.branch) && (
//                           <td>
//                             <select defaultValue={user.branch}>
//                               <option value="Main">Main</option>
//                               <option value="Secondary">Secondary</option>
//                             </select>
//                           </td>
//                         )}
//                         <td>
//                           <select defaultValue={user.role}>
//                             <option value="User">User</option>
//                             <option value="Admin">Admin</option>
//                           </select>
//                         </td>
//                         <td>
//                           <button onClick={() => handleUpdate(user)} disabled>
//                             Update
//                           </button>
//                           <button onClick={() => handleArchive(user)}>Archive</button>
//                           <button onClick={() => handleDelete(user)}>Delete</button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//               {/* Pagination controls would be inserted here */}
//             </div>
//           )}
//           <div className="modal-actions">
//             <button onClick={onClose}>Close</button>
//           </div>
//         </div>
//       </div>
//     );

// };

// export default ExistingUsersModal;