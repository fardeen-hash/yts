# Endpoints Needed

Based on the YTS API documentation, the following endpoints and data structures are needed.

## 1. List / Search Movies
- **Endpoint**: `https://movies-api.accel.li/api/v2/list_movies.json`
- **Method**: GET
- **Parameters**:
  - `page` (integer) - Pagination
  - `query_term` (string) - Search string
  - `limit` (integer) - default 20
- **Usage**: Used to populate the home page and perform searches.

## 2. View Movie Details
- **Endpoint**: `https://movies-api.accel.li/api/v2/movie_details.json`
- **Method**: GET
- **Parameters**:
  - `movie_id` (integer) - Required. The ID of the movie.
- **Usage**: Used to get detailed torrent information (hashes) and descriptions when a user selects a movie.

## 3. Magnet Link Generation (Local)
- **Format**: `magnet:?xt=urn:btih:TORRENT_HASH&dn=Url+Encoded+Movie+Name&tr=TRACKER_URLS...`
- **Trackers to append**:
  - `udp://tracker.opentrackr.org:1337/announce`
  - `udp://open.demonii.com:1337/announce`
  - `udp://tracker.torrent.eu.org:451/announce`
- **Usage**: Constructed locally on the client to initiate downloads without needing the API.
