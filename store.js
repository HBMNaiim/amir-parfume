// ============================================================
//  AMIR PARFUME - Store Logic v5
//  Extended: communes, olfactive notes, delivery, print/PDF
// ============================================================

let allProducts = [];
let filteredProducts = [];
let cart = [];
let currentFilter = 'all';
let currentProduct = null;
let modalQty = 1;
let storeCurrentLimit = 24;
let lastOrder = null; // Store last order for printing

// Touch swipe state
let touchStartY = 0;

// ---- Init --------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    // Hide loader
    setTimeout(() => {
        document.getElementById('page-loader').classList.add('hidden');
        document.querySelector('.hero-bg').classList.add('loaded');
    }, 1400);

    // Load Settings
    try {
        const settings = await DB.getSettings();
        if (settings && settings.heroBackground) {
            document.querySelector('.hero-bg').style.backgroundImage = `url(${settings.heroBackground})`;
        }
    } catch (e) { /* ignore */ }

    loadCart();
    showSkeletons();
    try {
        allProducts = await DB.getVisibleProducts();
    } catch (e) {
        allProducts = [];
        showToast('error', 'Impossible de charger le catalogue', 'fa-exclamation-circle');
    }
    filteredProducts = [...allProducts];
    renderProducts();
    buildFilterTabs();
    populateWilayas();
    bindEvents();
    initScrollReveal();
});

// ---- Wilaya & Commune Selector ------------------------------
function populateWilayas() {
    const sel = document.getElementById('wilaya');
    if (!sel) return;
    WILAYAS.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.name;
        opt.dataset.code = w.code;
        opt.textContent = `${w.code} - ${w.name}`;
        sel.appendChild(opt);
    });

    // Listen for wilaya change to update communes
    sel.addEventListener('change', () => {
        const selectedOption = sel.options[sel.selectedIndex];
        const code = selectedOption.dataset.code;
        populateCommunes(code);
        updateShippingCost();
    });
}

function populateCommunes(wilayaCode) {
    const communesSel = document.getElementById('commune');
    if (!communesSel) return;
    
    communesSel.innerHTML = '';
    
    if (!wilayaCode || !COMMUNES_BY_WILAYA[wilayaCode]) {
        communesSel.innerHTML = '<option value="">Choisir d\'abord une wilaya...</option>';
        communesSel.disabled = true;
        return;
    }

    const communes = COMMUNES_BY_WILAYA[wilayaCode].communes;
    communesSel.disabled = false;
    
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Choisir une commune...';
    communesSel.appendChild(defaultOpt);

    communes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        communesSel.appendChild(opt);
    });
}

// ---- Skeleton Loaders ---------------------------------------
function showSkeletons(count = 8) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        grid.innerHTML += `
        <div class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line w60"></div>
            <div class="skeleton-line w80"></div>
            <div class="skeleton-line w40"></div>
          </div>
        </div>`;
    }
}

// ---- Scroll Events -----------------------------------------
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 60);

    const btt = document.getElementById('back-to-top');
    btt.classList.toggle('visible', window.scrollY > 400);

    const prog = document.getElementById('scroll-progress');
    const total = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
}, { passive: true });

// ---- Scroll Reveal ------------------------------------------
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

// ---- Events ------------------------------------------------
function bindEvents() {
    // Hamburger
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');

    hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        mobileOverlay.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Nav links with data-filter
    document.querySelectorAll('[data-filter]').forEach(el => {
        el.addEventListener('click', (e) => {
            const filter = el.getAttribute('data-filter');
            if (filter) setFilter(filter);
        });
    });

    // Close mobile menu on any link click
    document.querySelectorAll('#mobile-menu a').forEach(a => {
        a.addEventListener('click', closeMobileMenu);
    });

    // Search
    document.getElementById('search-input').addEventListener('input', e => {
        applyFilters(e.target.value);
    });

    // Search nav button
    document.getElementById('search-nav-btn').addEventListener('click', () => {
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('search-input').focus(), 500);
    });

    // Cart
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('drawer-close').addEventListener('click', closeCart);

    // Modal close
    document.getElementById('modal-overlay').addEventListener('click', e => {
        if (e.target === document.getElementById('modal-overlay')) closeModal();
    });
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);

    // Modal swipe to close (mobile)
    const modalEl = document.querySelector('.product-modal');
    if (modalEl) {
        modalEl.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
        modalEl.addEventListener('touchend', e => {
            const diff = e.changedTouches[0].clientY - touchStartY;
            if (diff > 80) closeModal();
        }, { passive: true });
    }

    // Modal qty
    document.getElementById('modal-qty-minus').addEventListener('click', () => {
        if (modalQty > 1) { modalQty--; document.getElementById('modal-qty-display').textContent = modalQty; }
    });
    document.getElementById('modal-qty-plus').addEventListener('click', () => {
        if (currentProduct && modalQty < currentProduct.stock) {
            modalQty++;
            document.getElementById('modal-qty-display').textContent = modalQty;
        }
    });
    document.getElementById('modal-add-btn').addEventListener('click', () => {
        if (currentProduct) addToCart(currentProduct, modalQty);
        closeModal();
    });

    // Checkout btn
    document.getElementById('checkout-btn').addEventListener('click', () => {
        closeCart();
        showCheckout();
    });

    // Order form
    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitOrder(e);
    });

    // Back to shop
    document.getElementById('back-to-shop').addEventListener('click', hideCheckout);

    // Confirm ok
    document.getElementById('confirm-ok').addEventListener('click', () => {
        document.getElementById('confirm-overlay').classList.remove('open');
        document.body.style.overflow = '';
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });

    // Print & PDF buttons
    document.getElementById('print-order-btn').addEventListener('click', printOrder);
    document.getElementById('download-pdf-btn').addEventListener('click', downloadOrderPDF);

    // Back to top
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeModal();
            closeCart();
            closeMobileMenu();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Delivery method selection
    document.querySelectorAll('.delivery-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.delivery-option').forEach(opt => opt.classList.remove('selected'));
            radio.closest('.delivery-option').classList.add('selected');
            updateShippingCost();
        });
    });
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('hamburger-btn').classList.remove('open');
    document.getElementById('mobile-menu-overlay').classList.remove('open');
    document.getElementById('hamburger-btn').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ---- Shipping Calculation -----------------------------------
function getShippingCost() {
    const subtotal = cart.reduce((s, i) => s + (i.promoPrice || i.price) * i.qty, 0);
    if (subtotal >= 15000) return 0; // Free shipping threshold

    const method = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'home';
    return method === 'home' ? 600 : 400;
}

function updateShippingCost() {
    const shipping = getShippingCost();
    const subtotal = cart.reduce((s, i) => s + (i.promoPrice || i.price) * i.qty, 0);
    const total = subtotal + shipping;

    const shippingEl = document.getElementById('summary-shipping');
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total-amount');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? 'Gratuite ✨' : formatPrice(shipping);
        shippingEl.style.color = shipping === 0 ? '#2ecc71' : '';
    }
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// ---- Filter Tabs -------------------------------------------
function buildFilterTabs() {
    const tabs = document.getElementById('filter-tabs');
    const categories = [
        { key: 'all', label: 'Tous', icon: '✦' },
        { key: 'homme', label: 'Homme', icon: '♂' },
        { key: 'femme', label: 'Femme', icon: '♀' },
        { key: 'unisexe', label: 'Unisexe', icon: '⚥' },
        { key: 'promo', label: 'Promos', icon: '🏷' },
        { key: 'featured', label: 'Vedette', icon: '⭐' },
    ];

    tabs.innerHTML = '';
    categories.forEach(cat => {
        const count = getCount(cat.key);
        const btn = document.createElement('button');
        btn.className = 'filter-tab' + (cat.key === currentFilter ? ' active' : '');
        btn.dataset.filter = cat.key;
        btn.setAttribute('aria-pressed', cat.key === currentFilter);
        btn.innerHTML = `${cat.icon} ${cat.label} <span class="count">${count}</span>`;
        btn.addEventListener('click', () => setFilter(cat.key));
        tabs.appendChild(btn);
    });
}

function getCount(key) {
    if (key === 'all') return allProducts.length;
    if (key === 'promo') return allProducts.filter(p => p.promoPrice).length;
    if (key === 'featured') return allProducts.filter(p => p.featured).length;
    return allProducts.filter(p => p.category === key).length;
}

function setFilter(key) {
    currentFilter = key;
    storeCurrentLimit = 24;
    document.querySelectorAll('.filter-tab').forEach(t => {
        const active = t.dataset.filter === key;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', active);
    });
    applyFilters(document.getElementById('search-input').value);
}

function applyFilters(search = '') {
    const q = search.toLowerCase().trim();
    filteredProducts = allProducts.filter(p => {
        const matchCat =
            currentFilter === 'all' ? true :
                currentFilter === 'promo' ? !!p.promoPrice :
                    currentFilter === 'featured' ? p.featured :
                        p.category === currentFilter;
        const matchSearch = !q ||
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
            (p.olfactive_family && p.olfactive_family.toLowerCase().includes(q));
        return matchCat && matchSearch;
    });
    storeCurrentLimit = 24;
    renderProducts();
}

// ---- Render Products ---------------------------------------
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    const existing = document.getElementById('load-more-container');
    if (existing) existing.remove();

    if (filteredProducts.length === 0) {
        if (allProducts.length === 0) {
            grid.innerHTML = `<div class="no-results"><i class="fas fa-spray-can"></i><p>Le catalogue est en cours de préparation</p><p style="font-size:0.8rem;margin-top:8px">Revenez bientôt — Amir Parfume</p></div>`;
        } else {
            grid.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><p>Aucun parfum trouvé pour cette recherche</p></div>`;
        }
        return;
    }

    const items = filteredProducts.slice(0, storeCurrentLimit);
    items.forEach((p, i) => {
        const card = createProductCard(p, i);
        grid.appendChild(card);
    });

    if (filteredProducts.length > storeCurrentLimit) {
        const cont = document.createElement('div');
        cont.id = 'load-more-container';
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline';
        btn.innerHTML = '<i class="fas fa-plus-circle"></i> Voir plus de parfums';
        btn.onclick = () => { storeCurrentLimit += 24; renderProducts(); btn.blur(); };
        cont.appendChild(btn);
        grid.parentNode.insertBefore(cont, grid.nextSibling);
    }

    setTimeout(() => {
        document.querySelectorAll('.reveal-up:not(.visible)').forEach(el => {
            const obs = new IntersectionObserver(entries => {
                entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
            }, { threshold: 0.1 });
            obs.observe(el);
        });
    }, 50);
}

function createProductCard(p, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;
    card.setAttribute('role', 'listitem');

    const priceDisplay = p.promoPrice
        ? `<div class="price-block">
           <span class="price-original">${formatPrice(p.price)}</span>
           <span class="price-current promo">${formatPrice(p.promoPrice)}</span>
         </div>
         <span class="price-discount">-${Math.round((1 - p.promoPrice / p.price) * 100)}%</span>`
        : `<div class="price-block"><span class="price-current">${formatPrice(p.price)}</span></div>`;

    const badges = [];
    if (p.promoPrice) badges.push(`<span class="badge badge-promo">Promo</span>`);
    if (p.featured && !p.promoPrice) badges.push(`<span class="badge badge-featured">Vedette</span>`);
    if (p.stock === 0) badges.push(`<span class="badge badge-out">Épuisé</span>`);
    else if (p.stock <= 5) badges.push(`<span class="badge badge-stock-low">Stock bas</span>`);

    // Add olfactive family badge if present
    if (p.olfactive_family) {
        const family = OLFACTIVE_FAMILIES.find(f => f.key === p.olfactive_family);
        if (family) badges.push(`<span class="badge badge-family">${family.icon} ${family.label}</span>`);
    }

    const outOfStock = p.stock === 0;
    const errImg = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%230f0f1a%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 text-anchor=%22middle%22 fill=%22%23c9a84c%22 font-size=%2248%22>✦</text></svg>`;

    card.innerHTML = `
    <div class="card-image-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${errImg}'">
      <div class="card-badges">${badges.join('')}</div>
      <button class="card-wishlist" title="Ajouter aux favoris" aria-label="Ajouter ${p.name} aux favoris"><i class="far fa-heart"></i></button>
    </div>
    <div class="card-body">
      <p class="card-brand">${p.brand}</p>
      <h3 class="card-name">${p.name}</h3>
      <p class="card-volume">${p.volume || ''}</p>
      <div class="card-price-row">
        ${priceDisplay}
        <button class="card-add-btn" title="Ajouter au panier" aria-label="Ajouter ${p.name} au panier" ${outOfStock ? 'disabled' : ''}>
          <i class="fas fa-${outOfStock ? 'ban' : 'plus'}"></i>
        </button>
      </div>
    </div>`;

    card.addEventListener('click', e => {
        if (!e.target.closest('.card-add-btn') && !e.target.closest('.card-wishlist')) openModal(p);
    });

    card.querySelector('.card-add-btn').addEventListener('click', e => {
        e.stopPropagation();
        addToCart(p, 1);
        const btn = e.currentTarget;
        btn.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 250 });
    });

    card.querySelector('.card-wishlist').addEventListener('click', e => {
        e.stopPropagation();
        const icon = e.currentTarget.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        icon.style.color = icon.classList.contains('fas') ? '#e74c3c' : '';
        const isWished = icon.classList.contains('fas');
        e.currentTarget.setAttribute('aria-label', `${isWished ? 'Retirer' : 'Ajouter'} ${p.name} des favoris`);
    });

    return card;
}

// ---- Product Modal -----------------------------------------
function openModal(product) {
    currentProduct = product;
    modalQty = 1;
    document.getElementById('modal-qty-display').textContent = 1;

    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-brand').textContent = product.brand;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-volume').textContent = product.volume || '';

    const mainImg = document.getElementById('modal-image');
    mainImg.src = product.image;
    mainImg.alt = product.name;

    const thumbsContainer = document.getElementById('modal-thumbnails');
    const images = (product.images && product.images.length > 1) ? product.images : null;
    if (images) {
        thumbsContainer.style.display = 'flex';
        thumbsContainer.innerHTML = images.map(src =>
            `<img src="${src}" role="button" tabindex="0" onclick="document.getElementById('modal-image').src=this.src" 
             style="width:56px;height:56px;object-fit:cover;border-radius:6px;cursor:pointer;border:2px solid var(--border);transition:border-color 0.2s;flex-shrink:0;" 
             onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'" loading="lazy">`
        ).join('');
    } else {
        thumbsContainer.style.display = 'none';
        thumbsContainer.innerHTML = '';
    }

    document.getElementById('modal-desc').textContent = product.description || '';

    // ---- Olfactive Notes Pyramid ----
    const pyramidEl = document.getElementById('olfactive-pyramid');
    const hasNotes = product.notes_top || product.notes_heart || product.notes_base;
    if (hasNotes) {
        pyramidEl.style.display = 'block';
        document.getElementById('note-top-value').textContent = product.notes_top || '—';
        document.getElementById('note-heart-value').textContent = product.notes_heart || '—';
        document.getElementById('note-base-value').textContent = product.notes_base || '—';
        
        // Show/hide individual notes
        document.getElementById('note-top').style.display = product.notes_top ? 'flex' : 'none';
        document.getElementById('note-heart').style.display = product.notes_heart ? 'flex' : 'none';
        document.getElementById('note-base').style.display = product.notes_base ? 'flex' : 'none';
    } else {
        pyramidEl.style.display = 'none';
    }

    // ---- Olfactive Family ----
    const familyEl = document.getElementById('modal-olfactive-family');
    if (product.olfactive_family) {
        const family = OLFACTIVE_FAMILIES.find(f => f.key === product.olfactive_family);
        if (family) {
            familyEl.style.display = 'flex';
            document.getElementById('modal-family-value').textContent = `${family.icon} ${family.label}`;
        } else {
            familyEl.style.display = 'none';
        }
    } else {
        familyEl.style.display = 'none';
    }

    // Tags
    const tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = (product.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    // Badges
    const badgesEl = document.getElementById('modal-badges');
    const badges = [];
    if (product.promoPrice) badges.push(`<span class="badge badge-promo">Promotion</span>`);
    if (product.featured) badges.push(`<span class="badge badge-featured">Vedette</span>`);
    badgesEl.innerHTML = badges.join('');

    // Price
    const priceOrig = document.getElementById('modal-price-original');
    const priceCur = document.getElementById('modal-price-current');
    const priceSave = document.getElementById('modal-price-save');
    if (product.promoPrice) {
        priceOrig.style.display = 'block';
        priceOrig.textContent = formatPrice(product.price);
        priceCur.textContent = formatPrice(product.promoPrice);
        priceSave.style.display = 'block';
        const save = product.price - product.promoPrice;
        priceSave.textContent = `Économie : ${formatPrice(save)} (${Math.round(save / product.price * 100)}%)`;
    } else {
        priceOrig.style.display = 'none';
        priceCur.textContent = formatPrice(product.price);
        priceSave.style.display = 'none';
    }

    // Stock
    const stockEl = document.getElementById('modal-stock-info');
    const dot = document.getElementById('stock-dot');
    const addBtn = document.getElementById('modal-add-btn');
    if (product.stock === 0) {
        dot.className = 'stock-dot out';
        stockEl.textContent = 'Rupture de stock';
        addBtn.disabled = true;
        addBtn.innerHTML = '<i class="fas fa-ban"></i> Indisponible';
    } else if (product.stock <= 5) {
        dot.className = 'stock-dot low';
        stockEl.textContent = `Plus que ${product.stock} en stock !`;
        addBtn.disabled = false;
        addBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Ajouter au panier';
    } else {
        dot.className = 'stock-dot in';
        stockEl.textContent = 'En stock';
        addBtn.disabled = false;
        addBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Ajouter au panier';
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
    currentProduct = null;
}

// ---- Cart --------------------------------------------------
function loadCart() {
    try {
        const stored = sessionStorage.getItem('amir_parfume_cart');
        cart = stored ? JSON.parse(stored) : [];
    } catch (e) { cart = []; }
    updateCartUI();
}

function saveCart() {
    try { sessionStorage.setItem('amir_parfume_cart', JSON.stringify(cart)); } catch (e) { }
    updateCartUI();
}

function addToCart(product, qty = 1) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
        cart.push({ ...product, qty });
    }
    saveCart();
    showToast('success', `${product.name} ajouté au panier`, 'fa-check-circle');
    const badge = document.querySelector('.cart-badge');
    badge.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300 });
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty = Math.max(1, Math.min(item.qty + delta, item.stock));
        if (item.qty <= 0) removeFromCart(id);
        else saveCart();
    }
}

function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.querySelector('.cart-badge');
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
    renderCartItems();
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const total = cart.reduce((s, i) => s + (i.promoPrice || i.price) * i.qty, 0);
    document.getElementById('cart-total-amount').textContent = formatPrice(total);

    if (cart.length === 0) {
        list.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Votre panier est vide</p></div>`;
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    document.getElementById('checkout-btn').disabled = false;

    const errImg = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect fill=%22%230f0f1a%22 width=%2280%22 height=%2280%22/><text x=%2240%22 y=%2245%22 text-anchor=%22middle%22 fill=%22%23c9a84c%22 font-size=%2228%22>✦</text></svg>`;
    list.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='${errImg}'">
      <div class="cart-item-info">
        <p class="cart-item-brand">${item.brand}</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice((item.promoPrice || item.price) * item.qty)}</p>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}',-1)" aria-label="Diminuer quantité"><i class="fas fa-minus"></i></button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}',1)" aria-label="Augmenter quantité"><i class="fas fa-plus"></i></button>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Supprimer du panier"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

function openCart() {
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
}

// ---- Checkout ----------------------------------------------
function showCheckout() {
    if (cart.length === 0) { showToast('error', 'Votre panier est vide', 'fa-exclamation-circle'); return; }
    const subtotal = cart.reduce((s, i) => s + (i.promoPrice || i.price) * i.qty, 0);
    document.getElementById('summary-items').innerHTML = cart.map(item => `
    <div class="summary-item">
      <span class="summary-item-name">${item.name}</span>
      <span class="summary-item-qty">×${item.qty}</span>
      <span class="summary-item-price">${formatPrice((item.promoPrice || item.price) * item.qty)}</span>
    </div>`).join('');

    updateShippingCost();
    document.getElementById('checkout').classList.add('visible');
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
}

function hideCheckout() {
    document.getElementById('checkout').classList.remove('visible');
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

async function submitOrder(e) {
    const form = e.target;
    const required = ['firstName', 'lastName', 'phone', 'address', 'wilaya', 'commune'];
    let valid = true;

    required.forEach(field => {
        const el = form.querySelector(`[name="${field}"]`);
        if (!el || !el.value.trim()) {
            if (el) el.classList.add('error');
            valid = false;
        } else {
            el.classList.remove('error');
        }
    });

    // Phone validation (Algerian format)
    const phoneEl = form.querySelector('[name="phone"]');
    if (phoneEl && phoneEl.value.trim()) {
        const phone = phoneEl.value.replace(/\s/g, '');
        if (!/^(05|06|07)\d{8}$/.test(phone)) {
            phoneEl.classList.add('error');
            showToast('error', 'Numéro de téléphone invalide (05/06/07 XX XX XX XX)', 'fa-exclamation-circle');
            return;
        }
    }

    if (!valid) { showToast('error', 'Veuillez remplir tous les champs obligatoires', 'fa-exclamation-circle'); return; }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    try {
        const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'home';
        const shippingCost = getShippingCost();
        const subtotal = cart.reduce((s, i) => s + (i.promoPrice || i.price) * i.qty, 0);

        const order = {
            customer: {
                firstName: form.firstName.value.trim(),
                lastName: form.lastName.value.trim(),
                phone: form.phone.value.trim(),
                address: form.address.value.trim(),
                commune: form.commune.value,
                wilaya: form.wilaya.value,
                email: form.email ? form.email.value.trim() : '',
                notes: form.notes.value.trim()
            },
            items: cart.map(i => ({ id: i.id, name: i.name, brand: i.brand, price: i.promoPrice || i.price, qty: i.qty })),
            total: subtotal + shippingCost,
            subtotal: subtotal,
            shipping_cost: shippingCost,
            delivery_method: deliveryMethod
        };

        const savedOrder = await DB.saveOrder(order);

        // Store for printing
        lastOrder = { ...order, ...savedOrder, order_number: savedOrder.order_number || savedOrder.id || 'CMD-' + Date.now() };

        form.reset();
        // Reset commune selector
        const communesSel = document.getElementById('commune');
        if (communesSel) {
            communesSel.innerHTML = '<option value="">Choisir d\'abord une wilaya...</option>';
            communesSel.disabled = true;
        }
        cart = [];
        saveCart();
        updateCartUI();

        // Show confirmation
        const orderNum = lastOrder.order_number;
        document.getElementById('confirm-order-num').textContent = orderNum;

        // Build confirmation summary
        buildConfirmSummary(lastOrder);

        document.getElementById('confirm-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
        hideCheckout();
    } catch (err) {
        showToast('error', 'Erreur lors de la commande, réessayez', 'fa-exclamation-circle');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Confirmer la Commande';
    }
}

// ---- Order Confirmation Summary ----------------------------
function buildConfirmSummary(order) {
    const el = document.getElementById('confirm-summary');
    const deliveryLabel = order.delivery_method === 'relay' ? 'Point relais' : 'Livraison à domicile';
    
    el.innerHTML = `
    <div class="confirm-summary-section">
      <div class="confirm-summary-row">
        <span><i class="fas fa-user"></i> ${order.customer.firstName} ${order.customer.lastName}</span>
        <span><i class="fas fa-phone"></i> ${order.customer.phone}</span>
      </div>
      <div class="confirm-summary-row">
        <span><i class="fas fa-map-marker-alt"></i> ${order.customer.commune}, ${order.customer.wilaya}</span>
      </div>
      <div class="confirm-summary-row">
        <span><i class="fas fa-${order.delivery_method === 'relay' ? 'store' : 'home'}"></i> ${deliveryLabel}</span>
      </div>
    </div>
    <div class="confirm-summary-section">
      ${order.items.map(i => `
        <div class="confirm-summary-item">
          <span>${i.name} x${i.qty}</span>
          <span>${formatPrice(i.price * i.qty)}</span>
        </div>
      `).join('')}
      <div class="confirm-summary-total">
        <span>Livraison</span>
        <span>${order.shipping_cost === 0 ? 'Gratuite' : formatPrice(order.shipping_cost)}</span>
      </div>
      <div class="confirm-summary-total confirm-grand-total">
        <span>Total</span>
        <span>${formatPrice(order.total)}</span>
      </div>
    </div>`;
}

// ---- Print & PDF -------------------------------------------
function preparePrintData(order) {
    if (!order) return;
    const deliveryLabel = order.delivery_method === 'relay' ? 'Retrait en point relais' : 'Livraison à domicile';

    document.getElementById('print-order-num').textContent = order.order_number;
    document.getElementById('print-order-date').textContent = new Date(order.date || Date.now()).toLocaleDateString('fr-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    document.getElementById('print-name').textContent = `${order.customer.firstName} ${order.customer.lastName}`;
    document.getElementById('print-phone').textContent = order.customer.phone;
    document.getElementById('print-email').textContent = order.customer.email || '—';
    document.getElementById('print-wilaya').textContent = order.customer.wilaya;
    document.getElementById('print-commune').textContent = order.customer.commune || '—';
    document.getElementById('print-address').textContent = order.customer.address;
    document.getElementById('print-delivery').textContent = deliveryLabel;
    document.getElementById('print-notes').textContent = order.customer.notes || '—';

    document.getElementById('print-items').innerHTML = order.items.map(i => `
      <tr>
        <td>${i.name}</td>
        <td>${i.brand}</td>
        <td>${formatPrice(i.price)}</td>
        <td>${i.qty}</td>
        <td>${formatPrice(i.price * i.qty)}</td>
      </tr>
    `).join('');

    document.getElementById('print-subtotal').textContent = formatPrice(order.subtotal || order.total);
    document.getElementById('print-shipping').textContent = order.shipping_cost === 0 ? 'Gratuite' : formatPrice(order.shipping_cost || 0);
    document.getElementById('print-total').textContent = formatPrice(order.total);
}

function printOrder() {
    if (!lastOrder) return;
    preparePrintData(lastOrder);
    
    const printEl = document.getElementById('printable-order');
    printEl.style.display = 'block';
    printEl.style.position = 'absolute';
    printEl.style.top = '0';
    document.body.classList.add('printing');
    
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.body.classList.remove('printing');
            printEl.style.display = 'none';
            printEl.style.position = '';
            printEl.style.top = '';
        }, 3000); // Wait for mobile OS snapshot
    }, 150); // Allow browser to layout before print
}

function downloadOrderPDF() {
    if (!lastOrder) return;
    preparePrintData(lastOrder);
    
    const printEl = document.getElementById('printable-order');
    printEl.style.display = 'block';
    
    const originalPos = printEl.style.position;
    const originalTop = printEl.style.top;
    const originalZ = printEl.style.zIndex;
    printEl.style.position = 'absolute';
    printEl.style.top = '0';
    printEl.style.zIndex = '9999';

    const options = {
        margin: [10, 10, 10, 10],
        filename: `Commande_${lastOrder.order_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(printEl).save().then(() => {
        printEl.style.display = 'none';
        printEl.style.position = originalPos;
        printEl.style.top = originalTop;
        printEl.style.zIndex = originalZ;
    }).catch(() => {
        printEl.style.display = 'none';
        printEl.style.position = originalPos;
        printEl.style.top = originalTop;
        printEl.style.zIndex = originalZ;
        showToast('error', 'Erreur lors de la génération du PDF', 'fa-exclamation-circle');
    });
}

// ---- Toast -------------------------------------------------
function showToast(type, message, icon) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ---- Helpers -----------------------------------------------
function formatPrice(n) {
    return new Intl.NumberFormat('fr-DZ', { minimumFractionDigits: 0 }).format(n) + ' DA';
}
