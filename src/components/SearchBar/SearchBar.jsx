import React from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ searchTerm, onSearchTermChange, onSearch }) {
  function handleChange(e) {
    onSearchTermChange(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      onSearch();
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a song or artist"
      />

      <button className={styles.button} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
