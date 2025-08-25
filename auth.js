// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBUeM4bzg6b_9GCSBPLUbCDRQgN47QFwsw",
  authDomain: "buy-me-food-a2223.firebaseapp.com",
  projectId: "buy-me-food-a2223",
  appId: "1:602697360069:web:640a6f142f342bf60ac6ac"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI Interactions
const container = document.getElementById('container');
document.getElementById('signUp').addEventListener('click', () => {
  container.classList.add("right-panel-active");
});
document.getElementById('signIn').addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});
const mobileCreateAccountBtn = document.getElementById('mobileCreateAccountBtn');

mobileCreateAccountBtn.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

const mobileLoginBtn = document.getElementById('mobileLoginBtn');

mobileLoginBtn.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});


import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Google sign-in button
const loginWithGoogleBtn = document.getElementById("loginWithGoogleBtn");

loginWithGoogleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert(`Welcome, ${user.displayName}!`);
    // Redirect or update UI here
    window.location.href = "index.html"; // or your dashboard
  } catch (error) {
    console.error("Google Sign-in failed", error);
    alert("Google Sign-in failed. Try again.");
  }
});

const SignupwithGoogleBtn = document.getElementById("SignupwithGoogleBtn");

SignupwithGoogleBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert(`Welcome, ${user.displayName}!`);
    // Redirect or update UI here
    window.location.href = "index.html"; // or your dashboard
  } catch (error) {
    console.error("Google Sign-up failed", error);
    alert("Google Sign-up failed. Try again.");
  }
});


