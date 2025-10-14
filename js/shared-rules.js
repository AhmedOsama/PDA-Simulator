// ملف القواعد المشتركة لكل الصفحات

(function() {
  console.log('📋 Loading shared rules...');
  
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  function enforceInsulinPumpRule() {
    if (localStorage.getItem("pump-pairing") === "false" && localStorage.getItem("insulin-qaedy") === "true") {
      console.log('🔴 Shared Rules: pump-pairing is false, setting insulin-qaedy to false');
      originalSetItem.call(localStorage, "insulin-qaedy", "false");
      
      if (localStorage.getItem("activeTab")) {
        console.log('🔴 Removing activeTab because insulin-qaedy is now false');
        originalRemoveItem.call(localStorage, "activeTab");
      }
    }
  }
  
  enforceInsulinPumpRule();
  function fallbackUIUpdate(key, value) {
    console.log(`🔄 Fallback UI Update for ${key}: ${value}`);

    if (key === "cgms_paired") {
      const cgmsElements = document.querySelectorAll('[id*="cgms"], [class*="cgms"], .cgms-paired, .cgms-status, #cgmsStatus');
      cgmsElements.forEach(el => {
        if (el && el.textContent !== undefined) {
          if (!el.children.length || el.tagName === 'SPAN' || el.tagName === 'DIV') {
            if (value === "true") {
              el.textContent = "جاهز";
              el.style.color = "#1b52a4";
            } else {
              el.textContent = "غير جاهز";
              el.style.color = "#7b7b7b";
            }
          }
        }
      });
      const cgmsImage = document.getElementById('suspendChartImage');
      if (cgmsImage && value === "false") {
        cgmsImage.src = 'assets/basal.jpg';
      }
    }

    if (key === "pump-pairing") {
      const pumpElements = document.querySelectorAll('[id*="pump"], [class*="pump"], .pump-status, .insulin-status, #pumpStatus');
      pumpElements.forEach(el => {
        if (el && el.textContent !== undefined) {
          if (!el.children.length || el.tagName === 'SPAN' || el.tagName === 'DIV') {
            if (value === "true") {
              el.textContent = "جاهز";
              el.style.color = "#1b52a4";
            } else {
              el.textContent = "غير جاهز";
              el.style.color = "#7b7b7b";
            }
          }
        }
      });
    }

    if (key === "autoModeSwitch") {
      // More specific selectors to avoid affecting switch elements
      const autoElements = document.querySelectorAll('.mode-status, .auto-mode-status, .auto-status-text, #autoModeStatus, #autoStatusText');
      autoElements.forEach(el => {
        if (el && el.textContent !== undefined) {
          if (value === "true") {
            el.textContent = "مفعل";
            el.style.color = "#1b52a4";
          } else {
            el.textContent = "معطل";
            el.style.color = "#7b7b7b";
          }
        }
      });

      const autoSwitches = document.querySelectorAll('#autoModeSwitch, #planautoModeSwitch, #exerciseautoModeSwitch');
      autoSwitches.forEach(switchEl => {
        if (switchEl && switchEl.type === 'checkbox') {
          switchEl.checked = value === "true";
        }
      });
      const autoIconDiv = document.getElementById('autoIconDiv');
      if (autoIconDiv) {
        if (value === "true") {
          autoIconDiv.style.backgroundImage = 'url(assets/23-active.png)';
        } else {
          autoIconDiv.style.backgroundImage = 'url(assets/23.png)';
        }
      }
    }

    window.dispatchEvent(new CustomEvent('sharedRulesUpdate', {
      detail: { key, value }
    }));
  }
  function checkAutoModeRequirements() {
    const pumpPaired = localStorage.getItem("pump-pairing") === "true";
    const insulinQaedy = localStorage.getItem("insulin-qaedy") === "true";
    const glucoseLimitsCleared = localStorage.getItem("glucose_limits_v2_cleared") === "true";
    const activeTimeSelected = localStorage.getItem("active_time_selected") === "true";
    const dailyDoseSelected = localStorage.getItem("daily_dose_selected") === "true";
    const cgmsPaired = localStorage.getItem("cgms_paired") === "true";
    
    const allRequirementsMet = pumpPaired && insulinQaedy && glucoseLimitsCleared && 
                                activeTimeSelected && dailyDoseSelected && cgmsPaired;
    
    if (!allRequirementsMet) {
      const autoModeSwitch = localStorage.getItem("autoModeSwitch");
      if (autoModeSwitch === "true") {
        console.log('🔴 Shared Rules: Auto mode requirements not met, disabling autoModeSwitch');
        originalSetItem.call(localStorage, "autoModeSwitch", "false");
        
        if (localStorage.getItem("exerciseautoModeSwitch") === "true") {
          originalSetItem.call(localStorage, "exerciseautoModeSwitch", "false");
        }
      }
    }
  }
  localStorage.setItem = function(key, value) {
    const oldValue = localStorage.getItem(key);
    originalSetItem.call(this, key, value);
    if (['cgms_paired', 'pump-pairing', 'autoModeSwitch'].includes(key)) {
      setTimeout(() => {
        if (typeof fallbackUIUpdate === 'function') {
          fallbackUIUpdate(key, value);
        }
      }, 50);
    }
    if (key === "pump-pairing" && value === "false") {
      console.log("🔴 Shared Rules: pump-pairing set to false, enforcing rules...");
      if (localStorage.getItem("insulin-qaedy") === "true") {
        originalSetItem.call(localStorage, "insulin-qaedy", "false");
        console.log("  → insulin-qaedy set to false");
      }
      if (localStorage.getItem("activeTab")) {
        originalRemoveItem.call(localStorage, "activeTab");
        console.log("  → activeTab removed");
      }
      if (localStorage.getItem("autoModeSwitch") === "true") {
        originalSetItem.call(localStorage, "autoModeSwitch", "false");
        console.log("  → autoModeSwitch set to false");
      }
    }
    if (key === "insulin-qaedy" && value === "false") {
      if (localStorage.getItem("activeTab")) {
        originalRemoveItem.call(localStorage, "activeTab");
        console.log("🔴 Shared Rules: insulin-qaedy is false, removed activeTab");
      }
      checkAutoModeRequirements();
    }
    if (key === "insulin-qaedy" && value === "true") {
      if (localStorage.getItem("pump-pairing") !== "true") {
        console.log("🔴 Shared Rules: Cannot set insulin-qaedy to true, pump not paired!");
        originalSetItem.call(localStorage, "insulin-qaedy", "false");
        return;
      }
    }
    const autoModeRequirements = [
      "pump-pairing", "insulin-qaedy", "glucose_limits_v2_cleared",
      "active_time_selected", "daily_dose_selected", "cgms_paired"
    ];
    
    if (autoModeRequirements.includes(key)) {
      setTimeout(() => {
        checkAutoModeRequirements();
    if (typeof checkAndDisableAutoMode === 'function') {
      try {
        checkAndDisableAutoMode();
      } catch (error) {
        console.warn('⚠️ Error calling checkAndDisableAutoMode:', error);
      }
    }
      }, 100);
    }
    if (typeof updateActivateButton === 'function') {
      try {
        updateActivateButton();
      } catch (error) {
        console.warn('⚠️ Error calling updateActivateButton:', error);
      }
    }
    if (key === "pump-pairing" || key === "insulin-qaedy") {
      setTimeout(() => {
        if (typeof updateFinalStatusScreen === 'function') {
          try {
            updateFinalStatusScreen();
          } catch (error) {
            console.warn('⚠️ Error calling updateFinalStatusScreen:', error);
          }
        }
        if (typeof updateCGMSAndPumpStatus === 'function') {
          try {
            updateCGMSAndPumpStatus();
          } catch (error) {
            console.warn('⚠️ Error calling updateCGMSAndPumpStatus:', error);
          }
        }
        if (typeof updateInsulinButtonState === 'function') {
          try {
            updateInsulinButtonState();
          } catch (error) {
            console.warn('⚠️ Error calling updateInsulinButtonState:', error);
          }
        }
        window.dispatchEvent(new CustomEvent('storageRulesChanged', {
          detail: { key, value, oldValue }
        }));

        if (['cgms_paired', 'pump-pairing', 'autoModeSwitch'].includes(key)) {
          setTimeout(() => {
            fallbackUIUpdate(key, value);
          }, 50);
        }
      }, 150);
    }
  };
  let lastPumpPairing = localStorage.getItem("pump-pairing");
  let lastInsulinQaedy = localStorage.getItem("insulin-qaedy");
  
  setInterval(() => {
    const currentPumpPairing = localStorage.getItem("pump-pairing");
    const currentInsulinQaedy = localStorage.getItem("insulin-qaedy");
    if (currentPumpPairing === "false" && currentInsulinQaedy === "true") {
      console.log('🔴 Shared Rules: Enforcing pump-insulin rule');
      localStorage.setItem("insulin-qaedy", "false");
      lastInsulinQaedy = "false";
      if (localStorage.getItem("activeTab")) {
        localStorage.removeItem("activeTab");
      }
      if (typeof updateActivateButton === 'function') {
        try {
          updateActivateButton();
        } catch (error) {
          console.warn('⚠️ Error calling updateActivateButton:', error);
        }
      }
    }
    if (currentPumpPairing !== lastPumpPairing) {
      console.log('Shared Rules: pump-pairing changed from', lastPumpPairing, 'to', currentPumpPairing);
      lastPumpPairing = currentPumpPairing;
      
      if (currentPumpPairing === "false") {
        if (localStorage.getItem("insulin-qaedy") === "true") {
          console.log('🔴 Shared Rules: pump unpaired, forcing insulin-qaedy to false');
          localStorage.setItem("insulin-qaedy", "false");
          lastInsulinQaedy = "false";
          if (localStorage.getItem("activeTab")) {
            localStorage.removeItem("activeTab");
          }
        }
      }
    }
    if (currentInsulinQaedy !== lastInsulinQaedy) {
      console.log('Shared Rules: insulin-qaedy changed from', lastInsulinQaedy, 'to', currentInsulinQaedy);
      lastInsulinQaedy = currentInsulinQaedy;
    }
  }, 100);
  setInterval(() => {
    enforceInsulinPumpRule();
    checkAutoModeRequirements();
  }, 1000);
  function cleanupOnStartup() {
    enforceInsulinPumpRule();
    checkAutoModeRequirements();
    if (localStorage.getItem("pump-pairing") !== "true") {
      if (localStorage.getItem("insulin-qaedy") === "true") {
        originalSetItem.call(localStorage, "insulin-qaedy", "false");
      }
      if (localStorage.getItem("activeTab")) {
        originalRemoveItem.call(localStorage, "activeTab");
      }
    }
  }
  
  cleanupOnStartup();
  window.addEventListener('storage', function(e) {
    if (e.key === 'pump-pairing' || e.key === 'insulin-qaedy' || 
        e.key === 'autoModeSwitch' || e.key === 'activeTab' ||
        e.key === 'glucose_limits_v2_cleared' || e.key === 'active_time_selected' ||
        e.key === 'daily_dose_selected' || e.key === 'cgms_paired') {
      
      console.log(`📡 Storage changed from another tab: ${e.key} = ${e.newValue}`);
      enforceInsulinPumpRule();
      checkAutoModeRequirements();
      setTimeout(() => {
        if (typeof fallbackUIUpdate === 'function') {
          fallbackUIUpdate(e.key, e.newValue);
        }
        
        if (typeof updateActivateButton === 'function') {
          try {
            updateActivateButton();
          } catch (error) {
            console.warn('⚠️ Error calling updateActivateButton:', error);
          }
        }
        if (typeof updateFinalStatusScreen === 'function') {
          try {
            updateFinalStatusScreen();
          } catch (error) {
            console.warn('⚠️ Error calling updateFinalStatusScreen:', error);
          }
        }
        if (typeof updateCGMSAndPumpStatus === 'function') {
          try {
            updateCGMSAndPumpStatus();
          } catch (error) {
            console.warn('⚠️ Error calling updateCGMSAndPumpStatus:', error);
          }
        }
        if (typeof updateInsulinButtonState === 'function') {
          try {
            updateInsulinButtonState();
          } catch (error) {
            console.warn('⚠️ Error calling updateInsulinButtonState:', error);
          }
        }
        if (typeof checkAndDisableAutoMode === 'function') {
          try {
            checkAndDisableAutoMode();
          } catch (error) {
            console.warn('⚠️ Error calling checkAndDisableAutoMode:', error);
          }
        }
      }, 100);
    }
  });

  console.log('✅ Shared rules loaded successfully');
  console.log('📊 Current state:', {
    'pump-pairing': localStorage.getItem('pump-pairing'),
    'insulin-qaedy': localStorage.getItem('insulin-qaedy'),
    'autoModeSwitch': localStorage.getItem('autoModeSwitch'),
    'activeTab': localStorage.getItem('activeTab')
  });
})();
