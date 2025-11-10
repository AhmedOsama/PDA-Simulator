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

(function() {
  'use strict';

  const FADE_CLASS = 'page-fade-transition';

  const OVERLAY_QUERY = [
    '.modal.show',
    '.modal-overlay',
    '.success-popup-overlay',
    '.overlay',
    '.insulin-overlay',
    '.ms-mobile-select',
    '#image-overlay',
    '#loading-overlay'
  ].join(',');

  let updateScheduled = false;

  function getScrollbarCompensation() {
    const width = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.documentElement.style.setProperty('--scrollbar-compensation', `${width}px`);
    return width;
  }

  function isElementVisible(element) {
    if (!element || element.nodeType !== 1) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (parseFloat(style.opacity) === 0 && style.pointerEvents === 'none') return false;
    return true;
  }

  function hasActiveOverlays() {
    if (document.body.classList.contains('modal-open')) {
      return true;
    }

    const overlays = document.querySelectorAll(OVERLAY_QUERY);
    for (const overlay of overlays) {
      if (overlay.classList && overlay.classList.contains('modal')) {
        if (overlay.classList.contains('show')) {
          return true;
        }
        continue;
      }

      if (overlay.classList && overlay.classList.contains('ms-mobile-select')) {
        if (overlay.classList.contains('ms-show')) {
          return true;
        }
      }

      if (isElementVisible(overlay)) {
        return true;
      }
    }

    return false;
  }

  function applyOverlayState() {
    updateScheduled = false;
    getScrollbarCompensation();
    const hasOverlay = hasActiveOverlays();
    document.body.classList.toggle('overlay-open', hasOverlay);
  }

  function scheduleOverlayStateUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;
    window.requestAnimationFrame(applyOverlayState);
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target === document.body) {
          scheduleOverlayStateUpdate();
          return;
        }
        if (target.nodeType === 1 && target.matches && target.matches(OVERLAY_QUERY)) {
          scheduleOverlayStateUpdate();
          return;
        }
      } else if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches(OVERLAY_QUERY)) {
            scheduleOverlayStateUpdate();
            return;
          }
          if (node.querySelector && node.querySelector(OVERLAY_QUERY)) {
            scheduleOverlayStateUpdate();
            return;
          }
        }
        for (const node of mutation.removedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches(OVERLAY_QUERY)) {
            scheduleOverlayStateUpdate();
            return;
          }
        }
      }
    }
  });

  function initOverlayCompensation() {
    if (!document.body) return;
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      childList: true,
      subtree: true
    });
    scheduleOverlayStateUpdate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOverlayCompensation);
  } else {
    initOverlayCompensation();
  }

  window.addEventListener('resize', scheduleOverlayStateUpdate, { passive: true });
  window.addEventListener('orientationchange', scheduleOverlayStateUpdate, { passive: true });

  function setupPageFadeTransition() {
    if (document.body) {
      document.body.classList.add(FADE_CLASS, 'is-transitioning');
      requestAnimationFrame(() => {
        document.body.classList.remove('is-transitioning');
      });
    }

    document.addEventListener('click', function handleLinkClick(event) {
      if (event.defaultPrevented) return;

      const link = event.target.closest('a');
      if (!link) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;
      if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) return;
      if (link.protocol !== window.location.protocol || link.host !== window.location.host) return;

      document.body.classList.add('is-transitioning');
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPageFadeTransition);
  } else {
    setupPageFadeTransition();
  }
})();
