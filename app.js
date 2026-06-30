// ponytail: minimal state, cached elements, infinite scroll via IntersectionObserver
let currentPage = 1;
let currentQuery = '';
let currentGenre = '';
let currentSort = 'date_added';
let currentQuality = '';
let loading = false;
let hasMore = true;

const moviesEl = document.getElementById('movies');
const searchInput = document.getElementById('searchInput');
const sentinel = document.getElementById('sentinel');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalDesc = document.getElementById('modalDesc');
const modalLinks = document.getElementById('modalLinks');
const modalGenres = document.getElementById('modalGenres');
const movieCountEl = document.getElementById('movieCount');

async function loadMovies(reset = false) {
    if (loading) return;
    if (!reset && !hasMore) return;
    loading = true;
    if (reset) { moviesEl.innerHTML = ''; currentPage = 1; hasMore = true; }
    sentinel.textContent = 'Loading...';
    try {
        const data = await listMovies(currentPage, currentQuery, currentGenre, currentSort, currentQuality);
        if (data.movies) renderMovies(data.movies);
        movieCountEl.textContent = data.movie_count.toLocaleString() + ' movies';
        hasMore = data.movie_count > currentPage * data.limit;
        sentinel.textContent = hasMore ? '' : 'No more movies';
    } catch (e) {
        console.error('Failed to load movies', e);
        sentinel.textContent = 'Error loading movies';
    }
    loading = false;
}

function renderMovies(movies) {
    const html = movies.map(m => `
        <div class="movie-card" onclick="openDetails(${m.id})">
            <img src="${m.medium_cover_image}" alt="${m.title}" loading="lazy">
            <span class="overlay-pill">${m.year}</span>
            <div class="card-label">
                <h3>${m.title}</h3>
                <p>${m.rating}/10</p>
            </div>
        </div>
    `).join('');
    moviesEl.insertAdjacentHTML('beforeend', html);
}

async function openDetails(id) {
    modalTitle.textContent = 'Loading...';
    modalImg.src = '';
    modalMeta.textContent = '';
    modalDesc.textContent = '';
    modalLinks.innerHTML = '';
    modalGenres.innerHTML = '';
    modal.classList.add('active');

    try {
        const m = await getMovieDetails(id);
        modalImg.src = m.medium_cover_image;
        modalTitle.textContent = m.title_long;
        modalMeta.textContent = `${m.rating}/10 · ${m.runtime} min · ${m.language.toUpperCase()} · ${m.mpa_rating || '—'}`;
        modalDesc.textContent = m.description_full || m.description_intro || '';
        modalGenres.innerHTML = (m.genres || []).map(g => `<span class="pill muted">${g}</span>`).join('');
        modalLinks.innerHTML = m.torrents ? m.torrents.map(t => {
            const magnet = getMagnetUrl(t.hash, m.title);
            return `<a href="${magnet}" class="magnet-btn">${t.quality} · ${t.type} · ${t.size}</a>`;
        }).join('') : '<p style="color:var(--color-ash)">No torrents.</p>';
    } catch (e) {
        console.error('Failed to load details', e);
        modalTitle.textContent = 'Error loading details.';
    }
}

// Close modal
document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

// Search debounce
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchInput._t);
    searchInput._t = setTimeout(() => {
        currentQuery = e.target.value;
        loadMovies(true);
    }, 500);
});

// Pill group helper
function setupPillGroup(containerId, callback) {
    document.getElementById(containerId).addEventListener('click', (e) => {
        const pill = e.target.closest('.pill');
        if (!pill) return;
        pill.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        callback(pill);
    });
}

setupPillGroup('filters', (pill) => { currentGenre = pill.dataset.genre; loadMovies(true); });
setupPillGroup('sortPills', (pill) => { currentSort = pill.dataset.sort; loadMovies(true); });
setupPillGroup('qualityPills', (pill) => { currentQuality = pill.dataset.quality; loadMovies(true); });

// Collapse toggle
document.getElementById('collapseGenre').addEventListener('click', function() {
    const grid = document.getElementById('filters');
    grid.classList.toggle('collapsed');
    this.textContent = grid.classList.contains('collapsed') ? '+' : '−';
});

// Nav pills
document.getElementById('navBrowse').onclick = (e) => { e.preventDefault(); currentSort = 'date_added'; loadMovies(true); };
document.getElementById('navTop').onclick = (e) => {
    e.preventDefault();
    currentSort = 'rating';
    document.querySelectorAll('#sortPills .pill').forEach(p => p.classList.remove('active'));
    document.querySelector('#sortPills .pill[data-sort="rating"]').classList.add('active');
    loadMovies(true);
};

// ponytail: infinite scroll via IntersectionObserver — native, zero-dep
const scrollRoot = document.querySelector('.content');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading && hasMore) {
        currentPage++;
        loadMovies();
    }
}, { root: scrollRoot, rootMargin: '400px' });
observer.observe(sentinel);

// Init
loadMovies();
