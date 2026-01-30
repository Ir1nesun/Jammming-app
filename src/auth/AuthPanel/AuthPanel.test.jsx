import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AuthPanel from './AuthPanel';
import { renderWithRouter } from '../../test/utils/render.jsx';

vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../useAuth';

function makeCtx(overrides = {}) {
  return {
    user: null,
    loading: false,
    error: '',
    login: vi.fn().mockResolvedValue({ id: '1' }),
    register: vi.fn().mockResolvedValue({ id: '1' }),
    logout: vi.fn(),
    ...overrides,
  };
}

describe('AuthPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login by default', () => {
    useAuth.mockReturnValue(makeCtx());

    const { container } = renderWithRouter(<AuthPanel initialMode="login" />, { route: '/login' });

    const loginButtons = screen.getAllByRole('button', { name: /^login$/i });
    const loginTab = loginButtons.find((b) => b.getAttribute('type') === 'button');
    expect(loginTab).toBeTruthy();

    const registerTab = screen.getByRole('button', { name: /^register$/i });
    expect(registerTab).toHaveAttribute('type', 'button');

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/nickname/i)).toBeNull();

    const submit = container.querySelector('form button[type="submit"]');
    expect(submit).toBeTruthy();
    expect(submit.textContent).toMatch(/^login$/i);
  });

  test('switches to register and shows Nickname', async () => {
    useAuth.mockReturnValue(makeCtx());
    const user = userEvent.setup();

    renderWithRouter(<AuthPanel initialMode="login" />, { route: '/register' });

    await user.click(screen.getByRole('button', { name: /^register$/i }));
    expect(screen.getByLabelText(/nickname/i)).toBeInTheDocument();
  });

  test('submits login', async () => {
    const login = vi.fn().mockResolvedValue({ id: '1' });
    useAuth.mockReturnValue(makeCtx({ login }));

    const user = userEvent.setup();
    const { container } = renderWithRouter(<AuthPanel initialMode="login" />);

    await user.type(screen.getByLabelText(/email/i), 'a@a.com');
    await user.type(screen.getByLabelText(/password/i), '123456');

    const submit = container.querySelector('form button[type="submit"]');
    await user.click(submit);

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith({ email: 'a@a.com', password: '123456' });
  });

  test('submits register', async () => {
    const register = vi.fn().mockResolvedValue({ id: '1' });
    useAuth.mockReturnValue(makeCtx({ register }));

    const user = userEvent.setup();
    const { container } = renderWithRouter(<AuthPanel initialMode="login" />);

    await user.click(screen.getByRole('button', { name: /^register$/i }));

    await user.type(screen.getByLabelText(/nickname/i), 'iris');
    await user.type(screen.getByLabelText(/email/i), 'b@b.com');
    await user.type(screen.getByLabelText(/password/i), '123456');

    const submit = container.querySelector('form button[type="submit"]');
    await user.click(submit);

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith({
      email: 'b@b.com',
      password: '123456',
      username: 'iris',
    });
  });
});
