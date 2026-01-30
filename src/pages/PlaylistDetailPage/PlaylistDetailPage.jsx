import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { playlistsApi } from '@/api/playlistsApi';
import Tracklist from '@/components/Tracklist/Tracklist';
import styles from './PlaylistDetailPage.module.css';

const initialView = { status: 'loading', playlist: null, error: '' };

export default function PlaylistDetailsPage() {
  const { id } = useParams();

  const [view, setView] = useState(initialView);

  useEffect(() => {
    let cancelled = false;

    playlistsApi
      .get(id)
      .then((p) => {
        if (cancelled) return;
        setView({ status: 'ready', playlist: p, error: '' });
      })
      .catch((e) => {
        if (cancelled) return;
        setView({
          status: 'error',
          playlist: null,
          error: e?.message || 'Failed to load playlist',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const { status, playlist, error } = view;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Link className={styles.navLink} to="/playlists">
          ← My playlists
        </Link>

        <h2 className={styles.title}>{playlist?.name || 'Playlist'}</h2>

        <Link className={styles.navLink} to="/app">
          Search
        </Link>
      </div>

      {status === 'loading' ? <div className={styles.state}>Loading…</div> : null}
      {status === 'error' ? <div className={styles.error}>{error}</div> : null}

      {status === 'ready' && playlist ? (
        <div className={styles.panel}>
          <div className={styles.list}>
            <Tracklist
              tracks={playlist.tracks || []}
              onRemove={(trackId) =>
                playlistsApi.removeTrack(id, trackId).then(() => {
                  setView((v) => ({
                    ...v,
                    playlist: {
                      ...v.playlist,
                      tracks: (v.playlist.tracks || []).filter((t) => t.id !== trackId),
                    },
                  }));
                })
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
