import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '../db.js';
import { COOKIE_NAME, signToken } from '../auth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
  };
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

function avatarFromSeed(seed) {
  const safe = encodeURIComponent(seed);
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${safe}`;
}

const registerSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(200),
  username: z.string().min(2).max(32),
});

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(200),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const { email, password, username } = parsed.data;

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Email already used' });

  const id = crypto.randomUUID();
  const password_hash = await bcrypt.hash(password, 12);
  const avatar_url = avatarFromSeed(id);

  db.prepare(
    'INSERT INTO users (id, email, username, avatar_url, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, email, username, avatar_url, password_hash, Date.now());

  const token = signToken({ sub: id });
  setSessionCookie(res, token);

  res.status(201).json({ id, email, username, avatarUrl: avatar_url });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const { email, password } = parsed.data;

  const user = db
    .prepare('SELECT id, email, username, avatar_url, password_hash FROM users WHERE email = ?')
    .get(email);

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ sub: user.id });
  setSessionCookie(res, token);

  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatar_url,
  });
});

router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  const user = db
    .prepare('SELECT id, email, username, avatar_url FROM users WHERE id = ?')
    .get(req.user.sub);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatar_url,
  });
});

export default router;
