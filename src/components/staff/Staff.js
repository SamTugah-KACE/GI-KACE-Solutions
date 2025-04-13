// src/components/Staff.js
import React from 'react';
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

const Staff = () => {

    const { auth } = useAuth();
    const staffId = auth.emp && auth.emp.id; // Adjust depending on how your user model is structured

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
      <div className="section-block">
          <ProfileCard />
        </div>
        <div className="section-block">
          <SearchBar />
        </div>
        <div className="section-block">
          <ExpandableSection title="Bio-Data" icon="user">
            <BioDataSection staffId={staffId} />
          </ExpandableSection>
        </div>

        <div className="section-block">
          <ExpandableSection title="Qualifications" icon="graduation-cap">
            <div className="qualifications-container">
              <div className="section-block">
                <ExpandableSection title="Academic" icon="book">
                  <QualificationsSection type="academic" />
                </ExpandableSection>
              </div>
              <div className="section-block">
                <ExpandableSection title="Professional" icon="briefcase">
                  <QualificationsSection type="professional" />
                </ExpandableSection>
              </div>
            </div>
          </ExpandableSection>
        </div>

        <div className="section-block">
          <ExpandableSection title="Employment Details" icon="building">
            <EmploymentDetailsSection />
          </ExpandableSection>
        </div>
        {/*
        Uncomment and add additional sections as required:
        <div className="section-block">
          <ExpandableSection title="Payment Details" icon="money">
            <PaymentDetailsSection />
          </ExpandableSection>
        </div>
        <div className="section-block">
          <ExpandableSection title="Next of Kin" icon="users">
            <NextOfKinSection />
          </ExpandableSection>
        </div>
        <div className="section-block">
          <ExpandableSection title="Emergency Contact" icon="phone">
            <EmergencyContactSection />
          </ExpandableSection>
        </div>
        <div className="section-block">
          <ExpandableSection title="Employment History" icon="history">
            <EmploymentHistorySection />
          </ExpandableSection>
        </div>
        */}
      </div>
      <Footer />
    </div>
  );
};

export default Staff;
