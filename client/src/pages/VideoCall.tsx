import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const VideoCall: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    socketRef.current = io('/', { auth: { token } });

    const startCall = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;

        socketRef.current?.emit('join_session', sessionId);

        peerConnection.current = new RTCPeerConnection(iceServers);

        localStream.current.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, localStream.current!);
        });

        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
          setCallStatus('Connected');
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit('webrtc_ice_candidate', { sessionId, candidate: event.candidate });
          }
        };

        socketRef.current?.on('webrtc_offer', async (data: { offer: RTCSessionDescriptionInit }) => {
          await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnection.current?.createAnswer();
          await peerConnection.current?.setLocalDescription(answer);
          socketRef.current?.emit('webrtc_answer', { sessionId, answer });
        });

        socketRef.current?.on('webrtc_answer', async (data: { answer: RTCSessionDescriptionInit }) => {
          await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        socketRef.current?.on('webrtc_ice_candidate', async (data: { candidate: RTCIceCandidateInit }) => {
          await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        // The first person to join might need to initiate the offer
        // In this simple version, we'll let the user manually trigger it or wait for peer
        setCallStatus('Waiting for peer...');
      } catch (err) {
        console.error('Error accessing media devices.', err);
        setCallStatus('Media Error');
      }
    };

    startCall();

    return () => {
      localStream.current?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

  const initiateOffer = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer);
    socketRef.current?.emit('webrtc_offer', { sessionId, offer });
    setCallStatus('Calling...');
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="video-call-page">
      <div className="call-header glass-card">
        <h3>Anonymous Session</h3>
        <span className={`status-badge ${callStatus.toLowerCase().replace(/\s/g, '-')}`}>{callStatus}</span>
      </div>

      <div className="videos-container">
        <div className="remote-video-wrapper glass-card">
          <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
          <div className="remote-label">Therapist</div>
        </div>
        
        <div className="local-video-wrapper glass-card">
          <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
          <div className="local-label">You ({user?.alias})</div>
        </div>
      </div>

      <div className="call-controls glass-card">
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleMute} className={`control-btn ${isMuted ? 'off' : ''}`}>
          {isMuted ? 'Unmute' : 'Mute'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleVideo} className={`control-btn ${isVideoOff ? 'off' : ''}`}>
          {isVideoOff ? 'Start Video' : 'Stop Video'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={initiateOffer} className="control-btn call">
          Connect Peer
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/my-appointments')} className="control-btn end">
          End Call
        </motion.button>
      </div>

      <style>{`
        .video-call-page {
          height: 100vh;
          background: var(--bg-dark);
          display: flex;
          flex-direction: column;
          padding: 2rem;
          gap: 2rem;
          overflow: hidden;
        }
        .call-header {
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-badge {
          padding: 0.3rem 1rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--glass-bg);
          color: var(--primary);
        }
        .status-badge.connected { background: #059669; color: white; }
        .status-badge.media-error { background: #ef4444; color: white; }

        .videos-container {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          position: relative;
          gap: 1.5rem;
        }
        .remote-video-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .remote-video { width: 100%; height: 100%; object-fit: cover; }
        .local-video-wrapper {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 240px;
          height: 180px;
          overflow: hidden;
          z-index: 10;
        }
        .local-video { width: 100%; height: 100%; object-fit: cover; }
        
        .remote-label, .local-label {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          padding: 0.2rem 0.8rem;
          background: rgba(0,0,0,0.5);
          border-radius: 0.5rem;
          font-size: 0.75rem;
        }

        .call-controls {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }
        .control-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 3rem;
          border: none;
          font-weight: 600;
          color: white;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
        }
        .control-btn.off { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; color: #ef4444; }
        .control-btn.call { background: var(--primary); color: var(--bg-dark); }
        .control-btn.end { background: #ef4444; }
      `}</style>
    </div>
  );
};

export default VideoCall;
