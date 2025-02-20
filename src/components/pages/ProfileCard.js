// // src/components/ProfileCard.js
// import React, { useState } from 'react';
// import './ProfileCard.css';
// import userAvatar from '../../assets/images/avatar.jpeg';
// import { FaEnvelope } from 'react-icons/fa';

// const ProfileCard = () => {
//   // Simulate profile data and unread count
//   const [profile, setProfile] = useState({ username: 'John Doe', role: 'CEO', avatar: userAvatar });
//   const [showModal, setShowModal] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(3); // example unread messages count

//   // Open the profile update modal when clicking the profile card
//   const openProfileModal = () => setShowModal(true);
//   const handleUpdate = () => {
//     // Here you would normally call an API to update profile info
//     alert('Profile updated!');
//     setShowModal(false);
//   };

//   return (
//     <div className="profile-card-container">
      
      
//       {/* <button className="inbox-btn" onClick={() => alert('Open Inbox Modal')}>
//         <FaEnvelope className="inbox-icon" />
//         {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
//       </button> */}

//       <div className="profile-card" onClick={openProfileModal}>
//         <img src={profile.avatar} alt="Profile" className="profile-card-avatar" />
//         <div className="profile-card-info">
//           <span className="profile-card-username">{profile.username}</span>
//           <span className="profile-card-role">{profile.role}</span>
//         </div>
//       </div>
      
//       {showModal && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
//             <h3>Update Profile</h3>
//             <img src={profile.avatar} alt="Profile" className="profile-modal-avatar" />
//             <input
//               type="text"
//               value={profile.username}
//               onChange={(e) => setProfile({ ...profile, username: e.target.value })}
//               className="profile-modal-input"
//             />
//             <div className="profile-modal-actions">
//               <button onClick={handleUpdate}>Update</button>
//               <button onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}


//     </div>
//   );
// };

// export default ProfileCard;








// src/components/ProfileCard.js
import React, { useState } from 'react';
import './ProfileCard.css';
import userAvatar from '../../assets/images/avatar.jpeg';
import { FaEnvelope } from 'react-icons/fa';
import InboxModal from './InboxModal';

const ProfileCard = () => {
  // Simulated profile data and unread count
  const [profile, setProfile] = useState({ username: 'John Doe', role: 'CEO', avatar: userAvatar });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [unreadCount] = useState(3); // Example unread messages count

  // Opens the profile update modal when the card is clicked
  const openProfileModal = () => setShowProfileModal(true);

  // Opens the inbox modal; prevent propagation to avoid triggering the profile update modal
  const openInboxModal = (e) => {
    e.stopPropagation();
    setShowInboxModal(true);
  };

  const handleUpdate = () => {
    // In production, update profile info via API
    alert('Profile updated!');
    setShowProfileModal(false);
  };

  return (
    <div className="profile-card-container">
      <button className="inbox-btn" onClick={openInboxModal}>
        <FaEnvelope className="inbox-icon" />
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </button>
      <div className="profile-card" onClick={openProfileModal}>
        <img src={profile.avatar} alt="Profile" className="profile-card-avatar" />
        <div className="profile-card-info">
          <span className="profile-card-username">{profile.username}</span>
          <span className="profile-card-role">{profile.role}</span>
        </div>
      </div>

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Update Profile</h3>
            <img src={profile.avatar} alt="Profile" className="profile-modal-avatar" />
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="profile-modal-input"
            />
            <div className="profile-modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showInboxModal && <InboxModal onClose={() => setShowInboxModal(false)} />}
    </div>
  );
};

export default ProfileCard;

