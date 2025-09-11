// Sidebar toggles
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

// Search functionality
const searchInput = document.getElementById("vendor-search");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll(".vendor-card");
    cards.forEach((card) => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();
      card.style.display = name.includes(searchTerm) || description.includes(searchTerm) ? "block" : "none";
    });
  });
}