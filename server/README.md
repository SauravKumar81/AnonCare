# 🚀 AnonCare Server

The backend API for AnonCare, built with Node.js, Express, and Socket.io.

## 🛠️ Tech Stack
- **Node.js**: Runtime environment.
- **Express**: Web framework.
- **Mongoose**: MongoDB object modeling.
- **Socket.io**: Real-time bidirectional communication.
- **JWT**: Secure authentication.
- **Google Generative AI**: Gemini 1.5 Flash for AI companions.

## 📖 Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/anoncare
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

## 🏗️ Build & Production
- **Build**: `npm run build` (Compiles TypeScript to `dist/`).
- **Start**: `npm start` (Runs the production build).

## 🌐 Deployment (Render)
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
