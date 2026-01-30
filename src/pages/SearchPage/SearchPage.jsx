import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchResults from '@/components/SearchResults/SearchResults';
import Playlist from '@/components/PlaylistEditor/PlaylistEditor';
import { itunesApi } from '@/api/itunesApi';
import { playlistsApi } from '@/api/playlistsApi';
import { useAuth } from '@/auth/useAuth';

import styles from './SearchPage.module.css';

const DEFAULT_PLAYLIST_NAME = 'My Playlist';

export default function SearchPage() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const [searchTrigger, setSearchTrigger] = useState(0);

  const [saveBusy, setSaveBusy] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const controller = new AbortController();

    itunesApi
      .searchTracks(searchTerm, controller.signal)
      .then(setSearchResults)
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error(err);
      });

    return () => controller.abort();
  }, [searchTrigger]);

  function handleSearchTermChange(term) {
    setSearchTerm(term);
    if (!term.trim()) setSearchResults([]);
  }

  function handleSearch() {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchTrigger((prev) => prev + 1);
  }

  function addTrack(track) {
    setPlaylistTracks((prev) => (prev.some((t) => t.id === track.id) ? prev : [...prev, track]));
  }

  function removeTrack(trackId) {
    setPlaylistTracks((prev) => prev.filter((t) => t.id !== trackId));
  }

  function savePlaylist() {
    setSaveError('');

    if (!user) {
      setSaveError('Please login to save playlists.');
      return;
    }

    if (playlistTracks.length === 0) {
      setSaveError('Add at least one track before saving.');
      return;
    }

    setSaveBusy(true);

    const nameToSave = playlistName.trim() || DEFAULT_PLAYLIST_NAME;

    playlistsApi
      .create(nameToSave, playlistTracks)
      .then(() => {
        setPlaylistName('');
        setPlaylistTracks([]);
      })
      .catch((err) => setSaveError(err?.message || 'Save failed'))
      .finally(() => setSaveBusy(false));
  }

  return (
    <div className={styles.page}>
      {saveError && <div className={styles.error}>{saveError}</div>}
      {saveBusy && <div className={styles.busy}>Saving playlist…</div>}

      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSearch={handleSearch}
      />

      <div className={styles.columns}>
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={setPlaylistName}
          onSave={savePlaylist}
          placeholder={DEFAULT_PLAYLIST_NAME}
        />
      </div>
    </div>
  );
}
