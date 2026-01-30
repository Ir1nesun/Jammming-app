import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import AuthProvider from './AuthProvider';
import { useAuth } from './useAuth';

vi.mock('../api/authApi', () => ({
  authApi: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authApi } from '../api/authApi';

function Probe() {
  const { user, loading, error, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : ''}</div>

      <button onClick={() => login({ email: 'a@a.com', password: '123456' })}>doLogin</button>
      <button onClick={() => register({ email: 'b@b.com', password: '123456', username: 'bob' })}>
        doRegister
      </button>
      <button onClick={() => logout()}>doLogout</button>
    </div>
  );
}

function AppUnderTest() {
  return (
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthProvider', () => {
  test('me(): success -> sets user, loading=false, error empty', async () => {
    authApi.me.mockResolvedValueOnce({ id: '1', email: 'x@test.com', username: 'x' });

    render(<AppUnderTest />);

    expect(screen.getByTestId('loading').textContent).toBe('true');

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toContain('"id":"1"');
  });

  test('me(): 401 -> treats as guest (user=null), no error', async () => {
    const err = new Error('Unauthorized');
    err.status = 401;
    authApi.me.mockRejectedValueOnce(err);

    render(<AppUnderTest />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('user').textContent).toBe('');
  });

  test('me(): non-401 error -> sets error', async () => {
    const err = new Error('Boom');
    err.status = 500;
    authApi.me.mockRejectedValueOnce(err);

    render(<AppUnderTest />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('error').textContent).toMatch(/boom/i);
  });

  test('login(): updates user from API result', async () => {
    authApi.me.mockResolvedValueOnce(null);
    authApi.login.mockResolvedValueOnce({ id: '2', email: 'a@a.com', username: 'a' });

    render(<AppUnderTest />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    screen.getByText('doLogin').click();

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('"id":"2"');
    });
  });

  test('register(): updates user from API result', async () => {
    authApi.me.mockResolvedValueOnce(null);
    authApi.register.mockResolvedValueOnce({ id: '3', email: 'b@b.com', username: 'bob' });

    render(<AppUnderTest />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    screen.getByText('doRegister').click();

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('"id":"3"');
    });
  });

  test('logout(): optimistic user=null and calls API', async () => {
    authApi.me.mockResolvedValueOnce({ id: '1', email: 'x@test.com', username: 'x' });
    authApi.logout.mockResolvedValueOnce({ ok: true });

    render(<AppUnderTest />);

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('user').textContent).toContain('"id":"1"');

    screen.getByText('doLogout').click();

    expect(authApi.logout).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('');
    });
  });
});
