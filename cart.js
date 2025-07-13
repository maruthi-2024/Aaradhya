// Cart page functionality
let cart = [];
let cartCount = 0;

// Initialize cart from localStorage
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  displayCart();
  updateCartCount();
});

function loadCart() {
  const savedCart = localStorage.getItem("aaradhyaCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCartDiv = document.getElementById("emptyCart");
  const cartContainer = document.querySelector(".cart-container");

  if (cart.length === 0) {
    // Show empty cart message
    if (cartContainer) cartContainer.style.display = "none";
    if (emptyCartDiv) emptyCartDiv.style.display = "block";
    return;
  }

  // Show cart items
  if (cartContainer) cartContainer.style.display = "grid";
  if (emptyCartDiv) emptyCartDiv.style.display = "none";

  // Generate cart items HTML
  const cartItemsHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <i class="fas fa-om"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="price">₹${item.price.toLocaleString()}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                ₹${(item.price * item.quantity).toLocaleString()}
            </div>
            <button class="remove-item" onclick="removeItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
    )
    .join("");

  cartItemsContainer.innerHTML = cartItemsHTML;

  updateCartSummary();
}

function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
      removeItem(index);
    } else {
      cartCount += change;
      updateCartCount();
      saveCart();
      displayCart();
    }
  }
}

function removeItem(index) {
  if (cart[index]) {
    cartCount -= cart[index].quantity;
    cart.splice(index, 1);
    updateCartCount();
    saveCart();
    displayCart();

    // Show notification
    showNotification("Item removed from cart");
  }
}

function updateCartSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  document.getElementById(
    "subtotal"
  ).textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById(
    "shipping"
  ).textContent = `₹${shipping.toLocaleString()}`;
  document.getElementById("total").textContent = `₹${total.toLocaleString()}`;
}

function saveCart() {
  localStorage.setItem("aaradhyaCart", JSON.stringify(cart));
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Checkout button functionality
document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    showNotification("Your cart is empty");
    return;
  }

  // For now, redirect to WhatsApp with cart details
  const total =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50;
  const message = `Hello! I would like to place an order:\n\n${cart
    .map(
      (item) =>
        `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    )
    .join("\n")}\n\nTotal: ₹${total.toLocaleString()}`;

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
});

// Mobile navigation toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (hamburger) hamburger.classList.remove("active");
    if (navMenu) navMenu.classList.remove("active");
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  }
});

// Add responsive styles for cart page
const style = document.createElement("style");
style.textContent = `
    @media (max-width: 768px) {
        .cart-container {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .cart-item {
            grid-template-columns: 1fr;
            gap: 15px;
            text-align: center;
        }
        
        .cart-item-image {
            margin: 0 auto;
        }
        
        .quantity-controls {
            justify-content: center;
        }
        
        .cart-summary {
            position: static;
        }
    }
`;
document.head.appendChild(style);
