import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaUserMd, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <FaCalendarAlt className="brand-icon" />
          <span>DocScheduler</span>
        </Link>
      </div>

      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link btn-primary">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">
              <FaHome /> Dashboard
            </Link>

            {user.role === 'ROLE_PATIENT' && (
              <>
                <Link to="/doctors" className="nav-link">
                  <FaUserMd /> Find Doctors
                </Link>
                <Link to="/my-appointments" className="nav-link">
                  <FaCalendarAlt /> My Appointments
                </Link>
                <Link to="/patient/profile" className="nav-link">
                  Profile
                </Link>
              </>
            )}

            {user.role === 'ROLE_DOCTOR' && (
              <>
                <Link to="/doctor/profile" className="nav-link">Profile</Link>
                <Link to="/doctor/slots" className="nav-link">Manage Slots</Link>
                <Link to="/doctor/appointments" className="nav-link">Appointments</Link>
              </>
            )}

            <div className="nav-user">
              <span className="user-name">{user.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
