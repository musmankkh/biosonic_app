// src/components/Footer.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-5">
      <Container>
        <Row className="text-center text-md-start">
          {/* About Section */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">BioSonic</h5>
            <p style={{ fontSize: '0.95rem' }}>
              BioSonic is a precision diagnostics platform powered by AI. We help healthcare professionals detect diseases through chest sound analysis.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
              <li><Link to="/register" className="text-white text-decoration-none">Register</Link></li>
              <li><Link to="/login" className="text-white text-decoration-none">Login</Link></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Contact</h5>
            <p style={{ fontSize: '0.95rem' }}>
              Email: support@biosonic.com<br />
              Phone: +92 123 456 7890<br />
              Location: Lahore, Pakistan
            </p>
          </Col>
        </Row>

        <hr className="border-white opacity-50" />

        <p className="text-center text-white-50 py-3 mb-0">
          © {new Date().getFullYear()} BioSonic. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
