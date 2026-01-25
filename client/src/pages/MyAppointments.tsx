import React, { useEffect, useState } from 'react';
import api from '../api';

interface Appointment {
  _id: string;
  therapist: {
    name: string;
  };
  startTime: string;
  status: string;
  sessionLink?: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/therapists/my-appointments');
        setAppointments(data);
      } catch (err) {
        console.error('Failed to fetch appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <div className="loading">Loading sessions...</div>;

  return (
    <div className="appointments-page">
      <h1>My Scheduled Sessions</h1>
      
      {appointments.length === 0 ? (
        <p className="no-data">You have no upcoming sessions.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map(a => (
            <div key={a._id} className="appointment-card">
              <div className="info">
                <h3>Session with {a.therapist.name}</h3>
                <p>{new Date(a.startTime).toLocaleString()}</p>
                <span className={`status ${a.status}`}>{a.status}</span>
              </div>
              {a.status === 'confirmed' && (
                <button className="join-btn">Join Call</button>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .appointments-page {
          padding: 2rem;
          min-height: 100vh;
          background: #0f172a;
          color: white;
        }
        h1 { text-align: center; color: #38bdf8; margin-bottom: 3rem; }
        .appointment-list {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .appointment-card {
          background: #1e293b;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #334155;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 0.3rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }
        .status.confirmed { background: #059669; color: white; }
        .status.pending { background: #d97706; color: white; }
        .join-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
        }
        .no-data { text-align: center; color: #94a3b8; }
        .loading { text-align: center; padding: 5rem; color: #38bdf8; }
      `}</style>
    </div>
  );
};

export default MyAppointments;
