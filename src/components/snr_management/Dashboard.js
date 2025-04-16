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
// import Joyride from 'react-joyride';
// import { useOrganization } from '../../context/OrganizationContext';
import { useAuth } from '../../context/AuthContext';
import TourGuide from '../guide/TourGuide';

const Dashboard = () => {

const { auth } = useAuth();
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showUpdateDeptModal, setShowUpdateDeptModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

  
  // Define the tour steps. The target selectors must match unique CSS classes set in your components.
  const tourSteps = [
    {
      target: '.dashboard-header',
      content: 'This is your dashboard header where notifications and the title are displayed.',
    },
    {
      target: '.sidebar',
      content: 'Use this sidebar to navigate between different modules.',
    },
    {
      target: '.new-user-menu',
      content: 'Click here to access the New User options.',
    },
    {
      target: '.bulk-insert-menu',
      content: 'This option lets you perform a bulk insert of users.',
    },
    {
      target: '.user-registration-form-menu',
      content: 'Design and edit the User Registration Form here.',
    },
    {
      target: '.add-new-user-menu',
      content: 'Use this option to add a new user directly.',
    },
    {
      target: '.existing-users-menu',
      content: 'Click here to view the list of existing users.',
    },
    // Add further steps as needed.
  ];


  const handleDepartmentAdded = (newDept) => {
    // Update your state or refresh the department list as needed.
    console.log("New department added:", newDept);
  };


  const handleDepartmentUpdated = (newDept) => {
    // Update your state or refresh the department list as needed.
    console.log("Department Updated:", newDept);
  };

  
  const handleBranchAdded = (newBranch) => {
    console.log("New branch added:", newBranch);
    // Refresh the branch list as needed.
  };

  return (
    <div className="dashboard-container">
      {/* Pass the auth token into TourGuide for API calls */}
      <TourGuide steps={tourSteps} authToken={auth.token} />

      <Header  />
      <ProfileCard /> {/* Positioned immediately below header */}
      <div className="dashboard-content">
        <Sidebar 
        onNewUserClick={() => setShowNewUserModal(true)} 
        onNewDepartmentClick={() => setShowAddDeptModal(true)}
        onUpdateDepartmentClick={() => setShowUpdateDeptModal(true)}
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
          onDepartmentUpdated={handleDepartmentUpdated}
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
