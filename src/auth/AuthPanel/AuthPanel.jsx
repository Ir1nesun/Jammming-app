import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import styles from './AuthPanel.module.css';

export default function AuthPanel({ initialMode = 'login' }) {
  const { loading, error, login, register } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    setBusy(true);

    const action =
      mode === 'login'
        ? () => login({ email, password })
        : () => register({ email, password, username });

    action()
      .then(() => {
        setPassword('');
        setUsername('');
      })
      .catch((e) => setLocalError(e?.message || 'Auth failed'))
      .finally(() => setBusy(false));
  }

  if (loading) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Account</div>
          <div className={styles.sub}>
            {mode === 'login' ? 'Login to your account' : 'Create a new account'}
          </div>
        </div>

        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
              onClick={() => setMode('login')}
              disabled={busy}
            >
              Login
            </button>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
              onClick={() => setMode('register')}
              disabled={busy}
            >
              Register
            </button>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className={styles.label}>
              Nickname
              <input
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={busy}
                required
              />
            </label>
          )}

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          <button className={styles.buttonPrimary} type="submit" disabled={busy}>
            {busy ? '…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {(localError || error) && <div className={styles.error}>{localError || error}</div>}
      </div>
    </div>
  );
}
