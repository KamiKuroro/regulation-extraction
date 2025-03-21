// Visualization utilities for GMA Intelligent Qualification Query System

// Add visual enhancements and interactive components
document.addEventListener('DOMContentLoaded', () => {
  // Format switch between structured and raw views
  const formatButtons = document.querySelectorAll('.flex.border.border-gray-300 button');
  if (formatButtons.length === 2) {
    formatButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Toggle active state
        formatButtons.forEach(btn => {
          btn.classList.remove('bg-black', 'text-white');
          btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
        });
        
        button.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
        button.classList.add('bg-black', 'text-white');
        
        // Toggle view (in a real app, this would change the display format)
        const resultsContent = document.getElementById('results-content');
        if (index === 0) { // Structured view
          // This would reformat the content in a structured way
          // For demo, we'll just apply some styling
          resultsContent.querySelectorAll('h2').forEach(h2 => {
            h2.style.color = '#000';
            h2.style.borderBottom = '1px solid #e2e2e2';
          });
          resultsContent.querySelectorAll('ul').forEach(ul => {
            ul.style.listStyleType = 'none';
          });
        } else { // Raw view
          // This would show the raw markdown or JSON
          // For demo, we'll just apply different styling
          resultsContent.querySelectorAll('h2').forEach(h2 => {
            h2.style.color = '#555';
            h2.style.borderBottom = '1px dashed #e2e2e2';
          });
          resultsContent.querySelectorAll('ul').forEach(ul => {
            ul.style.listStyleType = 'disc';
          });
        }
      });
    });
  }
  
  // Highlight important updates with animation
  setTimeout(() => {
    const resultsContent = document.getElementById('results-content');
    if (resultsContent) {
      const importantNotes = resultsContent.querySelectorAll('p');
      importantNotes.forEach(note => {
        if (note.textContent.includes('❗')) {
          note.classList.add('bg-amber-50', 'border-l-4', 'border-amber-400', 'p-3', 'rounded-r');
          note.style.animation = 'highlight-pulse 2s infinite';
          
          // Add the CSS animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes highlight-pulse {
              0% { background-color: rgba(254, 243, 199, 0.5); }
              50% { background-color: rgba(254, 243, 199, 0.8); }
              100% { background-color: rgba(254, 243, 199, 0.5); }
            }
          `;
          document.head.appendChild(style);
        }
      });
    }
  }, 2000);
  
  // Add hover effects to data source items
  const dataSources = document.querySelectorAll('.md\\:w-1\\/2 .mb-4');
  dataSources.forEach(source => {
    source.addEventListener('mouseenter', () => {
      source.style.backgroundColor = '#f9fafb';
      source.style.transition = 'background-color 0.2s ease';
    });
    
    source.addEventListener('mouseleave', () => {
      source.style.backgroundColor = 'transparent';
    });
  });
});
