import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './MyAppointments.css';

interface Appointment {
  _id: string;
  therapist: {
    _id: string;
    name: string;
    specialization: string;
  };
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/therapists/my-appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    
    try {
      await api.put(`/therapists/cancel/${id}`);
      toast.success('Session cancelled');
      fetchAppointments();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to cancel session';
      toast.error(msg);
    }
  };

  const isUpcoming = (date: string) => new Date(date) > new Date();

  const upcomingSessions = appointments.filter(a => isUpcoming(a.startTime) && a.status !== 'cancelled' && a.status !== 'completed');
  const pastSessions = appointments.filter(a => !isUpcoming(a.startTime) || a.status === 'cancelled' || a.status === 'completed');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
    };
  };

  if (loading) return (
    <div className="loading-screen">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="loader"
      />
      <p>Loading your sessions...</p>
    </div>
  );

  const SessionCard = ({ appointment, upcoming }: { appointment: Appointment, upcoming: boolean }) => {
    const { day, month, time, full } = formatDate(appointment.startTime);
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="session-card glass-card"
      >
        <div className="session-main">
          <div className="date-box">
            <span className="day">{day}</span>
            <span className="month">{month}</span>
          </div>
          <div className="session-info">
            <div className="session-header">
              <h3>Session with {appointment.therapist.name}</h3>
              <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
            </div>
            <p className="full-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {full} at {time}
            </p>
          </div>
        </div>

        <div className="session-actions">
          {upcoming && appointment.status === 'confirmed' && (
            <button 
              onClick={() => navigate(`/call/${appointment._id}`)} 
              className="btn-premium btn-join"
            >
              Join Call
            </button>
          )}
          {upcoming && appointment.status !== 'cancelled' && (
            <button 
              onClick={() => handleCancel(appointment._id)} 
              className="btn-premium btn-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="appointments-page">
      <div className="max-width-container">
        <header className="page-header">
          <h1>My Sessions</h1>
          <p>Manage your professional support appointments</p>
        </header>

        <main className="sessions-content">
          <section className="sessions-section">
            <h2>Upcoming Sessions</h2>
            {upcomingSessions.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming sessions scheduled.</p>
                <Link to="/therapists" className="browse-btn">Browse Therapists</Link>
              </div>
            ) : (
              <div className="sessions-grid">
                <AnimatePresence>
                  {upcomingSessions.map(a => <SessionCard key={a._id} appointment={a} upcoming={true} />)}
                </AnimatePresence>
              </div>
            )}
          </section>

          {pastSessions.length > 0 && (
            <section className="sessions-section past">
              <h2>Recent & Cancelled</h2>
              <div className="sessions-grid">
                <AnimatePresence>
                  {pastSessions.map(a => <SessionCard key={a._id} appointment={a} upcoming={false} />)}
                </AnimatePresence>
              </div>
            </section>
          )}
        </main>
      </div>

      <style>{`
        .loading-screen {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          color: var(--primary);
        }
        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(56, 189, 248, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
        }
        .session-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.3rem; }
        .full-date { color: var(--text-muted); opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default MyAppointments;
