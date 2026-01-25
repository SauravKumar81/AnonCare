import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';

const BookAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [step, setStep] = useState(1); // 1: Select Time, 2: Payment
  const [loading, setLoading] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour session

      await api.post('/therapists/book', {
        therapistId: id,
        startTime,
        endTime
      });

      alert('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (err) {
      console.error('Booking failed', err);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="booking-card glass-card"
      >
        <div className="stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {step === 1 ? (
          <>
            <h2>Schedule Session</h2>
            <p>Select a time for your anonymous support session.</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="input-group">
                <label>Select Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="input-group">
                <label>Select Time</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="confirm-btn">Proceed to Payment</button>
            </form>
          </>
        ) : (
          <>
            <h2>Complete Payment</h2>
            <p>Securely pay for your session. All transactions are private.</p>
            <div className="payment-simulation">
              <div className="card-mockup">
                <div className="card-chip"></div>
                <div className="card-number">**** **** **** 4242</div>
                <div className="card-holder">ANONYMOUS USER</div>
              </div>
              <div className="payment-details">
                <div className="price-row">
                  <span>Session Fee</span>
                  <span>$50.00</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>$50.00</span>
                </div>
              </div>
            </div>
            <button onClick={handleBook} disabled={loading} className="confirm-btn">
              {loading ? 'Processing...' : 'Pay & Confirm Booking'}
            </button>
            <button onClick={() => setStep(1)} className="back-btn">Back</button>
          </>
        )}
      </motion.div>

      <style>{`
        .booking-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .booking-card {
          padding: 3rem;
          max-width: 450px;
          width: 100%;
          text-align: center;
        }
        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .step-item {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .step-item.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .step-line { width: 50px; height: 1px; background: var(--glass-border); }
        
        h2 { color: var(--primary); margin-bottom: 0.5rem; font-size: 2rem; }
        p { color: var(--text-muted); margin-bottom: 2.5rem; }
        
        .input-group { margin-bottom: 1.5rem; text-align: left; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--primary); font-weight: 600; }
        input {
          width: 100%;
          padding: 1rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 1rem;
          color: white;
          outline: none;
        }
        
        .confirm-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 1.1rem;
          margin-top: 1rem;
          box-shadow: 0 10px 20px -5px rgba(56, 189, 248, 0.4);
        }
        .back-btn {
          background: transparent;
          color: var(--text-muted);
          border: none;
          margin-top: 1rem;
          font-weight: 600;
        }

        .card-mockup {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          padding: 2rem;
          border-radius: 1rem;
          text-align: left;
          margin-bottom: 2rem;
          border: 1px solid var(--glass-border);
        }
        .card-chip { width: 40px; height: 30px; background: #fbbf24; border-radius: 0.4rem; margin-bottom: 1.5rem; opacity: 0.8; }
        .card-number { font-size: 1.25rem; letter-spacing: 2px; margin-bottom: 1rem; }
        .card-holder { font-size: 0.7rem; color: #64748b; }
        
        .price-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #94a3b8; }
        .price-row.total { border-top: 1px solid var(--glass-border); padding-top: 0.5rem; margin-top: 0.5rem; color: white; font-weight: bold; font-size: 1.1rem; }
      `}</style>
    </div>
  );
};

export default BookAppointment;
