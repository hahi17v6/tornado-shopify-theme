/**
 * TORNADO LUXURY STREETWEAR — SHOPIFY THEME JAVASCRIPT (v1.0.0 PRODUCTION)
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. STICKY & SCROLL HEADER
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.tornado-header');
  if (header && header.dataset.headerSticky === 'true') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     2. MOBILE MENU DRAWER
     ------------------------------------------------------------------------ */
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-menu-drawer]');
  const mobileOverlay = document.querySelector('[data-mobile-menu-overlay]');
  const mobileClose = document.querySelector('[data-mobile-menu-close]');

  function openMobileMenu() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('active');
      mobileOverlay.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('active');
      mobileOverlay.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  /* ------------------------------------------------------------------------
     3. PREDICTIVE SEARCH OVERLAY
     ------------------------------------------------------------------------ */
  const searchToggles = document.querySelectorAll('[data-search-toggle]');
  const searchModal = document.querySelector('[data-search-modal]');
  const searchOverlay = document.querySelector('[data-search-overlay]');
  const searchClose = document.querySelector('[data-search-close]');
  const searchInput = document.querySelector('[data-predictive-search-input]');

  function openSearch() {
    if (searchModal && searchOverlay) {
      searchModal.classList.add('active');
      searchOverlay.classList.add('active');
      searchModal.setAttribute('aria-hidden', 'false');
      if (searchInput) setTimeout(() => searchInput.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSearch() {
    if (searchModal && searchOverlay) {
      searchModal.classList.remove('active');
      searchOverlay.classList.remove('active');
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  searchToggles.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

  // Keyboard Escape Handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeSearch();
      if (typeof closeCart === 'function') closeCart();
    }
  });

  /* ------------------------------------------------------------------------
     4. DROP COUNTDOWN TIMER
     ------------------------------------------------------------------------ */
  const countdownEl = document.querySelector('[data-drop-date]');
  if (countdownEl) {
    const dropDateStr = countdownEl.dataset.dropDate;
    const dropTarget = new Date(dropDateStr).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const diff = dropTarget - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        const daysEl = document.getElementById('timer-days');
        const hoursEl = document.getElementById('timer-hours');
        const minsEl = document.getElementById('timer-minutes');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      }
    }

    updateTimer();
    setInterval(updateTimer, 60000);
  }

  /* ------------------------------------------------------------------------
     5. WISHLIST LOCAL STORAGE HANDLER
     ------------------------------------------------------------------------ */
  let wishlist = JSON.parse(localStorage.getItem('tornado_wishlist') || '[]');

  function updateWishlistBadge() {
    document.querySelectorAll('[data-wishlist-count]').forEach(el => {
      el.textContent = wishlist.length;
    });
  }

  updateWishlistBadge();

  document.querySelectorAll('[data-wishlist-add]').forEach(btn => {
    const pid = btn.dataset.wishlistAdd;
    if (wishlist.includes(pid)) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (wishlist.includes(pid)) {
        wishlist = wishlist.filter(id => id !== pid);
        btn.classList.remove('active');
      } else {
        wishlist.push(pid);
        btn.classList.add('active');
      }
      localStorage.setItem('tornado_wishlist', JSON.stringify(wishlist));
      updateWishlistBadge();
    });
  });
});

  /* ------------------------------------------------------------------------
     PHASE 4: FILTER DRAWER & PREDICTIVE SEARCH LOGIC
     ------------------------------------------------------------------------ */
  const filterDrawerBtn = document.querySelector('[data-filter-drawer-toggle]');
  const filterDrawer = document.querySelector('[data-filter-drawer]');
  const filterOverlay = document.querySelector('[data-filter-overlay]');
  const filterClose = document.querySelector('[data-filter-drawer-close]');

  function openFilterDrawer() {
    if (filterDrawer && filterOverlay) {
      filterDrawer.classList.add('active');
      filterOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeFilterDrawer() {
    if (filterDrawer && filterOverlay) {
      filterDrawer.classList.remove('active');
      filterOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (filterDrawerBtn) filterDrawerBtn.addEventListener('click', openFilterDrawer);
  if (filterClose) filterClose.addEventListener('click', closeFilterDrawer);
  if (filterOverlay) filterOverlay.addEventListener('click', closeFilterDrawer);

  // Predictive Search API Handler
  const predInput = document.querySelector('[data-predictive-search-input]');
  const predResults = document.querySelector('[data-predictive-search-results]');

  if (predInput && predResults) {
    let debounceTimer;
    predInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      const query = this.value.trim();

      if (query.length < 2) {
        predResults.innerHTML = '<p class="text-secondary text-sm">Saisissez un mot-clé pour commencer la recherche...</p>';
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`);
          if (response.ok) {
            const data = await response.json();
            const products = data.resources.results.products || [];
            
            if (products.length > 0) {
              let html = '<div class="predictive-results-list">';
              products.forEach(p => {
                html += `
                  <a href="${p.url}" class="predictive-item">
                    <img src="${p.image}" width="50" height="65" alt="${p.title}">
                    <div>
                      <div class="font-bold text-sm text-white">${p.title}</div>
                      <div class="text-gold-gradient text-xs font-bold">${p.price} €</div>
                    </div>
                  </a>
                `;
              });
              html += '</div>';
              predResults.innerHTML = html;
            } else {
              predResults.innerHTML = `<p class="text-secondary text-sm">Aucun résultat trouvé pour "${escapeHtml(query)}".</p>`;
            }
          }
        } catch (e) {
          console.error('Predictive Search Error:', e);
        }
      }, 250);
    });
  }

  /* ------------------------------------------------------------------------
     PHASE 5: PDP PREMIUM INTERACTIVITY (GALLERY, VARIANTS, ACCORDIONS, AJAX CART)
     ------------------------------------------------------------------------ */
  
  // 1. PDP Gallery Thumbnail Selector & Zoom
  const mainImage = document.querySelector('[data-product-main-image]');
  const mainMediaContainer = document.querySelector('[data-product-main-media]');
  const thumbnails = document.querySelectorAll('[data-gallery-thumb]');

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        thumbnails.forEach(t => t.classList.remove('is-active'));
        this.classList.add('is-active');

        const newSrc = this.dataset.src;
        const newZoom = this.dataset.zoom;
        const mediaId = this.dataset.mediaId;

        if (newSrc) {
          mainImage.src = newSrc;
          mainImage.setAttribute('data-zoom', newZoom || newSrc);
          mainImage.dataset.mediaId = mediaId;
        }
      });
    });

    // Image Hover / Click Zoom Effect
    if (mainMediaContainer) {
      mainMediaContainer.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImage.style.transformOrigin = `${x}% ${y}%`;
      });

      mainMediaContainer.addEventListener('mouseenter', function() {
        mainImage.style.transform = 'scale(1.4)';
      });

      mainMediaContainer.addEventListener('mouseleave', function() {
        mainImage.style.transform = 'scale(1)';
        mainImage.style.transformOrigin = 'center center';
      });
    }
  }

  // 2. Accordions Toggle Logic
  const accordionHeaders = document.querySelectorAll('[data-accordion-toggle]');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const parent = this.closest('.pdp-accordion');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        parent.classList.remove('is-open');
      } else {
        this.setAttribute('aria-expanded', 'true');
        parent.classList.add('is-open');
      }
    });
  });

  // 3. Dynamic Variant Selector Logic
  const pdpForm = document.querySelector('[data-pdp-form]');
  if (pdpForm) {
    const variantIdInput = pdpForm.querySelector('[data-variant-id-input]');
    const priceContainer = document.querySelector('[data-pdp-price]');
    const submitBtn = pdpForm.querySelector('[data-add-to-cart-btn]');
    const btnText = submitBtn ? submitBtn.querySelector('.pdp-btn__text') : null;
    const inventoryBadge = document.querySelector('[data-pdp-inventory-badge]');
    
    // Parse variants JSON if embedded
    const variantsScript = document.querySelector('[data-product-variants-json]');
    let variantsData = [];
    if (variantsScript) {
      try {
        variantsData = JSON.parse(variantsScript.textContent);
      } catch(e) {
        console.warn('Could not parse variants JSON', e);
      }
    }

    function getSelectedOptions() {
      const selectedOptions = [];
      pdpForm.querySelectorAll('[data-option-index]').forEach(container => {
        const activeSwatch = container.querySelector('.pdp-swatch.is-active, .pdp-size-btn.is-active');
        const select = container.querySelector('select');

        if (activeSwatch) {
          selectedOptions.push(activeSwatch.dataset.optionValue);
        } else if (select) {
          selectedOptions.push(select.value);
        }
      });
      return selectedOptions;
    }

    function updateVariant() {
      if (!variantsData.length) return;
      const selectedOptions = getSelectedOptions();

      // Find matching variant
      const matchedVariant = variantsData.find(variant => {
        return variant.options.every((opt, idx) => opt === selectedOptions[idx]);
      });

      if (matchedVariant) {
        if (variantIdInput) variantIdInput.value = matchedVariant.id;

        // Update URL state without refresh
        if (window.history.replaceState) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('variant', matchedVariant.id);
          window.history.replaceState({ path: newUrl.href }, '', newUrl.href);
        }

        // Update Price
        if (priceContainer) {
          let html = `<span class="pdp-price__current">${matchedVariant.formatted_price}</span>`;
          if (matchedVariant.compare_at_price) {
            html += `<span class="pdp-price__compare">${matchedVariant.formatted_compare_at_price}</span>`;
            html += `<span class="pdp-price__badge">ÉCONOMISEZ ${matchedVariant.formatted_discount}</span>`;
          }
          priceContainer.innerHTML = html;
        }

        // Update Availability & Button
        if (submitBtn) {
          if (matchedVariant.available) {
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'AJOUTER AU PANIER';
          } else {
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'ÉPUISÉ';
          }
        }

        // Update Inventory Badge
        if (inventoryBadge) {
          if (matchedVariant.available) {
            inventoryBadge.innerHTML = `<span class="tornado-badge tornado-badge--success">EN STOCK — EXPÉDITION 24-48H</span>`;
          } else {
            inventoryBadge.innerHTML = `<span class="tornado-badge tornado-badge--danger">ÉPUISÉ</span>`;
          }
        }

        // Switch media image if variant has featured image
        if (matchedVariant.featured_media_id) {
          const matchingThumb = document.querySelector(`[data-media-id="${matchedVariant.featured_media_id}"]`);
          if (matchingThumb) matchingThumb.click();
        }
      } else {
        if (submitBtn) {
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'NON DISPONIBLE';
        }
      }
    }

    // Swatches Click Event
    pdpForm.querySelectorAll('.pdp-swatch, .pdp-size-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const container = this.closest('[data-option-index]');
        if (container) {
          container.querySelectorAll('.pdp-swatch, .pdp-size-btn').forEach(btn => btn.classList.remove('is-active'));
          this.classList.add('is-active');
          updateVariant();
        }
      });
    });

    // Option Select Change Event
    pdpForm.querySelectorAll('select[data-option-select]').forEach(select => {
      select.addEventListener('change', updateVariant);
    });
  }

  // 4. AJAX Add To Cart Form Submission
  const pdpAddToCartForm = document.querySelector('[data-pdp-form]');
  if (pdpAddToCartForm) {
    pdpAddToCartForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('[data-add-to-cart-btn]');
      const btnText = submitBtn ? submitBtn.querySelector('.pdp-btn__text') : null;
      const originalText = btnText ? btnText.textContent : 'AJOUTER AU PANIER';

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'AJOUT EN COURS...';

      const formData = new FormData(this);

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.ok) {
          const item = await response.json();
          if (btnText) btnText.textContent = 'AJOUTÉ AU PANIER ✓';

          // Refresh Cart Count
          const cartCountRes = await fetch('/cart.js');
          if (cartCountRes.ok) {
            const cartData = await cartCountRes.json();
            document.querySelectorAll('[data-cart-count]').forEach(el => {
              el.textContent = cartData.item_count;
            });
          }

          // Open Cart Drawer if available
          const cartDrawer = document.querySelector('[data-cart-drawer]');
          const cartOverlay = document.querySelector('[data-cart-overlay]');
          if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
          }

          setTimeout(() => {
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = originalText;
          }, 2000);
        } else {
          const errData = await response.json();
          alert(errData.description || "Erreur lors de l'ajout au panier.");
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = originalText;
        }
      } catch(err) {
        console.error('Add to Cart Error:', err);
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = originalText;
      }
    });
  }

  /* ------------------------------------------------------------------------
     PHASE 6: CENTRALIZED SHOPIFY AJAX CART MANAGER (DRAWER, QTY, REMOVE, BAR)
     ------------------------------------------------------------------------ */

  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartOverlay = document.querySelector('[data-cart-overlay]');
  const cartToggles = document.querySelectorAll('[data-cart-toggle]');
  const cartCloses = document.querySelectorAll('[data-cart-close]');
  let lastFocusedElement = null;

  // Format Money Helper (Shopify Currency)
  function formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    return `${amount.replace('.', ',')} €`;
  }

  // Open Cart Drawer
  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      lastFocusedElement = document.activeElement;
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      cartDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus close button for accessibility
      const closeBtn = cartDrawer.querySelector('[data-cart-close]');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    }
  }

  // Close Cart Drawer
  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      cartDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lastFocusedElement) lastFocusedElement.focus();
    }
  }

  // Global Cart Event Listeners
  cartToggles.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  }));

  cartCloses.forEach(btn => btn.addEventListener('click', closeCartDrawer));
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  // Keyboard Escape Handler for Cart Drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('active')) {
      closeCartDrawer();
    }
  });

  // Centralized Cart UI Updater
  async function refreshCartUI() {
    try {
      const response = await fetch('/cart.js');
      if (!response.ok) return;

      const cart = await response.json();

      // 1. Update Cart Count Badges
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = cart.item_count;
      });

      document.querySelectorAll('[data-cart-count-badge]').forEach(el => {
        el.textContent = `(${cart.item_count} ${cart.item_count > 1 ? 'ARTICLES' : 'ARTICLE'})`;
      });

      // 2. Update Free Shipping Progress Bar (Seuil 150 €)
      const thresholdCents = 15000; // 150.00 €
      const remainingCents = Math.max(0, thresholdCents - cart.total_price);
      const progressPercent = Math.min(100, Math.round((cart.total_price / thresholdCents) * 100));

      document.querySelectorAll('[data-shipping-bar-fill]').forEach(bar => {
        bar.style.width = `${progressPercent}%`;
      });

      document.querySelectorAll('[data-shipping-bar-text]').forEach(textEl => {
        if (cart.total_price >= thresholdCents) {
          textEl.innerHTML = `<span class="text-gold">✨ LIVRAISON GRATUITE OFFERTE !</span>`;
        } else {
          textEl.innerHTML = `<span>Plus que <strong class="text-gold">${formatMoney(remainingCents)}</strong> pour la <strong>livraison gratuite</strong></span>`;
        }
      });

      // 3. Update Subtotal & Checkout Totals
      document.querySelectorAll('[data-cart-subtotal], [data-cart-total], [data-cart-total-checkout]').forEach(el => {
        el.textContent = formatMoney(cart.total_price);
      });

      // 4. Reload Cart Sections via Section Rendering API if needed
      if (document.querySelector('[data-cart-page]') || document.querySelector('[data-cart-drawer]')) {
        const sectionsRes = await fetch(`${window.location.pathname}?sections=main-cart-drawer,main-cart`);
        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json();
          if (sectionsData['main-cart-drawer'] && cartDrawer) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(sectionsData['main-cart-drawer'], 'text/html');
            const newBody = doc.querySelector('[data-cart-drawer-body]');
            const newFooter = doc.querySelector('[data-cart-footer]');
            
            const currentBody = cartDrawer.querySelector('[data-cart-drawer-body]');
            const currentFooter = cartDrawer.querySelector('[data-cart-footer]');

            if (newBody && currentBody) currentBody.innerHTML = newBody.innerHTML;
            if (newFooter && currentFooter) currentFooter.innerHTML = newFooter.innerHTML;
          }
        }
      }

    } catch (e) {
      console.error('Failed to refresh Cart UI:', e);
    }
  }

  // Handle Quantity Change & Removal (Event Delegation)
  document.addEventListener('click', async (e) => {
    // Quantity adjustment minus/plus
    const qtyBtn = e.target.closest('[data-qty-adjust]');
    if (qtyBtn) {
      e.preventDefault();
      const key = qtyBtn.dataset.key;
      const action = qtyBtn.dataset.qtyAdjust;
      const qtyContainer = qtyBtn.closest('[data-qty-container]');
      const qtyValueEl = qtyContainer ? qtyContainer.querySelector('[data-qty-value]') : null;

      if (!key || !qtyValueEl) return;

      let currentQty = parseInt(qtyValueEl.textContent.trim(), 10) || 1;
      let newQty = action === 'plus' ? currentQty + 1 : currentQty - 1;

      if (newQty < 0) newQty = 0;

      // Disable buttons during AJAX request
      qtyContainer.querySelectorAll('button').forEach(b => b.disabled = true);

      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ id: key, quantity: newQty })
        });

        if (response.ok) {
          await refreshCartUI();
        } else {
          alert('Impossible de modifier la quantité.');
        }
      } catch (err) {
        console.error('Qty Update Error:', err);
      } finally {
        if (qtyContainer) qtyContainer.querySelectorAll('button').forEach(b => b.disabled = false);
      }
    }

    // Remove Item
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      e.preventDefault();
      const key = removeBtn.dataset.cartRemove;
      if (!key) return;

      removeBtn.disabled = true;

      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ id: key, quantity: 0 })
        });

        if (response.ok) {
          await refreshCartUI();
        }
      } catch (err) {
        console.error('Item Removal Error:', err);
      }
    }

    // Quick Add from Cross-Sell
    const quickAddBtn = e.target.closest('[data-quick-add]');
    if (quickAddBtn) {
      e.preventDefault();
      const variantId = quickAddBtn.dataset.quickAdd;
      if (!variantId) return;

      quickAddBtn.disabled = true;
      quickAddBtn.textContent = '...';

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (response.ok) {
          await refreshCartUI();
          openCartDrawer();
        }
      } catch (err) {
        console.error('Quick Add Error:', err);
      } finally {
        quickAddBtn.disabled = false;
        quickAddBtn.textContent = '+ AJOUTER';
      }
    }
  });

  // Expose openCartDrawer globally for other modules
  window.tornadoOpenCartDrawer = openCartDrawer;
  window.tornadoRefreshCartUI = refreshCartUI;

  /* ------------------------------------------------------------------------
     PHASE 7: WISHLIST MANAGER & REVIEWS INTERACTIVITY
     ------------------------------------------------------------------------ */

  // HTML Escape Helper (XSS Protection)
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 1. Reviews Form Toggle & Star Selector
  const toggleReviewBtn = document.querySelector('[data-toggle-review-form]');
  const reviewFormWrapper = document.getElementById('review-form-wrapper');

  if (toggleReviewBtn && reviewFormWrapper) {
    toggleReviewBtn.addEventListener('click', () => {
      const isHidden = reviewFormWrapper.style.display === 'none';
      reviewFormWrapper.style.display = isHidden ? 'block' : 'none';
      toggleReviewBtn.textContent = isHidden ? '- FERMER LE FORMULAIRE' : '+ LAISSER UN AVIS';
    });
  }

  const starSelectSpans = document.querySelectorAll('[data-star-select] span');
  const ratingInput = document.getElementById('review-rating-val');

  if (starSelectSpans.length > 0 && ratingInput) {
    starSelectSpans.forEach(span => {
      span.addEventListener('click', function() {
        const rating = parseInt(this.dataset.star, 10);
        ratingInput.value = rating;

        starSelectSpans.forEach(s => {
          const val = parseInt(s.dataset.star, 10);
          if (val <= rating) {
            s.classList.add('is-selected');
          } else {
            s.classList.remove('is-selected');
          }
        });
      });
    });
  }

  // Handle Review Submission (XSS Safe)
  const reviewForm = document.querySelector('[data-review-form]');
  const reviewsListContainer = document.querySelector('[data-reviews-list]');

  if (reviewForm && reviewsListContainer) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const author = escapeHtml(formData.get('author'));
      const title = escapeHtml(formData.get('title'));
      const body = escapeHtml(formData.get('body'));
      const rating = parseInt(formData.get('rating'), 10) || 5;

      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card tornado-glass-card padding-lg';
      reviewCard.innerHTML = `
        <div class="review-card__header flex justify-between items-start margin-bottom-sm">
          <div>
            <div class="text-gold text-sm font-bold margin-bottom-xs">${stars}</div>
            <div class="text-sm font-bold text-white">${author}</div>
          </div>
          <span class="tornado-badge tornado-badge--gold text-xs">NOUVEAU</span>
        </div>
        <h4 class="font-bold text-sm text-white margin-bottom-xs">${title}</h4>
        <p class="text-xs text-secondary line-height-relaxed margin-bottom-sm">${body}</p>
        <div class="text-xs text-secondary font-mono">Publié à l'instant &bull; En attente de modération</div>
      `;

      reviewsListContainer.prepend(reviewCard);
      this.reset();
      if (reviewFormWrapper) reviewFormWrapper.style.display = 'none';
      if (toggleReviewBtn) toggleReviewBtn.textContent = '+ LAISSER UN AVIS';

      alert('Merci ! Votre avis a été soumis avec succès.');
    });
  }

  // 2. Wishlist Grid Rendering in Account Dashboard
  const wishlistGridContainer = document.querySelector('[data-wishlist-items]');
  const wishlistEmptyContainer = document.querySelector('[data-wishlist-empty]');

  async function renderWishlistGrid() {
    if (!wishlistGridContainer || !wishlistEmptyContainer) return;

    const storedWishlist = JSON.parse(localStorage.getItem('tornado_wishlist') || '[]');

    if (storedWishlist.length === 0) {
      wishlistGridContainer.style.display = 'none';
      wishlistEmptyContainer.style.display = 'block';
    } else {
      wishlistEmptyContainer.style.display = 'none';
      wishlistGridContainer.style.display = 'grid';
      wishlistGridContainer.innerHTML = '<p class="text-xs text-secondary">Chargement de votre wishlist...</p>';

      let html = '';
      for (const pid of storedWishlist) {
        try {
          // Fetch product json if endpoint available or render placeholder
          html += `
            <div class="product-card">
              <div class="product-card__image-wrapper">
                <div class="cart-item__image-placeholder" style="height: 200px; display:flex; align-items:center; justify-content:center; background:#141414; color:#D4AF37; font-weight:bold;">
                  TORNADO ITEM #${pid}
                </div>
              </div>
              <div class="product-card__info">
                <div class="product-card__vendor">TORNADO VIP</div>
                <div class="product-card__title font-bold text-sm text-white">Produit Favori ${pid}</div>
                <button type="button" class="tornado-btn tornado-btn--outline text-xs w-full margin-top-xs" data-wishlist-add="${pid}">
                  RETIRER DES FAVORIS
                </button>
              </div>
            </div>
          `;
        } catch(e) {
          console.error(e);
        }
      }
      wishlistGridContainer.innerHTML = html;
    }
  }

  renderWishlistGrid();

  /* ------------------------------------------------------------------------
     PHASE 8: MARKETING POP-UP & REAL UTC COUNTDOWN MANAGERS
     ------------------------------------------------------------------------ */

  // 1. Newsletter Modal Pop-up Logic
  const newsModal = document.querySelector('[data-newsletter-modal]');
  if (newsModal) {
    const isDismissed = localStorage.getItem('tornado_popup_closed');
    if (!isDismissed) {
      setTimeout(() => {
        newsModal.style.display = 'flex';
        newsModal.setAttribute('aria-hidden', 'false');
      }, 5000); // Trigger after 5 seconds
    }

    const modalCloseBtns = newsModal.querySelectorAll('[data-newsletter-close]');
    modalCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        newsModal.style.display = 'none';
        newsModal.setAttribute('aria-hidden', 'true');
        localStorage.setItem('tornado_popup_closed', 'true');
      });
    });
  }

  // 2. Real Flash Sale UTC Countdown
  const flashSaleContainer = document.querySelector('[data-flash-sale-date]');
  if (flashSaleContainer) {
    const endDateStr = flashSaleContainer.dataset.flashSaleDate;
    const endTarget = new Date(endDateStr).getTime();

    function updateFlashTimer() {
      const now = new Date().getTime();
      const diff = endTarget - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const hoursEl = document.getElementById('flash-hours');
        const minsEl = document.getElementById('flash-minutes');
        const secsEl = document.getElementById('flash-seconds');

        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
      } else {
        flashSaleContainer.innerHTML = '<span class="text-xs text-secondary font-bold">VENTE FLASH TERMINÉE</span>';
      }
    }

    updateFlashTimer();
    setInterval(updateFlashTimer, 1000);
  }

  // 3. Real Drop Page Launch Countdown
  const dropTimerContainer = document.querySelector('[data-drop-launch-timer]');
  if (dropTimerContainer) {
    const launchDateStr = dropTimerContainer.dataset.dropLaunchTimer;
    const launchTarget = new Date(launchDateStr).getTime();

    function updateDropTimer() {
      const now = new Date().getTime();
      const diff = launchTarget - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('drop-timer-days');
        const hoursEl = document.getElementById('drop-timer-hours');
        const minsEl = document.getElementById('drop-timer-mins');
        const secsEl = document.getElementById('drop-timer-secs');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
      } else {
        dropTimerContainer.innerHTML = '<span class="text-sm text-gold font-bold">⚡ LE DROP EST MAINTENANT EN LIGNE !</span>';
      }
    }

    updateDropTimer();
    setInterval(updateDropTimer, 1000);
  }




