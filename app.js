// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
const foodList = document.getElementById('food-list');
const cartEl = document.getElementById('cart');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = [];

// Dummy food data
const foods = [
  { name: "Pizza", price: 9.99, img: "https://source.unsplash.com/200x150/?pizza" },
  { name: "Burger", price: 5.99, img: "https://source.unsplash.com/200x150/?burger" },
  { name: "Sushi", price: 12.99, img: "https://source.unsplash.com/200x150/?sushi" },
];

foods.forEach(food => {
  const card = document.createElement('div');
  card.className = 'food-card';
  card.innerHTML = `
    <img src="${food.img}" />
    <h3>${food.name}</h3>
    <p>$${food.price.toFixed(2)}</p>
    <button>Add to Cart</button>
  `;
  card.querySelector('button').addEventListener('click', () => addToCart(food));
  foodList.appendChild(card);
});

function addToCart(item) {
  cart.push(item);
  renderCart();
}

function renderCart() {
  cartEl.innerHTML = '';
  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartEl.appendChild(li);
  });
}

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
    alert("Order placed!");
    cart = [];
    renderCart();
  } catch (e) {
    console.error("Error adding order:", e);
  }
});

// Auth
loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
logoutBtn.addEventListener('click', () => signOut(auth));

signupBtn.addEventListener('click', async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    loginModal.style.display = 'none';
  } catch (e) {
    alert(e.message);
  }
});

loginFormBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    loginModal.style.display = 'none';
  } catch (e) {
    alert(e.message);
  }
});

onAuthStateChanged(auth, user => {
  if (user) {
    userEmail.textContent = user.email;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline';
  } else {
    userEmail.textContent = '';
    loginBtn.style.display = 'inline';
    logoutBtn.style.display = 'none';
  }
});
