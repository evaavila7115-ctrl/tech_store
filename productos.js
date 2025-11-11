// Base de datos de productos
const products = [
    {
        id: 1,
        name: "Samsung Galaxy A54",
        brand: "Samsung",
        model: "A54 5G",
        specs: "128GB, 6GB RAM, Triple Cámara 50MP",
        price: 2800,
        stock: 15,
        image: "images/galaxya54.jpg"
    },
    {
        id: 2,
        name: "iPhone 14",
        brand: "Apple",
        model: "iPhone 14",
        specs: "256GB, Face ID, iOS 17, Cámara 12MP",
        price: 8500,
        stock: 8,
        image: "images/iphone14.jpg"
    },
    {
        id: 3,
        name: "Xiaomi Redmi Note 12",
        brand: "Xiaomi",
        model: "Redmi Note 12",
        specs: "64GB, 4GB RAM, Dual Cámara 48MP",
        price: 1500,
        stock: 23,
        image: "images/redminote12.jpg"
    },
    {
        id: 4,
        name: "Huawei P40 Lite",
        brand: "Huawei",
        model: "P40 Lite",
        specs: "128GB, 6GB RAM, Quad Cámara 48MP",
        price: 2200,
        stock: 12,
        image: "images/huaweip40.jpg"
    },
    {
        id: 5,
        name: "Motorola Edge 30",
        brand: "Motorola",
        model: "Edge 30",
        specs: "256GB, 8GB RAM, Triple Cámara 50MP",
        price: 3200,
        stock: 6,
        image: "images/motorolaedge30.jpg"
    },
    {
        id: 6,
        name: "OPPO A78",
        brand: "OPPO",
        model: "A78 5G",
        specs: "128GB, 8GB RAM, Dual Cámara 50MP",
        price: 1800,
        stock: 18,
        image: "images/oppoa78.jpg"
    }
];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Variables globales
let filteredProducts = [...products];

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Filtros
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('brandFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
    
    // Cerrar menú móvil al hacer clic en enlace
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Cargar productos
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    grid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animation = 'fadeInUp 0.5s ease';
    
    const stockBadge = product.stock > 5 
        ? `<span class="product-badge">En Stock</span>` 
        : product.stock > 0 
        ? `<span class="product-badge low-stock">Pocas Unidades</span>`
        : `<span class="product-badge" style="background: #f44336;">Agotado</span>`;
    
    const stockClass = product.stock <= 5 ? 'low' : '';
    
    card.innerHTML = `
        <div class="product-image">
            ${stockBadge}
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTI1IiByPSI0MCIgZmlsbD0iI2U5ZjRmZiIgc3Ryb2tlPSIjNjM2NmYxIiBzdHJva2Utd2lkdGg9IjMiLz48dGV4dCB4PSIxMDAiIHk9IjEzNSIgZm9udC1mYW1pbHk9IkZvbnRBd2Vzb21lIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNjM2NmYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaY8L3RleHQ+PC9zdmc+';">
        </div>
        <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-specs">${product.specs}</div>
            <div class="product-footer">
                <div class="product-price">Bs. ${product.price.toLocaleString()}</div>
                <div class="product-stock ${stockClass}">
                    <i class="fas fa-box"></i> ${product.stock} unidades
                </div>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>
        </div>
    `;
    
    return card;
}

// Aplicar filtros
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const brandFilter = document.getElementById('brandFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    // Filtrar
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.model.toLowerCase().includes(searchTerm) ||
                            product.specs.toLowerCase().includes(searchTerm);
        const matchesBrand = !brandFilter || product.brand === brandFilter;
        
        return matchesSearch && matchesBrand;
    });
    
    // Ordenar
    switch(sortFilter) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Mantener orden por defecto (ID)
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    loadProducts();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('sortFilter').value = 'default';
    applyFilters();
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product || product.stock === 0) {
        showNotification('Producto no disponible', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('No hay más stock disponible', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            maxStock: product.stock
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} agregado al carrito`, 'success');
    
    // Animación del icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.animation = 'none';
    setTimeout(() => {
        cartIcon.style.animation = 'bounce 0.5s ease';
    }, 10);
}

// Actualizar cantidad en el carrito
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > item.maxStock) {
        showNotification('No hay más stock disponible', 'warning');
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
}

// Eliminar del carrito
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    const itemName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    
    saveCart();
    updateCartUI();
    showNotification(`${itemName} eliminado del carrito`, 'info');
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar cuerpo del carrito
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartTotal.textContent = 'Bs. 0';
        checkoutBtn.disabled = true;
        return;
    }
    
    // Mostrar items del carrito
    cartBody.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZTlmNGZmIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkZvbnRBd2Vzb21lIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2NmYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaY8L3RleHQ+PC9zdmc+';">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Bs. ${item.price.toLocaleString()} c/u</div>
                <div class="cart-item-controls">
                    <button class="btn-quantity" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="btn-quantity" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        cartBody.appendChild(cartItem);
    });
    
    cartTotal.innerHTML = `Bs. <span style="color: #ff6b6b;">${total.toLocaleString()}</span>`;
    checkoutBtn.disabled = false;
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Toggle carrito
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevenir scroll del body cuando el carrito está abierto
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Realizar pedido por WhatsApp
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    let message = '¡Hola! 👋 Me interesa realizar el siguiente pedido:\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        message += `${index + 1}. 📱 *${item.name}*\n`;
        message += `   • Cantidad: ${item.quantity} unidad${item.quantity > 1 ? 'es' : ''}\n`;
        message += `   • Precio unitario: Bs. ${item.price.toLocaleString()}\n`;
        message += `   • Subtotal: Bs. ${itemTotal.toLocaleString()}\n\n`;
    });
    
    message += `💰 *TOTAL: Bs. ${total.toLocaleString()}*\n\n`;
    message += '¿Podrías ayudarme con el proceso de compra? Gracias 😊';
    
    const phoneNumber = '59173871178'; // Tu número de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    showNotification('Redirigiendo a WhatsApp...', 'success');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #4caf50, #66bb6a)',
        error: 'linear-gradient(135deg, #f44336, #ef5350)',
        warning: 'linear-gradient(135deg, #ff9800, #ffb74d)',
        info: 'linear-gradient(135deg, #2196f3, #42a5f5)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 3000;
        animation: slideInRight 0.4s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
        font-weight: 600;
    `;
    
    notification.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);