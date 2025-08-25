document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    toggleBtn.classList.toggle('open');
  });

  // Optional: Fade-in page content
  const content = document.querySelector('.dashboard-content');
  content.style.opacity = 0;
  setTimeout(() => {
    content.style.transition = 'opacity 0.6s ease-in-out';
    content.style.opacity = 1;
  }, 200);
});





