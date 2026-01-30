const ITUNES_BASE = "https://itunes.apple.com/search";

export const itunesApi = {
  async searchTracks(term, signal) {
    if (!term || !term.trim()) return [];

    const params = new URLSearchParams({
      term: term.trim(),
      media: "music",
      entity: "song",
      limit: "20",
    });

    const res = await fetch(`${ITUNES_BASE}?${params.toString()}`, { signal });
    if (!res.ok) throw new Error(`iTunes error ${res.status}`);

    const data = await res.json();
    const results = data.results ?? [];

    return results.map((t) => ({
      id: String(t.trackId),
      name: t.trackName,
      artist: t.artistName,
      album: t.collectionName,
      uri: t.trackViewUrl || "",
      previewUrl: t.previewUrl || "",
      imageUrl: t.artworkUrl100 || "",
    }));
  },
};
