import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Completely open for local testing
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`); // Added a log so you know it works!

  socket.on('join-session', (sessionId: string) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });

  socket.on('canvas-update', (data: { sessionId: string; json: string }) => {
    socket.to(data.sessionId).emit('canvas-update', data.json);
  });

  socket.on('cursor-move', (data: { sessionId: string; userId: string; x: number; y: number }) => {
    socket.to(data.sessionId).emit('cursor-move', { userId: data.userId, x: data.x, y: data.y });
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
    io.emit('user-disconnected', socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log('Server streaming on port 3001');
});