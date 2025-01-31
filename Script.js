// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const cart = {
    items: [],
    total: 0
  };

  const closeCart = document.querySelector('.close-cart');
  const cartDropdown = document.querySelector('.cart-dropdown');

  closeCart.addEventListener('click', () => {
    cartDropdown.style.display = 'none';
  });

  function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const cartCount = document.querySelector('.cart-count');
    
    let totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.items.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Tu carrito está vacío</p>
        </div>
      `;
    } else {
      cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <span>${item.name}</span>
          <div class="quantity-controls">
            <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${cart.total.toFixed(2)}`;
  }

  window.updateQuantity = (id, change) => {
    const item = cart.items.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      updateCart();
    }
  };

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const { id, name, price } = button.dataset;
      const existingItem = cart.items.find(item => item.id === parseInt(id));
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          id: parseInt(id),
          name,
          price: parseFloat(price),
          quantity: 1
        });
      }
      updateCart();
      showNotification(name);
      animateCartIcon();
    });
  });

  window.removeFromCart = (id) => {
    const index = cart.items.findIndex(item => item.id === id);
    if (index > -1) {
      cart.total -= cart.items[index].price;
      cart.items.splice(index, 1);
      updateCart();
    }
  };

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('.cart-count');

  function showNotification(productName) {
    // Remove existing notification if present
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${productName} añadido al carrito`;
    document.body.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
      notification.remove();
    }, 2300);
  }

  function updateButton(button) {
    button.classList.add('added');
    button.innerHTML = 'Añadido al carrito ✓';
    
    setTimeout(() => {
      button.classList.remove('added');
      button.innerHTML = 'Añadir al carrito';
    }, 2000);
  }

  function animateCartIcon() {
    cartIcon.classList.add('cart-shake');
    cartCount.classList.add('scaleCount');
    
    setTimeout(() => {
      cartIcon.classList.remove('cart-shake');
      cartCount.classList.remove('scaleCount');
    }, 500);
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productName = this.dataset.name;
      const productPrice = this.dataset.price;
      
      // Visual feedback
      updateButton(this);
      showNotification(productName);
      animateCartIcon();
      
      // Update cart count
      const currentCount = parseInt(cartCount.textContent);
      cartCount.textContent = currentCount + 1;
      
      // Aquí puedes añadir la lógica para actualizar el carrito
    });
  });

  // Toggle cart dropdown
  cartIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from bubbling to document
    cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close cart when clicking outside
  document.addEventListener('click', (e) => {
    if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
      cartDropdown.style.display = 'none';
    }
  });

  // Close cart with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cartDropdown.style.display = 'none';
    }
  });
});