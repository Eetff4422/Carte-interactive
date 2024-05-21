// Dans Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
     return (
        <nav className="navbar">
        <ul className="nav-links">
            <li>
            <Link to="/">Accueil</Link>
            </li>
        </ul>
        </nav>
    );
}

export default Navbar;
