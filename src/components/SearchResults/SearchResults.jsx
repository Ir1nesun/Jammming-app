import React from "react";
import styles from './SearchResults.module.css'
import Track from "../Track/Track";

function SearchResults({searchResults, onAdd}){
    return(
        <div className={styles.panel}>
            <h2 className={styles.title}>Results</h2>
            <div className={styles.list}>
                {searchResults.map((track)=> (
                <Track key={track.id} track={track} onAdd={onAdd}/>
                ))}
            </div>
        </div>
    )
}

export default SearchResults