/**
 * Smooth Navigation Helper
 * Automatically handles smooth page transitions for all navigation
 */

// Helper function for smooth page transitions
window.smoothNavigate = window.smoothNavigate || function(url) {
  document.body.classList.add('page-transition');
  setTimeout(() => {
    window.location.href = url;
  }, 150);
};

// Intercept all clicks on elements with onclick that sets window.location.href
document.addEventListener('DOMContentLoaded', function() {
  // Override window.location.href setter for smooth transitions
  let isNavigating = false;
  
  const originalHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
  
  Object.defineProperty(window.location, 'href', {
    set: function(url) {
      if (!isNavigating && !document.body.classList.contains('page-transition')) {
        isNavigating = true;
        document.body.classList.add('page-transition');
        setTimeout(() => {
          originalHrefDescriptor.set.call(window.location, url);
        }, 150);
      } else {
        originalHrefDescriptor.set.call(window.location, url);
      }
    },
    get: function() {
      return originalHrefDescriptor.get.call(window.location);
    }
  });
  
  // Also handle regular <a> links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.target && link.href.indexOf('http') !== 0) {
      e.preventDefault();
      smoothNavigate(link.href);
    }
  }, true);
});
