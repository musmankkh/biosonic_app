// src/components/Carousel.jsx
import { Carousel } from 'react-bootstrap';
import img1 from '../assets/image5.jpg';
import img2 from '../assets/image7.jpg';
import img3 from '../assets/image6.jpg';

const CustomCarousel = () => {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img1}
          alt="Doctor using stethoscope"
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Welcome to BioSonic</h3>
          <p>Record chest sounds using digital stethoscopes</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img2}
          alt="AI Health Prediction"
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>AI-Based Prediction</h3>
          <p>Top 3 diseases with confidence levels</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img3}
          alt="Doctor consulting"
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Simple & Friendly Interface</h3>
          <p>Senior-friendly and minimal design</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CustomCarousel;
