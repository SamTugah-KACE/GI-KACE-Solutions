import React, { useState } from 'react';
import Header from '../pages/Header';
import Footer from '../Footer';
import Sidebar from '../pages/Sidebar';
import SearchBar from '../pages/SearchBar';
import SummaryCards from '../pages/SummaryCards';
import DashboardTable from '../pages/DashboardTable';
import NewUserModal from '../pages/NewUserModal';
import AddDepartmentModal from './AddDepartmentModal';
import UpdateDepartmentModal from './UpdateDepartmentModal';
import AddBranchModal from './AddBranchModal';
import './Dashboard.css';
import ProfileCard from '../pages/ProfileCard';
// import { useOrganization } from '../../context/OrganizationContext';

const Dashboard = () => {


  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showUpdateDeptModal, setShowUpdateDeptModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);


  const handleDepartmentAdded = (newDept) => {
    // Update your state or refresh the department list as needed.
    console.log("New department added:", newDept);
  };

  const handleBranchAdded = (newBranch) => {
    console.log("New branch added:", newBranch);
    // Refresh the branch list as needed.
  };

  return (
    <div className="dashboard-container">
      <Header  />
      <ProfileCard /> {/* Positioned immediately below header */}
      <div className="dashboard-content">
        <Sidebar 
        onNewUserClick={() => setShowNewUserModal(true)} 
        onNewDepartmentClick={() => setShowAddDeptModal(true)}
        onUpdateDepartmenthClick={() => setShowUpdateDeptModal(true)}
        onNewBranchClick={() => setShowAddBranchModal(true)}
          />
        <main className="main-panel">
          <SearchBar />
          <SummaryCards />
          <DashboardTable />
        </main>
      </div>
      {showNewUserModal && (
        <NewUserModal onClose={() => setShowNewUserModal(false)} />
      )}

     {showAddDeptModal && (
        <AddDepartmentModal
          onClose={() => setShowAddDeptModal(false)}
          onDepartmentAdded={handleDepartmentAdded}
        />
      )}

{showUpdateDeptModal && (
        <UpdateDepartmentModal
          onClose={() => setShowUpdateDeptModal(false)}
          // onDepartmentAdded={handleDepartmentAdded}
        />
      )}
      
      {showAddBranchModal && (
        <AddBranchModal
          onClose={() => setShowAddBranchModal(false)}
          onBranchAdded={handleBranchAdded}
        />
      )}

      <Footer />
    </div>

    
  );
};

export default Dashboard;
