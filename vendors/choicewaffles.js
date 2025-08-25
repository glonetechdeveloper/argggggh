let cart = [];

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  cartItemsEl.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₦${(item.price * item.quantity).toLocaleString()}
      <span class="cart-quantity">
        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">−</button>
        ${item.quantity}
        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
      </span>
      <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = `Total: ₦${total.toLocaleString()}`;
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout...");
}

















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




function updateNavbarCartCount(cart) {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return; // In case the page doesn't have the navbar
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;

  // Animation effect
  cartCountEl.classList.add("updated");
  setTimeout(() => cartCountEl.classList.remove("updated"), 200);
}

