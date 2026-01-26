# 🎨 AnonCare Client

The frontend application for AnonCare, built with React and Vite.

## ✨ Features
- **Real-time Chat**: Community support via Socket.io.
- **AI Companion**: Personalized therapy conversations.
- **Book Sessions**: Appointment management.
- **Video Call**: Secure WebRTC-based video sessions.
- **Premium Design**: Glassmorphism UI with Framer Motion.

## 📖 Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

## 🏗️ Build & Production
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## 🌐 Deployment (Vercel)
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Environment Variable**: `VITE_API_URL` (Pointer to your backend).
