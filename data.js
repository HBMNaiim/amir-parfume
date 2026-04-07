// ============================================================
//  AMIR PARFUME - Data Layer (Supabase + LocalStorage Fallback)
//  v5 — Extended models with olfactive notes, delivery, statuses
// ============================================================

// CONFIGURATION SUPABASE
const SUPABASE_URL = 'https://seqjtokzwcfxdtptzbxr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcWp0b2t6d2NmeGR0cHR6YnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDcwODQsImV4cCI6MjA5MTEyMzA4NH0.68tTft9vM8PP4Ok32rzQfA1VDwJn-zp-VfBEFs_1FeU';

let dbClient = null;
if (typeof supabase !== 'undefined'
  && SUPABASE_URL.startsWith('https://')
  && !SUPABASE_KEY.startsWith('YOUR_')) {
  dbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const DB = {
  PRODUCTS_KEY: 'amir_parfume_products',
  ORDERS_KEY: 'amir_parfume_orders',
  ADMIN_KEY: 'amir_parfume_admin',
  COUNTER_KEY: 'amir_parfume_counter',
  SETTINGS_KEY: 'amir_parfume_settings',

  // ---- Settings ----------------------------------------------
  async getSettings() {
    if (dbClient) {
      const { data, error } = await dbClient.from('settings').select('*').limit(1);
      if (!error && data && data.length > 0) return data[0];
    }
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {
      heroBackground: '',
      store_name: 'Amir Parfume',
      store_phone: '0540 56 76 53',
      store_whatsapp: '213540567653',
      shipping_config: {
        free_threshold: 15000,
        home_delivery_cost: 600,
        relay_delivery_cost: 400
      }
    };
  },

  async saveSettings(settings) {
    if (dbClient) {
      const { data: existData } = await dbClient.from('settings').select('id').limit(1);
      if (existData && existData.length > 0) {
        const id = existData[0].id;
        await dbClient.from('settings').update(settings).eq('id', id);
      } else {
        await dbClient.from('settings').insert([settings]);
      }
    }
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },

  // ---- Admin ------------------------------------------------
  getAdmin() {
    const stored = localStorage.getItem(this.ADMIN_KEY);
    if (stored) return JSON.parse(stored);
    const defaultAdmin = { username: 'admin', password: 'parfum2024' };
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(defaultAdmin));
    return defaultAdmin;
  },

  // ---- Products --------------------------------------------
  async getProducts() {
    if (dbClient) {
      const { data, error } = await dbClient.from('products').select('*').order('created_at', { ascending: false });
      if (!error) return data;
    }
    const stored = localStorage.getItem(this.PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async getVisibleProducts() {
    const products = await this.getProducts();
    return products.filter(p => !p.hidden);
  },

  async saveProduct(product) {
    // Ensure new fields exist with defaults
    if (product.notes_top === undefined) product.notes_top = '';
    if (product.notes_heart === undefined) product.notes_heart = '';
    if (product.notes_base === undefined) product.notes_base = '';
    if (product.olfactive_family === undefined) product.olfactive_family = '';
    if (product.hidden === undefined) product.hidden = false;

    if (dbClient) {
      if (product.id && !product.id.startsWith('temp_')) {
        const { data, error } = await dbClient.from('products').update(product).eq('id', product.id).select();
        if (error) { console.error("Supabase update error:", error); throw new Error(error.message); }
        if (!error) return data[0];
      } else {
        delete product.id;
        const { data, error } = await dbClient.from('products').insert([product]).select();
        if (error) { console.error("Supabase insert error:", error); throw new Error(error.message); }
        if (!error) return data[0];
      }
    }

    // Fallback LocalStorage
    const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) products[idx] = product;
      else products.push(product);
    } else {
      product.id = 'p_' + Date.now();
      products.push(product);
    }
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    return product;
  },

  async deleteProduct(id) {
    if (dbClient) {
      await dbClient.from('products').delete().eq('id', id);
    }
    const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]').filter(p => p.id !== id);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  },

  async toggleProductVisibility(id) {
    const products = await this.getProducts();
    const p = products.find(p => p.id === id);
    if (p) {
      p.hidden = !p.hidden;
      if (dbClient) {
        await dbClient.from('products').update({ hidden: p.hidden }).eq('id', id);
      }
      const localProducts = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
      const lp = localProducts.find(p => p.id === id);
      if (lp) lp.hidden = p.hidden;
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(localProducts));
      return p.hidden;
    }
    return false;
  },

  async updateStock(id, delta) {
    const products = await this.getProducts();
    const p = products.find(p => p.id === id);
    if (p) {
      const newStock = Math.max(0, p.stock + delta);
      if (dbClient) {
        await dbClient.from('products').update({ stock: newStock }).eq('id', id);
      }
      const localProducts = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
      const lp = localProducts.find(p => p.id === id);
      if (lp) lp.stock = newStock;
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(localProducts));
      return newStock;
    }
    return 0;
  },

  // ---- Orders ----------------------------------------------
  async getOrders() {
    if (dbClient) {
      const { data, error } = await dbClient.from('orders').select('*').order('created_at', { ascending: false });
      if (!error) return data;
    }
    const stored = localStorage.getItem(this.ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async saveOrder(order) {
    order.date = new Date().toISOString();
    order.status = 'pending';
    order.updated_at = order.date;

    // Ensure delivery fields
    if (!order.delivery_method) order.delivery_method = 'home';
    if (order.shipping_cost === undefined) order.shipping_cost = 0;

    if (dbClient) {
      const { data, error } = await dbClient.from('orders').insert([order]).select();
      if (!error) {
        const saved = data[0];
        for (const item of order.items) {
          await this.updateStock(item.id, -item.qty);
        }
        return saved;
      }
    }

    // Fallback LocalStorage
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    let counter = parseInt(localStorage.getItem(this.COUNTER_KEY) || '1000');
    counter++;
    localStorage.setItem(this.COUNTER_KEY, counter.toString());
    order.id = counter;
    order.order_number = 'CMD-' + counter;
    orders.unshift(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));

    for (const item of order.items) {
      await this.updateStock(item.id, -item.qty);
    }
    return order;
  },

  async updateOrderStatus(id, status) {
    const updated_at = new Date().toISOString();
    if (dbClient) {
      await dbClient.from('orders').update({ status, updated_at }).eq('id', id);
    }
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    const o = orders.find(o => o.id === id);
    if (o) {
      o.status = status;
      o.updated_at = updated_at;
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    }
  },

  async deleteOrder(id) {
    if (dbClient) {
      await dbClient.from('orders').delete().eq('id', id);
    }
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]').filter(o => o.id !== id);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }
};

// ---- 58 Wilayas d'Algérie ----------------------------------
const WILAYAS = [
  { code: '01', name: 'Adrar' }, { code: '02', name: 'Chlef' }, { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' }, { code: '05', name: 'Batna' }, { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' }, { code: '08', name: 'Béchar' }, { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' }, { code: '11', name: 'Tamanrasset' }, { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' }, { code: '14', name: 'Tiaret' }, { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Alger' }, { code: '17', name: 'Djelfa' }, { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' }, { code: '20', name: 'Saïda' }, { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' }, { code: '23', name: 'Annaba' }, { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' }, { code: '26', name: 'Médéa' }, { code: '27', name: 'Mostaganem' },
  { code: '28', name: "M'Sila" }, { code: '29', name: 'Mascara' }, { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' }, { code: '32', name: 'El Bayadh' }, { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arreridj' }, { code: '35', name: 'Boumerdès' }, { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' }, { code: '38', name: 'Tissemsilt' }, { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' }, { code: '41', name: 'Souk Ahras' }, { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' }, { code: '44', name: 'Aïn Defla' }, { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' }, { code: '47', name: 'Ghardaïa' }, { code: '48', name: 'Relizane' },
  { code: '49', name: 'Timimoun' }, { code: '50', name: 'Bordj Badji Mokhtar' }, { code: '51', name: 'Ouled Djellal' },
  { code: '52', name: 'Béni Abbès' }, { code: '53', name: 'In Salah' }, { code: '54', name: 'In Guezzam' },
  { code: '55', name: 'Touggourt' }, { code: '56', name: 'Djanet' }, { code: '57', name: "El M'Ghair" },
  { code: '58', name: 'El Meniaa' }
];

// ---- Theme Toggle (runs immediately) -----------------------
(function initTheme() {
  const saved = localStorage.getItem('amir_parfume_theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

function _applyThemeToggles() {
  document.querySelectorAll('[id="theme-toggle"], .theme-toggle-btn').forEach(btn => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', function () {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('amir_parfume_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('amir_parfume_theme', 'light');
      }
      const icon = fresh.querySelector('i');
      if (icon) {
        const nowLight = document.documentElement.getAttribute('data-theme') === 'light';
        icon.className = nowLight ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
    const icon = fresh.querySelector('i');
    if (icon) {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _applyThemeToggles);
} else {
  _applyThemeToggles();
}
