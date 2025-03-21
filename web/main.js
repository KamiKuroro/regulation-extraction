// Main JavaScript for GMA Intelligent Qualification Query System

// Prevent zooming on the webpage
window.addEventListener("wheel", (e)=> {
  const isPinching = e.ctrlKey;
  if(isPinching) e.preventDefault();
}, { passive: false });

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
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
