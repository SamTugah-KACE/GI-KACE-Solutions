import React from 'react';
import './FileModal.css';

const FileModal = ({ file, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Viewing File: {file}</h3>
        <div className="file-viewer">
          <p>File content preview goes here...</p>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FileModal;
