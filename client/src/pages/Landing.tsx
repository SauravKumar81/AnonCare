import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      await login();
      navigate('/chat');
    } catch (err) {
      alert('Failed to start anonymous session. Please check your connection.');
    }
  };

  return (
    <div className="landing-page">
      <header className="hero">
        <h1 className="title">AnonCare</h1>
        <p className="subtitle">Heal anonymously. Speak freely. Be heard without judgment.</p>
        <div className="features">
          <div className="feature-card">
            <h3>Anonymous Chat</h3>
            <p>Connect with others using random aliases. No personal data needed.</p>
          </div>
          <div className="feature-card">
            <h3>AI Support</h3>
            <p>Get immediate, 24/7 empathetic basic support from our AI guide.</p>
          </div>
          <div className="feature-card">
            <h3>Verified Therapists</h3>
            <p>Access professional help through secure, anonymous sessions.</p>
          </div>
        </div>
        <button onClick={handleStart} className="start-btn">
          Enter Anonymously
        </button>
      </header>

      <style>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          color: white;
          padding: 2rem;
          text-align: center;
        }
        .title {
          font-size: 4rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          font-size: 1.5rem;
          color: #94a3b8;
          max-width: 600px;
          margin-bottom: 3rem;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin-bottom: 4rem;
        }
        .feature-card {
          background: rgba(30, 41, 59, 0.5);
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.1);
          backdrop-filter: blur(10px);
        }
        .feature-card h3 {
          color: #38bdf8;
          margin-bottom: 0.5rem;
        }
        .feature-card p {
          color: #94a3b8;
        }
        .start-btn {
          background: #38bdf8;
          color: #0f172a;
          padding: 1rem 2.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          border-radius: 3rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .start-btn:hover {
          background: #7dd3fc;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Landing;
