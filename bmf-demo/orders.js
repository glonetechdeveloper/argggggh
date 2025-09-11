import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUeM4bzg6b_9GCSBPLUbCDRQgN47QFwsw",
  authDomain: "buy-me-food-a2223.firebaseapp.com",
  projectId: "buy-me-food-a2223",
  appId: "1:602697360069:web:640a6f142f342bf60ac6ac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ordersList = document.getElementById('orders-list');

function renderOrders(orders) {
  if (ordersList) {
    ordersList.innerHTML = '';
    if (orders.length === 0) {
      ordersList.innerHTML = '<p>No orders yet.</p>';
      return;
    }
    orders.forEach(order => {
      const div = document.createElement('div');
      div.className = 'order-card';
      div.innerHTML = `
        <h3>Order for ${order.user || 'Unknown User'}</h3>
        <p>Date: ${new Date(order.createdAt?.toDate?.() || order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
        <ul>
          ${order.items?.map(item => `<li>${item.name} - $${item.price?.toFixed(2) || 'N/A'}</li>`).join('') || '<li>No items</li>'}
        </ul>
      `;
      ordersList.appendChild(div);
    });
  }
}

let unsubscribeOrders = null;
onAuthStateChanged(auth, user => {
  if (user) {
    setTimeout(() => {
      console.log("Authenticated User Email before query:", user.email);
      console.log("Auth Token Email:", getAuthTokenEmail());
      const ordersRef = collection(db, "orders");
      unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds || 0);
        renderOrders(orders);
      }, (error) => {
        console.error("Error fetching orders:", error);
        if (ordersList) ordersList.innerHTML = '<p>Error loading orders. Check console.</p>';
      });
    }, 1000); // Delay to ensure token
  } else {
    if (ordersList) ordersList.innerHTML = '<p>Login to see your orders.</p>';
    if (unsubscribeOrders) unsubscribeOrders();
  }
});

function getAuthTokenEmail() {
  return auth.currentUser ? auth.currentUser.email : 'No token';
}

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileSidebar = document.getElementById("mobileSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    mobileSidebar.classList.add("active");
    overlay.classList.add("active");
  });
}

if (closeSidebar) {
  closeSidebar.addEventListener("click", () => {
    mobileSidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    mobileSidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}