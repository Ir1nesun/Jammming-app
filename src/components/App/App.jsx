import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import styles from './App.module.css';

import AuthWidget from '@/auth/AuthWidget/AuthWidget';
import SearchPage from '@/pages/SearchPage/SearchPage';

import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import LogoutPage from '@/pages/LogoutPage/LogoutPage';

import RequireAuth from '@/routes/RequireAuth';
import PublicOnly from '@/routes/PublicOnly';
import PlaylistsPage from '@/pages/PlaylistPage/PlaylistPage';
import PlaylistDetailsPage from '@/pages/PlaylistDetailPage/PlaylistDetailPage';

export default function App() {
  const location = useLocation();

  const isPublicPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        {!isPublicPage && (
          <Link to="/playlists" className={styles.playlistsLink}>
            <svg className={styles.playlistsIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            My playlists
          </Link>
        )}

        <h1 className={styles.title}>
          Ja<span className={styles.highlight}>mmm</span>ing
        </h1>

        {!isPublicPage && <AuthWidget />}
      </header>

      <main className={styles.content}>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />

          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <RegisterPage />
              </PublicOnly>
            }
          />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <SearchPage />
              </RequireAuth>
            }
          />
          <Route
            path="/logout"
            element={
              <RequireAuth>
                <LogoutPage />
              </RequireAuth>
            }
          />

          <Route
            path="/playlists"
            element={
              <RequireAuth>
                <PlaylistsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/playlists/:id"
            element={
              <RequireAuth>
                <PlaylistDetailsPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
