// src/components/DepartmentRow.js
import React, { useEffect, useState } from 'react';
import request from '../request';

const DepartmentRow = ({ department, organizationId, isBranchManaged }) => {
  const [hodName, setHodName] = useState('N/A');
  const [branchName, setBranchName] = useState('N/A');

  // Fetch Head of Department details using department_head_id
  useEffect(() => {
    const fetchHOD = async () => {
      if (department.department_head_id) {
        try {
          const response = await request.get(
            `/api/staff/${department.department_head_id}?organization_id=${organizationId}&include_files=false&max_file_size=2097152`
          );
          const emp = response.data.main.Employee;
          // Format the full name: include middle name only if non-empty.
          const fullName = `${emp.title} ${emp.first_name}${emp.middle_name ? ' ' + emp.middle_name : ''} ${emp.last_name}`;
          setHodName(fullName);
        } catch (error) {
          console.error("Error fetching HoD details:", error);
        }
      }
    };
    fetchHOD();
  }, [department.department_head_id, organizationId]);

  // If the organization is branch-managed and the department has a branch_id,
  // fetch the branch details.
  useEffect(() => {
    const fetchBranch = async () => {
      if (isBranchManaged && department.branch_id) {
        try {
          const response = await request.get(
            `/organizations/${organizationId}/branches/${department.branch_id}`
          );
          setBranchName(response.data.name);
        } catch (error) {
          console.error("Error fetching branch details:", error);
        }
      }
    };
    fetchBranch();
  }, [department.branch_id, organizationId, isBranchManaged]);

  return (
    <tr>
      <td>{department.name}</td>
      <td>{hodName}</td>
      {isBranchManaged && <td>{branchName}</td>}
    </tr>
  );
};

export default DepartmentRow;
