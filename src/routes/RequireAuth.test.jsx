import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { vi } from 'vitest';

const mockUseAuth = vi.fn();

vi.mock('../auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

function AppCase() {
  return (
    <Routes>
      <Route
        path="/private"
        element={
          <RequireAuth>
            <div>PRIVATE</div>
          </RequireAuth>
        }
      />
      <Route path="/login" element={<div>LOGIN</div>} />
    </Routes>
  );
}

test('redirects to /login when not authenticated', () => {
  mockUseAuth.mockReturnValue({ user: null, loading: false });

  render(
    <MemoryRouter initialEntries={['/private']}>
      <AppCase />
    </MemoryRouter>
  );

  expect(screen.getByText('LOGIN')).toBeInTheDocument();
});

test('renders children when authenticated', () => {
  mockUseAuth.mockReturnValue({ user: { id: '1' }, loading: false });

  render(
    <MemoryRouter initialEntries={['/private']}>
      <AppCase />
    </MemoryRouter>
  );

  expect(screen.getByText('PRIVATE')).toBeInTheDocument();
});
