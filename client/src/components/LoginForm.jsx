// src/components/LoginForm.jsx
import { useState } from "react";
import { Form, Button, InputGroup, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        login(data.user);
     

        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 shadow rounded-4 bg-white"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <h5 className="mb-4 text-center fw-semibold">Login to Your Account</h5>

      <Form onSubmit={handleSubmit}>
        {/* Email */}
        <Form.Group className="mb-3" controlId="formEmail">
          <InputGroup>
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Error Alert */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Login Button */}
        <div className="d-grid mb-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </div>
      </Form>

      {/* Register Link */}
      <div className="text-center">
        <span className="text-muted">Don't have an account? </span>
        <Link
          to="/register"
          className="text-primary fw-semibold text-decoration-none"
        >
          Create one
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
