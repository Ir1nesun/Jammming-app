import { apiFetch } from './apiClient';

export const playlistsApi = {
  create(name, tracks) {
    return apiFetch('/api/playlists', {
      method: 'POST',
      body: { name, tracks },
    });
  },

  list() {
    return apiFetch('/api/playlists');
  },

  get(id) {
    return apiFetch(`/api/playlists/${id}`);
  },

  remove(id) {
    return apiFetch(`/api/playlists/${id}`, {
      method: 'DELETE',
    });
  },

  removeTrack(playlistId, trackId) {
    return apiFetch(`/api/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE',
    });
  },
};
