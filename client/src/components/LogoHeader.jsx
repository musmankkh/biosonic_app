// src/components/LogoHeader.jsx
import { Image } from 'react-bootstrap';
import logo from '../assets/logo.jpg'; // Use your own logo path

const LogoHeader = () => {
  return (
    <div className="text-center mb-4">
      <Image src={logo} alt="BioSonic Logo" width={80} />
      <h4 className="mt-3 fw-bold text-primary">BioSonic Health</h4>
      <p className="text-muted" style={{ fontSize: '0.95rem' }}>
        Precision Diagnostics Through AI
      </p>
    </div>
  );
};

export default LogoHeader;
