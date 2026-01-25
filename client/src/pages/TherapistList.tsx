import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Therapist {
  _id: string;
  name: string;
  specialization: string[];
  bio: string;
  hourlyRate: number;
}

const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const { data } = await api.get('/therapists');
        setTherapists(data);
      } catch (err) {
        console.error('Failed to fetch therapists', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="loader"
      />
      <p>Finding the right support for you...</p>
    </div>
  );

  return (
    <div className="therapist-list-page">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="gradient-text">Verified Professionals</h1>
        <p className="subtitle">Choose a therapist who resonates with your journey.</p>
      </motion.header>

      <div className="therapist-grid">
        {therapists.map((t, i) => (
          <motion.div 
            key={t._id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="therapist-card glass-card"
          >
            <div className="card-content">
              <h3>{t.name}</h3>
              <div className="specialties">
                {t.specialization.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
              <p className="bio">{t.bio}</p>
            </div>
            <div className="card-footer">
              <div className="pricing">
                <span className="amount">${t.hourlyRate}</span>
                <span className="unit">/session</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/book/${t._id}`)} 
                className="book-btn"
              >
                Schedule Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .therapist-list-page { padding: 4rem 2rem; min-height: 100vh; }
        header { text-align: center; margin-bottom: 5rem; }
        header h1 { font-size: 3.5rem; margin-bottom: 1rem; }
        .subtitle { color: var(--text-muted); font-size: 1.2rem; }
        
        .therapist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .therapist-card {
          display: flex;
          flex-direction: column;
          padding: 2.5rem;
          transition: transform 0.3s ease;
        }
        .therapist-card:hover { transform: translateY(-10px); }
        
        .card-content h3 { font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-main); }
        .specialties { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .tag {
          background: var(--glass-bg);
          color: var(--primary);
          padding: 0.3rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          border: 1px solid var(--glass-border);
          font-weight: 600;
        }
        .bio { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; margin-bottom: 2rem; }
        
        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }
        .amount { font-size: 2rem; font-weight: 800; color: var(--primary); }
        .unit { color: var(--text-muted); font-size: 0.9rem; margin-left: 0.3rem; }
        
        .book-btn {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 1rem 1.8rem;
          border-radius: 1rem;
          border: none;
          font-weight: bold;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
        }

        .loading-container {
          height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .loader {
          width: 50px;
          height: 50px;
          border: 4px solid var(--glass-border);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default TherapistList;
