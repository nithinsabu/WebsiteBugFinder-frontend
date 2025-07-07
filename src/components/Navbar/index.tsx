import React from "react";
import { Link } from "react-router-dom"; 
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const email = useSelector((state: RootState) => state.app.email);
    return (
        <nav className="navbar">
        <Link to="/" className="navbar-logo-link">
          <div className="navbar-title">
            <img src="/logo.png" alt="Logo" />
            <h1 className="navbar-heading">Webpage Bug Finder</h1>
          </div>
        </Link>
      
        <div className="navbar-links-container">
          {!email && <Link to="/login" className="navbar-link">Login</Link>}
          {email && <Link to="/upload" className="navbar-link">Find Bug</Link>}
          {email && <Link to="/view-webpages" className="navbar-link">Your Webpages</Link>}
        </div>
      </nav>
    );
};

export default Navbar;
