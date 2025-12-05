import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Navbar.css'; // Custom styles here

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="navbar navbar-expand-lg gradient-navbar navbar-dark shadow-sm py-2 px-3">
      <Link className="navbar-brand fs-5 fw-bold text-uppercase" to="/">
        <i className="bi bi-journal-text me-2"></i>CMS
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={handleNavCollapse}
        aria-controls="navbarNav"
        aria-expanded={!isNavCollapsed}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse justify-content-between`} id="navbarNav">
        <ul className="navbar-nav">
          {user && (
            <li className="nav-item">
              <Link className="nav-link active" to="/profile">
                <i className="bi bi-person-circle me-1"></i> Profile
              </Link>
            </li>
          )}
        </ul>

        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="text-light me-3">
                <i className="bi bi-person-check me-1"></i>
                Welcome, <strong>{user.name}</strong>
              </span>
              <button
                className="btn btn-outline-light btn-sm rounded-pill"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-outline-light btn-sm rounded-pill me-2"
                to="/login"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Link>
              <Link
                className="btn btn-outline-light btn-sm rounded-pill"
                to="/register"
              >
                <i className="bi bi-person-plus me-1"></i> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
