import React from "react";
import { Link } from "react-router-dom"; // or use <a> if no router
import "./Navbar.css";

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-title">
            <img src="/logo.png" /> 
                <h1 className="navbar-heading">Webpage Bug Finder</h1>    
            </div>

            <div className="navbar-links-container">
                <Link to="/login" className="navbar-link">
                    Login
                </Link>
                <Link to="/upload" className="navbar-link">
                    Find Bug
                </Link>
                <Link to="/view-webpages" className="navbar-link">
                    Your Webpages
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
