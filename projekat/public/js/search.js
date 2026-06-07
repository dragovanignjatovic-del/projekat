const KATEGORIJE = [
  'Poljoprivreda i šumarstvo',
  'Rudarstvo i vađenje',
  'Prerađivačka industrija',
  'Snabdevanje energijom',
  'Vodosnabdevanje i otpad',
  'Građevinarstvo',
  'Trgovina na veliko i malo',
  'Saobraćaj i skladištenje',
  'Ugostiteljstvo i turizam',
  'Informacije i komunikacije',
  'Finansije i osiguranje',
  'Poslovanje nekretninama',
  'Stručne i naučne delatnosti',
  'Administrativne i pomoćne usluge',
  'Obrazovanje',
  'Zdravstvo i socijalna zaštita',
  'Umetnost, zabava i rekreacija'
];

const DRZAVE = ['Srbija', 'Crna Gora', 'Bosna i Hercegovina', 'Hrvatska', 'Severna Makedonija'];

const GRADOVI = typeof GRAD_NASELJA !== 'undefined' ? Object.keys(GRAD_NASELJA) : [];

// Populate naselje dropdown based on selected grad/opstina
function populateNaselja(selectedGrad) {
  const naseljeSelect = document.getElementById('filter-naselje');
  if (!naseljeSelect) return;
  const naselja = (typeof GRAD_NASELJA !== 'undefined' && GRAD_NASELJA[selectedGrad]) || [];
  naseljeSelect.innerHTML = '<option value="">Sva naselja</option>' +
    naselja.map(n => `<option value="${n}">${n}</option>`).join('');
  naseljeSelect.disabled = naselja.length === 0;
}

// Show Grad/Opstina and Naselje filters only when Drzava is Srbija
function toggleSrbijaFilters() {
  const drzavaSelect = document.getElementById('filter-drzava');
  const gradSelect = document.getElementById('filter-grad');
  const naseljeSelect = document.getElementById('filter-naselje');
  if (!drzavaSelect || !gradSelect || !naseljeSelect) return;

  const isSrbija = drzavaSelect.value === 'Srbija';
  gradSelect.style.display = isSrbija ? '' : 'none';
  naseljeSelect.style.display = isSrbija ? '' : 'none';

  if (!isSrbija) {
    gradSelect.value = '';
    naseljeSelect.value = '';
    naseljeSelect.innerHTML = '<option value="">Naselje</option>';
    naseljeSelect.disabled = true;
  }
}

// Populate dropdowns
function populateDropdowns() {
  const drzavaSelect = document.getElementById('filter-drzava');
  const gradSelect = document.getElementById('filter-grad');
  const delatnostSelect = document.getElementById('filter-delatnost');
  const naseljeSelect = document.getElementById('filter-naselje');

  if (drzavaSelect) {
    drzavaSelect.innerHTML = '<option value="">Sve drzave</option>' +
      DRZAVE.map(d => `<option value="${d}">${d}</option>`).join('');
    drzavaSelect.value = 'Srbija';
    drzavaSelect.addEventListener('change', toggleSrbijaFilters);
  }
  if (gradSelect) {
    gradSelect.innerHTML = '<option value="">Grad / Opstina</option>' +
      GRADOVI.map(g => `<option value="${g}">${g}</option>`).join('');
    gradSelect.addEventListener('change', () => populateNaselja(gradSelect.value));
  }
  if (naseljeSelect) {
    naseljeSelect.innerHTML = '<option value="">Naselje</option>';
    naseljeSelect.disabled = true;
  }
  if (delatnostSelect) {
    delatnostSelect.innerHTML = '<option value="">Sve delatnosti</option>' +
      KATEGORIJE.map(k => `<option value="${k}">${k}</option>`).join('');
  }
  toggleSrbijaFilters();
}

// Render business cards
function renderCards(oglasi, container) {
  if (!container) return;
  if (!oglasi || oglasi.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">🔍</div>
        <p>Nema rezultata. Pokusajte drugaciju pretragu.</p>
      </div>`;
    return;
  }
  container.innerHTML = oglasi.map(o => {
    const imgSrc = o.slike && o.slike[0] ? o.slike[0] : null;
    const imgHtml = imgSrc
      ? `<div class="card-img"><img src="${imgSrc}" alt="${o.naziv}" loading="lazy"></div>`
      : `<div class="card-img">🏢</div>`;
    return `
      <a class="card" href="/oglas.html?id=${o.id}">
        ${imgHtml}
        <div class="card-body">
          <div class="card-badge">${o.vrsta_privrede || 'Delatnost'}</div>
          <div class="card-title">${o.naziv}</div>
          <div class="card-location">📍 ${[o.grad, o.okrug].filter(Boolean).join(', ') || 'Srbija'}</div>
          <div class="card-desc">${o.opis || ''}</div>
        </div>
      </a>`;
  }).join('');
}

// Search with debounce
let searchTimer = null;
function debounceSearch(fn, delay = 400) {
  return function(...args) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => fn(...args), delay);
  };
}

// Main search function
async function doSearch(params = {}) {
  const container = document.getElementById('results-grid');
  if (!container) return;
  container.innerHTML = '<div class="spinner"></div>';

  const url = new URL('/api/search', location.origin);
  Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });

  // Sync URL
  const stateParams = new URLSearchParams(params);
  history.pushState({}, '', '?' + stateParams.toString());

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderCards(data, container);
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Greska pri ucitavanju. Osvezite stranicu.</p>';
  }
}

// Read params from URL
function getSearchParams() {
  const p = new URLSearchParams(location.search);
  return {
    ime: p.get('ime') || '',
    drzava: p.get('drzava') || '',
    grad: p.get('grad') || '',
    naselje: p.get('naselje') || '',
    delatnost: p.get('delatnost') || '',
    tip: p.get('tip') || ''
  };
}

// Init search page
function initSearch() {
  populateDropdowns();
  const params = getSearchParams();

  // Set form values from URL
  ['ime', 'drzava', 'grad', 'delatnost', 'tip'].forEach(k => {
    const el = document.getElementById('filter-' + k);
    if (el && params[k]) el.value = params[k];
  });
  toggleSrbijaFilters();
  if (params.grad && document.getElementById('filter-drzava')?.value === 'Srbija') {
    populateNaselja(params.grad);
    const naseljeSelect = document.getElementById('filter-naselje');
    if (naseljeSelect && params.naselje) naseljeSelect.value = params.naselje;
  }

  const form = document.getElementById('search-form');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const current = {
        ime: document.getElementById('filter-ime')?.value || '',
        drzava: document.getElementById('filter-drzava')?.value || '',
        grad: document.getElementById('filter-grad')?.value || '',
        naselje: document.getElementById('filter-naselje')?.value || '',
        delatnost: document.getElementById('filter-delatnost')?.value || '',
        tip: document.getElementById('filter-tip')?.value || ''
      };
      doSearch(current);
    });
  }

  // Load initial results
  const hasParams = Object.values(params).some(v => v);
  if (hasParams) {
    doSearch(params);
  } else {
    loadAll();
  }
}

async function loadAll() {
  const container = document.getElementById('results-grid');
  if (!container) return;
  container.innerHTML = '<div class="spinner"></div>';
  try {
    const res = await fetch('/api/oglasi');
    const data = await res.json();
    renderCards(data, container);
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Greska pri ucitavanju.</p>';
  }
}
