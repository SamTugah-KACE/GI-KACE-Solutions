import { useState } from 'react';
import { FaBell, FaChevronDown } from 'react-icons/fa';
import './SecondaryHeader.css';
import { useAuth } from '../../context/AuthContext'; // Adjust the import based on your project structure
import userAvatar from '../../assets/images/avatar.jpeg'; // Adjust the import based on your project structure
import { useNavigate, useParams } from 'react-router-dom';
import LogoutConfirmationModal from '../pages/LogoutConfirmationModal';
import { toast } from 'react-toastify';
import request from "../request"; // Adjust the import based on your project structure


export default function SecondaryHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
   const { auth, logout } = useAuth();
    const user = auth.user || {username: "Guest", role: "Guest", image_path: userAvatar};
   const name = auth.user_name;
   const role = auth.role;

   const navigate = useNavigate();
   const { orgSlug } = useParams();
  
    // Simulated profile data and unread count
    const [profile, setProfile] = useState({ username: 'John Doe', role: 'CEO', avatar: userAvatar });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      message: "New leave request from Jane Smith",
      time: "10 minutes ago",
      read: false
    },
    {
      id: 2,
      message: "Performance review deadline tomorrow",
      time: "2 hours ago",
      read: false
    },
    {
      id: 3,
      message: "New job application for Developer position",
      time: "Yesterday",
      read: true
    }
  ];

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    console.log("Notification state:", !isNotificationsOpen); // Debug line
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal((prev) => !prev);
  };

  const handleConfirmLogout = async () => {
    // console.log("\n\norgSlug in logout function: ", orgSlug);
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
      // alert(error);
      toast.error('Logout failed. Please try again.');
      // Optionally, show an error message to the user
    }
    // Clear auth state and redirect to the organization's signin page
    
  };

 {/* Logout Button: adjust its placement as needed */}
 <div className="logout-btn-container">
 <button className="logout-btn" onClick={toggleLogoutModal}>
   Logout
 </button>
</div>
{showLogoutModal && (
 <LogoutConfirmationModal
   onConfirm={handleConfirmLogout}
   onCancel={toggleLogoutModal}
 />
)}




  return (
    <header className="secondary-header">
      <div className="secondary-header__notification">
        <button 
          className="secondary-header__notification-btn"
          onClick={toggleNotifications}
        >
          <FaBell />
          <span className="secondary-header__badge">3</span>
        </button>
        
        {isNotificationsOpen && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button className="mark-all-read">Mark all as read</button>
            </div>
            <div className="notification-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))}
            </div>
            <div className="notification-footer">
              <a href="#">View all notifications</a>
            </div>
          </div>
        )}
      </div>
      
      <div className="secondary-header__profile">
        {/* <img src="/profile.jpg" alt="Profile" className="secondary-header__image" /> */}
         <img src={user.image_path || userAvatar} alt="Profile" className="secondary-header__image" />
       

        <div className="secondary-header__info">
          <span className="secondary-header__name">{name}</span>
          <div
            className="secondary-header__title-container"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="secondary-header__title">{role}</span>
            <FaChevronDown className={`secondary-header__arrow ${isDropdownOpen ? 'open' : ''}`} />
            {isDropdownOpen && (
              <div className="secondary-header__dropdown">
                <a href="#">Profile</a>
                <a href="#">Settings</a>
                
                <a href="#" onClick={() => setIsProfileModalOpen(true)}>Update Profile</a>
                {showProfileModal && (
                  <div className="profile-modal">
                    <h3>Update Profile</h3>
                    <img src={user.image_path} alt="Profile" className="profile-modal-avatar" />
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="profile-modal-input"
                    />
                    <div className="profile-modal-actions">
                      <button onClick={() => setShowProfileModal(false)}>Close</button>
                    </div>
                  </div>
                )}

                <a href="#">Help</a>
                <a href="#">Feedback</a>
                <a href="#" onClick={toggleLogoutModal}>Logout</a>
                {showLogoutModal && (
                  <LogoutConfirmationModal
                    onConfirm={handleConfirmLogout}
                    onCancel={toggleLogoutModal}
                  />
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}