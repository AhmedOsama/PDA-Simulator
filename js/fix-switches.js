// Fix for all auto-mode switches
(function() {
  'use strict';
  
  console.log("🔧 Fix Switches Script Loaded");
  
  // Function to update switch visual state
  function updateSwitchVisual(switchElement) {
    if (!switchElement) return;
    
    const track = switchElement.parentElement?.querySelector('.switch-track');
    const thumb = switchElement.parentElement?.querySelector('.switch-thumb');
    
    if (!track || !thumb) {
      console.warn("Track or thumb not found for switch:", switchElement.id);
      return;
    }
    
    if (switchElement.checked) {
      // Checked state (blue)
      track.style.cssText = 'background: #c7d9f0 !important; position: absolute; top: 2px; left: 0; width: 40px; height: 20px; border-radius: 16px; transition: background 0.3s;';
      thumb.style.cssText = 'background: #2056a8 !important; transform: translateX(15px) !important; position: absolute; top: -2px; left: 0; width: 25px; height: 25px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.3s, background 0.3s;';
    } else {
      // Unchecked state (gray)
      track.style.cssText = 'background: #d1d1d6 !important; position: absolute; top: 2px; left: 0; width: 40px; height: 20px; border-radius: 16px; transition: background 0.3s;';
      thumb.style.cssText = 'background: #9e9e9e !important; transform: translateX(0) !important; position: absolute; top: -2px; left: 0; width: 25px; height: 25px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.3s, background 0.3s;';
    }
  }
  
  // Function to handle main auto mode switch
  function handleMainAutoSwitch(event) {
    const switchEl = event.target;
    console.log("🔄 Main auto switch changed:", switchEl.checked);
    
    // Check requirements if trying to enable
    if (switchEl.checked) {
      const requirements = checkAutoModeRequirements();
      if (!requirements.allMet) {
        event.preventDefault();
        switchEl.checked = false;
        updateSwitchVisual(switchEl);
        showRequirementError(requirements);
        return;
      }
    }
    
    // Save state
    localStorage.setItem('autoModeSwitch', switchEl.checked ? 'true' : 'false');
    updateSwitchVisual(switchEl);
    
    // If turning off main switch, turn off exercise switch too
    if (!switchEl.checked) {
      const exerciseSwitch = document.getElementById('exerciseautoModeSwitch');
      if (exerciseSwitch) {
        exerciseSwitch.checked = false;
        localStorage.setItem('exerciseautoModeSwitch', 'false');
        updateSwitchVisual(exerciseSwitch);
      }
    }
  }
  
  // Function to handle exercise switch specifically
  function handleExerciseSwitch(event) {
    const switchEl = event.target;
    console.log(`🔄 Exercise switch changed:`, switchEl.checked);
    
    // Check if main auto mode is enabled first
    const mainSwitch = document.getElementById('autoModeSwitch');
    if (!mainSwitch || !mainSwitch.checked) {
      if (switchEl.checked) {
        event.preventDefault();
        switchEl.checked = false;
        updateSwitchVisual(switchEl);
        showConfirmationModal("يجب تفعيل الوضع التلقائي الرئيسي أولاً");
        return;
      }
    }
    
    // If turning on, show the exercise time picker
    if (switchEl.checked) {
      if (typeof showExerciseTimePicker === 'function') {
        showExerciseTimePicker();
      }
    } else {
      localStorage.setItem('exerciseautoModeSwitch', 'false');
    }
    
    updateSwitchVisual(switchEl);
  }
  
  // Function to handle other switches
  function handleOtherSwitch(event) {
    const switchEl = event.target;
    const switchId = switchEl.id;
    console.log(`🔄 ${switchId} changed:`, switchEl.checked);
    
    // Check if main auto mode is enabled first
    const mainSwitch = document.getElementById('autoModeSwitch');
    if (!mainSwitch || !mainSwitch.checked) {
      if (switchEl.checked) {
        event.preventDefault();
        switchEl.checked = false;
        updateSwitchVisual(switchEl);
        showConfirmationModal("يجب تفعيل الوضع التلقائي الرئيسي أولاً");
        return;
      }
    }
    
    // Save state
    localStorage.setItem(switchId, switchEl.checked ? 'true' : 'false');
    updateSwitchVisual(switchEl);
  }
  
  // Check auto mode requirements
  function checkAutoModeRequirements() {
    const requirements = {
      pumpPaired: localStorage.getItem("pump-pairing") === "true",
      insulinQaedy: localStorage.getItem("insulin-qaedy") === "true",
      glucoseLimitsCleared: localStorage.getItem("glucose_limits_v2_cleared") === "true",
      activeTimeSelected: localStorage.getItem("active_time_selected") === "true",
      dailyDoseSelected: localStorage.getItem("daily_dose_selected") === "true",
      cgmsPaired: localStorage.getItem("cgms_paired") === "true"
    };
    
    requirements.allMet = Object.values(requirements).every(v => v === true);
    return requirements;
  }
  
  // Show requirement error
  function showRequirementError(requirements) {
    let message = "";
    if (!requirements.pumpPaired) {
      message = "لم يتم إقتران مضخة الانسولين, لا يمكن تمكين الوضع التلقائي";
    } else if (!requirements.insulinQaedy) {
      message = "يرجى ضبط القاعدي";
    } else if (!requirements.glucoseLimitsCleared) {
      message = "يرجى ضبط معامل حساسية الأنسولين";
    } else if (!requirements.activeTimeSelected) {
      message = "يرجى ضبط معامل الإنسولين النشط";
    } else if (!requirements.dailyDoseSelected) {
      message = "يرجى ضبط اجمالي كمية الأنسولين اليومية";
    } else if (!requirements.cgmsPaired) {
      message = "يرجى إقران نظام المراقبة المستمرة للجلوكوز";
    }
    
    if (typeof showConfirmationModal === 'function') {
      showConfirmationModal(message);
    } else {
      alert(message);
    }
  }
  
  // Initialize switch with proper event handling
  function initializeSwitch(switchId, handlerType = 'other') {
    // Get ALL elements with this ID (in case of duplicates)
    const allSwitches = document.querySelectorAll(`#${switchId}`);
    
    if (allSwitches.length === 0) {
      console.warn(`❌ No switch found with ID: ${switchId}`);
      return;
    }
    
    if (allSwitches.length > 1) {
      console.warn(`⚠️ Multiple switches found with ID: ${switchId} (${allSwitches.length} instances)`);
    }
    
    // Process each switch
    allSwitches.forEach((switchEl, index) => {
      console.log(`📌 Initializing ${switchId} instance ${index + 1}/${allSwitches.length}`);
      
      // Remove any existing inline handlers
      switchEl.onclick = null;
      switchEl.onchange = null;
      
      // Remove parent label onclick if exists
      const label = switchEl.closest('label');
      if (label) {
        label.onclick = null;
      }
      
      // Special handling for exercise switch to preserve original functionality
      if (switchId === 'exerciseautoModeSwitch') {
        // Just update visual state and ensure CSS works
        const savedState = localStorage.getItem(switchId);
        if (savedState !== null) {
          switchEl.checked = savedState === 'true';
        }
        
        // Add visual update handler without interfering with original logic
        switchEl.addEventListener('click', function() {
          setTimeout(() => updateSwitchVisual(this), 10);
        });
        
        // Ensure visual state is correct
        updateSwitchVisual(switchEl);
        
        // The original handler in automatic-mode.js will handle the modal logic
        console.log("✅ Exercise switch visual handling added, preserving original functionality");
        return;
      }
      
      // For main auto switch, handle properly
      if (switchId === 'autoModeSwitch') {
        // Load saved state
        const savedState = localStorage.getItem(switchId);
        if (savedState !== null) {
          switchEl.checked = savedState === 'true';
        }
        
        // Remove old listeners and add new one
        const newSwitch = switchEl.cloneNode(true);
        switchEl.parentNode.replaceChild(newSwitch, switchEl);
        
        // Get the new reference
        const freshSwitch = allSwitches.length > 1 ? 
          document.querySelectorAll(`#${switchId}`)[index] : 
          document.getElementById(switchId);
        
        if (freshSwitch) {
          freshSwitch.addEventListener('change', handleMainAutoSwitch);
          freshSwitch.addEventListener('click', function() {
            setTimeout(() => updateSwitchVisual(this), 10);
          });
          updateSwitchVisual(freshSwitch);
        }
        return;
      }
      
      // For other switches
      const savedState = localStorage.getItem(switchId);
      if (savedState !== null) {
        switchEl.checked = savedState === 'true';
      }
      
      switchEl.addEventListener('change', handleOtherSwitch);
      switchEl.addEventListener('click', function() {
        setTimeout(() => updateSwitchVisual(this), 10);
      });
      updateSwitchVisual(switchEl);
    });
  }
  
  // Initialize all switches
  function initializeAllSwitches() {
    console.log("🚀 Initializing all switches");
    
    // Main auto mode switch
    initializeSwitch('autoModeSwitch', 'main');
    
    // Exercise switch - special handling to preserve original functionality
    initializeSwitch('exerciseautoModeSwitch', 'exercise');
    
    // Other switches
    initializeSwitch('statusautoModeSwitch', 'other');
    initializeSwitch('planautoModeSwitch', 'other');
    
    console.log("✅ All switches initialized");
  }
  
  // Monitor for dynamic content changes
  function monitorDynamicContent() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              // Check if any switches were added
              const switches = node.querySelectorAll('#autoModeSwitch, #exerciseautoModeSwitch, #statusautoModeSwitch, #planautoModeSwitch');
              if (switches.length > 0) {
                console.log("🔄 New switches detected, reinitializing");
                setTimeout(initializeAllSwitches, 100);
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Periodic check to ensure switches work
  function periodicCheck() {
    const switches = ['autoModeSwitch', 'exerciseautoModeSwitch', 'statusautoModeSwitch', 'planautoModeSwitch'];
    
    switches.forEach(switchId => {
      const switchEl = document.getElementById(switchId);
      if (switchEl) {
        // Check if visual state matches actual state
        const savedState = localStorage.getItem(switchId);
        if (savedState !== null) {
          const shouldBeChecked = savedState === 'true';
          if (switchEl.checked !== shouldBeChecked) {
            console.log(`🔧 Fixing ${switchId} state`);
            switchEl.checked = shouldBeChecked;
          }
        }
        updateSwitchVisual(switchEl);
      }
    });
  }
  
  // Global function for debugging
  window.debugSwitches = function() {
    const switches = ['autoModeSwitch', 'exerciseautoModeSwitch', 'statusautoModeSwitch', 'planautoModeSwitch'];
    const report = {};
    
    switches.forEach(switchId => {
      const switchEl = document.getElementById(switchId);
      const track = switchEl?.parentElement?.querySelector('.switch-track');
      const thumb = switchEl?.parentElement?.querySelector('.switch-thumb');
      
      report[switchId] = {
        exists: !!switchEl,
        checked: switchEl?.checked,
        localStorage: localStorage.getItem(switchId),
        trackBg: track?.style.background,
        thumbTransform: thumb?.style.transform
      };
    });
    
    console.table(report);
    return report;
  };
  
  // Manual fix function
  window.fixSwitch = function(switchId) {
    const isMain = switchId === 'autoModeSwitch';
    const switchEl = initializeSwitch(switchId, isMain);
    if (switchEl) {
      console.log(`✅ ${switchId} fixed`);
      return switchEl;
    } else {
      console.error(`❌ Could not fix ${switchId}`);
      return null;
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initializeAllSwitches, 100);
      monitorDynamicContent();
      setInterval(periodicCheck, 2000);
    });
  } else {
    setTimeout(initializeAllSwitches, 100);
    monitorDynamicContent();
    setInterval(periodicCheck, 2000);
  }
  
})();
