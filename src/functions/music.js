async function spList(track_id) {
    const data = await undici.fetch("https://open.spotify.com/get_access_token?reason=transport&productType=embed");

    const body = await data.json();

    const res = await undici.fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_tracks=${track_id}`, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`,
            'Content-Type': 'application/json',
        },
    })

    const json = await res.json();

    const tracks = json.tracks.slice(0, 5);
  
    return tracks.map(track => ({
      id: track.id,
      name: track.name
    }));
}

module.exports = { spList };