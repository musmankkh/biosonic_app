// src/components/Navbar.jsx
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Still using custom hover styles for nav links

const CustomNavbar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          BioSonic
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="biosonic-navbar" />
        <Navbar.Collapse id="biosonic-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="custom-nav-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="custom-nav-link">About</Nav.Link>

            {/* Register Button */}
            <Button
              as={Link}
              to="/login"
              variant="light"
              size="sm"
              className="ms-3 fw-semibold text-primary"
              style={{ borderRadius: '5px' }}
            >
              Login
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
