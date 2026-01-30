import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { playlistsApi } from '@/api/playlistsApi';
import styles from './PlaylistPage.module.css';

export default function PlaylistsPage() {
  const [busy, setBusy] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    playlistsApi
      .list()
      .then((rows) => {
        if (cancelled) return;
        setItems(rows || []);
        setError('');
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || 'Failed to load playlists');
      })
      .finally(() => {
        if (cancelled) return;
        setBusy(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h2 className={styles.title}>My playlists</h2>
        <Link className={styles.back} to="/app">
          ← Back to search
        </Link>
      </div>

      {busy ? <div className={styles.state}>Loading…</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      {!busy && !error && items.length === 0 ? (
        <div className={styles.state}>No playlists yet. Save one on the Search page.</div>
      ) : null}

      {!busy && !error ? (
        <div className={styles.list}>
          {items.map((p) => (
            <Link key={p.id} className={styles.card} to={`/playlists/${p.id}`}>
              <div className={styles.cardName}>{p.name}</div>

              <div className={styles.cardMeta}>
                {p.created_at ? new Date(p.created_at).toLocaleString() : ''}
              </div>

              <button
                className={styles.delete}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (!confirm(`Delete playlist "${p.name}"?`)) return;

                  playlistsApi.remove(p.id).then(() => {
                    setItems((prev) => prev.filter((x) => x.id !== p.id));
                  });
                }}
              >
                ✕
              </button>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
