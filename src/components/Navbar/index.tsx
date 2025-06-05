import React from 'react';
import { Link } from 'react-router-dom'; // or use <a> if no router
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-heading">Webpage Bug Finder</h1>
      <Link to="/login" className="navbar-link">
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
