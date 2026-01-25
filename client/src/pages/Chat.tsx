import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api';

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
      // Local addition for AI chat
      const userMessage: Message = {
        _id: Date.now().toString(),
        sender: { _id: user!.id, alias: user!.alias },
        text: inputText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');

      try {
        const { data } = await aiApi.chat(inputText);
        const aiMessage: Message = {
          _id: (Date.now() + 1).toString(),
          sender: { _id: 'ai', alias: 'AI Companion' },
          text: data.reply,
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err) {
        console.error('AI chat error', err);
      }
    } else {
      socketRef.current?.emit('send_message', { text: inputText });
      setInputText('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AnonCare Community</h2>
        <div className="controls">
          <label>
            <input 
              type="checkbox" 
              checked={isAIActive} 
              onChange={() => setIsAIActive(!isAIActive)} 
            />
            AI Support Mode
          </label>
          <span className="user-alias">Talking as: <strong>{user?.alias}</strong></span>
        </div>
      </div>

      <div className="messages-list">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`message-wrapper ${msg.sender._id === user?.id ? 'own' : ''} ${msg.isAI ? 'ai' : ''}`}
          >
            <div className="message-info">
              <span className="sender">{msg.sender.alias}</span>
              <span className="time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isAIActive ? "Ask the AI Companion..." : "Message the community..."}
        />
        <button type="submit">Send</button>
      </form>

      <style>{`
        .chat-container {
          height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          background: #0f172a;
          color: white;
        }
        .chat-header {
          padding: 1rem;
          background: #1e293b;
          border-bottom: 1px solid #334155;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user-alias { font-size: 0.9rem; color: #94a3b8; }
        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message-wrapper {
          max-width: 70%;
          display: flex;
          flex-direction: column;
        }
        .message-wrapper.own { align-self: flex-end; align-items: flex-end; }
        .sender { font-size: 0.8rem; color: #38bdf8; margin-bottom: 0.2rem; }
        .time { font-size: 0.7rem; color: #64748b; margin-left: 0.5rem; }
        .message-bubble {
          padding: 0.8rem 1rem;
          border-radius: 1rem;
          background: #334155;
          line-height: 1.4;
        }
        .own .message-bubble { background: #38bdf8; color: #0f172a; border-radius: 1rem 1rem 0 1rem; }
        .ai .message-bubble { border: 1px solid #38bdf8; }
        .chat-input-area {
          padding: 1rem;
          background: #1e293b;
          display: flex;
          gap: 0.5rem;
        }
        .chat-input-area input {
          flex: 1;
          padding: 0.8rem;
          border-radius: 0.5rem;
          border: 1px solid #334155;
          background: #0f172a;
          color: white;
        }
        .chat-input-area button {
          padding: 0.8rem 1.5rem;
          border-radius: 0.5rem;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Chat;
