import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onNewUserClick, onDesignerClick }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleExpanded = () => setExpanded(!expanded);
  const toggleSubmenu = (menu) =>
    setActiveMenu((prev) => (prev === menu ? null : menu));

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
              <li>Add New Role</li>
              <li>Existing Roles</li>
            </ul>
          )}
        </li>
        <li className="menu-item" onClick={() => toggleSubmenu('dept')}>
          Department <span className="dropdown-indicator">▼</span>
          {expanded && activeMenu === 'dept' && (
            <ul className="submenu">
              <li>New Department</li>
              <li>Existing Departments</li>
            </ul>
          )}
        </li>

        {/* <li className="menu-item" onClick={onDesignerClick}>User Dashboard</li> */}
      </ul>
      <div className="logout-container">
        <button className="logout-btn">
          {expanded ? 'Log Out' : <span className="logout-icon">⎋</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
