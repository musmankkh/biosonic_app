import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Card,
  Form,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { FaSignOutAlt, FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  const chestLocationMap = {
    0: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    1: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    6: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    7: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    8: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    11: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    12: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    13: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    14: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    15: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    16: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    17: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    18: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    19: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    20: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  };

  const [name, setName] = useState("Asma");
  const [age, setAge] = useState(72);
  const [gender, setGender] = useState("female");
  const [chestLocation, setChestLocation] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const { user, logout } = useAuth();

  const fileInputRef = useRef();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".wav")) {
        setFileError("Only WAV files are allowed.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setFileError("");
    }
  };

  const handleChestChange = (e) => {
    const key = e.target.value;
    setSelectedKey(key);
    setChestLocation(chestLocationMap[key] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("Please select a WAV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("chestLocation", JSON.stringify(chestLocation));

    setIsSubmitting(true);
    setPredictions(null);
    setFileError("");

    try {
      const token = localStorage.getItem("token"); // 👈 Get token from localStorage

      const res = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // 👈 Include in Authorization header
        },
      });

      const data = await res.json();

      if (data.predictions) {
        setPredictions(data.predictions);
      } else {
        setFileError(data.error || "Analysis failed.");
      }
    } catch (err) {
      setFileError("Server error: " + err.message);
    }

    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom bg-white shadow-sm rounded-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <img src={logo} alt="BioSonic Logo" style={{ height: 48 }} />
          <div>
            <h4 className="fw-bold text-primary mb-0">BioSonic Dashboard</h4>
            <small className="text-muted">AI-based chest sound analyzer</small>
          </div>
        </div>
        <div className="text-end">
          <div className="fw-semibold mb-1">
            Welcome,{" "}
            <span className="text-primary">{user?.name || "User"}</span>
          </div>
          <div className="d-flex align-items-center justify-content-end gap-2">
            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Container className="row justify-content-center g-4">
        <div className="col-lg-6">
          {/* File Upload */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="mb-3">Upload Chest Recording</h5>
              <p className="text-muted">
                Only WAV format, 4000 Hz sampling rate
              </p>

              <input
                type="file"
                accept=".wav"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <Button
                variant="outline-primary"
                onClick={() => fileInputRef.current.click()}
              >
                <FaFileUpload className="me-2" />
                {selectedFile ? "Change WAV File" : "Select WAV File"}
              </Button>

              {selectedFile && (
                <div className="mt-3 text-success small">
                  Selected: {selectedFile.name}
                </div>
              )}
              {fileError && (
                <Alert variant="danger" className="mt-3 small py-1">
                  {fileError}
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Patient Form */}
          <Card>
            <Card.Body>
              <Card.Title>Patient Information</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <br />
                  <ToggleButtonGroup
                    type="radio"
                    name="gender"
                    value={gender}
                    onChange={(val) => setGender(val)}
                  >
                    <ToggleButton
                      id="gender-male"
                      value="1,0,0"
                      variant="outline-secondary"
                    >
                      Male
                    </ToggleButton>
                    <ToggleButton
                      id="gender-female"
                      value="0,1,0"
                      variant="outline-primary"
                    >
                      Female
                    </ToggleButton>
                    <ToggleButton
                      id="gender-other"
                      value="0,0,1"
                      variant="outline-secondary"
                    >
                      Other
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Chest Location</Form.Label>
                  <Form.Select value={selectedKey} onChange={handleChestChange}>
                    <option value="">Select Location</option>
                    <option value="0">Anterior Left (A L)</option>
                    <option value="1">Anterior Left Upper (A L U)</option>
                    <option value="2">Anterior Right (A R)</option>
                    <option value="3">Anterior Right Lower (A R L)</option>
                    <option value="4">Anterior Right Middle (A R M)</option>
                    <option value="5">Anterior Right Upper (A R U)</option>
                    <option value="6">Anterior Upper Right (A U R)</option>
                    <option value="7">Lateral Left (L L)</option>
                    <option value="8">Lateral Right (L R)</option>
                    <option value="9">Posterior (P)</option>
                    <option value="10">Posterior Left (P L)</option>
                    <option value="11">
                      Posterior Left Lower & Right (P L L & P R)
                    </option>
                    <option value="12">Posterior Left Lower (P L L)</option>
                    <option value="13">Posterior Left Middle (P L M)</option>
                    <option value="14">Posterior Left Right (P L & P R)</option>
                    <option value="15">Posterior Left Upper (P L U)</option>
                    <option value="16">Posterior Right (P R)</option>
                    <option value="17">Posterior Right Lower (P R L)</option>
                    <option value="18">Posterior Right Middle (P R M)</option>
                    <option value="19">Posterior Right Upper (P R U)</option>
                    <option value="20">Trachea (Tc)</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-100 mb-3"
                >
                  {isSubmitting ? "Analyzing..." : "Analyze Recording"}
                </Button>

                {/* Progress Bar shown during submission */}
                {isSubmitting && (
                  <ProgressBar
                    animated
                    now={100}
                    striped
                    variant="info"
                    className="w-100"
                  />
                )}
              </Form>
            </Card.Body>
          </Card>

          {/* Predictions Output */}
          {predictions && (
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <Card.Title>Top-3 Predictions</Card.Title>
                {Object.entries(predictions).map(([label, score]) => (
                  <p key={label} className="mb-1">
                    <strong>{label}</strong>: {score}
                  </p>
                ))}
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
