import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { initDatabase } from './config/initDb.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import chatRoutes from './routes/chats.js';
import messageRoutes from './routes/messages.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chats', messageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

async function start() {
  await initDatabase();
  app.listen(config.port, () => {
    console.log(`ArcMind server running on port ${config.port}`);
  });
}

start();
