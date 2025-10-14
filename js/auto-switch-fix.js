// Ultra Simple Auto Switch Solution
// CSS handles the visual, we just handle the state

(function() {
  'use strict';
  
  console.log('🚀 Ultra simple switch solution loading...');
  
  // Wait for DOM
  function init() {
    const checkbox = document.getElementById('autoModeSwitch');
    if (!checkbox) {
      console.log('⏳ Waiting for checkbox...');
      setTimeout(init, 100);
      return;
    }
    
    console.log('✅ Checkbox found!');
    
    // Load saved state
    const savedState = localStorage.getItem('autoModeSwitch');
    if (savedState !== null) {
      checkbox.checked = savedState === 'true';
      console.log('💾 Loaded state:', checkbox.checked);
    }
    
    // Save state on change (using native event)
    checkbox.onchange = function() {
      const isChecked = this.checked;
      localStorage.setItem('autoModeSwitch', isChecked ? 'true' : 'false');
      console.log('💾 Saved state:', isChecked);
      
      // Call other functions if they exist
      if (typeof window.updateFinalStatusScreen === 'function') {
        try { window.updateFinalStatusScreen(); } catch(e) {}
      }
      if (typeof window.handleCheckboxModeSwitch === 'function') {
        try { window.handleCheckboxModeSwitch(); } catch(e) {}
      }
    };
    
    // Make absolutely sure the checkbox is clickable
    checkbox.style.pointerEvents = 'auto';
    checkbox.style.cursor = 'pointer';
    
    console.log('✅ Ultra simple switch ready!');
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

console.log('📦 Ultra simple switch script loaded!');
