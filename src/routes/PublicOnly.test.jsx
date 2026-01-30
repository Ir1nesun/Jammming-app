import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicOnly from './PublicOnly';
import { vi } from 'vitest';

const mockUseAuth = vi.fn();

vi.mock('../auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

function AppCase() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <div>LOGIN PAGE</div>
          </PublicOnly>
        }
      />
      <Route path="/app" element={<div>APP PAGE</div>} />
    </Routes>
  );
}

test('redirects to /app when authenticated', () => {
  mockUseAuth.mockReturnValue({ user: { id: '1' }, loading: false });

  render(
    <MemoryRouter initialEntries={['/login']}>
      <AppCase />
    </MemoryRouter>
  );

  expect(screen.getByText('APP PAGE')).toBeInTheDocument();
});

test('renders children when not authenticated', () => {
  mockUseAuth.mockReturnValue({ user: null, loading: false });

  render(
    <MemoryRouter initialEntries={['/login']}>
      <AppCase />
    </MemoryRouter>
  );

  expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
});
