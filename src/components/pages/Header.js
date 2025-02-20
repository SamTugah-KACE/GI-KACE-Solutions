import React from 'react';
import './Header.css';
import leftLogo from '../../assets/images/moc.jpg';    // ensure these files exist
import rightLogo from '../../assets/images/gi-kace.png';
// import userAvatar from '../../assets/images/avatar.jpeg';
// import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  return (
    <header className="dashboard-header">
      <img src={leftLogo} alt="Left Logo" className="header-logo" />
      <h1 className="org-name">Your Organization Name</h1>
      <div className="header-right">
        <img src={rightLogo} alt="Right Logo" className="header-logo" />
        
        <br/>
      
      {/* <div className="profile-card">
          <img src={userAvatar} alt="User" className="profile-avatar" />
          <div className="profile-info">
            <span className="profile-name">John Doe</span>
            <span className="profile-role">CEO</span>
          </div>
        </div> */}
        
        {/* <ProfileDropdown /> */}
      </div>
      
    </header>
  );
};

export default Header;
