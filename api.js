// ponytail: minimalist fetch wrappers, no unnecessary abstractions
const BASE_URL = 'https://movies-api.accel.li/api/v2';

const trackers = [
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://tracker.torrent.eu.org:451/announce',
    'udp://tracker.dler.org:6969/announce',
    'udp://open.stealth.si:80/announce',
    'udp://open.demonii.com:1337/announce',
    'udp://tracker.srv00.com:6969/announce'
].map(t => `tr=${encodeURIComponent(t)}`).join('&');

async function listMovies(page = 1, query = '') {
    const url = new URL(`${BASE_URL}/list_movies.json`);
    url.searchParams.append('page', page);
    if (query) url.searchParams.append('query_term', query);
    
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
}

async function getMovieDetails(id) {
    const url = new URL(`${BASE_URL}/movie_details.json`);
    url.searchParams.append('movie_id', id);
    
    const res = await fetch(url);
    const json = await res.json();
    return json.data.movie;
}

function getMagnetUrl(hash, title) {
    return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&${trackers}`;
}
