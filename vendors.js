
  // Initialize cart from localStorage or empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartDisplay() {
    const cartIcon = document.getElementById("cart-count");
    cartIcon.textContent = cart.length;
  }

  function addToCart(vendorId, vendorName) {
    const item = {
      id: vendorId,
      name: vendorName,
      quantity: 1
    };

    // Check if vendor already exists in cart
    const existing = cart.find((v) => v.id === vendorId);
    if (!existing) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
      alert(`${vendorName} added to cart!`);
    } else {
    }
  }

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".vendor-card");
      const vendorId = card.getAttribute("data-id");
      const vendorName = card.querySelector("h3").textContent;
      addToCart(vendorId, vendorName);
    });
  });

  // Update cart icon on load
  updateCartDisplay();


  // Sidebar toggles
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileSidebar = document.getElementById("mobileSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");

hamburgerBtn.addEventListener("click", () => {
  mobileSidebar.classList.add("active");
  overlay.classList.add("active");
});

closeSidebar.addEventListener("click", () => {
  mobileSidebar.classList.remove("active");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  mobileSidebar.classList.remove("active");
  overlay.classList.remove("active");
});





  // Search functionality
  const searchInput = document.getElementById("vendor-search");

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll(".vendor-card");

    cards.forEach((card) => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();

      if (name.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

