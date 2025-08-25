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