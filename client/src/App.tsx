import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import TherapistList from './pages/TherapistList';
import FindTherapist from './pages/FindTherapist';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import VideoCall from './pages/VideoCall';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
            },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/therapists" 
            element={
              <ProtectedRoute>
                <TherapistList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/find-support" 
            element={
              <ProtectedRoute>
                <FindTherapist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/book/:id" 
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-appointments" 
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/call/:sessionId" 
            element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
