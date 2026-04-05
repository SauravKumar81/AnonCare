import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Landing.css';

const Landing: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      await login();
      navigate('/chat');
    } catch (err: any) {
      console.error('Login Error Details:', {
        message: err.message,
        response: err?.response?.data,
        status: err?.response?.status
      });
      alert('Failed to start anonymous session. Check console for details or ensure your server is running.');
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="ambient-background">
        <div className="ambient-spotlight"></div>
      </div>

      <nav className="landing-nav">
        <div className="nav-brand-landing">AnonCare</div>
        <div className="nav-actions">
          <button className="nav-login-btn" onClick={handleStart}>Login</button>
          <button className="nav-cta-btn" onClick={handleStart}>Get Started</button>
        </div>
      </nav>

      <main className="landing-main">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-content">
            <span className="badge">Now Open to Everyone</span>
            <h1 className="hero-title">
              Your Safe Space to <span className="gradient-text-accent">Heal.</span>
            </h1>
            <p className="hero-subtitle">
              AnonCare is a unified platform for anonymous support. Chat with community members, get 24/7 AI guidance, or connect with verified therapists — completely judgment-free and identity-protected.
            </p>
            <div className="hero-cta-group">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart} 
                className="hero-start-btn pulse-glow"
              >
                Start Anonymously Now
              </motion.button>
              <button className="hero-secondary-btn" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="glow-sphere main-glow"></div>
          <div className="glow-sphere secondary-glow"></div>
          <div className="app-mockup">
            <div className="mockup-header">
              <div className="window-controls">
                <span className="dot close"></span>
                <span className="dot minimize"></span>
                <span className="dot expand"></span>
              </div>
              <div className="window-title">AnonCare Workspace</div>
            </div>
            <div className="mockup-body">
              <img src="/beeper.webp" alt="AnonCare Unified Chat" className="hero-app-image" />
              <div className="mockup-glass-overlay"></div>
            </div>
          </div>
        </motion.div>

        <section id="features" className="features-section">
          <div className="features-header">
            <h2>Everything you need, in one safe space.</h2>
            <p>Designed for absolute privacy. Find exactly the help you need when you need it.</p>
          </div>
          
          <div className="bento-grid">
            <div className="bento-card col-span-2">
               <div className="bento-content">
                 <div className="bento-icon">💬</div>
                 <h3>Anonymous Community</h3>
                 <p>Connect with peers who understand what you're going through. Auto-generated aliases ensure your identity is always protected.</p>
               </div>
               <div className="bento-bg bento-gradient-1"></div>
            </div>
            
            <div className="bento-card">
               <div className="bento-content">
                 <div className="bento-icon">🤖</div>
                 <h3>AI Companion</h3>
                 <p>Available 24/7. Our empathetic AI guide is here to listen and help ground you during difficult moments.</p>
               </div>
               <div className="bento-bg bento-gradient-2"></div>
            </div>

            <div className="bento-card">
               <div className="bento-content">
                 <div className="bento-icon">🛡️</div>
                 <h3>Zero Knowledge</h3>
                 <p>We don't collect your data. Everything routing through AnonCare is end-to-end encrypted and stripped of PII.</p>
               </div>
               <div className="bento-bg bento-gradient-3"></div>
            </div>

            <div className="bento-card col-span-2">
               <div className="bento-content">
                 <div className="bento-icon">👩‍⚕️</div>
                 <h3>Verified Professionals</h3>
                 <p>Ready for the next step? Connect securely over voice or video with licensed therapists safely within our platform.</p>
               </div>
               <div className="bento-bg bento-gradient-4"></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="brand-footer">AnonCare</div>
          <div className="copyright">© 2026 AnonCare. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
