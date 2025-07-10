// src/components/InfoCard.jsx
import { Card } from 'react-bootstrap';
import { FaHeartbeat } from 'react-icons/fa'; // Default icon (optional)

const InfoCard = ({ title, description, icon: Icon = FaHeartbeat }) => {
  return (
    <Card
      className="h-100 border-0 shadow-sm p-3 rounded-4 info-card"
      style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
    >
      <div className="text-center mb-3">
        <Icon size={36} className="text-primary" />
      </div>

      <Card.Body className="text-center">
        <Card.Title className="text-primary fw-bold fs-5 mb-2">{title}</Card.Title>
        <Card.Text className="text-secondary fs-6">
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default InfoCard;
