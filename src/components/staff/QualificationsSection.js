// src/components/QualificationsSection.js
import React, { useState } from 'react';
import FileModal from './FileModal';
import './QualificationsSection.css';

const QualificationsSection = ({ type }) => {
  // Simulated table data for demonstration.
  const initialData = [
    {
      id: 1,
      institution: 'University A',
      degree: type === 'academic' ? 'B.Sc. in Computer Science' : 'Certified Professional',
      yearObtained: 2010,
      details: 'Additional details...',
      filePath: '/files/certificate1.pdf'
    },
    {
      id: 2,
      institution: 'Institute B',
      degree: type === 'academic' ? 'M.Sc. in Software Engineering' : 'Advanced Certification',
      yearObtained: 2014,
      details: 'More details...',
      filePath: '/files/certificate2.pdf'
    }
  ];

  const [modalFile, setModalFile] = useState(null);

  const handleView = (filePath) => {
    // In production, you might validate file existence and open modal.
    setModalFile(filePath);
  };

  const handleCloseModal = () => {
    setModalFile(null);
  };

  const handleDownload = (filePath) => {
    // For demo, we create a temporary link to trigger download.
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    console.log("Saving qualification updates.");
  };

  const handleProposeUpdate = () => {
    console.log("Proposing qualification update.");
  };

  return (
    <div className="qualifications-section">
      <table>
        <thead>
          <tr>
            <th>Institution</th>
            <th>{type === 'academic' ? 'Degree' : 'Qualification'}</th>
            <th>Year Obtained</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {initialData.map(item => (
            <tr key={item.id}>
              <td>{item.institution}</td>
              <td>{item.degree}</td>
              <td>{item.yearObtained}</td>
              <td>
                {item.filePath ? (
                  <>
                    <button onClick={() => handleView(item.filePath)}>View</button>
                    <button onClick={() => handleDownload(item.filePath)}>Download</button>
                  </>
                ) : (
                  "No file"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="section-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleProposeUpdate}>Propose Update</button>
      </div>
      {modalFile && <FileModal filePath={modalFile} onClose={handleCloseModal} />}
    </div>
  );
};

export default QualificationsSection;
