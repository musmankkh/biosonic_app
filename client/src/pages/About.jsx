// src/pages/About.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaStethoscope, FaBrain, FaShieldAlt } from "react-icons/fa";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-primary fw-bold mb-3 text-center">About BioSonic</h2>
          <p className="fs-5 text-secondary text-center mb-4">
            Transforming healthcare with AI-powered chest sound diagnostics.
          </p>

          <p className="fs-6 text-dark">
            <strong>BioSonic</strong> is a healthcare-focused application that simplifies chest disease diagnosis through advanced audio signal processing and machine learning.
            With BioSonic, healthcare professionals can either record chest sounds using a digital stethoscope or upload WAV audio files for analysis. Once metadata like age,
            gender, and chest location is added, the app communicates with a backend API to predict the top 3 potential diseases — with confidence scores.
          </p>

          <p className="fs-6 text-dark mt-3">
            The app is designed to be intuitive and senior-friendly, offering real-time waveform visualization, filter configuration (e.g., notch, bandpass), and history tracking.
            It ensures secure data handling, supports Firebase authentication, and integrates with Bluetooth stethoscopes via the Eko SDK.
          </p>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h4 className="text-center text-primary fw-bold mb-4">Core Features</h4>
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="border-0 shadow h-100">
              <Card.Body>
                <FaStethoscope size={36} className="text-primary mb-3" />
                <Card.Title>Audio Recording</Card.Title>
                <Card.Text>
                  Record chest sounds using Bluetooth stethoscopes or upload WAV files for diagnostic prediction.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow h-100">
              <Card.Body>
                <FaBrain size={36} className="text-primary mb-3" />
                <Card.Title>AI-Based Prediction</Card.Title>
                <Card.Text>
                  Send audio and patient metadata to an AI model that predicts the top 3 diseases with confidence percentages.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow h-100">
              <Card.Body>
                <FaShieldAlt size={36} className="text-primary mb-3" />
                <Card.Title>Secure & Simple</Card.Title>
                <Card.Text>
                  Designed with privacy in mind using secure authentication and a clean, senior-accessible UI.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default About;
