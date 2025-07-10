// src/pages/Register.jsx
import Navbar from "../components/Navbar";
import LogoHeader from "../components/LogoHeader";
import RegisterForm from "../components/RegisterForm";
import { Container } from "react-bootstrap";

const Register = () => {
    return (
        <>
            <Navbar />
            <Container className="py-5">
                <LogoHeader />
                <RegisterForm />
            </Container>
        </>
    );
};

export default Register;
