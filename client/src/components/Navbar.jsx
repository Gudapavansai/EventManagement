import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <div className="logo-icon">
                        <FaCalendarAlt size={20} />
                    </div>
                    <span className="logo-text">
                        <span style={{ color: 'var(--primary-color)' }}>BellCrop</span> <span style={{ color: 'var(--text-secondary)' }}>Studio</span>
                    </span>
                </Link>

                <div className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
                        onClick={closeMenu}
                    >
                        Browse Events
                    </NavLink>
                    
                    {user ? (
                        <>
                            <NavLink 
                                to="/dashboard" 
                                className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}
                                onClick={closeMenu}
                            >
                                Dashboard
                            </NavLink>
                            <div className="nav-divider"></div>
                            <div className="user-profile-menu">
                                <span className="user-name">
                                    <FaUserCircle size={18} /> {user.name}
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                             <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>Login</Link>
                             <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
