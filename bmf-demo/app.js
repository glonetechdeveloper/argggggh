import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, arrayUnion, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBUeM4bzg6b_9GCSBPLUbCDRQgN47QFwsw",
  authDomain: "buy-me-food-a2223.firebaseapp.com",
  projectId: "buy-me-food-a2223",
  appId: "1:602697360069:web:640a6f142f342bf60ac6ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI Elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const signupBtn = document.getElementById('signup');
const loginFormBtn = document.getElementById('login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userEmail = document.getElementById('userEmail');
const cartEl = document.getElementById('cart');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = [];

// Add event listeners to vendor buttons
function initializeVendorButtons() {
  const vendorButtons = document.querySelectorAll('.add-to-cart');
  vendorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.vendor-card');
      const item = {
        id: card.getAttribute('data-id'),
        name: card.querySelector('h3').textContent,
        price: 9.99, // Placeholder price; update with real prices
        img: card.querySelector('img').src
      };
      addToCart(item);
    });
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', initializeVendorButtons);

async function addToCart(item) {
  if (!auth.currentUser) return alert("Login to add to cart");
  if (cart.some(existing => existing.id === item.id)) return alert("Item already in cart");
  const cartRef = doc(db, "users", auth.currentUser.uid, "cart", "active");
  await updateDoc(cartRef, { items: arrayUnion(item) }).catch(() => setDoc(cartRef, { items: [item] }));
  cart.push(item);
  renderCart();
}

function renderCart() {
  if (cartEl) {
    cartEl.innerHTML = '';
    cart.forEach((item, i) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
      cartEl.appendChild(li);
    });
  }
  const cartCountId = document.getElementById('cart-count');
  const cartCountClasses = document.getElementsByClassName('cart-count');
  if (cartCountId) cartCountId.textContent = cart.length;
  for (let element of cartCountClasses) {
    element.textContent = cart.length;
  }
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login to checkout");
    if (cart.length === 0) return alert("Cart is empty");
    try {
      await addDoc(collection(db, "orders"), {
        user: user.email,
        items: cart,
        createdAt: new Date()
      });
      await updateDoc(doc(db, "users", user.uid, "cart", "active"), { items: [] });
      cart = [];
      renderCart();
      alert("Order placed!");
    } catch (e) {
      console.error("Error adding order:", e);
      alert("Checkout failed. Check console for details.");
    }
  });
}

// Auth
if (loginBtn) loginBtn.addEventListener('click', () => loginModal && (loginModal.style.display = 'block'));
if (logoutBtn) logoutBtn.addEventListener('click', () => signOut(auth));

if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    try {
      await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
      if (loginModal) loginModal.style.display = 'none';
    } catch (e) {
      alert(e.message);
    }
  });
}

if (loginFormBtn) {
  loginFormBtn.addEventListener('click', async () => {
    try {
      await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
      if (loginModal) loginModal.style.display = 'none';
    } catch (e) {
      alert(e.message);
    }
  });
}

let unsubscribeCart = null;
onAuthStateChanged(auth, async user => {
  if (user) {
    if (userEmail) userEmail.textContent = user.email;
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline';
    const cartRef = doc(db, "users", user.uid, "cart", "active");
    unsubscribeCart = onSnapshot(cartRef, (snap) => {
      cart = snap.data()?.items || [];
      renderCart();
    }, (error) => {
      console.error("Error loading cart:", error);
      cart = [];
      renderCart();
    });
  } else {
    if (userEmail) userEmail.textContent = '';
    if (loginBtn) loginBtn.style.display = 'inline';
    if (logoutBtn) logoutBtn.style.display = 'none';
    // Keep cart as is, don’t reset
    if (unsubscribeCart) unsubscribeCart();
  }
});