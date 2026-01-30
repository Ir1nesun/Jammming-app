import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PlaylistsPage from './PlaylistPage';

vi.mock('../../api/playlistsApi', () => ({
  playlistsApi: {
    list: vi.fn(),
    remove: vi.fn(),
  },
}));

test('renders playlists from api', async () => {
  const { playlistsApi } = await import('../../api/playlistsApi');
  playlistsApi.list.mockResolvedValue([
    { id: 'p1', name: 'Rock', created_at: Date.now() },
    { id: 'p2', name: 'Chill', created_at: Date.now() },
  ]);

  render(
    <MemoryRouter>
      <PlaylistsPage />
    </MemoryRouter>
  );

  expect(await screen.findByText('Rock')).toBeInTheDocument();
  expect(screen.getByText('Chill')).toBeInTheDocument();
});

test('shows empty state', async () => {
  const { playlistsApi } = await import('../../api/playlistsApi');
  playlistsApi.list.mockResolvedValue([]);

  render(
    <MemoryRouter>
      <PlaylistsPage />
    </MemoryRouter>
  );

  expect(await screen.findByText(/No playlists yet/i)).toBeInTheDocument();
});

test('deletes playlist', async () => {
  const user = userEvent.setup();
  const { playlistsApi } = await import('../../api/playlistsApi');

  playlistsApi.list.mockResolvedValue([{ id: 'p1', name: 'Rock', created_at: Date.now() }]);
  playlistsApi.remove.mockResolvedValue({ ok: true });

  vi.spyOn(window, 'confirm').mockReturnValue(true);

  render(
    <MemoryRouter>
      <PlaylistsPage />
    </MemoryRouter>
  );

  expect(await screen.findByText('Rock')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '✕' }));

  expect(screen.queryByText('Rock')).not.toBeInTheDocument();
});
