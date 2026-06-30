// ponytail: Minimal state & DOM logic.
let currentPage = 1;
let currentQuery = '';

const moviesContainer = document.getElementById('movies');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMore');
const modal = document.getElementById('modal');

async function loadMovies(reset = false) {
    if (reset) {
        moviesContainer.innerHTML = '';
        currentPage = 1;
    }
    
    loadMoreBtn.textContent = 'Loading...';
    try {
        const data = await listMovies(currentPage, currentQuery);
        if (data.movies) renderMovies(data.movies);
        
        loadMoreBtn.style.display = (data.movie_count > currentPage * data.limit) ? 'block' : 'none';
        loadMoreBtn.textContent = 'Load More';
    } catch (e) {
        console.error('Failed to load movies', e);
        loadMoreBtn.textContent = 'Error. Try again';
    }
}

function renderMovies(movies) {
    const html = movies.map(m => `
        <div class="movie-card" onclick="openDetails(${m.id})">
            <img src="${m.medium_cover_image}" alt="${m.title}" loading="lazy">
            <div class="info">
                <h3>${m.title}</h3>
                <p>${m.year} • ★ ${m.rating}</p>
            </div>
        </div>
    `).join('');
    moviesContainer.insertAdjacentHTML('beforeend', html);
}

async function openDetails(id) {
    // Show modal quickly with loading text or skeleton if needed
    document.getElementById('modalTitle').textContent = "Loading...";
    document.getElementById('modalImg').src = "";
    document.getElementById('modalMeta').textContent = "";
    document.getElementById('modalDesc').textContent = "";
    document.getElementById('modalLinks').innerHTML = "";
    modal.classList.add('active');

    try {
        const m = await getMovieDetails(id);
        document.getElementById('modalImg').src = m.medium_cover_image;
        document.getElementById('modalTitle').textContent = m.title_long;
        document.getElementById('modalMeta').textContent = `★ ${m.rating} • ${m.runtime} mins • ${(m.genres || []).join(', ')}`;
        document.getElementById('modalDesc').textContent = m.description_full || m.description_intro || "No description available.";
        
        const linksDiv = document.getElementById('modalLinks');
        linksDiv.innerHTML = m.torrents ? m.torrents.map(t => {
            const magnet = getMagnetUrl(t.hash, m.title);
            return `<a href="${magnet}" class="magnet-btn">Download ${t.quality} (${t.size})</a>`;
        }).join('') : '<p>No torrents available.</p>';
    } catch (e) {
        console.error('Failed to load movie details', e);
        document.getElementById('modalTitle').textContent = "Error loading details.";
    }
}

// Events
document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
modal.onclick = (e) => { if(e.target === modal) modal.classList.remove('active'); };

searchInput.addEventListener('input', (e) => {
    // Basic debounce
    clearTimeout(searchInput.timeout);
    searchInput.timeout = setTimeout(() => {
        currentQuery = e.target.value;
        loadMovies(true);
    }, 500);
});

loadMoreBtn.onclick = () => {
    currentPage++;
    loadMovies();
};

// Init
loadMovies();
