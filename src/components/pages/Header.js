import React from 'react';
import './Header.css';
import { useOrganization } from '../../context/OrganizationContext';
// import leftLogo from '../../assets/images/moc.jpg';    // ensure these files exist
// import rightLogo from '../../assets/images/gi-kace.png';
// import userAvatar from '../../assets/images/avatar.jpeg';
// import ProfileDropdown from './ProfileDropdown';

const Header = () => {

  const { org } = useOrganization();
  console.log("org in header: ", org.name);
  // Assume org.logos is a dictionary. We convert it to an array of URLs.
  const logos = org?.logos ? Object.values(org.logos).map(url => encodeURI(url)) : [];
  // Choose first logo for the left, second for the right if available.
  const leftLogo = logos[0] || null;
  const rightLogo = logos[1] || null;
  const organizationName = org?.name || "Your Organization";

  return (
    <header className="dashboard-header">
      {/* <img src={leftLogo} alt="Left Logo" className="header-logo" /> */}
      {leftLogo && (
        <img src={leftLogo} alt="Left Logo" className="header-logo left-logo" />
      )}
      
      <h1 className="org-name">{organizationName}</h1>
      
      {rightLogo && (
        <img src={rightLogo} alt="Right Logo" className="header-logo right-logo" />
      )}
      {/* <div className="header-right">
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
      {/* </div> } */}
      
    </header>
  );
};

export default Header;
