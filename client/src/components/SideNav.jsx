// src/components/SideNav.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaHistory, FaCog } from 'react-icons/fa';

const SideNav = () => {
  return (
    <Nav className="flex-column text-center pt-4">
      <Nav.Link as={NavLink} to="/dashboard" className="py-3">
        <FaHome size={20} /><br />Home
      </Nav.Link>
      <Nav.Link as={NavLink} to="/dashboard/history" className="py-3">
        <FaHistory size={20} /><br />History
      </Nav.Link>
      <Nav.Link as={NavLink} to="/dashboard/settings" className="py-3">
        <FaCog size={20} /><br />Settings
      </Nav.Link>
    </Nav>
  );
};

export default SideNav;
