import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import PlaylistDetailsPage from './PlaylistDetailPage';

vi.mock('../../api/playlistsApi', () => ({
  playlistsApi: {
    get: vi.fn(),
    removeTrack: vi.fn(),
  },
}));

test('renders playlist tracks', async () => {
  const { playlistsApi } = await import('../../api/playlistsApi');

  playlistsApi.get.mockResolvedValue({
    id: 'p1',
    name: 'Rock',
    tracks: [
      { id: 't1', name: 'Song 1', artist: 'A', album: 'X' },
      { id: 't2', name: 'Song 2', artist: 'B', album: 'Y' },
    ],
  });

  render(
    <MemoryRouter initialEntries={['/playlists/p1']}>
      <Routes>
        <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText('Song 1')).toBeInTheDocument();
  expect(screen.getByText('Song 2')).toBeInTheDocument();
});

test('removes track', async () => {
  const user = userEvent.setup();
  const { playlistsApi } = await import('../../api/playlistsApi');

  playlistsApi.get.mockResolvedValue({
    id: 'p1',
    name: 'Rock',
    tracks: [{ id: 't1', name: 'Song 1', artist: 'A', album: 'X' }],
  });

  playlistsApi.removeTrack.mockResolvedValue({ ok: true });

  render(
    <MemoryRouter initialEntries={['/playlists/p1']}>
      <Routes>
        <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText('Song 1')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '−' }));

  expect(screen.queryByText('Song 1')).not.toBeInTheDocument();
  expect(playlistsApi.removeTrack).toHaveBeenCalledWith('p1', 't1');
});
