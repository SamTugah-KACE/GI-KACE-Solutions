// src/components/ExpandableSection.js
import React, { useState } from 'react';
import './ExpandableSection.css';
// You may use a library like FontAwesome for icons.
import { FaChevronDown, FaChevronUp, FaIcon } from 'react-icons/fa';

const ExpandableSection = ({ title, icon, children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <div className="expandable-section">
      <div className="section-header" onClick={toggleExpanded}>
        <div className="section-title">
          {/* Replace with your icon component, for example: */}
          <i className={`fa fa-${icon}`}></i>
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
