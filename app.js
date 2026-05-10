// Menu Data
const menuData = [
    { id: 1, name: "Veg Momos", desc: "Steamed dumplings with fresh veggies.", price: 80, category: "Fast Food" },
    { id: 2, name: "Chicken Momos", desc: "Juicy steamed dumplings stuffed with minced chicken.", price: 120, category: "Fast Food" },
    { id: 3, name: "Kurkure Momos", desc: "Crispy fried momos tossed in special spices.", price: 140, category: "Fast Food" },
    { id: 4, name: "Paneer Roll", desc: "Spicy paneer tikka wrapped in a soft paratha.", price: 110, category: "Rolls" },
    { id: 5, name: "Chicken Egg Roll", desc: "Double egg and spicy chicken chunks wrapped together.", price: 150, category: "Rolls" },
    { id: 6, name: "White Sauce Pasta", desc: "Creamy cheesy pasta with herbs and olives.", price: 180, category: "Pasta" },
    { id: 7, name: "Red Sauce Pasta", desc: "Tangy tomato arrabbiata pasta with exotic veggies.", price: 160, category: "Pasta" },
    { id: 8, name: "Grilled Sandwich", desc: "Stuffed with cheese, corn, and capsicum.", price: 90, category: "Sandwich" },
    { id: 9, name: "Chicken Tikka Sandwich", desc: "Loaded with grilled chicken and tandoori mayo.", price: 130, category: "Sandwich" },
    { id: 10, name: "Cold Coffee", desc: "Classic thick cold coffee with a scoop of vanilla.", price: 100, category: "Beverages" },
    { id: 11, name: "Virgin Mojito", desc: "Refreshing mint and lemon cooler.", price: 90, category: "Beverages" }
];

// App State
let currentOrderType = 'Dine-In'; // 'Dine-In' or 'Takeaway'
let activeCategory = 'All';
let cart = {}; // { itemId: quantity }

// Elements
const categoriesContainer = document.getElementById('categories-container');
const menuContainer = document.getElementById('menu-container');
const btnDineIn = document.getElementById('btn-dine-in');
const btnTakeaway = document.getElementById('btn-takeaway');
const cartBar = document.getElementById('cart-bar');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const modalTotalPrice = document.getElementById('modal-total-price');
const modalOrderType = document.getElementById('modal-order-type');
const successScreen = document.getElementById('success-screen');

// Initialize
function init() {
    renderCategories();
    renderMenu();
}

// Order Type Toggle
function setOrderType(type) {
    currentOrderType = type;
    
    // Update Buttons
    if (type === 'Dine-In') {
        btnDineIn.classList.add('active');
        btnTakeaway.classList.remove('active');
    } else {
        btnTakeaway.classList.add('active');
        btnDineIn.classList.remove('active');
    }
}

// Menu Functions
function renderCategories() {
    const categories = ['All', ...new Set(menuData.map(item => item.category))];
    categoriesContainer.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${activeCategory === cat ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => {
            activeCategory = cat;
            renderCategories(); // Re-render to update active class
            renderMenu();
        };
        categoriesContainer.appendChild(btn);
    });
}

function renderMenu() {
    menuContainer.innerHTML = '';
    
    const filteredMenu = activeCategory === 'All' 
        ? menuData 
        : menuData.filter(item => item.category === activeCategory);
        
    filteredMenu.forEach(item => {
        const qty = cart[item.id] || 0;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-item';
        
        let actionHTML = '';
        if (qty === 0) {
            actionHTML = `<button class="add-init-btn" onclick="updateCart(${item.id}, 1)">Add</button>`;
        } else {
            actionHTML = `
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateCart(${item.id}, -1)"><i class="ph ph-minus"></i></button>
                    <span class="qty-display">${qty}</span>
                    <button class="qty-btn add-btn" onclick="updateCart(${item.id}, 1)"><i class="ph ph-plus"></i></button>
                </div>
            `;
        }
        
        itemEl.innerHTML = `
            <div class="menu-item-info">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-desc">${item.desc}</p>
                <div class="menu-item-price">₹${item.price}</div>
            </div>
            <div class="menu-item-action" id="action-${item.id}">
                ${actionHTML}
            </div>
        `;
        
        menuContainer.appendChild(itemEl);
    });
}

// Cart Functions
function updateCart(itemId, change) {
    if (!cart[itemId]) cart[itemId] = 0;
    
    cart[itemId] += change;
    
    if (cart[itemId] <= 0) {
        delete cart[itemId];
    }
    
    renderMenu(); // Update UI buttons
    updateCartBar();
    
    // If modal is open, update it
    if (cartModal.classList.contains('open')) {
        renderCartModal();
        if (Object.keys(cart).length === 0) {
            toggleCartModal(); // close if empty
        }
    }
}

function updateCartBar() {
    const itemIds = Object.keys(cart);
    let totalItems = 0;
    let totalPrice = 0;
    
    itemIds.forEach(id => {
        const qty = cart[id];
        const item = menuData.find(i => i.id === parseInt(id));
        totalItems += qty;
        totalPrice += (qty * item.price);
    });
    
    if (totalItems > 0) {
        cartCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
        cartTotalPrice.textContent = `₹${totalPrice}`;
        cartBar.classList.remove('hidden');
    } else {
        cartBar.classList.add('hidden');
    }
}

function toggleCartModal() {
    if (Object.keys(cart).length === 0) return;
    
    if (cartModal.classList.contains('open')) {
        cartModal.classList.remove('open');
    } else {
        renderCartModal();
        cartModal.classList.add('open');
    }
}

function renderCartModal() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    modalOrderType.textContent = currentOrderType;
    
    Object.keys(cart).forEach(id => {
        const qty = cart[id];
        const item = menuData.find(i => i.id === parseInt(id));
        totalPrice += (qty * item.price);
        
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="qty-control">
                <button class="qty-btn" onclick="updateCart(${item.id}, -1)"><i class="ph ph-minus"></i></button>
                <span class="qty-display">${qty}</span>
                <button class="qty-btn add-btn" onclick="updateCart(${item.id}, 1)"><i class="ph ph-plus"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });
    
    modalTotalPrice.textContent = `₹${totalPrice}`;
}

// Order Logic
function placeOrder() {
    toggleCartModal();
    const orderId = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('random-order-id').textContent = `#BH-${orderId}`;
    document.getElementById('success-order-type').textContent = currentOrderType;
    successScreen.classList.add('active');
    cartBar.classList.add('hidden');
}

function startNewOrder() {
    cart = {};
    activeCategory = 'All';
    updateCartBar();
    successScreen.classList.remove('active');
    init(); // reset menu UI
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Start app
init();
