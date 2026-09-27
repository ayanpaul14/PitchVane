import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { createCaseRouter } from './routes/cases.js';
import { createAuthRouter } from './routes/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://pitch-vane.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io Room Subscription
io.on('connection', (socket) => {
  socket.on('join:case', (caseId) => {
    socket.join(caseId);
    console.log(`[Socket] ${socket.id} joined case room: ${caseId}`);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PitchVane Multi-Agent Backend',
    version: '2.4.0',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', createAuthRouter());
app.use('/api/cases', createCaseRouter(io));

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 PitchVane Backend listening on http://localhost:${PORT}`);
  });
}

startServer();
