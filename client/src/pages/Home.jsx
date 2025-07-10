// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import InfoCard from "../components/InfoCard";
import Footer from "../components/Footer";
import {
    FaMicrophoneAlt,
    FaUpload,
    FaHeartbeat,
    FaSlidersH,
    FaHistory,
    FaUserMd
} from 'react-icons/fa';

import { Container, Row, Col } from "react-bootstrap";

const Home = () => {
    return (
        <>
            <Navbar />
            <Carousel />

            <Container className="my-5">
                <Row className="g-4">
                    <Col xs={12} md={6} lg={4}>
                        <InfoCard
                            title="Record Chest Sounds"
                            description="Use the app to record high-quality chest sound data via microphone or Bluetooth stethoscope."
                            icon={FaMicrophoneAlt}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <InfoCard
                            title="Upload WAV Files"
                            description="Upload existing WAV audio files for prediction."
                            icon={FaUpload}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <InfoCard
                            title="Disease Prediction"
                            description="Get top 3 predicted diseases using advanced AI models."
                            icon={FaHeartbeat}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <InfoCard
                            title="Filter Settings"
                            description="Customize audio filters such as bandpass, notch, and more before recording."
                            icon={FaSlidersH}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <InfoCard
                            title="History View"
                            description="View a list of all past predictions and their metadata."
                            icon={FaHistory}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <InfoCard
                            title="Doctor Login"
                            description="Only registered doctors can access and manage patient audio data."
                            icon={FaUserMd}
                        />
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default Home;
