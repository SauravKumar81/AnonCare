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
        status: err?.response?.status,
      });
      alert('Failed to start anonymous session. Check console for details or ensure your server is running.');
    }
  };

  return (
    <div className="lp">
      {/* ===== Background Geometry ===== */}
      <div className="lp-bg-shapes" aria-hidden="true">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-glow"></div>
      </div>

      {/* ===== Top Navigation ===== */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <span className="brand-dot"></span>
          <span className="brand-name">AnonCare</span>
        </div>
        <div className="lp-nav-links">
          <a href="#sanctuary">Explore</a>
          <a href="#features">Community</a>
          <a href="#footer">Resources</a>
        </div>
        <div className="lp-nav-actions">
          <div className="lp-nav-avatar">👤</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lp-nav-cta"
            onClick={handleStart}
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="lp-hero">
        <motion.div
          className="hero-inner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="hero-badge">
            <span className="badge-icon">🔒</span>
            <span>100% Anonymous</span>
          </div>

          <h1 className="hero-headline">
            You don't have to{' '}
            <span className="hero-headline-accent">face this alone.</span>
          </h1>

          <p className="hero-description">
            A sanctuary of shadows for your mind. Speak freely, breathe deeply,
            and find your way back to yourself in total anonymity.
          </p>

          <motion.button
            className="hero-cta"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
          >
            Begin Your Journey
          </motion.button>

          <div className="hero-available-badge">
            <span className="available-dot"></span>
            <span>Available 24/7</span>
          </div>
        </motion.div>
      </section>

      {/* ===== Sanctuary Section ===== */}
      <section id="sanctuary" className="lp-sanctuary">
        <motion.div
          className="sanctuary-inner"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="sanctuary-text">
            <span className="section-label">Your Sanctuary</span>
            <h2 className="sanctuary-heading">
              A space where silence finds its voice.
            </h2>
            <p className="sanctuary-desc">
              Our platform is designed to be the lowest sensory pressure
              environment. No loud colors, no judgmental counters, just a direct
              line to peace.
            </p>
            <a href="#features" className="sanctuary-link">
              Discover the Journaling Experience →
            </a>
          </div>
          <div className="sanctuary-card">
            <div className="breath-pacer-card">
              <div className="pacer-icon">🧘</div>
              <h3 className="pacer-title">The Breath Pacer</h3>
              <p className="pacer-desc">
                Use our built-in guided breathing visual to ground yourself
                before entering a session.
              </p>
              <div className="pacer-circle-wrap">
                <div className="pacer-circle">
                  <div className="pacer-ring"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="lp-features">
        <motion.div
          className="features-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {[
            {
              icon: '📓',
              title: 'Ephemeral Journaling',
              desc: 'Write your thoughts and let them dissolve into the shadows, or choose to keep them locked in your local vault.',
            },
            {
              icon: '👥',
              title: 'Shadow Circles',
              desc: 'Join anonymous peer-led sessions where experiences are shared without names or labels.',
            },
            {
              icon: '💜',
              title: 'Proactive Safety',
              desc: 'AI-enhanced monitoring that suggests crisis support instantly if you\'re in distress, without storing your data.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-tile"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <div className="feature-tile-icon">{feature.icon}</div>
              <h3 className="feature-tile-title">{feature.title}</h3>
              <p className="feature-tile-desc">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== Footer ===== */}
      <footer id="footer" className="lp-footer">
        <div className="footer-inner">
          <div className="footer-brand">AnonCare</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#" className="footer-crisis">Crisis Support</a>
          </div>
          <div className="footer-copy">
            © 2026 AnonCare. A Sanctuary of Shadows.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
