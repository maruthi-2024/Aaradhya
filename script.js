document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Mobile navigation toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".offering-card, .feature, .testimonial-card, .instagram-post"
  );

  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Cart functionality
let cart = [];
let cartCount = 0;

// Initialize cart from localStorage if available
document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("aaradhyaCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCount();
  }
});

function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

function addToCart(productName, price) {
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1,
    });
  }

  cartCount += 1;
  updateCartCount();

  // Save to localStorage
  localStorage.setItem("aaradhyaCart", JSON.stringify(cart));

  // Show success message
  showNotification(`${productName} added to cart!`);
}

function showNotification(message) {
  // Create notification element
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

// Initialize cart controls
function initCartControls() {
  // Load cart and update displays
  loadCart();
  updateCartDisplays();
}

function loadCart() {
  const savedCart = localStorage.getItem("aaradhyaCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

function updateCartDisplays() {
  // Update cart count in navigation
  updateCartCount();

  // For each product-buttons block
  document.querySelectorAll(".product-buttons").forEach((block) => {
    const product = block.getAttribute("data-product");
    const item = cart.find((i) => i.name === product);
    const addBtn = block.querySelector(".add-to-cart");
    const controls = block.querySelector(".cart-controls");
    const display = block.querySelector(".quantity-display");
    if (item && item.quantity > 0) {
      addBtn.style.display = "none";
      controls.style.display = "flex";
      display.textContent = item.quantity;
    } else {
      addBtn.style.display = "block";
      controls.style.display = "none";
      display.textContent = 0;
    }
  });
}

// Add to cart functionality
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const productName = this.getAttribute("data-product");
    const card = this.closest(".offering-card");
    const priceText = card.querySelector(".price").textContent;
    const price = parseFloat(priceText.replace("₹", "").replace(",", ""));
    addToCart(productName, price);
    updateCartDisplays();
  });
});

// Quantity controls functionality
document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
  button.addEventListener("click", function () {
    const productName = this.getAttribute("data-product");
    const card = this.closest(".offering-card");
    const priceText = card.querySelector(".price").textContent;
    const price = parseFloat(priceText.replace("₹", "").replace(",", ""));
    addToCart(productName, price);
    updateCartDisplays();
  });
});

document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
  button.addEventListener("click", function () {
    const productName = this.getAttribute("data-product");
    const existingItem = cart.find((item) => item.name === productName);
    if (existingItem && existingItem.quantity > 0) {
      existingItem.quantity -= 1;
      cartCount -= 1;
      if (existingItem.quantity === 0) {
        cart = cart.filter((item) => item.name !== productName);
      }
      localStorage.setItem("aaradhyaCart", JSON.stringify(cart));
      updateCartDisplays();
      showNotification(`${productName} removed from cart`);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  initCartControls();
});

// Buy now functionality
document.querySelectorAll(".buy-now").forEach((button) => {
  button.addEventListener("click", function () {
    const card = this.closest(".offering-card");
    const productName = card.querySelector("h3").textContent;
    const priceText = card.querySelector(".price").textContent;
    const price = parseFloat(priceText.replace("₹", "").replace(",", ""));

    // Check if product already exists in cart
    const existingItem = cart.find((item) => item.name === productName);

    if (!existingItem) {
      // Add to cart if not already there
      addToCart(productName, price);
    }

    // Visual feedback
    const originalText = this.textContent;
    this.textContent = "Redirecting...";
    this.style.background = "linear-gradient(135deg, #10B981, #059669)";

    // Redirect to cart page after a short delay
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 1000);
  });
});

// Cart icon click handler
document.querySelector(".cart-icon").addEventListener("click", function () {
  // Navigate to cart page
  window.location.href = "cart.html";
});

// CTA button click handler
document.querySelector(".cta-button").addEventListener("click", function () {
  // Scroll to offerings section
  document.querySelector("#offerings").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// Temple slideshow functionality
function initTempleSlideshow() {
  const slides = document.querySelectorAll(".temple-slide");
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  // Change slide every 3 seconds
  setInterval(nextSlide, 3000);
}

// Initialize temple slideshow
document.addEventListener("DOMContentLoaded", () => {
  initTempleSlideshow();
});

// Parallax effect for hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const mandala = document.querySelector(".mandala-bg");

  if (mandala) {
    mandala.style.transform = `translate(-50%, -50%) rotate(${
      scrolled * 0.1
    }deg)`;
  }
});

// Loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Form validation for contact form (if added later)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// WhatsApp link functionality
document
  .querySelector(".whatsapp-link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const phone = "919876543210";
    const message = "Hello! I'm interested in Aaradhya's spiritual products.";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  });

// Instagram post click handlers
document.querySelectorAll(".instagram-post").forEach((post) => {
  post.addEventListener("click", function () {
    // Open Instagram profile in new tab
    window.open("https://instagram.com/aaradhya", "_blank");
  });
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll("section");

const revealSection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("section--visible");
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

revealSections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

// Add CSS for section animations
const style = document.createElement("style");
document.head.appendChild(style);
