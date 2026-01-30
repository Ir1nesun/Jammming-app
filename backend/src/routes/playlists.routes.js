import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const trackSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  uri: z.string().optional(),
  previewUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

const playlistSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  tracks: z.array(trackSchema).max(200),
});

router.use(requireAuth);

router.get('/', (req, res) => {
  const rows = db
    .prepare(
      'SELECT id, name, created_at FROM playlists WHERE user_id = ? ORDER BY created_at DESC'
    )
    .all(req.user.sub);

  res.json(rows);
});

router.get('/:id', (req, res) => {
  const p = db
    .prepare('SELECT id, name, created_at FROM playlists WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.sub);

  if (!p) return res.status(404).json({ error: 'Not found' });

  const tracks = db
    .prepare('SELECT track_json FROM playlist_tracks WHERE playlist_id = ?')
    .all(req.params.id)
    .map((r) => JSON.parse(r.track_json));

  res.json({ ...p, tracks });
});

router.post('/', (req, res) => {
  const parsed = playlistSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const { name, tracks } = parsed.data;
  const id = parsed.data.id || crypto.randomUUID();

  const existing = db
    .prepare('SELECT id FROM playlists WHERE id = ? AND user_id = ?')
    .get(id, req.user.sub);

  if (!existing) {
    db.prepare('INSERT INTO playlists (id, user_id, name, created_at) VALUES (?, ?, ?, ?)').run(
      id,
      req.user.sub,
      name,
      Date.now()
    );
  } else {
    db.prepare('UPDATE playlists SET name = ? WHERE id = ? AND user_id = ?').run(
      name,
      id,
      req.user.sub
    );

    db.prepare('DELETE FROM playlist_tracks WHERE playlist_id = ?').run(id);
  }

  const insertTrack = db.prepare(
    'INSERT INTO playlist_tracks (playlist_id, track_id, track_json) VALUES (?, ?, ?)'
  );

  const tx = db.transaction(() => {
    for (const t of tracks) insertTrack.run(id, t.id, JSON.stringify(t));
  });
  tx();

  res.status(201).json({ id, name });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  const own = db
    .prepare('SELECT id FROM playlists WHERE id = ? AND user_id = ?')
    .get(id, req.user.sub);

  if (!own) return res.status(404).json({ error: 'Not found' });

  const tx = db.transaction(() => {
    db.prepare('DELETE FROM playlist_tracks WHERE playlist_id = ?').run(id);
    db.prepare('DELETE FROM playlists WHERE id = ? AND user_id = ?').run(id, req.user.sub);
  });

  tx();

  res.json({ ok: true });
});

router.delete('/:id/tracks/:trackId', (req, res) => {
  const { id, trackId } = req.params;

  const own = db
    .prepare('SELECT id FROM playlists WHERE id = ? AND user_id = ?')
    .get(id, req.user.sub);

  if (!own) return res.status(404).json({ error: 'Not found' });

  const result = db
    .prepare('DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?')
    .run(id, trackId);

  if (result.changes === 0) return res.status(404).json({ error: 'Track not found in playlist' });

  res.json({ ok: true });
});

export default router;
