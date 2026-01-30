import React from 'react';
import styles from './Tracklist.module.css';
import Track from '../Track/Track';

function Tracklist({ tracks, onRemove }) {
  return (
    <div className={styles.list}>
      {tracks.map((track) => (
        <Track key={track.id} track={track} onRemove={onRemove} />
      ))}
    </div>
  );
}

export default Tracklist;
