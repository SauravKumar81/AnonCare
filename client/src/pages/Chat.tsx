import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

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

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAIActive, setIsAIActive] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    socketRef.current = io('/', {
      auth: { token }
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
      // Local addition for AI chat
      const userMessage: Message = {
        _id: Date.now().toString(),
        sender: { _id: user!.id, alias: user!.alias },
        text: messageText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');

      try {
        const { data } = await aiApi.chat(messageText);
        const aiMessage: Message = {
          _id: (Date.now() + 1).toString(),
          sender: { _id: 'ai', alias: 'AI Companion' },
          text: data.reply,
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err: any) {
        console.error('AI chat error', err);
        const errorMessage = err.response?.data?.message || 'AI Support is currently unavailable.';
        alert(errorMessage);
      }
    } else {
      socketRef.current?.emit('send_message', { text: inputText });
      setInputText('');
    }
  };

  return (
    <div className="chat-container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="chat-header glass-card"
      >
        <div className="header-info">
          <h2>Community Support</h2>
          <span className="user-alias">Talking as: <strong>{user?.alias}</strong></span>
        </div>
        <div className="controls">
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isAIActive} 
              onChange={() => setIsAIActive(!isAIActive)} 
            />
            <span className="slider round"></span>
            <span className="label-text">AI Companion</span>
          </label>
        </div>
      </motion.div>

      <div className="messages-list">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg._id} 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`message-wrapper ${msg.sender._id === user?.id ? 'own' : ''} ${msg.isAI ? 'ai' : ''}`}
            >
              <div className="message-info">
                <span className="sender">{msg.sender.alias}</span>
                <span className="time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="message-bubble glass-card">{msg.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSendMessage} 
        className="chat-input-area glass-card"
      >
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isAIActive ? "Ask the AI Companion..." : "Message the community..."}
        />
        <button type="submit" className="send-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </motion.form>

      <style>{`
        .chat-container {
          height: calc(100vh - 70px);
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          gap: 1.5rem;
        }
        .chat-header {
          padding: 1.2rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 1.5rem;
        }
        .header-info h2 { margin: 0; font-size: 1.5rem; color: var(--primary); }
        .user-alias { font-size: 0.85rem; color: var(--text-muted); }
        
        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
        }
        .message-wrapper { max-width: 75%; display: flex; flex-direction: column; }
        .message-wrapper.own { align-self: flex-end; align-items: flex-end; }
        
        .sender { font-size: 0.8rem; color: var(--primary); margin-bottom: 0.3rem; font-weight: 500; }
        .time { font-size: 0.7rem; color: var(--text-muted); margin-left: 0.5rem; }
        
        .message-bubble {
          padding: 1rem 1.4rem;
          border-radius: 1.5rem;
          line-height: 1.5;
          font-size: 0.95rem;
        }
        .own .message-bubble { 
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-radius: 1.5rem 1.5rem 0 1.5rem;
          border: none;
        }
        .ai .message-bubble { 
          border: 1.5px solid var(--accent);
          box-shadow: 0 0 15px rgba(244, 114, 182, 0.2);
        }

        .chat-input-area {
          padding: 0.8rem;
          display: flex;
          gap: 0.8rem;
          border-radius: 4rem;
        }
        .chat-input-area input {
          flex: 1;
          padding: 1rem 1.5rem;
          border-radius: 3rem;
          border: none;
          background: var(--glass-bg);
          color: white;
          outline: none;
        }
        .send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);
        }

        /* Toggle Switch */
        .switch { position: relative; display: flex; align-items: center; gap: 0.8rem; cursor: pointer; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: relative; width: 44px; height: 22px;
          background-color: #334155; transition: .4s; border-radius: 34px;
        }
        .slider:before {
          position: absolute; content: ""; height: 16px; width: 16px;
          left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--accent); }
        input:checked + .slider:before { transform: translateX(22px); }
        .label-text { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default Chat;
