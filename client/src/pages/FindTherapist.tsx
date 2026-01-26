import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const FindTherapist: React.FC = () => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleCreateAgent = async () => {
    setLoading(true);
    try {
      const { data } = await aiApi.createAgent(description);
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

  return (
    <div className="find-support-page">
      <div className="container glass-card">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="step-content"
            >
              <h1>Find Your Perfect Support</h1>
              <p>Tell us what you're looking for in a therapist. Be as specific as you'd like.</p>
              
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., I need someone calm who specializes in anxiety and uses mindfulness techniques..."
                className="input-textarea"
              />
              
              <div className="actions">
                <button 
                  disabled={!description.trim() || loading}
                  onClick={handleCreateAgent}
                  className="primary-btn"
                >
                  {loading ? 'Creating your Agent...' : 'Create Custom AI Agent'}
                </button>
                <div className="divider">OR</div>
                <button 
                  onClick={() => navigate('/therapists')}
                  className="secondary-btn"
                >
                  Browse Professional Therapists
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="step-content result-step"
            >
              <div className="success-icon">✨</div>
              <h1>Your Custom Agent is Ready!</h1>
              <p>We've crafted a personalized AI companion based on your needs.</p>
              
              <div className="persona-preview glass-card">
                <h3>Persona Summary</h3>
                <p>{result?.persona}</p>
              </div>

              <div className="actions">
                <button 
                  onClick={() => navigate('/chat')}
                  className="primary-btn"
                >
                  Start Chatting Now
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="link-btn"
                >
                  Refine Persona
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .find-support-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent),
                      radial-gradient(circle at bottom left, rgba(232, 121, 249, 0.1), transparent);
        }
        .container {
          max-width: 600px;
          width: 100%;
          padding: 3rem;
          border-radius: 2rem;
          text-align: center;
        }
        h1 { font-size: 2.2rem; margin-bottom: 1rem; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: var(--text-muted); margin-bottom: 2rem; line-height: 1.6; }
        
        .input-textarea {
          width: 100%;
          min-height: 150px;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 1.2rem;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          resize: none;
          margin-bottom: 2rem;
          outline: none;
          transition: border-color 0.3s;
        }
        .input-textarea:focus { border-color: var(--primary); }
        
        .actions { display: flex; flex-direction: column; gap: 1rem; }
        
        .primary-btn {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 1.2rem;
          border-radius: 1rem;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(56, 189, 248, 0.3); }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding: 1.2rem;
          border-radius: 1rem;
          border: 1px solid var(--glass-border);
          font-weight: 600;
          cursor: pointer;
        }
        .secondary-btn:hover { background: rgba(255, 255, 255, 0.1); }

        .divider { margin: 0.5rem 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }

        .success-icon { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
        
        .persona-preview {
          padding: 1.5rem;
          text-align: left;
          margin-bottom: 2rem;
          background: rgba(56, 189, 248, 0.05);
          border-color: rgba(56, 189, 248, 0.2);
        }
        .persona-preview h3 { font-size: 0.9rem; color: var(--primary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .persona-preview p { font-size: 0.95rem; margin-bottom: 0; }

        .link-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default FindTherapist;
