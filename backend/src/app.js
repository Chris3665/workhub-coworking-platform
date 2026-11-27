import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './modules/auth/auth.routes.js';
import spacesRoutes from './modules/spaces/spaces.routes.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'WorkHub API running in UTC' });
});

app.use('/api/auth', authRoutes);
app.use('/api/spaces', spacesRoutes);

export default app;