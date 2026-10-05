/* ============================================================
   TORNADO — APP.JS — Cart, Navigation, Interactions
   ============================================================ */

const PRODUCTS = [
  { id: 1, name: 'Obsidian Heavyweight Hoodie', price: 189, icon: '🧥', brand: 'TORNADO LABS', badge: 'new', cat: 'sweats' },
  { id: 2, name: 'Vortex Cargo Pants', price: 159, icon: '👖', brand: 'TORNADO LABS', badge: 'best', cat: 'pantalons' },
  { id: 3, name: 'Storm Runner Sneakers', price: 249, icon: '👟', brand: 'TORNADO LABS', badge: 'limited', cat: 'sneakers' },
  { id: 4, name: 'Phantom Bomber Jacket', price: 299, icon: '🧥', brand: 'OBSIDIAN PARIS', badge: 'new', cat: 'vestes' },
  { id: 5, name: 'Eclipse Oversized T-Shirt', price: 89, icon: '👕', brand: 'TORNADO LABS', badge: 'best', cat: 't-shirts' },
  { id: 6, name: 'Tornado Logo Cap', price: 59, icon: '🧢', brand: 'TORNADO LABS', badge: 'new', cat: 'casquettes' },
  { id: 7, name: 'Midnight Chain Necklace', price: 129, icon: '📿', brand: 'VALENTINO STUDIO', badge: 'limited', cat: 'bijoux' },
  { id: 8, name: 'Shadow Crossbody Bag', price: 179, icon: '👜', brand: 'OBSIDIAN PARIS', badge: 'best', cat: 'sacs' },
  { id: 9, name: 'Cyclone Track Jacket', price: 219, icon: '🧥', brand: 'TORNADO LABS', badge: 'new', cat: 'vestes' },
  { id: 10, name: 'Dark Matter Joggers', price: 139, icon: '👖', brand: 'TORNADO LABS', badge: 'sale', oldPrice: 179, cat: 'pantalons' },
  { id: 11, name: 'Abyss Leather Belt', price: 79, icon: '🔗', brand: 'VALENTINO STUDIO', badge: 'best', cat: 'bijoux' },
  { id: 12, name: 'Nebula Beanie', price: 49, icon: '🧶', brand: 'TORNADO LABS', badge: 'new', cat: 'casquettes' },
];

const BADGE_MAP = {
  new: { cls: 'badge-new', text: 'NOUVEAUTÉ' },
  best: { cls: 'badge-best', text: 'BEST-SELLER' },
  limited: { cls: 'badge-limited', text: 'ÉDITION LIMITÉE' },
  sale: { cls: 'badge-sale', text: 'SOLDE' },
};

const GRADIENTS = [
  'linear-gradient(145deg, #1a1a2e, #16213e, #0f3460)',
  'linear-gradient(145deg, #1a0a2e, #2d1b4e, #1a1a2e)',
  'linear-gradient(145deg, #0a1a2e, #0f3460, #1a2a4e)',
  'linear-gradient(145deg, #2e1a1a, #4e2d1b, #2e1a2a)',
];

// ============================================================
// CART STATE
// ============================================================
let cart = JSON.parse(localStorage.getItem('tornado_cart') || '[]');

function saveCart() {
  localStorage.setItem('tornado_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, size, qty) {
  size = size || 'M';
  qty = qty || 1;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId && c.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, icon: product.icon, brand: product.brand, size, qty });
  }
  saveCart();
  showToast(`${product.name} ajouté au panier !`);
  openCartDrawer();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateCartQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// ============================================================
// CART UI
// ============================================================
function updateCartUI() {
  // Update cart count badges
  document.querySelectorAll('.header__cart-count').forEach(el => {
    const count = getCartCount();
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });

  // Update cart drawer body
  const body = document.querySelector('.cart-drawer__body');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-drawer__empty">
        <div class="cart-drawer__empty-icon">🛒</div>
        <p>Votre panier est vide</p>
      </div>`;
  } else {
    body.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item__img">${item.icon}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__meta">Taille : ${item.size}</div>
          <div class="cart-item__price gold-text">${item.price},00 €</div>
          <div class="cart-item__actions">
            <button class="cart-item__qty-btn" onclick="updateCartQty(${i},-1)">−</button>
            <span class="cart-item__qty">${item.qty}</span>
            <button class="cart-item__qty-btn" onclick="updateCartQty(${i},1)">+</button>
            <button class="cart-item__remove" onclick="removeFromCart(${i})">✕ Retirer</button>
          </div>
        </div>
      </div>`).join('');
  }

  // Update footer
  const subtotal = document.querySelector('.cart-drawer__subtotal-val');
  if (subtotal) subtotal.textContent = `${getCartTotal()},00 €`;

  // Shipping progress
  const fill = document.querySelector('.shipping-progress__fill');
  const shippingText = document.querySelector('.shipping-progress__text');
  if (fill && shippingText) {
    const total = getCartTotal();
    const threshold = 150;
    const pct = Math.min(100, (total / threshold) * 100);
    fill.style.width = pct + '%';
    if (total >= threshold) {
      shippingText.textContent = '✓ Livraison GRATUITE débloquée !';
    } else {
      shippingText.textContent = `Plus que ${threshold - total},00 € pour la livraison gratuite`;
    }
  }
}

// ============================================================
// CART DRAWER OPEN/CLOSE
// ============================================================
function openCartDrawer() {
  document.querySelector('.cart-overlay')?.classList.add('open');
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// MOBILE MENU
// ============================================================
function openMobileMenu() {
  document.querySelector('.mobile-menu-overlay')?.classList.add('open');
  document.querySelector('.mobile-menu')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.querySelector('.mobile-menu-overlay')?.classList.remove('open');
  document.querySelector('.mobile-menu')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// TOAST
// ============================================================
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast__icon">✓</span><span class="toast__text"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast__text').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================================
// PRODUCT CARD GENERATION
// ============================================================
function createProductCard(product) {
  const badge = BADGE_MAP[product.badge];
  const grad = GRADIENTS[product.id % GRADIENTS.length];
  const priceHTML = product.oldPrice
    ? `<span class="product-card__price-old">${product.oldPrice},00 €</span><span class="product-card__price-current gold-text">${product.price},00 €</span>`
    : `<span class="product-card__price-current gold-text">${product.price},00 €</span>`;

  return `
    <div class="product-card" onclick="goToProduct(${product.id})">
      <div class="product-card__img" style="background:${grad}">
        <span class="product-card__img-icon">${product.icon}</span>
        <span class="product-card__img-label">TORNADO</span>
        <span class="product-card__badge ${badge.cls}">${badge.text}</span>
        <div class="product-card__quick">
          <button class="product-card__quick-btn" onclick="event.stopPropagation(); addToCart(${product.id},'M',1)">
            + AJOUTER AU PANIER
          </button>
        </div>
      </div>
      <div class="product-card__info">
        <span class="product-card__brand">${product.brand}</span>
        <h3 class="product-card__name">${product.name}</h3>
        <div class="product-card__price">${priceHTML}</div>
      </div>
    </div>`;
}

function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// ============================================================
// FLASH SALE TIMER
// ============================================================
function startFlashTimer() {
  const el = document.querySelector('.flash-timer');
  if (!el) return;
  
  // Set end to 23h59 tonight
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 0);
  
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    const hEl = el.querySelector('[data-h]');
    const mEl = el.querySelector('[data-m]');
    const sEl = el.querySelector('[data-s]');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

// ============================================================
// ACCORDION
// ============================================================
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.accordion-item').classList.toggle('open');
    });
  });
}

// ============================================================
// SIZE SELECTOR (Product page)
// ============================================================
function initSizeSelector() {
  document.querySelectorAll('.product-size').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.product-size').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ============================================================
// QUANTITY SELECTOR (Product page)
// ============================================================
function initQtySelector() {
  const val = document.querySelector('.product-qty__val');
  if (!val) return;
  
  document.querySelector('.qty-minus')?.addEventListener('click', () => {
    let v = parseInt(val.textContent);
    if (v > 1) val.textContent = v - 1;
  });
  
  document.querySelector('.qty-plus')?.addEventListener('click', () => {
    let v = parseInt(val.textContent);
    if (v < 10) val.textContent = v + 1;
  });
}

// ============================================================
// PRODUCT DETAIL PAGE INIT
// ============================================================
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const grad = GRADIENTS[product.id % GRADIENTS.length];

  // Fill in product detail
  const nameEl = document.querySelector('.product-info__name');
  const priceEl = document.querySelector('.product-info__price');
  const brandEl = document.querySelector('.product-info__brand');
  const galleryMain = document.querySelector('.product-gallery__main');
  const breadcrumbName = document.querySelector('.breadcrumb__product');

  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) {
    if (product.oldPrice) {
      priceEl.innerHTML = `<span style="text-decoration:line-through;color:var(--text-muted);font-size:20px;margin-right:12px">${product.oldPrice},00 €</span><span class="gold-text">${product.price},00 €</span>`;
    } else {
      priceEl.innerHTML = `<span class="gold-text">${product.price},00 €</span>`;
    }
  }
  if (brandEl) brandEl.textContent = product.brand;
  if (galleryMain) {
    galleryMain.style.background = grad;
    galleryMain.querySelector('.product-gallery__main-icon').textContent = product.icon;
  }
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  // Add to cart button
  document.querySelector('.btn-add-cart')?.addEventListener('click', () => {
    const size = document.querySelector('.product-size.active')?.textContent || 'M';
    const qty = parseInt(document.querySelector('.product-qty__val')?.textContent || '1');
    addToCart(product.id, size, qty);
  });

  // Buy now button
  document.querySelector('.btn-buy-now')?.addEventListener('click', () => {
    const size = document.querySelector('.product-size.active')?.textContent || 'M';
    const qty = parseInt(document.querySelector('.product-qty__val')?.textContent || '1');
    addToCart(product.id, size, qty);
    showToast('Redirection vers le paiement...');
  });

  // Related products
  const relatedGrid = document.querySelector('.related-grid');
  if (relatedGrid) {
    const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
    relatedGrid.innerHTML = related.map(p => createProductCard(p)).join('');
  }

  document.title = `${product.name} — TORNADO`;
}

// ============================================================
// COLLECTION PAGE INIT
// ============================================================
function initCollectionPage() {
  const grid = document.querySelector('.collection-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => createProductCard(p)).join('');
}

// ============================================================
// HOME PAGE GRIDS
// ============================================================
function initHomeGrids() {
  const mostWanted = document.querySelector('.grid-most-wanted');
  if (mostWanted) {
    const picks = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[2], PRODUCTS[7]];
    mostWanted.innerHTML = picks.map(p => createProductCard(p)).join('');
  }

  const newDrops = document.querySelector('.grid-new-drops');
  if (newDrops) {
    const picks = [PRODUCTS[4], PRODUCTS[8], PRODUCTS[5], PRODUCTS[11]];
    newDrops.innerHTML = picks.map(p => createProductCard(p)).join('');
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Cart drawer toggle
  document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-drawer__close')?.addEventListener('click', closeCartDrawer);

  // Mobile menu toggle
  document.querySelector('.header__burger')?.addEventListener('click', openMobileMenu);
  document.querySelector('.mobile-menu-overlay')?.addEventListener('click', closeMobileMenu);
  document.querySelector('.mobile-menu__close')?.addEventListener('click', closeMobileMenu);

  // Init page-specific
  if (document.querySelector('.grid-most-wanted')) initHomeGrids();
  if (document.querySelector('.collection-grid')) initCollectionPage();
  if (document.querySelector('.product-detail')) initProductPage();

  initAccordions();
  initSizeSelector();
  initQtySelector();
  startFlashTimer();
  updateCartUI();
});
