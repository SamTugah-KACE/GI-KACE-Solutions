import React, { useState } from 'react';
import FileModal from './FileModal';
import './DashboardTable.css';

const DashboardTable = () => {
  const [fileToView, setFileToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const data = [
    {
      id: 1,
      accountName: 'User One',
      role: 'Admin',
      issues: 'Deactivation',
      attachments: ['file1.pdf'],
    },
    {
      id: 2,
      accountName: 'User Two',
      role: 'User',
      issues: 'Approval',
      attachments: ['file2.docx'],
    },
  ];

  const handleViewFile = (file) => setFileToView(file);
  const handleCloseModal = () => setFileToView(null);

  return (
    <div className="dashboard-table">
      <div className="table-header">
        <span>Page {currentPage}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Role</th>
            <th>Issue(s)</th>
            <th>Attachment(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const showDeactivate = row.issues.toLowerCase().includes('deactivation');
            const showApproval = row.issues.toLowerCase().includes('approval');
            return (
              <tr key={row.id}>
                <td>{row.accountName}</td>
                <td>{row.role}</td>
                <td>{row.issues}</td>
                <td>
                  {row.attachments.map((att, idx) => (
                    <div key={idx} className="attachment-cell">
                      <div className="file-name">{att}</div>
                      <div className="file-actions">
                        <button onClick={() => handleViewFile(att)}>View</button>
                        <button>Download</button>
                      </div>
                    </div>
                  ))}
                </td>
                <td>
                  {showDeactivate && <button className="table-btn">Deactivate</button>}
                  {showApproval && (
                    <>
                      <button className="table-btn">Approve</button>
                      <button className="table-btn">Decline</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination controls (stub) */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
      {fileToView && <FileModal file={fileToView} onClose={handleCloseModal} />}
    </div>
  );
};

export default DashboardTable;
