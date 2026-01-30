import React from 'react';
import styles from './PlaylistEditor.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
  return (
    <div className={styles.panel}>
      <input
        className={styles.name}
        value={playlistName}
        placeholder="My Playlist"
        onChange={(e) => onNameChange(e.target.value)}
      />
      <div className={styles.list}>
        <Tracklist tracks={playlistTracks} onRemove={onRemove} />
      </div>
      <button className={styles.save} onClick={onSave}>
        Save To Playlist
      </button>
    </div>
  );
}

export default Playlist;
