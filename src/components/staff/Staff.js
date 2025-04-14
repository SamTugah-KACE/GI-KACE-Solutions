// src/components/Staff.js
import React, {useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../pages/Header';
import Footer from '../Footer';
import ProfileCard from '../pages/ProfileCard';
import SearchBar from './SearchBar';
import ExpandableSection from './ExpandableSection';
import BioDataSection from './BioDataSection';
import QualificationsSection from './QualificationsSection';
import EmploymentDetailsSection from './EmploymentDetailsSection';
// import PaymentDetailsSection from './PaymentDetailsSection';
// import NextOfKinSection from './NextOfKinSection';
// import EmergencyContactSection from './EmergencyContactSection';
// import EmploymentHistorySection from './EmploymentHistorySection';
import './Staff.css';
import LogoutConfirmationModal from '../pages/LogoutConfirmationModal';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import request from '../request'; // Adjust the import based on your project structure
// import { useOrganization } from '../../context/OrganizationContext'; // Adjust the import based on your project structure
// import { useEffect } from 'react';

const Staff = () => {
  const { auth, logout } = useAuth();
  //  const { organization } = useOrganization();
    const navigate = useNavigate();
  const { orgSlug } = useParams();
  const staffId = auth.emp && auth.emp.id;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleLogoutModal = () => {
    setShowLogoutModal((prev) => !prev);
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
      // alert(error);
      toast.error('Logout failed. Please try again.');
      // Optionally, show an error message to the user
    }
    // Clear auth state and redirect to the organization's signin page
    
  };

  return (
    <div className="dashboard-container">
      <Header />
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

      <main className="dashboard-content">
        <div className="block-section">
          <ProfileCard />
        </div>

        <div className="block-section">
          <SearchBar />
        </div>

        <div className="block-section">
          <ExpandableSection title="Bio-Data" icon="user">
            <BioDataSection staffId={staffId} />
          </ExpandableSection>
        </div>

        <div className="block-section">
          <ExpandableSection title="Qualifications" icon="graduation-cap">
            <div className="nested-blocks">
              <div className="nested-section">
                <ExpandableSection title="Academic" icon="book">
                  <QualificationsSection type="academic" />
                </ExpandableSection>
              </div>
              <div className="nested-section">
                <ExpandableSection title="Professional" icon="briefcase">
                  <QualificationsSection type="professional" />
                </ExpandableSection>
              </div>
            </div>
          </ExpandableSection>
        </div>

        <div className="block-section">
          <ExpandableSection title="Employment Details" icon="building">
            <EmploymentDetailsSection />
          </ExpandableSection>
        </div>
        {/*
//         Uncomment and add additional sections as required:
//         <div className="block-section">
//           <ExpandableSection title="Payment Details" icon="money">
//             <PaymentDetailsSection />
//           </ExpandableSection>
//         </div>
//         <div className="block-section">
//           <ExpandableSection title="Next of Kin" icon="users">
//             <NextOfKinSection />
//           </ExpandableSection>
//         </div>
//         <div className="block-section">
//           <ExpandableSection title="Emergency Contact" icon="phone">
//             <EmergencyContactSection />
//           </ExpandableSection>
//         </div>
//         <div className="block-section">
//           <ExpandableSection title="Employment History" icon="history">
//             <EmploymentHistorySection />
//           </ExpandableSection>
//         </div>
//         */}
      </main>
      <Footer />
    </div>
  );
};

export default Staff;











// // src/components/Staff.js
// import React from 'react';
// import { useAuth } from '../../context/AuthContext';
// import Header from '../pages/Header';
// import Footer from '../Footer';
// import ProfileCard from '../pages/ProfileCard';
// import SearchBar from './SearchBar';
// import ExpandableSection from './ExpandableSection';
// import BioDataSection from './BioDataSection';
// import QualificationsSection from './QualificationsSection';
// import EmploymentDetailsSection from './EmploymentDetailsSection';
// // import PaymentDetailsSection from './PaymentDetailsSection';
// // import NextOfKinSection from './NextOfKinSection';
// // import EmergencyContactSection from './EmergencyContactSection';
// // import EmploymentHistorySection from './EmploymentHistorySection';
// import './Staff.css';

// const Staff = () => {

//     const { auth } = useAuth();
//     const staffId = auth.emp && auth.emp.id; // Adjust depending on how your user model is structured

//   return (
//     <div className="dashboard-container">
//       <Header />
//       <div className="dashboard-content">
//       <div className="section-block">
//           <ProfileCard />
//         </div>
//         <div className="section-block">
//           <SearchBar />
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Bio-Data" icon="user">
//             <BioDataSection staffId={staffId} />
//           </ExpandableSection>
//         </div>

//         <div className="section-block">
//           <ExpandableSection title="Qualifications" icon="graduation-cap">
//             <div className="qualifications-container">
//               <div className="section-block">
//                 <ExpandableSection title="Academic" icon="book">
//                   <QualificationsSection type="academic" />
//                 </ExpandableSection>
//               </div>
//               <div className="section-block">
//                 <ExpandableSection title="Professional" icon="briefcase">
//                   <QualificationsSection type="professional" />
//                 </ExpandableSection>
//               </div>
//             </div>
//           </ExpandableSection>
//         </div>

//         <div className="section-block">
//           <ExpandableSection title="Employment Details" icon="building">
//             <EmploymentDetailsSection />
//           </ExpandableSection>
//         </div>
//         {/*
//         Uncomment and add additional sections as required:
//         <div className="section-block">
//           <ExpandableSection title="Payment Details" icon="money">
//             <PaymentDetailsSection />
//           </ExpandableSection>
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Next of Kin" icon="users">
//             <NextOfKinSection />
//           </ExpandableSection>
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Emergency Contact" icon="phone">
//             <EmergencyContactSection />
//           </ExpandableSection>
//         </div>
//         <div className="section-block">
//           <ExpandableSection title="Employment History" icon="history">
//             <EmploymentHistorySection />
//           </ExpandableSection>
//         </div>
//         */}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Staff;
