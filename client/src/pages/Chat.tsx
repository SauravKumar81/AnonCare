import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Chat.css';

interface Message {
  _id: string;
  sender: {
    _id: string;
    alias: string;
  };
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

const MOODS = [
  { emoji: '😔', label: 'Low' },
  { emoji: '😟', label: 'Anxious' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Better' },
  { emoji: '😊', label: 'Good' },
];

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAIActive, setIsAIActive] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket']
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socketRef.current.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isAIActive) {
      const messageText = inputText;
      const userMessage: Message = {
        _id: Date.now().toString(),
        sender: { _id: user!.id, alias: user!.alias },
        text: messageText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsTyping(true);

      try {
        const { data } = await aiApi.chat(messageText);
        setIsTyping(false);
        const aiMessage: Message = {
          _id: (Date.now() + 1).toString(),
          sender: { _id: 'ai', alias: 'Sanctuary AI' },
          text: data.reply,
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err: any) {
        setIsTyping(false);
        console.error('AI chat error', err);
        const errorMessage = err.response?.data?.message || 'AI Support is currently unavailable.';
        toast.error(errorMessage, { icon: '🛠️', duration: 4000 });
        setMessages(prev => prev.filter(m => m._id !== userMessage._id));
      }
    } else {
      socketRef.current?.emit('send_message', { text: inputText });
      setInputText('');
    }
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();

  return (
    <div className="chat-sanctuary">
      {/* ===== Top Navigation ===== */}
      <nav className="sanctuary-topnav">
        <div className="topnav-brand" onClick={() => navigate('/')}>AnonCare</div>
        <div className="topnav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); }}>Explore</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/find-support'); }}>Community</a>
          <a href="#" onClick={(e) => { e.preventDefault(); }}>Resources</a>
        </div>
        <div className="topnav-actions">
          <div className="topnav-avatar">👤</div>
          <button className="topnav-logout-btn" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </nav>

      {/* ===== Chat Content ===== */}
      <main className="sanctuary-chat-main">
        <div className="chat-journey-label">
          <span>Today's Journey</span>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle-container">
          <div className="mode-toggle">
            <button
              className={`mode-btn ${isAIActive ? 'active' : ''}`}
              onClick={() => setIsAIActive(true)}
            >
              ✨ AI Session
            </button>
            <button
              className={`mode-btn ${!isAIActive ? 'active' : ''}`}
              onClick={() => setIsAIActive(false)}
            >
              👥 Community
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="msg-row"
            >
              <div className="msg-avatar ai-avatar">✨</div>
              <div className="msg-body">
                <div className="msg-bubble ai-bubble">
                  Good evening. I've noticed you've been carrying a lot lately. 
                  This space is here for whatever you need to release. How is your 
                  heart feeling in this moment?
                </div>
                <div className="msg-meta">
                  <span className="meta-sender">Sanctuary AI</span>
                  <span>•</span>
                  <span>{formatTime(new Date())}</span>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`msg-row ${msg.sender._id === user?.id ? 'user-msg' : ''}`}
              >
                {msg.isAI && (
                  <div className="msg-avatar ai-avatar">✨</div>
                )}
                <div className="msg-body">
                  <div className={`msg-bubble ${msg.isAI ? 'ai-bubble' : msg.sender._id === user?.id ? 'user-bubble' : 'ai-bubble'}`}>
                    {msg.text}
                  </div>
                  <div className="msg-meta">
                    {msg.isAI && <span className="meta-sender">{msg.sender.alias}</span>}
                    {msg.isAI && <span>•</span>}
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.sender._id === user?.id && (
                      <span className="meta-read">Read</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="typing-indicator">
              <div className="msg-avatar ai-avatar" style={{ width: 30, height: 30, fontSize: '0.75rem' }}>✨</div>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Mood Selector */}
        <div className="mood-selector">
          <div className="mood-selector-inner">
            {MOODS.map((mood, i) => (
              <button
                key={mood.label}
                className={`mood-option ${selectedMood === i ? 'selected' : ''}`}
                onClick={() => setSelectedMood(i)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form className="sanctuary-input-area" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Journal your thoughts here..."
            />
            <button type="button" className="input-attach-btn" title="Attach">
              🔗
            </button>
            <button type="submit" className="input-send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
          <div className="input-privacy-notice">
            Your thoughts are private and encrypted in the sanctuary.
          </div>
        </form>
      </main>
    </div>
  );
};

export default Chat;
