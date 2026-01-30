export function makeUser(overrides = {}) {
  return {
    id: 'u1',
    email: 'test@test.com',
    username: 'test',
    avatarUrl: 'https://example.com/a.svg',
    ...overrides,
  };
}

export function makeTrack(overrides = {}) {
  return {
    id: 't1',
    name: 'Song',
    artist: 'Artist',
    album: 'Album',
    uri: '',
    previewUrl: '',
    imageUrl: '',
    ...overrides,
  };
}

export function makePlaylist(overrides = {}) {
  return {
    id: 'p1',
    name: 'My Playlist',
    created_at: Date.now(),
    tracks: [],
    ...overrides,
  };
}
