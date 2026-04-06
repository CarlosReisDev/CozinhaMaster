/* ============================================================
   CozinhaMaster — Cardápio dinâmico via Supabase
   Layout: seções por categoria + scroll spy nos tabs
   ============================================================ */

/* ── REFS ───────────────────────────────────────────────────── */
const menuWrap = document.getElementById('menu-wrap');
const tabsWrap = document.getElementById('filter-tabs');
const countEl  = document.getElementById('filter-count');
const header   = document.getElementById('site-header');

/* ── HELPERS ────────────────────────────────────────────────── */
function formatPrice(value) {
  return `A partir de R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeImgUrl(url) {
  if (!url || typeof url !== 'string') return null;
  return url.startsWith('https://') ? esc(url) : null;
}

const BADGE_MAP = {
  popular:  { label: 'Popular',      cls: 'badge-popular'  },
  destaque: { label: 'Destaque',     cls: 'badge-destaque' },
  novo:     { label: 'Novo',         cls: 'badge-novo'     },
  chef:     { label: "Chef's Pick",  cls: 'badge-chef'     },
};

/* ── BUILD CARD ─────────────────────────────────────────────── */
function buildCard(item) {
  const badge = item.badge && BADGE_MAP[item.badge]
    ? `<span class="card-badge ${BADGE_MAP[item.badge].cls}">${BADGE_MAP[item.badge].label}</span>`
    : '';

  const imgUrl = safeImgUrl(item.image_url);
  const imageBlock = imgUrl
    ? `<div class="card-image">
         <img src="${imgUrl}" alt="${esc(item.name)}" loading="lazy" decoding="async" />
         <div class="card-image-overlay"></div>
         ${badge}
       </div>`
    : `<div class="card-image card-image--placeholder">
         <div class="card-image-placeholder-icon">◈</div>
         ${badge}
       </div>`;

  const orderUrl = item.saipos_url && safeUrl(item.saipos_url, ['https:'])
    ? esc(item.saipos_url) : null;

  const orderBtn = orderUrl
    ? `<a href="${orderUrl}" class="card-order-btn" target="_blank" rel="noopener">Pedir</a>`
    : '';

  const article = document.createElement('article');
  article.className = 'menu-card';
  article.innerHTML = `
    ${imageBlock}
    <div class="card-body">
      <h3 class="card-name">${esc(item.name)}</h3>
      ${item.description ? `<p class="card-desc">${esc(item.description)}</p>` : ''}
    </div>
    <div class="card-footer">
      <span class="card-price">${formatPrice(item.price)}</span>
      ${orderBtn}
    </div>`;
  return article;
}

/* ── RENDER SEÇÕES ──────────────────────────────────────────── */
function groupByCategory(categories, items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.category_slug]) map[item.category_slug] = [];
    map[item.category_slug].push(item);
  });
  return categories
    .map(cat => ({ ...cat, items: map[cat.slug] || [] }))
    .filter(cat => cat.items.length > 0);
}

function renderSections(categories, items) {
  const grouped = groupByCategory(categories, items);
  menuWrap.innerHTML = '';

  grouped.forEach(cat => {
    const section = document.createElement('section');
    section.className = 'menu-section';
    section.id = `cat-${cat.slug}`;

    const header = document.createElement('div');
    header.className = 'menu-section-header';
    header.innerHTML = `
      <h2 class="menu-section-title">${esc(cat.name)}</h2>
      <span class="menu-section-count">${cat.items.length} ${cat.items.length === 1 ? 'item' : 'itens'}</span>`;

    const grid = document.createElement('div');
    grid.className = 'menu-section-grid';
    cat.items.forEach(item => grid.appendChild(buildCard(item)));

    section.appendChild(header);
    section.appendChild(grid);
    menuWrap.appendChild(section);
  });

  countEl.textContent = `${items.length} itens`;
  setupScrollSpy(grouped);
}

/* ── TABS ───────────────────────────────────────────────────── */
function renderTabs(categories) {
  tabsWrap.innerHTML = `<button class="filter-tab active" data-filter="all">Tudo</button>`;

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab';
    btn.dataset.filter = cat.slug;
    btn.textContent = cat.name;
    tabsWrap.appendChild(btn);
  });

  tabsWrap.addEventListener('click', e => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;

    const slug = tab.dataset.filter;
    if (slug === 'all') {
      menuWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const target = document.getElementById(`cat-${slug}`);
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  });
}

function setActiveTab(slug) {
  tabsWrap.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === slug);
  });
}

/* ── SCROLL SPY ─────────────────────────────────────────────── */
function setupScrollSpy(grouped) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slug = entry.target.id.replace('cat-', '');
        setActiveTab(slug);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  grouped.forEach(cat => {
    const el = document.getElementById(`cat-${cat.slug}`);
    if (el) observer.observe(el);
  });

  // Quando chega no topo, volta para "Tudo"
  const topObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) setActiveTab('all');
  }, { rootMargin: '0px' });
  if (menuWrap.firstElementChild) topObserver.observe(menuWrap);
}

/* ── SKELETON ───────────────────────────────────────────────── */
function showSkeleton() {
  menuWrap.innerHTML = Array(3).fill(`
    <section class="menu-section">
      <div class="menu-section-header">
        <div class="skeleton-line skeleton-section-title"></div>
      </div>
      <div class="menu-section-grid">
        ${Array(3).fill(`
          <div class="menu-card skeleton-card">
            <div class="card-image skeleton-image"></div>
            <div class="card-body">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line skeleton-short"></div>
            </div>
            <div class="card-footer">
              <div class="skeleton-line skeleton-price"></div>
            </div>
          </div>`).join('')}
      </div>
    </section>`).join('');
}

/* ── ERRO ───────────────────────────────────────────────────── */
function showError(msg) {
  menuWrap.innerHTML = `
    <div class="menu-error">
      <span class="menu-error-icon">⚠</span>
      <p class="menu-error-text">${msg}</p>
      <button class="menu-retry-btn">Tentar novamente</button>
    </div>`;
  menuWrap.querySelector('.menu-retry-btn').addEventListener('click', loadMenu);
  countEl.textContent = '0 itens';
}

/* ── FETCH ──────────────────────────────────────────────────── */
async function loadMenu() {
  if (!SUPABASE_URL || SUPABASE_URL.startsWith('COLE_')) {
    showError('Configuração do banco pendente.');
    return;
  }

  showSkeleton();

  const headers = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  };

  try {
    const [catsRes, itemsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/menu_categories?select=slug,name&order=display_order.asc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=category_slug,name,description,price,badge,image_url,saipos_url&order=display_order.asc`, { headers }),
    ]);

    if (!catsRes.ok || !itemsRes.ok) throw new Error(`Erro ${catsRes.status}`);

    const categories = await catsRes.json();
    const items      = await itemsRes.json();

    renderTabs(categories);
    renderSections(categories, items);

  } catch (err) {
    console.error('[Cardápio]', err);
    showError('Não foi possível carregar o cardápio.<br>Verifique sua conexão e tente novamente.');
  }
}

/* ── NAVBAR SCROLL ──────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── INIT ───────────────────────────────────────────────────── */
loadMenu();
