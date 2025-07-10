import React, { useState, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaMicrophone, FaStop } from 'react-icons/fa';

const RecordChestSounds = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or not supported.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="text-center">
        <h5 className="mb-3">Record Chest Sounds</h5>

        <Button
          variant={recording ? 'danger' : 'primary'}
          onClick={recording ? stopRecording : startRecording}
          className="d-flex align-items-center gap-2 px-4"
        >
          {recording ? <FaStop /> : <FaMicrophone />}
          {recording ? 'Stop Recording' : 'Press to Record'}
        </Button>

        {audioURL && (
          <div className="mt-3">
            <audio controls src={audioURL}></audio>
            <div className="text-muted small mt-1">Playback Recorded Audio</div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecordChestSounds;
