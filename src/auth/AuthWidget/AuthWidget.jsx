import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import styles from './AuthWidget.module.css';

function avatarFromSeed(seed) {
  const safe = encodeURIComponent(seed || 'user');
  return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${safe}`;
}

export default function AuthWidget() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const email = user.email || '';
  const username = user.username || email.split('@')[0] || 'User';
  const avatarUrl = user.avatarUrl || avatarFromSeed(user.id || email);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.profile}>
            <img className={styles.avatar} src={avatarUrl} alt="" />
            <div className={styles.name}>{username}</div>
          </div>

          <Link to="/logout" className={styles.logout}>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}
