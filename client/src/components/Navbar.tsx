import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const hideNavbarRoutes = ['/', '/chat', '/find-support'];
  if (!user || hideNavbarRoutes.includes(location.pathname)) return null;

  const links = [
    { name: 'Community Chat', path: '/chat' },
    { name: 'Find Support', path: '/find-support' },
    { name: 'My Sessions', path: '/my-appointments' },
  ];

  return (
    <nav className="navbar glass-card">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="nav-brand"
      >
        <Link to="/" className="gradient-text">AnonCare</Link>
      </motion.div>
      <div className="nav-links">
        {links.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.name}
            {location.pathname === link.path && (
              <motion.div 
                layoutId="nav-underline" 
                className="underline" 
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        ))}
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 2.5rem;
          margin: 1rem 1.5rem;
          border-radius: 4rem;
          position: sticky;
          top: 1rem;
          z-index: 1000;
        }
        .nav-brand a {
          font-size: 1.6rem;
          font-weight: 800;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        .nav-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          position: relative;
          padding: 0.5rem 0;
          transition: color 0.3s;
        }
        .nav-links a:hover, .nav-links a.active { color: var(--primary); }
        .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
        }
        .logout-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 0.5rem 1.2rem;
          border-radius: 2rem;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .logout-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }
      `}</style>
    </nav>
  );
};

export default Navbar;
