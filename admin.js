// ============================================================
//  AMIR PARFUME - Admin Logic v5
//  Extended: 5 statuses, delivery slips, product notes, filters
// ============================================================

let currentView = 'dashboard-view';
let products = [];
let orders = [];
let settings = {};
let currentEditId = null;
let currentOrderId = null;

// Pagination
let currentPageOrders = 1;
let itemsPerPageOrders = 15;
let currentPageProducts = 1;
let itemsPerPageProducts = 15;

const App = {
  async init() {
    this.checkAuth();
    this.bindEvents();
    if (localStorage.getItem('admin_logged_in') === 'true') {
      document.getElementById('login-view').style.display = 'none';
      document.getElementById('admin-layout').style.display = 'flex';
      await this.loadData();
      this.navigate('dashboard-view');
      this.populateFilters();
    }
  },

  checkAuth() {
    const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
    if (!isAdmin) {
      document.getElementById('login-view').style.display = 'flex';
      document.getElementById('admin-layout').style.display = 'none';
    }
  },

  async handleLogin(e) {
    if (e) e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const admin = DB.getAdmin();

    if (u === admin.username && p === admin.password) {
      localStorage.setItem('admin_logged_in', 'true');
      document.getElementById('login-view').style.display = 'none';
      document.getElementById('admin-layout').style.display = 'flex';
      showToast('success', 'Connexion réussie', 'fa-check');
      await this.loadData();
      this.navigate('dashboard-view');
      this.populateFilters();
    } else {
      showToast('error', 'Identifiants incorrects', 'fa-exclamation-circle');
    }
  },

  logout() {
    localStorage.removeItem('admin_logged_in');
    location.reload();
  },

  async loadData() {
    products = await DB.getProducts();
    orders = await DB.getOrders();
    settings = await DB.getSettings();
    this.updateDashboard();
    this.renderProducts();
    this.renderOrders();
    this.initSettings();
  },

  navigate(viewId) {
    currentView = viewId;
    document.querySelectorAll('.admin-page').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    const btn = document.querySelector(`.nav-btn[data-target="${viewId}"]`);
    if(btn) btn.classList.add('active');

    const titles = {
      'dashboard-view': 'Tableau de Bord',
      'orders-view': 'Gestion des Commandes',
      'products-view': 'Catalogue de Produits',
      'settings-view': 'Paramètres'
    };
    document.getElementById('breadcrumb').textContent = titles[viewId] || '';

    if (window.innerWidth <= 992) {
      document.getElementById('sidebar').classList.remove('open');
    }

    if (viewId === 'orders-view') this.renderOrders();
    if (viewId === 'products-view') this.renderProducts();
  },

  bindEvents() {
    document.getElementById('login-form').addEventListener('submit', e => this.handleLogin(e));
    document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    
    document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
      btn.addEventListener('click', () => this.navigate(btn.dataset.target));
    });

    document.getElementById('hamburger-admin').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
    document.getElementById('sidebar-close').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
    });

    // Products
    document.getElementById('btn-add-product').addEventListener('click', () => this.openProductModal());
    document.getElementById('close-product-btn').addEventListener('click', () => this.closeModal('product-modal'));
    document.getElementById('cancel-product-btn').addEventListener('click', () => this.closeModal('product-modal'));
    document.getElementById('product-form').addEventListener('submit', e => this.saveProduct(e));
    
    document.getElementById('product-search').addEventListener('input', () => this.renderProducts());
    document.getElementById('product-cat-filter').addEventListener('change', () => this.renderProducts());
    document.getElementById('product-stock-filter').addEventListener('change', () => this.renderProducts());
    document.getElementById('product-visibility-filter').addEventListener('change', () => this.renderProducts());

    // Orders
    document.getElementById('order-search').addEventListener('input', () => this.renderOrders());
    document.getElementById('order-status-filter').addEventListener('change', () => this.renderOrders());
    document.getElementById('order-wilaya-filter').addEventListener('change', () => this.renderOrders());
    document.getElementById('order-date-filter').addEventListener('change', () => this.renderOrders());
    document.getElementById('refresh-orders-btn').addEventListener('click', async () => {
      orders = await DB.getOrders();
      this.renderOrders();
      this.updateDashboard();
      showToast('success', 'Commandes actualisées', 'fa-sync');
    });

    document.getElementById('close-order-btn').addEventListener('click', () => this.closeModal('order-modal'));
    document.getElementById('btn-update-status').addEventListener('click', () => this.updateOrderStatus());
    document.getElementById('btn-delete-order').addEventListener('click', () => this.deleteOrder());
    document.getElementById('btn-print-slip').addEventListener('click', () => this.printDeliverySlip());

    // Settings
    document.getElementById('btn-save-settings').addEventListener('click', () => this.saveSettings());
    document.getElementById('btn-save-credentials').addEventListener('click', () => this.updateAdminCredentials());

    // Modal overlay click
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => {
        if (e.target === ov) ov.classList.remove('open');
      });
    });
  },

  populateFilters() {
    const sel = document.getElementById('order-wilaya-filter');
    if(sel && sel.options.length <= 1) { // Populate only once
        if (typeof WILAYAS !== 'undefined') {
            WILAYAS.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.name;
                opt.textContent = w.name;
                sel.appendChild(opt);
            });
        }
    }
  },

  // ---- Dashboard --------------------------------------------
  updateDashboard() {
    const todayStr = new Date().toISOString().split('T')[0];
    let dailyOrders = 0;
    let dailyRev = 0;
    let pendingCount = 0;
    let outOfStock = products.filter(p => p.stock <= 0).length;

    orders.forEach(o => {
      if (o.status === 'pending') pendingCount++;
      const orderDate = o.date ? o.date.split('T')[0] : '';
      if (orderDate === todayStr) {
        dailyOrders++;
        if (o.status !== 'cancelled') dailyRev += o.total;
      }
    });

    document.getElementById('stat-orders-today').textContent = dailyOrders;
    document.getElementById('stat-rev-today').textContent = formatPrice(dailyRev);
    document.getElementById('stat-pending').textContent = pendingCount;
    document.getElementById('stat-out').textContent = outOfStock;

    const navBadge = document.getElementById('nav-pending-badge');
    if (pendingCount > 0) {
      navBadge.style.display = 'flex';
      navBadge.textContent = pendingCount;
    } else {
      navBadge.style.display = 'none';
    }

    // Top sales logic (mock calculation based on orders)
    let productSales = {};
    orders.forEach(o => {
      if(o.status !== 'cancelled') {
        (o.items || []).forEach(i => {
           productSales[i.id] = (productSales[i.id] || 0) + i.qty;
        });
      }
    });

    let topProducts = products.map(p => ({
        ...p,
        soldQty: productSales[p.id] || 0
    })).sort((a,b) => b.soldQty - a.soldQty).slice(0, 5);

    const dashProducts = document.getElementById('dash-stock-body');
    if (topProducts.length === 0) {
      dashProducts.innerHTML = `<div class="p-3 text-center text-muted">Aucun produit à afficher.</div>`;
    } else {
      dashProducts.innerHTML = topProducts.map(p => `
        <div class="dash-product-item pb-2 mb-2" style="border-bottom:1px solid var(--border)">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <img src="${p.image}" style="width:32px;height:32px;border-radius:4px;object-fit:cover" onerror="this.src='data:image/svg+xml,...'">
              <div>
                <div style="font-weight:600;font-size:0.9rem">${p.name} <span class="badge ${p.stock<=0 ? 'badge-danger' : (p.stock<=5 ? 'badge-warning' : '')}">${p.stock<=0?'Rupture':(p.stock<=5?`Stock: ${p.stock}`:'')}</span></div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Vendus: ${p.soldQty}</div>
              </div>
            </div>
            <div class="gold-text" style="font-weight:600">${formatPrice(p.promoPrice || p.price)}</div>
          </div>
        </div>
      `).join('');
    }

    // Latest Orders
    const recentOrders = orders.slice(0, 5);
    const tbody = document.getElementById('dash-orders-body');
    if (recentOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center">Aucune commande.</td></tr>`;
    } else {
      tbody.innerHTML = recentOrders.map(o => `
        <tr style="cursor:pointer" onclick="App.openOrderModal(${o.id})">
          <td><strong>${o.order_number || o.id}</strong></td>
          <td>${o.customer.firstName} ${o.customer.lastName}</td>
          <td>${formatDateShort(o.date)}</td>
          <td>${formatPrice(o.total)}</td>
          <td>${this.getStatusBadge(o.status)}</td>
        </tr>
      `).join('');
    }
  },

  // ---- Products ---------------------------------------------
  renderProducts() {
    const tbody = document.getElementById('products-table-body');
    const sq = document.getElementById('product-search').value.toLowerCase();
    const catF = document.getElementById('product-cat-filter').value;
    const stkF = document.getElementById('product-stock-filter').value;
    const visF = document.getElementById('product-visibility-filter').value;

    let filtered = products.filter(p => {
      const matchQ = p.name.toLowerCase().includes(sq) || p.brand.toLowerCase().includes(sq);
      const matchCat = catF === 'all' || p.category === catF;
      
      let matchStk = true;
      if (stkF === 'instock') matchStk = p.stock > 0;
      if (stkF === 'lowstock') matchStk = p.stock > 0 && p.stock <= 5;
      if (stkF === 'outstock') matchStk = p.stock <= 0;

      let matchVis = true;
      if (visF === 'visible') matchVis = !p.hidden;
      if (visF === 'hidden') matchVis = p.hidden;

      return matchQ && matchCat && matchStk && matchVis;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPageProducts);
    if (currentPageProducts > totalPages && totalPages > 0) currentPageProducts = totalPages;

    const start = (currentPageProducts - 1) * itemsPerPageProducts;
    const paginated = filtered.slice(start, start + itemsPerPageProducts);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Aucun produit trouvé.</td></tr>`;
      document.getElementById('products-pagination').innerHTML = '';
      return;
    }

    tbody.innerHTML = paginated.map(p => `
      <tr>
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-img" onerror="this.src='data:image/svg+xml,...'">
        </td>
        <td>
          <strong>${p.name}</strong><br>
          <span class="text-muted small">${p.brand} ${p.hidden ? '<i class="fas fa-eye-slash text-warning ml-1" title="Masqué"></i>' : ''}</span>
        </td>
        <td><span class="badge" style="background:var(--border);color:var(--text-primary)">${p.category}</span></td>
        <td>${p.promoPrice ? `<del class="text-muted small">${formatPrice(p.price)}</del><br><span class="gold-text">${formatPrice(p.promoPrice)}</span>` : formatPrice(p.price)}</td>
        <td>
          <span class="badge ${p.stock <= 0 ? 'badge-danger' : (p.stock <= 5 ? 'badge-warning' : 'badge-success')}">
            ${p.stock} Unités
          </span>
        </td>
        <td>
           ${p.featured ? '<span class="badge badge-featured mb-1"><i class="fas fa-star"></i> Vedette</span><br>' : ''}
           ${p.promoPrice ? '<span class="badge badge-promo">Promo</span>' : ''}
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" onclick="App.openProductModal('${p.id}')" title="Modifier"><i class="fas fa-edit"></i></button>
            <button class="btn-icon text-warning" onclick="App.toggleProductVis('${p.id}')" title="${p.hidden ? 'Afficher' : 'Masquer'}">
              <i class="fas fa-eye${p.hidden ? '' : '-slash'}"></i>
            </button>
            <button class="btn-icon text-danger" onclick="App.deleteProduct('${p.id}')" title="Supprimer"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    this.renderPagination('products-pagination', totalPages, currentPageProducts, (page) => {
      currentPageProducts = page;
      this.renderProducts();
    });
  },

  openProductModal(id = null) {
    currentEditId = id;
    const form = document.getElementById('product-form');
    form.reset();

    if (id) {
      const p = products.find(x => x.id === id);
      if (p) {
        document.getElementById('product-modal-title').textContent = 'Modifier le Produit';
        document.getElementById('p-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-brand').value = p.brand;
        document.getElementById('p-category').value = p.category;
        document.getElementById('p-volume').value = p.volume || '';
        document.getElementById('p-desc').value = p.description || '';
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-promo').value = p.promoPrice || '';
        document.getElementById('p-stock').value = p.stock;
        
        document.getElementById('p-family').value = p.olfactive_family || '';
        document.getElementById('p-notes-top').value = p.notes_top || '';
        document.getElementById('p-notes-heart').value = p.notes_heart || '';
        document.getElementById('p-notes-base').value = p.notes_base || '';

        document.getElementById('p-image').value = p.image;
        document.getElementById('p-images').value = p.images ? p.images.join(',') : '';
        document.getElementById('p-tags').value = p.tags ? p.tags.join(',') : '';
        document.getElementById('p-featured').checked = p.featured;
        document.getElementById('p-hidden').checked = p.hidden;
      }
    } else {
      document.getElementById('product-modal-title').textContent = 'Nouveau Produit';
      document.getElementById('p-id').value = '';
    }

    document.getElementById('product-modal').classList.add('open');
  },

  async saveProduct(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';

    const p = {
      id: document.getElementById('p-id').value || undefined,
      name: document.getElementById('p-name').value,
      brand: document.getElementById('p-brand').value,
      category: document.getElementById('p-category').value,
      volume: document.getElementById('p-volume').value,
      description: document.getElementById('p-desc').value,
      price: parseInt(document.getElementById('p-price').value) || 0,
      promoPrice: parseInt(document.getElementById('p-promo').value) || null,
      stock: parseInt(document.getElementById('p-stock').value) || 0,
      
      olfactive_family: document.getElementById('p-family').value,
      notes_top: document.getElementById('p-notes-top').value,
      notes_heart: document.getElementById('p-notes-heart').value,
      notes_base: document.getElementById('p-notes-base').value,

      image: document.getElementById('p-image').value,
      images: document.getElementById('p-images').value.split(',').map(s => s.trim()).filter(s => s),
      tags: document.getElementById('p-tags').value.split(',').map(s => s.trim()).filter(s => s),
      featured: document.getElementById('p-featured').checked,
      hidden: document.getElementById('p-hidden').checked
    };

    try {
      await DB.saveProduct(p);
      products = await DB.getProducts();
      this.renderProducts();
      this.updateDashboard();
      this.closeModal('product-modal');
      showToast('success', 'Produit enregistré', 'fa-check');
    } catch (err) {
      showToast('error', 'Erreur lors de l\'enregistrement', 'fa-exclamation-triangle');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enregistrer';
    }
  },

  async toggleProductVis(id) {
    await DB.toggleProductVisibility(id);
    products = await DB.getProducts();
    this.renderProducts();
  },

  async deleteProduct(id) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      await DB.deleteProduct(id);
      products = await DB.getProducts();
      this.renderProducts();
      this.updateDashboard();
      showToast('success', 'Produit supprimé', 'fa-trash');
    }
  },

  // ---- Orders -----------------------------------------------
  renderOrders() {
    const tbody = document.getElementById('orders-table-body');
    const sq = document.getElementById('order-search').value.toLowerCase();
    const statF = document.getElementById('order-status-filter').value;
    const wilF = document.getElementById('order-wilaya-filter').value;
    const dateF = document.getElementById('order-date-filter').value;

    let filtered = orders.filter(o => {
      const matchQ = (o.order_number || String(o.id)).toLowerCase().includes(sq) ||
                     o.customer.firstName.toLowerCase().includes(sq) ||
                     o.customer.lastName.toLowerCase().includes(sq) ||
                     o.customer.phone.includes(sq);
      
      const matchStat = statF === 'all' || o.status === statF;
      const matchWil = wilF === 'all' || o.customer.wilaya === wilF;
      
      let matchDate = true;
      if (dateF !== 'all') {
         const oDate = new Date(o.date);
         const now = new Date();
         const diffTime = Math.abs(now - oDate);
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
         if (dateF === 'today') matchDate = diffDays <= 1 && oDate.getDate() === now.getDate();
         else if (dateF === '7days') matchDate = diffDays <= 7;
         else if (dateF === '30days') matchDate = diffDays <= 30;
      }

      return matchQ && matchStat && matchWil && matchDate;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPageOrders);
    if (currentPageOrders > totalPages && totalPages > 0) currentPageOrders = totalPages;

    const start = (currentPageOrders - 1) * itemsPerPageOrders;
    const paginated = filtered.slice(start, start + itemsPerPageOrders);

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Aucune commande trouvée.</td></tr>`;
      document.getElementById('orders-pagination').innerHTML = '';
      return;
    }

    tbody.innerHTML = paginated.map(o => `
      <tr>
        <td><strong>${o.order_number || o.id}</strong></td>
        <td>${formatDateShort(o.date)}</td>
        <td>${o.customer.firstName} ${o.customer.lastName}<br><span class="text-muted small">${o.customer.phone}</span></td>
        <td>${o.customer.wilaya}<br><span class="badge" style="background:var(--border);color:var(--text-primary);font-size:0.75rem"><i class="fas fa-${o.delivery_method==='relay'?'store':'home'}"></i> ${o.delivery_method==='relay'?'Relais':'Domicile'}</span></td>
        <td>${o.items.reduce((s,i)=>s+i.qty,0)} art.</td>
        <td><strong>${formatPrice(o.total)}</strong></td>
        <td>${this.getStatusBadge(o.status)}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="App.openOrderModal(${o.id})">Gérer</button>
        </td>
      </tr>
    `).join('');

    this.renderPagination('orders-pagination', totalPages, currentPageOrders, (page) => {
      currentPageOrders = page;
      this.renderOrders();
    });
  },

  openOrderModal(id) {
    currentOrderId = id;
    const o = orders.find(x => x.id === id);
    if (!o) return;

    document.getElementById('o-ref').textContent = o.order_number || o.id;
    document.getElementById('o-status-badge').innerHTML = this.getStatusBadge(o.status);
    document.getElementById('o-name').textContent = `${o.customer.firstName} ${o.customer.lastName}`;
    document.getElementById('o-phone').textContent = o.customer.phone;
    document.getElementById('o-email').textContent = o.customer.email || '—';
    document.getElementById('o-wilaya').textContent = o.customer.wilaya;
    document.getElementById('o-commune').textContent = o.customer.commune || '—';
    document.getElementById('o-address').textContent = o.customer.address;
    document.getElementById('o-method').textContent = o.delivery_method === 'relay' ? 'Retrait en point relais' : 'Livraison à domicile';
    document.getElementById('o-date').textContent = new Date(o.date).toLocaleString('fr-DZ');
    document.getElementById('o-updated').textContent = o.updated_at ? new Date(o.updated_at).toLocaleString('fr-DZ') : '—';
    document.getElementById('o-notes').textContent = o.customer.notes || '—';

    document.getElementById('o-items-body').innerHTML = o.items.map(i => `
      <tr>
        <td>${i.name} <span class="text-muted small d-block">${i.brand}</span></td>
        <td>${formatPrice(i.price)}</td>
        <td>${i.qty}</td>
        <td>${formatPrice(i.price * i.qty)}</td>
      </tr>
    `).join('');

    document.getElementById('o-subtotal').textContent = formatPrice(o.subtotal || o.total);
    document.getElementById('o-shipping').textContent = o.shipping_cost === 0 ? 'Gratuite' : formatPrice(o.shipping_cost || 0);
    document.getElementById('o-total').textContent = formatPrice(o.total);

    document.getElementById('o-status-select').value = o.status;
    document.getElementById('order-modal').classList.add('open');
  },

  async updateOrderStatus() {
    const status = document.getElementById('o-status-select').value;
    if (currentOrderId) {
      await DB.updateOrderStatus(currentOrderId, status);
      orders = await DB.getOrders();
      this.renderOrders();
      this.updateDashboard();
      
      const o = orders.find(x => x.id === currentOrderId);
      if(o) {
        document.getElementById('o-status-badge').innerHTML = this.getStatusBadge(o.status);
        document.getElementById('o-updated').textContent = o.updated_at ? new Date(o.updated_at).toLocaleString('fr-DZ') : '—';
      }
      showToast('success', 'Statut mis à jour', 'fa-check');
    }
  },

  async deleteOrder() {
    if (currentOrderId && confirm('Attention : Cette action est irréversible. Supprimer cette commande ?')) {
      await DB.deleteOrder(currentOrderId);
      orders = await DB.getOrders();
      this.renderOrders();
      this.updateDashboard();
      this.closeModal('order-modal');
      showToast('success', 'Commande supprimée', 'fa-trash');
    }
  },

  printDeliverySlip() {
    if (!currentOrderId) return;
    const o = orders.find(x => x.id === currentOrderId);
    if (!o) return;

    document.getElementById('slip-ref').textContent = o.order_number || o.id;
    // Basic barcode representation for styling
    document.getElementById('slip-barcode').textContent = `*${o.order_number || o.id}*`;
    
    document.getElementById('slip-c-name').textContent = `${o.customer.firstName} ${o.customer.lastName}`;
    document.getElementById('slip-c-phone').textContent = o.customer.phone;
    document.getElementById('slip-c-address').textContent = o.customer.address;
    document.getElementById('slip-c-commune').textContent = o.customer.commune || '';
    document.getElementById('slip-c-wilaya').textContent = o.customer.wilaya;
    document.getElementById('slip-c-method').textContent = o.delivery_method === 'relay' ? 'Retrait en point relais' : 'Livraison à domicile';

    document.getElementById('slip-items-body').innerHTML = o.items.map(i => `
      <tr>
        <td>${i.name} - ${i.brand}</td>
        <td style="text-align:center">${i.qty}</td>
        <td style="text-align:right">${formatPrice(i.price)}</td>
        <td style="text-align:right">${formatPrice(i.price * i.qty)}</td>
      </tr>
    `).join('');

    document.getElementById('slip-subtotal').textContent = formatPrice(o.subtotal || o.total);
    document.getElementById('slip-shipping').textContent = o.shipping_cost === 0 ? 'Gratuite' : formatPrice(o.shipping_cost || 0);
    document.getElementById('slip-total').textContent = formatPrice(o.total);

    const slipEl = document.getElementById('printable-slip');
    slipEl.style.display = 'block';
    document.body.classList.add('printing-slip');
    
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.body.classList.remove('printing-slip');
            slipEl.style.display = 'none';
        }, 3000);
    }, 150);
  },

  getStatusBadge(status) {
    const badges = {
      pending: `<span class="badge badge-warning"><i class="fas fa-clock"></i> Nouvelle</span>`,
      confirmed: `<span class="badge badge-info" style="background:rgba(52,152,219,0.15);color:#3498db;border:1px solid rgba(52,152,219,0.3)"><i class="fas fa-check"></i> Confirmée</span>`,
      shipped: `<span class="badge badge-primary" style="background:rgba(155,89,182,0.15);color:#9b59b6;border:1px solid rgba(155,89,182,0.3)"><i class="fas fa-truck"></i> Expédiée</span>`,
      delivered: `<span class="badge badge-success"><i class="fas fa-check-double"></i> Livrée</span>`,
      cancelled: `<span class="badge badge-danger"><i class="fas fa-times"></i> Annulée</span>`
    };
    return badges[status] || `<span class="badge">${status}</span>`;
  },

  // ---- Settings ---------------------------------------------
  initSettings() {
    document.getElementById('set-store-name').value = settings.store_name || 'Amir Parfume';
    document.getElementById('set-phone').value = settings.store_phone || '0540 56 76 53';
    document.getElementById('set-whatsapp').value = settings.store_whatsapp || '213540567653';
    document.getElementById('set-hero-bg').value = settings.heroBackground || '';
    
    const sc = settings.shipping_config || {};
    document.getElementById('set-free-threshold').value = sc.free_threshold || 15000;
    document.getElementById('set-home-cost').value = sc.home_delivery_cost || 600;
    document.getElementById('set-relay-cost').value = sc.relay_delivery_cost || 400;

    const admin = DB.getAdmin();
    document.getElementById('admin-username').value = admin.username;
  },

  async saveSettings() {
    const newSet = {
      store_name: document.getElementById('set-store-name').value,
      store_phone: document.getElementById('set-phone').value,
      store_whatsapp: document.getElementById('set-whatsapp').value,
      heroBackground: document.getElementById('set-hero-bg').value,
      shipping_config: {
        free_threshold: parseInt(document.getElementById('set-free-threshold').value) || 15000,
        home_delivery_cost: parseInt(document.getElementById('set-home-cost').value) || 600,
        relay_delivery_cost: parseInt(document.getElementById('set-relay-cost').value) || 400
      }
    };
    await DB.saveSettings(newSet);
    settings = newSet;
    showToast('success', 'Paramètres enregistrés', 'fa-save');
  },

  updateAdminCredentials() {
    const un = document.getElementById('admin-username').value;
    const pw = document.getElementById('admin-password').value;
    if (!un) {
      showToast('error', 'Nom d\'utilisateur requis', 'fa-times');
      return;
    }
    const admin = DB.getAdmin();
    admin.username = un;
    if (pw) {
      if (pw.length < 6) {
        showToast('error', 'Mot de passe trop court', 'fa-times');
        return;
      }
      admin.password = pw;
    }
    localStorage.setItem(DB.ADMIN_KEY, JSON.stringify(admin));
    document.getElementById('admin-password').value = '';
    showToast('success', 'Identifiants mis à jour. Veuillez vous reconnecter.', 'fa-lock');
    setTimeout(() => this.logout(), 2000);
  },

  // ---- Utils ------------------------------------------------
  renderPagination(containerId, totalPages, current, onClick) {
    const el = document.getElementById(containerId);
    if (totalPages <= 1) { el.innerHTML = ''; return; }
    
    let html = `<button class="page-btn ${current === 1 ? 'disabled' : ''}" ${current === 1 ? 'disabled' : ''} data-page="${current - 1}"><i class="fas fa-chevron-left"></i> Précédent</button>`;
    
    // Simple pagination (show all if few, otherwise could add ellipsis)
    for (let i = 1; i <= totalPages; i++) {
        // Show bounds and current ± 2
        if(i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
            html += `<button class="page-num ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === current - 2 || i === current + 2) {
            html += `<span style="color:var(--text-muted);padding:0 5px">...</span>`;
        }
    }
    
    html += `<button class="page-btn ${current === totalPages ? 'disabled' : ''}" ${current === totalPages ? 'disabled' : ''} data-page="${current + 1}">Suivant <i class="fas fa-chevron-right"></i></button>`;
    el.innerHTML = html;

    el.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.hasAttribute('disabled')) onClick(parseInt(btn.getAttribute('data-page')));
      });
    });
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('open');
  }
};

function formatPrice(n) {
  return new Intl.NumberFormat('fr-DZ', { minimumFractionDigits: 0 }).format(n) + ' DA';
}

function formatDateShort(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(type, msg, icon) {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fas ${icon}"></i> <span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.classList.add('hide'), 2500);
  setTimeout(() => t.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => App.init());
