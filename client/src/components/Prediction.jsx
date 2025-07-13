import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Prediction = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/predict/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch prediction data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center mt-5">
        {error}
      </Alert>
    );
  }

  const patientInfo = {
    name: data.name,
    age: data.age,
    gender: data.gender,
    chest_location: data.chest_location,
  };

  const getDiagnosisResults = () => {
    const predictions = data.predictions || [];

    return predictions
      .map((item) => {
        const confidence = parseFloat(item.confidence);
        return {
          name: item.label.charAt(0).toUpperCase() + item.label.slice(1),
          confidence: confidence.toFixed(1),
          status: confidence > 70 ? 'High confidence' : '',
          color: confidence > 70 ? 'success' : 'danger',
          highlighted: confidence > 70,
        };
      })
      .sort((a, b) => b.confidence - a.confidence);
  };


  const diagnosisResults = getDiagnosisResults();

  return (
    <div className="p-4 bg-light min-vh-100">
      <h4 className="fw-bold text-center mb-4">Diagnosis Results</h4>

      {/* Patient Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h6 className="fw-bold mb-3 text-primary">Patient Information</h6>
          <Row className="mb-2"><Col xs={4}>Name:</Col><Col>{patientInfo.name}</Col></Row>
          <Row className="mb-2"><Col xs={4}>Age:</Col><Col>{patientInfo.age}</Col></Row>
          <Row className="mb-2"><Col xs={4}>Gender:</Col><Col>{patientInfo.gender}</Col></Row>
          <Row className="mb-2"><Col xs={4}>Chest Location:</Col><Col>{patientInfo.chest_location}</Col></Row>
        </Card.Body>
      </Card>

      {/* Diagnosis Results */}
      <h6 className="fw-bold text-primary mb-3">Diagnosis Results</h6>
      {diagnosisResults.map((result, index) => (
        <Card
          key={index}
          className={`mb-3 border-${result.highlighted ? 'primary' : result.color} shadow-sm`}
        >
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0 fw-semibold">{result.name}</h6>
              {result.status && <small className="text-muted">{result.status}</small>}
            </div>
            <Badge bg={result.color} pill style={{ fontSize: '1rem' }}>
              {result.confidence}%
            </Badge>
          </Card.Body>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="outline-primary">🎙️ Record Again</Button>
      </div>
    </div>
  );
};

export default Prediction;
