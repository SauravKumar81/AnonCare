import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
        response: err.response?.data,
        status: err.response?.status
      });
      alert('Failed to start anonymous session. Check console for details or ensure your server is running.');
    }
  };

  return (
    <div className="landing-page">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero"
      >
        <h1 className="title gradient-text">AnonCare</h1>
        <p className="subtitle">Heal anonymously. Speak freely. Be heard without judgment.</p>
        
        <div className="features">
          {[
            { title: 'Anonymous Chat', desc: 'Connect with others using random aliases. No personal data needed.', icon: '💬' },
            { title: 'AI Support', desc: 'Get immediate, 24/7 empathetic basic support from our AI guide.', icon: '🤖' },
            { title: 'Verified Therapists', desc: 'Access professional help through secure, anonymous sessions.', icon: '🎓' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="feature-card glass-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart} 
          className="start-btn pulse"
        >
          Enter Anonymously
        </motion.button>
      </motion.header>

      <style>{`
        .landing-page {
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg-dark);
        }
        .bg-blobs {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
        }
        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          filter: blur(100px);
          opacity: 0.15;
          border-radius: 50%;
        }
        .blob-1 { top: -100px; left: -100px; }
        .blob-2 { bottom: -100px; right: -100px; background: var(--accent); }
        
        .hero { z-index: 1; max-width: 1100px; width: 100%; text-align: center; }
        .title { font-size: 5rem; font-weight: 800; margin-bottom: 1rem; }
        .subtitle { font-size: 1.4rem; color: var(--text-muted); margin-bottom: 4rem; }
        
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }
        .feature-card { padding: 2rem; border-radius: 2rem; }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .feature-card h3 { color: var(--primary); margin-bottom: 1rem; font-size: 1.5rem; }
        
        .start-btn {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 1.2rem 3.5rem;
          font-size: 1.4rem;
          font-weight: 700;
          border-radius: 4rem;
          border: none;
          box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.4);
          cursor: pointer;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }
        .pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
};

export default Landing;
