import React, { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { authApi } from '../api/authApi';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setError('');
      })
      .catch((e) => {
        if (cancelled) return;
        if (e?.status !== 401) setError(e?.message || 'Auth check failed');
        setUser(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function login(payload) {
    setError('');
    return authApi.login(payload).then((me) => {
      setUser(me);
      return me;
    });
  }

  function register(payload) {
    setError('');
    return authApi.register(payload).then((me) => {
      setUser(me);
      return me;
    });
  }

  function logout() {
    setError('');
    setUser(null);
    return authApi.logout().catch((e) => {
      setError(e?.message || 'Logout failed');
    });
  }

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
