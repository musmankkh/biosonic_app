import React, { useRef, useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { FaFileUpload } from 'react-icons/fa';

const UploadRecording = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Simple validation: must be .wav
      if (!file.name.toLowerCase().endsWith('.wav')) {
        setError('Only WAV files are allowed.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="text-center">
        <h5 className="mb-3">Upload Chest Recording</h5>
        <p className="text-muted">Only WAV format, 4000 Hz sampling rate</p>

        <input
          type="file"
          accept=".wav"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="d-none"
        />

        <Button variant="outline-primary" onClick={handleButtonClick}>
          <FaFileUpload className="me-2" />
          Select WAV File
        </Button>

        {/* File Info */}
        {selectedFile && (
          <div className="mt-3 text-success small">
            Selected: {selectedFile.name}
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="danger" className="mt-3 py-1 small">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default UploadRecording;
