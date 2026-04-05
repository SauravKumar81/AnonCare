import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './FindTherapist.css';

const FindTherapist: React.FC = () => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleCreateAgent = async () => {
    setLoading(true);
    try {
      const { data } = await aiApi.createAgent(description);
      setResult(data);
      setStep(3);
      toast.success('Your personalized agent is ready!', { icon: '✨' });
    } catch (err: any) {
      console.error('Failed to create agent', err);
      const msg = err.response?.data?.message || 'AI Matching service is under maintenance.';
      toast.error(msg, { icon: '🛠️' });
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { label: 'Explore', path: '/chat' },
    { label: 'Community', path: '/find-support' },
    { label: 'Resources', path: '/therapists' },
  ];

  return (
    <div className="fs-page">
      {/* Background */}
      <div className="fs-bg" aria-hidden="true">
        <div className="fs-bg-shape fs-bg-shape-1"></div>
        <div className="fs-bg-shape fs-bg-shape-2"></div>
        <div className="fs-bg-glow"></div>
      </div>

      {/* ===== Top Navigation ===== */}
      <nav className="fs-nav">
        <div className="fs-nav-brand" onClick={() => navigate('/chat')}>
          <span className="fs-brand-name">AnonCare</span>
        </div>
        <div className="fs-nav-links">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href="#"
              className={location.pathname === link.path ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate(link.path); }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="fs-nav-actions">
          <div className="fs-nav-avatar">👤</div>
          <button 
            className="fs-nav-logout" 
            onClick={() => { logout(); navigate('/'); }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <main className="fs-main">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              className="fs-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="fs-heading">Find Your Perfect Support</h1>
              <p className="fs-subtitle">
                Tell us what you're looking for in a therapist. Be as specific as you'd like.
              </p>

              <div className="fs-textarea-wrap">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., I need someone calm who specializes in anxiety and uses mindfulness techniques..."
                  className="fs-textarea"
                />
                <div className="fs-textarea-badge">
                  <span>✨</span> AI Assisted
                </div>
              </div>

              <div className="fs-actions">
                <motion.button
                  disabled={!description.trim() || loading}
                  onClick={handleCreateAgent}
                  className="fs-primary-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-icon">⚙️</span>
                  {loading ? 'Creating your Agent...' : 'Create Custom AI Agent'}
                </motion.button>

                <div className="fs-divider">
                  <span>OR</span>
                </div>

                <button
                  onClick={() => navigate('/therapists')}
                  className="fs-secondary-btn"
                >
                  Browse Professional Therapists
                </button>
              </div>

              <div className="fs-trust-badges">
                <span className="trust-badge">
                  <span className="trust-icon">🔒</span> End-to-End Encrypted
                </span>
                <span className="trust-badge">
                  <span className="trust-icon">🛡️</span> HIPAA Compliant
                </span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="fs-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="fs-success-icon">✨</div>
              <h1 className="fs-heading">Your Custom Agent is Ready!</h1>
              <p className="fs-subtitle">
                We've crafted a personalized AI companion based on your needs.
              </p>

              <div className="fs-persona-card">
                <h3>Persona Summary</h3>
                <p>{result?.persona || 'A compassionate AI companion tailored to your preferences.'}</p>
              </div>

              <div className="fs-actions">
                <motion.button
                  onClick={() => navigate('/chat')}
                  className="fs-primary-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Chatting Now
                </motion.button>
                <button onClick={() => setStep(1)} className="fs-link-btn">
                  ← Refine Persona
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inspirational Quote */}
        <motion.p
          className="fs-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          "Healing is not linear, but it is always possible."
        </motion.p>
      </main>

      {/* ===== Footer ===== */}
      <footer className="fs-footer">
        <div className="fs-footer-inner">
          <div className="fs-footer-left">
            <div className="fs-footer-brand">AnonCare</div>
            <div className="fs-footer-copy">© 2026 AnonCare. Your Sanctuary.</div>
          </div>
          <div className="fs-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#" className="crisis-link">Crisis Support</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FindTherapist;
