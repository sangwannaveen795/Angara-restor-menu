/**
 * @typedef {Object} CartItem
 * @property {string} name
 * @property {number} price
 */

/** @type {CartItem[]} */
let cart = [];

// Initialize Page
window.onload = function() {
    openTab('starters');
};

/**
 * Handle Category Tabs
 * @param {string} tabName 
 */
function openTab(tabName) {
    document.querySelectorAll('.menu-content').forEach(tab => {
        /** @type {HTMLElement} */ (tab).style.display = 'none';
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'grid';
        setTimeout(() => selectedTab.classList.add('active'), 10);
    }
    
    if (window && window.event && window.event.currentTarget) {
        /** @type {HTMLElement} */ (window.event.currentTarget).classList.add('active');
    }
}

/**
 * Filter Logic for All / Veg / Non-Veg
 * @param {string} filterType 
 */
function filterMenu(filterType) {
    const btnAll = document.getElementById('btn-all');
    if(btnAll) {
        if(filterType === 'all') {
            btnAll.style.background = 'var(--nav-brown)';
            btnAll.style.color = 'white';
        } else {
            btnAll.style.background = 'transparent';
            btnAll.style.color = 'var(--nav-brown)';
        }
    }

    // Filter Image Cards & Text Cards
    const menuItems = document.querySelectorAll('.menu-card-img, .menu-card-text');
    menuItems.forEach(item => {
        const htmlItem = /** @type {HTMLElement} */ (item);
        const itemType = htmlItem.getAttribute('data-type');
        
        if (filterType === 'all' || itemType === filterType) {
            htmlItem.style.display = 'flex';
        } else {
            htmlItem.style.display = 'none';
        }
    });

    const selfCookingBanner = document.getElementById('selfCookingBanner');
    if(selfCookingBanner) {
        selfCookingBanner.style.display = (filterType === 'veg') ? 'none' : 'block';
    }
}

// Sidebar Toggle
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) cartSidebar.classList.toggle('open');
}

/**
 * Add Standard Item
 * @param {string} itemName 
 * @param {number | string} itemPrice 
 */
function addToCart(itemName, itemPrice) {
    const price = typeof itemPrice === 'string' ? parseInt(itemPrice) : itemPrice;
    cart.push({ name: itemName, price: price });
    updateCartUI();
    
    if (window && window.event && window.event.currentTarget) {
        buttonFeedback(/** @type {HTMLElement} */ (window.event.currentTarget));
    }
}

/**
 * Add Dropdown Variant Item
 * @param {string} baseName 
 * @param {string} selectElementId 
 */
function addVariantToCart(baseName, selectElementId) {
    const selectEl = /** @type {HTMLSelectElement} */ (document.getElementById(selectElementId));
    if(!selectEl) return;
    
    const price = parseInt(selectEl.value);
    const variantOption = selectEl.options[selectEl.selectedIndex];
    
    const variantNameRaw = variantOption ? variantOption.getAttribute('data-name') : '';
    const variantClean = variantNameRaw ? variantNameRaw.replace('- ', '') : ''; 
    const fullName = `${baseName} ${variantClean}`.trim();
    
    cart.push({ name: fullName, price: price });
    updateCartUI();
    
    if (window && window.event && window.event.currentTarget) {
        buttonFeedback(/** @type {HTMLElement} */ (window.event.currentTarget));
    }
}

/**
 * Visual feedback for Add buttons
 * @param {HTMLElement} btn 
 */
function buttonFeedback(btn) {
    if (!btn) return;
    let originalText = btn.innerText;
    btn.innerText = "✓";
    btn.style.background = "#2E7D32";
    btn.style.color = "white";
    btn.style.borderColor = "#2E7D32";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = ""; 
        btn.style.color = "";
        btn.style.borderColor = "";
    }, 800);
}

// Refresh Cart UI
function updateCartUI() {
    const cartList = document.getElementById('cartItemsList');
    const badgeTop = document.getElementById('cart-count-top');
    const badgeMobile = document.getElementById('cart-count-badge');
    const totalDisplay = document.getElementById('cartTotalValue');
    
    if (!cartList || !totalDisplay) return;
    
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 10px;"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                <p>Your cart is empty.</p>
            </div>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartList.innerHTML += `
                <div class="cart-item-row">
                    <div class="cart-item-details">
                        <h5>${item.name}</h5>
                        <span>₹${item.price}</span>
                    </div>
                    <button class="delete-btn" onclick="removeFromCart(${index})">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF6B6B" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            `;
        });
    }
    
    if(badgeTop) badgeTop.innerText = cart.length.toString();
    if(badgeMobile) badgeMobile.innerText = cart.length.toString();
    totalDisplay.innerText = `₹${total}`;
}

/**
 * Remove from Cart
 * @param {number} index 
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// WhatsApp Checkout Logic
function sendWhatsAppOrder() {
    const customerInput = /** @type {HTMLInputElement} */ (document.getElementById('customerName'));
    const tableInput = /** @type {HTMLInputElement} */ (document.getElementById('tableNumber'));
    
    const customerName = customerInput ? customerInput.value : '';
    const tableNumber = tableInput ? tableInput.value : '';

    if (cart.length === 0) {
        alert("Please add items to your cart first.");
        return;
    }
    if (!tableNumber || tableNumber.trim() === "") {
        alert("Please enter your Table Number.");
        if (tableInput) tableInput.focus();
        return;
    }
    if (!customerName || customerName.trim() === "") {
        alert("Please enter your Name.");
        if (customerInput) customerInput.focus();
        return;
    }

    let message = "🔥 *Angara Restro Order* 🔥\n\n";
    message += `👤 *Name:* ${customerName}\n`;
    message += `📍 *Table No:* ${tableNumber}\n`;
    message += "---------------------------\n";
    
    let total = 0;
    cart.forEach(item => {
        message += `▪️ ${item.name} - ₹${item.price}\n`;
        total += item.price;
    });
    
    message += "---------------------------\n";
    message += `💰 *Total Bill: ₹${total}*\n`;
    message += "---------------------------\n";
    message += "✅ Thank you for the order!";

    alert("Thank you for the order! Redirecting to WhatsApp...");

    let encodedMessage = encodeURIComponent(message);
    let phoneNumber = "917690090066"; 
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}
/**
 * Filter Logic for All / Veg / Non-Veg
 * @param {string} filterType 
 */
function filterMenu(filterType) {
    // 1. Update Active Button Colors
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById(`btn-${filterType === 'non-veg' ? 'nonveg' : filterType}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // 2. Filter the Menu Items
    const menuItems = document.querySelectorAll('.menu-card-img, .menu-card-text');
    menuItems.forEach(item => {
        const htmlItem = /** @type {HTMLElement} */ (item); // Fixes "style does not exist" error
        const itemType = htmlItem.getAttribute('data-type');
        
        if (filterType === 'all' || itemType === filterType) {
            htmlItem.style.display = 'flex';
        } else {
            htmlItem.style.display = 'none';
        }
    });

    // 3. Handle the Special Banner
    const banner = document.getElementById('selfCookingBanner');
    if (banner) {
        banner.style.display = (filterType === 'veg') ? 'none' : 'block';
    }
}

/**
 * Turns media display "On"
 * @param {HTMLElement} element 
 */
function toggleMedia(element) {
    const modal = document.getElementById("mediaLightbox");
    const lImg = /** @type {HTMLImageElement | null} */ (document.getElementById("lightboxImg"));
    const lVid = /** @type {HTMLVideoElement | null} */ (document.getElementById("lightboxVid"));
    const caption = document.getElementById("lightboxCaption");

    if (!modal || !lImg || !lVid || !caption) return;

    // Reset display
    lImg.style.display = "none";
    lVid.style.display = "none";
    lVid.pause();

    const img = element.querySelector("img");
    const vid = element.querySelector("video");

    if (img) {
        lImg.src = img.src;
        lImg.style.display = "block";
        caption.innerHTML = img.alt || "Angara Restro Highlights";
    } else if (vid) {
        lVid.src = vid.src;
        lVid.style.display = "block";
        lVid.play().catch(() => {}); // Play the video enlarged
        caption.innerHTML = "Experience Angara Garden";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Stop background scrolling
}

/**
 * Turns media display "Off"
 */
function closeMedia() {
    const modal = document.getElementById("mediaLightbox");
    const lVid = /** @type {HTMLVideoElement | null} */ (document.getElementById("lightboxVid"));
    
    if (modal) modal.style.display = "none";
    if (lVid) lVid.pause();
    
    document.body.style.overflow = "auto"; // Resume scrolling
}
/**
 * Toggles the entire Gallery section On/Off
 */
function toggleGalleryVisibility() {
    const toggle = /** @type {HTMLInputElement | null} */ (document.getElementById("galleryToggle"));
    const wrapper = document.getElementById("galleryWrapper");
    if (toggle && wrapper) {
        wrapper.style.display = toggle.checked ? "block" : "none";
        if (!toggle.checked) closeMedia();
    }
}

/**
 * Turns media enlarged view "On"
 * @param {HTMLElement} element 
 */
function toggleMedia(element) {
    const modal = document.getElementById("mediaLightbox");
    const lImg = /** @type {HTMLImageElement | null} */ (document.getElementById("lightboxImg"));
    const lVid = /** @type {HTMLVideoElement | null} */ (document.getElementById("lightboxVid"));
    const caption = document.getElementById("lightboxCaption");

    if (!modal || !lImg || !lVid || !caption) return;

    lImg.style.display = "none";
    lVid.style.display = "none";
    lVid.pause();

    const img = element.querySelector("img");
    const vid = element.querySelector("video");

    if (img) {
        lImg.src = img.src;
        lImg.style.display = "block";
        caption.innerHTML = img.alt;
    } else if (vid) {
        lVid.src = vid.src;
        lVid.style.display = "block";
        lVid.play().catch(() => {});
        caption.innerHTML = "Angara Highlights";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

/**
 * Turns enlarged view "Off" and stops media
 */
function closeMedia() {
    const modal = document.getElementById("mediaLightbox");
    const lVid = /** @type {HTMLVideoElement | null} */ (document.getElementById("lightboxVid"));
    if (modal) modal.style.display = "none";
    if (lVid) {
        lVid.pause();
        lVid.src = ""; // Reset video fully
    }
    document.body.style.overflow = "auto";
}