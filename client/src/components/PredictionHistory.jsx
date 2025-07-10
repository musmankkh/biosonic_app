import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPredictions(response.data);
      } catch (err) {
        setError("Failed to load predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

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

  return (
    <div className="p-4 bg-light min-vh-100">
      <h4 className="fw-bold text-center mb-4">Prediction History</h4>

      <Row className="gy-3">
        {predictions.map((entry, index) => (
          <Col key={entry.id || index} xs={12}>
            <Link
              to={`/dashboard/prediction/${entry.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card className="shadow-sm border-0 hover-shadow">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div>
                      <span className="fw-semibold">
                        {entry.name}, {entry.age}
                      </span>
                      <br />
                      <small className="text-muted">
                        {entry.date} • {entry.time}
                      </small>
                    </div>
                    <FaInfoCircle className="text-muted" />
                  </div>

                  <div className="mt-2">
                    <div className="fw-medium">
                      Top Prediction:{" "}
                      <span className="text-primary fw-semibold">
                        {entry.topPrediction} ({entry.confidence}%)
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PredictionHistory;
