/// <reference types="node" />

import "dotenv/config";
import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from './routes/auth.routes.js'
import playlistsRoutes from './routes/playlists.routes.js'

const app = express();

app.use(helmet());
app.use(express.json())
app.use(cookieParser())

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
    cors({
        origin:FRONTEND_ORIGIN,
        credentials: true,
    })
)

app.get("/health", (req, res) => res.json({ok:true}))

app.post('/ping', (req, res) => {
  res.json({ ok: true, body: req.body });
});


app.use('/auth', authRoutes);
app.use('/api/playlists', playlistsRoutes);

const port = process.env.PORT || 3001;


app.listen(port, () => console.log(`API listening on :${port}`));