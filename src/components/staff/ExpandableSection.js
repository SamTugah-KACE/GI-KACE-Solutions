// src/components/ExpandableSection.js
import React, { useState } from 'react';
import './ExpandableSection.css';
import { FaChevronDown, FaChevronUp, FaUser, FaGraduationCap, FaBook, FaBriefcase, FaBuilding } from 'react-icons/fa';
// You may use a library like FontAwesome for icons.
// import { FaChevronDown, FaChevronUp, FaIcon } from 'react-icons/fa';


const iconMap = {
  user: <FaUser />,
  'graduation-cap': <FaGraduationCap />,
  book: <FaBook />,
  briefcase: <FaBriefcase />,
  building: <FaBuilding />
};

const ExpandableSection = ({ title, icon, children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(prev => !prev);


  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpanded}>
        <div className="section-title">
          {/* Render the icon from the map, if provided */}
          { iconMap[icon] && <span className="section-icon">{iconMap[icon]}</span> }
          <span>{title}</span>
        </div>
        <div className="section-toggle">
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {expanded && <div className="section-content">{children}</div>}
    </div>
  );
};

export default ExpandableSection;


//   return (
//     <div className="expandable-section">
//       <div className="section-header" onClick={toggleExpanded}>
//         <div className="section-title">
//           {/* Replace with your icon component, for example: */}
//           <i className={`fa fa-${icon}`}></i>
//           <span>{title}</span>
//         </div>
//         <div className="section-toggle">
//           {expanded ? <FaChevronUp /> : <FaChevronDown />}
//         </div>
//       </div>
//       {expanded && <div className="section-content">{children}</div>}
//     </div>
//   );
// };

// export default ExpandableSection;
