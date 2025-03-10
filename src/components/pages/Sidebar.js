// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import request from '../request';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import ViewDepartmentsModal from '../snr_management/ViewDepartmentsModal'; // Import the modal
import UpdateDepartmentModal from '../snr_management/UpdateDepartmentModal';
import AddBranchModal from '../snr_management/AddBranchModal';

const Sidebar = ({ onNewUserClick, onNewDepartmentClick, onPromotionClick, onNewBranchClick  }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const [showViewDeptModal, setShowViewDeptModal] = useState(false);
  const [showUpdateDeptModal, setShowUpdateDeptModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

    // Retrieve orgSlug from the URL for multi-tenant navigation
    const { orgSlug } = useParams();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { organization } = useOrganization();

  const isBranchManaged = organization?.nature?.toLowerCase().includes('branch');

  const toggleExpanded = () => setExpanded(!expanded);
  const toggleSubmenu = (menu) =>
    setActiveMenu((prev) => (prev === menu ? null : menu));

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };


  const handleConfirmLogout = async () => {
    console.log("\n\norgSlug in logout function: ", orgSlug);
    try {
      console.log("\n\nuser's toekn: ",auth.token);
      // Call the backend logout API with the token in the header
      await request.post('/auth/logout', null, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });

      logout();
    setShowLogoutModal(false);
    // Navigate to /:orgSlug/signin so that the slug remains in the URL
    navigate(`/${orgSlug}/signin`, { replace: true });

    } catch (error) {
      console.error('Logout API error:', error);
      alert(error);
      // Optionally, show an error message to the user
    }
    // Clear auth state and redirect to the organization's signin page
    
  };
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };


  return (
    <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleExpanded}>
        {expanded ? '<<' : '>>'}
      </button>
      <ul className="menu-list">
        <li className="menu-item" onClick={onNewUserClick}>New User</li>
        <li className="menu-item" onClick={() => toggleSubmenu('roles')}>
          System Roles <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'roles' && (
            <ul className="submenu">
              <li onClick={() => alert("Add New Role modal")}>Add New Role</li>
              <li onClick={() => alert("Existing Roles modal")}>Existing Roles</li>
            </ul>
          )}
        </li>
        <li className="menu-item" onClick={() => toggleSubmenu('dept')}>
          Department <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'dept' && (
            <ul className="submenu">
              <li onClick={onNewDepartmentClick}>Add New Department</li>
              <li onClick={() => setShowViewDeptModal(true)}>View Departments</li>
              <li onClick={() => alert("Assign Head of Department modal")}>Assign Head of Department<br/>(HoD)</li>
              <li onClick={() =>  setShowUpdateDeptModal(true)}>Update Department</li>
              <li onClick={() => alert("Delete Department modal")}>Delete Department</li>
            </ul>
          )}
        </li>
        {isBranchManaged && (
          <li className="menu-item" onClick={() => toggleSubmenu('branch')}>
            Branch <span className="dropdown-indicator">▼</span>
            {expanded && activeMenu === 'branch' && (
              <ul className="submenu">
                <li onClick={() => setShowAddBranchModal(true)}>Add New Branch</li>
                <li onClick={() => alert("View Branches modal")}>View Branches</li>
                <li onClick={() => alert("Assign Branch Manager modal")}>Assign Branch Manager</li>
                <li onClick={() => alert("Update Branch modal")}>Update Branch</li>
                <li onClick={() => alert("Delete Branch modal")}>Delete Branch</li>
              </ul>
            )}
          </li>
        )}
        <li className="menu-item" onClick={() => toggleSubmenu('promotion')}>
          Promotions <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'promotion' && (
            <ul className="submenu">
              <li onClick={() => alert("Ranks modal")}>Ranks</li>
              <li onClick={() => alert("Policy modal")}>Policy</li>
              <li onClick={() => alert("Applications modal")}>Applications</li>
            </ul>
          )}
        </li>
      </ul>
      <div className="logout-container">
        <button className="logout-btn"  onClick={handleLogoutClick}>
          {expanded ? 'Log Out' : <span className="logout-icon">⎋</span>}
        </button>
      </div>
      {showLogoutModal && (
        <LogoutConfirmationModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}

     {showUpdateDeptModal && (
        <UpdateDepartmentModal onClose={() => setShowUpdateDeptModal(false)} 
        onDepartmentUpdated={() => alert("Department Updated")}

        />
      )}

      {showViewDeptModal && (
        <ViewDepartmentsModal onClose={() => setShowViewDeptModal(false)} 
        />
      )}

      {showAddBranchModal && (
        <AddBranchModal
          onClose={() => setShowAddBranchModal(false)}
          onBranchAdded={() => alert("Branch added")}
        />
      )}
    </aside>
  );
};

export default Sidebar;







// import React, { useState } from 'react';
// import './Sidebar.css';

// const Sidebar = ({ onNewUserClick, onDesignerClick }) => {
//   const [expanded, setExpanded] = useState(true);
//   const [activeMenu, setActiveMenu] = useState(null);

//   const toggleExpanded = () => setExpanded(!expanded);
//   const toggleSubmenu = (menu) =>
//     setActiveMenu((prev) => (prev === menu ? null : menu));

//   return (
//     <aside className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
//       <button className="toggle-btn" onClick={toggleExpanded}>
//         {expanded ? '<<' : '>>'}
//       </button>
//       <ul className="menu-list">
//         <li className="menu-item" onClick={onNewUserClick}>New User</li>
//         <li className="menu-item" onClick={() => toggleSubmenu('roles')}>
//           System Roles <span className="dropdown-indicator">▼</span>
//           {expanded && activeMenu === 'roles' && (
//             <ul className="submenu">
//               <li>Add New Role</li>
//               <li>Existing Roles</li>
//             </ul>
//           )}
//         </li>
//         <li className="menu-item" onClick={() => toggleSubmenu('dept')}>
//           Department <span className="dropdown-indicator">▼</span>
//           {expanded && activeMenu === 'dept' && (
//             <ul className="submenu">
//               <li>New Department</li>
//               <li>Existing Departments</li>
//             </ul>
//           )}
//         </li>

//         <li className='menu-item' onClick={() => toggleSubmenu('promotion')} > Promotions <span className="dropdown-indicator">▼</span>
//           {expanded && activeMenu === 'promotion' && (
//             <ul className="submenu">
//               <li>Ranks</li>
//               <li>Policy</li>
//               <li>Applications</li>
//             </ul>
//           )}
          
//           </li>

//         {/* <li className="menu-item" onClick={onDesignerClick}>User Dashboard</li> */}
//       </ul>
//       <div className="logout-container">
//         <button className="logout-btn">
//           {expanded ? 'Log Out' : <span className="logout-icon">⎋</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


