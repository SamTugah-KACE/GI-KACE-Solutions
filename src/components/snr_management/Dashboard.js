import React, { useState } from 'react';
import Header from '../pages/Header';
import Sidebar from '../pages/Sidebar';
import SearchBar from '../pages/SearchBar';
import SummaryCards from '../pages/SummaryCards';
import DashboardTable from '../pages/DashboardTable';
import NewUserModal from '../pages/NewUserModal';
import AlertNotifier from '../AlertNotifier';
import Inbox from '../pages/InboxButton';
import DashboardDesigner from '../DashboardDesigner';
import './Dashboard.css';
// import ProfileDropdown from '../pages/ProfileDropdown';
import ProfileCard from '../pages/ProfileCard';

const Dashboard = () => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  // const [showDesigner, setShowDesigner] = useState(false);
  return (
    <div className="dashboard-container">
      <Header />
      <ProfileCard /> {/* Positioned immediately below header */}
      <div className="dashboard-content">
        <Sidebar 
        onNewUserClick={() => setShowNewUserModal(true)} 
        // onDesignerClick={() => setShowDesigner(true)}
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
      {/* {showDesigner && <DashboardDesigner onClose={() => setShowDesigner(false)} />} */}
      {/* <AlertNotifier /> */}
      {/* <Inbox /> */} 
    </div>
  );
};

export default Dashboard;
