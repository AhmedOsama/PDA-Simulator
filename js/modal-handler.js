/**
 * Universal Modal Handler
 * Handles closing modals when clicking outside
 */

(function() {
  'use strict';
  
  // Setup modal backdrop close functionality
  function setupModalBackdropClose() {
    // Handle custom modal overlays
    document.addEventListener('click', function(e) {
      // Check if clicked element is a modal overlay
      if (e.target.classList.contains('modal-overlay') || 
          e.target.classList.contains('modal-backdrop')) {
        
        // Find active modals within this overlay
        const activeModals = e.target.querySelectorAll('.active, .show, .ms-show');
        activeModals.forEach(modal => {
          // Try to close using closeModalMs if available
          if (typeof closeModalMs === 'function') {
            const modalId = modal.id || modal.parentElement.id;
            if (modalId) closeModalMs(modalId);
          } else {
            // Fallback: remove active classes
            modal.classList.remove('active', 'show', 'ms-show');
          }
        });
        
        // Also remove active class from overlay itself
        e.target.classList.remove('active', 'show');
      }
      
      // Handle Bootstrap modals
      if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
        // Check if clicked on the modal itself (not content)
        if (e.target === e.currentTarget) {
          const bsModal = bootstrap.Modal.getInstance(e.target);
          if (bsModal) {
            bsModal.hide();
          }
        }
      }
    }, true); // Use capture to catch events early
    
    // Handle ESC key to close modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        // Find all active modals
        const activeModals = document.querySelectorAll('.modal-overlay.active, .modal.show, .ms-mobile-select.ms-show');
        
        activeModals.forEach(modal => {
          if (typeof closeModalMs === 'function') {
            const modalId = modal.id;
            if (modalId) closeModalMs(modalId);
          } else if (modal.classList.contains('modal') && typeof bootstrap !== 'undefined') {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
          } else {
            modal.classList.remove('active', 'show', 'ms-show');
          }
        });
      }
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupModalBackdropClose);
  } else {
    setupModalBackdropClose();
  }
  
  // Export for use in other scripts if needed
  window.setupModalBackdropClose = setupModalBackdropClose;
})();
