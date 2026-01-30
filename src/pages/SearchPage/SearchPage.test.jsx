import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import SearchPage from './SearchPage';

vi.mock('../../api/playlistsApi', () => ({
  playlistsApi: {
    create: vi.fn(() => Promise.resolve({ id: 'p1' })),
  },
}));

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'a@a.com' } }),
}));

vi.mock('../../components/SearchResults/SearchResults', () => ({
  default: ({ onAdd }) => (
    <button
      onClick={() =>
        onAdd({
          id: 't1',
          name: 'Track 1',
          artist: 'Artist',
          album: 'Album',
        })
      }
    >
      Add fake track
    </button>
  ),
}));

test('save calls playlistsApi.create when playlist has tracks', async () => {
  const user = userEvent.setup();
  const { playlistsApi } = await import('../../api/playlistsApi');

  render(<SearchPage />);

  await user.click(screen.getByText(/add fake track/i));

  await user.click(screen.getByRole('button', { name: /save to playlist/i }));

  expect(playlistsApi.create).toHaveBeenCalledTimes(1);
  expect(playlistsApi.create).toHaveBeenCalledWith('My Playlist', expect.any(Array));
});
