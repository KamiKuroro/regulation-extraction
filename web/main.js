// Main JavaScript for GMA Intelligent Qualification Query System

// Prevent zooming on the webpage
window.addEventListener("wheel", (e)=> {
  const isPinching = e.ctrlKey;
  if(isPinching) e.preventDefault();
}, { passive: false });

// Add a favicon to prevent 404 errors
function addFavicon() {
  // Check if a favicon already exists
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'%3E%3C/path%3E%3Cpolyline points='13 2 13 9 20 9'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cline x1='10' y1='9' x2='8' y2='9'%3E%3C/line%3E%3C/svg%3E";
    document.head.appendChild(favicon);
  }
}

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  // Add favicon to prevent 404 errors
  addFavicon();
  
  const lucideIcons = document.querySelectorAll('[data-lucide]');
  lucideIcons.forEach(element => {
    const iconName = element.getAttribute('data-lucide');
    if (iconName && window.lucide && window.lucide[iconName]) {
      const icon = window.lucide[iconName]();
      element.innerHTML = icon.outerHTML;
    }
  });

  // Add event listeners for the query button
  document.getElementById('query-button').addEventListener('click', handleQuery);

  // Initialize any other components
  initializeComponents();
});

function initializeComponents() {
  // Initialize other components as needed
  console.log('Initializing components...');
  
  // Example: Add hover effects to feature cards
  const featureCards = document.querySelectorAll('.grid-cols-2 > div');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('div > i');
      if (icon) {
        icon.parentElement.style.transform = 'scale(1.1)';
        icon.parentElement.style.transition = 'transform 0.2s ease-in-out';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('div > i');
      if (icon) {
        icon.parentElement.style.transform = 'scale(1)';
      }
    });
  });
}
