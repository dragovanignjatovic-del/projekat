/* ============================================================
   Find Me Qwic — icon set (simple line SVGs)
   Usage: <span data-icon="search"></span>  → renderIcons() fills it in
   ============================================================ */

const FMQ_ICONS = {
  // ---- UI ----
  search:   '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  phone:    '<path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L14 16l4 1.5V20a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail:     '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  eye:      '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/>',
  pin:      '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  camera:   '<path d="M3 8.5A2 2 0 0 1 5 6.5h1.6l1.2-2h8.4l1.2 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.4"/>',
  globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18"/>',
  chevdown: '<path d="m6 9 6 6 6-6"/>',
  chevright:'<path d="m9 6 6 6-6 6"/>',
  arrow:    '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  menu:     '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x:        '<path d="m6 6 12 12M18 6 6 18"/>',
  check:    '<path d="m5 12 4.5 4.5L19 7"/>',
  user:     '<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  lock:     '<rect x="5" y="11" width="14" height="9" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2.2"/><path d="M4 9h16M8 3v4M16 3v4"/>',
  link:     '<path d="M9.5 14.5 14.5 9.5"/><path d="M8 12 6 14a3.5 3.5 0 0 0 5 5l2-2"/><path d="M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2"/>',
  share:    '<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><path d="m8.2 11 6.6-3.8M8.2 13l6.6 3.8"/>',
  play:     '<path d="M8 6.5v11l9-5.5z"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  edit:     '<path d="M16 4.5 19.5 8 9 18.5 5 19.5l1-4z"/><path d="m14 6.5 3.5 3.5"/>',
  file:     '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  info:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  star:     '<path d="M12 4l2.4 5 5.6.7-4 3.9 1 5.5L12 16.6 7 19l1-5.5-4-3.9 5.6-.7z"/>',
  trash:    '<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>',

  // ---- socials ----
  facebook: '<path d="M14 7h2V4h-2.5C11 4 10 5.5 10 7.5V9H8v3h2v8h3v-8h2.2l.5-3H13V8c0-.7.3-1 1-1z"/>',
  instagram:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1"/>',
  linkedin: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 10v6M8 7v.01M12 16v-3.5a1.8 1.8 0 0 1 3.6 0V16"/>',
  youtube:  '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="m11 9.5 4 2.5-4 2.5z"/>',

  // ---- categories ----
  cart:     '<circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M3 4h2l2.2 11h10.3l1.8-7.5H6"/>',
  wrench:   '<path d="M15.5 4a4.5 4.5 0 0 0-5.6 5.7L4 15.6 7.5 19l5.9-5.9A4.5 4.5 0 0 0 19 7.5l-2.6 2.6-2.5-2.5L16.5 5z"/>',
  cup:      '<path d="M5 8h11v5a5 5 0 0 1-10 0z"/><path d="M16 9h2.5a2 2 0 0 1 0 4H16"/><path d="M5 20h11"/>',
  leaf:     '<path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14Z"/><path d="M9 15c2-3 5-5 8-6"/>',
  hammer:   '<path d="m11 8 5-5 4 4-5 5z"/><path d="m13 10-8 8 1.5 1.5 8-8"/>',
  pulse:    '<path d="M3 12h4l2-5 4 12 2.5-7H21"/>',
  factory:  '<path d="M3 20V10l5 3.5V10l5 3.5V8l6 4v8z"/><path d="M3 20h18M8 16h.01M13 16h.01M17 16h.01"/>',
  palette:  '<path d="M12 3a9 9 0 0 0 0 18c1.6 0 2-1.2 1.2-2.2-.8-1 0-2.3 1.3-2.3H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5Z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="11" r="1"/>',
  compass:  '<circle cx="12" cy="12" r="9"/><path d="m9 15 2-5 5-2-2 5z"/>',
  cap:      '<path d="m3 9 9-4 9 4-9 4z"/><path d="M7 11v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4"/><path d="M21 9v5"/>',
  crane:    '<path d="M5 21V5l13 3"/><path d="M5 8h13"/><path d="M11 8v3a3 3 0 0 0 0 0"/><path d="M11 11v3"/><path d="M8 21h8"/>',
  monitor:  '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/>',
  news:     '<rect x="4" y="5" width="13" height="14" rx="1.6"/><path d="M17 9h2.5a1.5 1.5 0 0 1 1.5 1.5V17a2 2 0 0 1-2 2M7 9h7M7 12h7M7 15h4"/>',
  trophy:   '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M10 13.5V17h4v-3.5M8 20h8"/>',
  users:    '<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 7a3 3 0 0 1 0 4M17 19a5.5 5.5 0 0 0-3-5"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.6"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  store:    '<path d="M4 9 5 4h14l1 5M4 9v11h16V9M4 9h16M9 20v-5h6v5"/>',
};

function iconHTML(name, { size = 20, strokeWidth = 1.8, className = '' } = {}) {
  const inner = FMQ_ICONS[name] || FMQ_ICONS.info;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" class="${className}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

// Replaces every element with a data-icon attribute with the matching SVG
function renderIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    const size = parseInt(el.getAttribute('data-icon-size') || '20', 10);
    el.innerHTML = iconHTML(name, { size });
    el.classList.add('icon-wrap');
  });
}

window.Icon = iconHTML;
window.FMQ_ICONS = FMQ_ICONS;
window.renderIcons = renderIcons;
