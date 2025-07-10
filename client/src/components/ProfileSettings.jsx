import React, { useEffect, useState } from "react";
import { Card, Button, Container, Spinner } from "react-bootstrap";
import {
  FaEnvelope,
  FaSignOutAlt,
  FaUserMd,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 

        const res = await axios.get("http://localhost:8080/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="text-center mb-4">
        <div
          className="rounded-circle bg-light p-3 position-relative"
          style={{ width: 100, height: 100 }}
        >
          <FaUserMd size={60} />
          <FaCheckCircle
            className="text-primary position-absolute"
            style={{ bottom: 5, right: 5 }}
          />
        </div>
        <h4 className="mt-3 fw-bold">DR. {user.name}</h4>
        <p className="text-muted mb-1">Username: {user.username}</p>
      </div>

      <Card className="w-100" style={{ maxWidth: 400 }}>
        <Card.Body className="text-start">
          <div className="mb-3 d-flex align-items-center gap-2">
            <FaEnvelope className="text-secondary" />
            <span>{user.email}</span>
          </div>
        </Card.Body>
      </Card>

      <Button
        variant="danger"
        className="mt-4 w-100"
        style={{ maxWidth: 400 }}
        onClick={handleLogout}
      >
        <FaSignOutAlt className="me-2" />
        Log Out
      </Button>

      <div className="text-muted mt-3">BioSonic App v1.0.0</div>
    </Container>
  );
};

export default ProfileSettings;
