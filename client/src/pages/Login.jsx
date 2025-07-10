// src/pages/Login.jsx
import Navbar from "../components/Navbar";
import LogoHeader from "../components/LogoHeader";
import LoginForm from "../components/LoginForm";
import { Container } from "react-bootstrap";

const Login = () => {
  return (
    <>
      <Navbar />
      <Container className="py-5">
        <LogoHeader />
        <LoginForm />
      </Container>
    </>
  );
};

export default Login;
