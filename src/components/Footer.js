// import React from 'react';
// import './Footer.css'; // add your styling

// const Footer = () => {
//   return (
//     <footer className="fixed-footer">
//       <p>&copy; {new Date().getFullYear()} SaaS Organization. All rights reserved.</p>
//     </footer>
//   );
// };

// export default Footer;




import React from 'react';
import './Footer.css';
import orgLogo from '../assets/images/image-1.png'; // adjust path if needed

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} SaaS Program. All rights reserved.</p>
        <div className="powered-by">
          <span>Powered by:</span>
          <img src={orgLogo} alt="Organization Logo" className="org-logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;