// src/components/RegisterForm.jsx
import { useState } from 'react';
import { Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', formData);
      setMessage({ type: 'success', text: response.data.message });
      setFormData({ name: '', username: '', email: '', password: '', confirmpassword: '' });
      navigate("/login");

    } catch (error) {
      const errorText =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      setMessage({ type: 'danger', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 shadow rounded-4 bg-white" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h5 className="mb-4 text-center fw-semibold">Create Your Account</h5>

      {message.text && (
        <Alert variant={message.type}>
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
          <InputGroup>
            <InputGroup.Text><FaUser /></InputGroup.Text>
            <Form.Control
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>
        {/* Username */}
        <Form.Group className="mb-3" controlId="formUsername">
          <InputGroup>
            <InputGroup.Text><FaUser /></InputGroup.Text>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3" controlId="formEmail">
          <InputGroup>
            <InputGroup.Text><FaEnvelope /></InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <InputGroup.Text><FaLock /></InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className="mb-4" controlId="formConfirmPassword">
          <InputGroup>
            <InputGroup.Text><FaLock /></InputGroup.Text>
            <Form.Control
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Submit Button */}
        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Create Account'}
          </Button>
        </div>
      </Form>

      <hr className="my-4" />
      <div className="text-center text-muted mb-2">OR</div>

      {/* Login link */}
      <div className="text-center">
        <span className="text-muted">Already have an account? </span>
        <Link to="/login" className="text-primary fw-semibold text-decoration-none">
          Click here to login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
