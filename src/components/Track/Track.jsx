import React from 'react';
import styles from './Track.module.css';

function Track({ track, onAdd, onRemove }) {
  return (
    <div className={styles.track}>
      {track.imageUrl ? (
        <img className={styles.cover} src={track.imageUrl} alt={`${track.name} cover`} />
      ) : (
        <div className={styles.coverStub} aria-hidden="true" />
      )}

      <div className={styles.body}>
        <div className={styles.name}>{track.name}</div>
        <div className={styles.meta}>
          {track.artist} | {track.album}
        </div>
      </div>

      {onAdd ? (
        <button
          type="button"
          className={styles.action}
          onClick={() => onAdd(track)}
          aria-label="Add to playlist"
        >
          +
        </button>
      ) : null}

      {onRemove ? (
        <button type="button" className={styles.action} onClick={() => onRemove(track.id)}>
          −
        </button>
      ) : null}
    </div>
  );
}

export default Track;
