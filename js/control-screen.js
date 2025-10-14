/**
 * Control Screen Component
 * A reusable component that can be injected into any HTML file
 */

class ControlScreen {
  constructor(options = {}) {
    this.options = {
      containerId: "phone-container",
      deviceId: options.deviceId || "--",
      insulinAmount: options.insulinAmount || "123 وحدة",
      cgmsId: options.cgmsId || "22222C4JT",
      sensorAge: options.sensorAge || "15 يوم ",
      isLocked: options.isLocked !== undefined ? options.isLocked : true,
      ...options,
    };

    this.isActive = false;
    this.callbacks = {
      onToggle: options.onToggle || null,
      onClose: options.onClose || null,
    };

    this.init();
  }

  init() {
    this.injectCSS();
    this.createHTML();
    this.bindEvents();
    this.updatePumpPairingStatus();
  }

  injectCSS() {}

  createHTML() {
    // Support both class and id container targeting without changing API
    let container = document.querySelector(`.${this.options.containerId}`);
    if (!container) {
      container = document.getElementById(this.options.containerId);
    }
    if (!container) {
      // Container not found; avoid throwing and exit gracefully
      return;
    }
    const controlScreenHTML = `
      <div id="controlScreen" class="mobile-screen w-full h-screen sm:h-[740px] flex flex-col phone-container overflow-hidden relative bg-dark text-white">
        <div class="p-3 ">
          <!-- Top section -->
          <div class="mb-4">
            <div class="d-flex justify-content-end align-items-center gap-3 px-2 mb-5" dir="ltr">
              <div class="text-end">
                <div class="fs-3 fw- text-white mb-1 device-id-line dashW">--</div>
                <div class="muted-16">غير مقترن</div>
              </div>
              <div class="text-center">
                <div class="d-flex align-items-center justify-content-center mb-2 flex-wrap device-box">
                  <div class="d-flex align-items-center justify-content-center my-1">
                    <div class="image image-1"></div>
                  </div>
                  <div class="device-label"> مضخة</div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mb-4">
              <div class="text-center flex-fill">
                <div class="mb-2 d-flex justify-content-center"><div class="image image-2"></div></div>
                <div class="dash dash-step1">--</div>
                <div class="small-muted-white">الأنسولين المتبقي</div>
              </div>
              <div class="text-center flex-fill">
                <div class="mb-2 d-flex justify-content-center"><div class="image image-3"></div></div>
                <div class="dash dash-step2">--</div>
                <div class="small-muted-white">مستوى بطارية المضخة</div>
              </div>
              <div class="text-center flex-fill">
                <div class="mb-2 d-flex justify-content-center"><div class="image image-4" style="margin-bottom:28px;"></div></div>
                <div class="small-muted-white wifi"> لا يوجد إِشارة </div>
              </div>
            </div>
            <div class="dashed-sep"></div>
          </div>

          <!-- CGMS Section -->
          <div class="mb-5 cgms-middle-section" style="display:none;">
            <div class="d-flex justify-content-between align-items-center mb-4 px-2">
              <div class="text-center">
                <div class="cgms-box d-flex align-items-center justify-content-center mb-2 flex-wrap py-3">
                  <div class="cgms-inner d-flex justify-content-center align-items-center">
                    <div class="cgms-inner-dot"></div>
                  </div>
                  <div class="cgms-label" style="font-family:Arial, Helvetica, sans-serif;">CGMS</div>
                </div>
              </div>
              <div class="text-right mb-3">
                <div class="fw- text-white mb-0 name-20" style="font-size: 22px; color: #fff;font-family:Arial, Helvetica, sans-serif;">--</div>
                <div class="muted-16" style="font-size: 20px; color: #fff">مقترن</div>
              </div>
              <div class="text-end">
                <div class="mb-3">
                  <div class="text-white mb-1" style="font-size: 20px">15 يوم</div>
                  <div style="font-size: 20px; color: #fff">عمر المستشعر</div>
                </div>
              </div>
            </div>
            <div class="dashed-sep"></div>
          </div>

          <!-- AutoMode Section -->
          <div class="mb-5 auto-mode-middle-section"  style="display:none;">
            <div class="d-flex gap-5 align-items-center mb-4 px-2">
              <div class="text-center">
                <div class="auto-mode-box d-flex align-items-center justify-content-center mb-2 flex-wrap py-3">
                  <div class="auto-mode-inner d-flex justify-content-center align-items-center">
                  <div class="image-mode"></div>
                  </div>
                  <div class="auto-mode-label">الوضع الأوتوماتيكي</div>
                </div>
                

              </div>
              <div class=" mb-3">
               <div class="status">الحالة العادية</div>
               <div class="stat">نشط</div>
              </div>
              <div class="text-end">
                
              </div>
          </div>
          <div class="dashed-sep"></div>
        </div>

        <div class="close-chevron w-100 text-center mb-3"><i class="fa-solid fa-chevron-up"></i></div>
      </div>
    `;

    // Create a temporary container to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = controlScreenHTML;

    // Append the control screen to the container
    container.appendChild(temp.firstElementChild);

    this.element = document.getElementById("controlScreen");
    if (this.element) {
      // Add a semantic class so cleanup logic can detect instances
      this.element.classList.add("control-screen");
    }
  }

  bindEvents() {
    const closeChevron = this.element.querySelector(".close-chevron");

    closeChevron.addEventListener("click", () => {
      this.hide();
      if (this.callbacks.onClose) {
        this.callbacks.onClose();
      }
    });

    // Add escape key support
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isActive) {
        this.hide();
        if (this.callbacks.onClose) {
          this.callbacks.onClose();
        }
      }
    });
  }

  show() {
    if (this.element) {
      this.element.classList.add("active");
      this.isActive = true;
      if (this.callbacks.onToggle) {
        this.callbacks.onToggle(true);
      }
    }
  }

  hide() {
    if (this.element) {
      this.element.classList.remove("active");
      this.isActive = false;
      if (this.callbacks.onToggle) {
        this.callbacks.onToggle(false);
      }
    }
  }

  toggle() {
    if (this.isActive) {
      this.hide();
    } else {
      this.show();
    }
  }
  updateData(newData) {
    if (!this.element) return;

    if (newData.deviceId) {
      const deviceIdElement = this.element.querySelector(".device-id-line");
      if (deviceIdElement) deviceIdElement.textContent = newData.deviceId;
    }

    if (newData.insulinAmount) {
      // Find the insulin block by its image marker (.image-2), then update the nearest .dash inside that block
      const insulinBlockImage = this.element.querySelector(".image-2");
      if (insulinBlockImage) {
        const statBlock = insulinBlockImage.closest(".text-center.flex-fill");
        const dashEl = statBlock ? statBlock.querySelector(".dash") : null;
        if (dashEl) dashEl.textContent = newData.insulinAmount;
      }
    }

    if (newData.cgmsId) {
      const cgmsElement = this.element.querySelector(".name-20");
      if (cgmsElement) cgmsElement.textContent = newData.cgmsId;
    }

    if (newData.sensorAge) {
      // Scope to CGMS section to avoid catching unrelated elements
      const cgmsSection = this.element.querySelector(".cgms-middle-section");
      const sensorElement = cgmsSection
        ? cgmsSection.querySelector(".text-white.mb-1")
        : null;
      if (sensorElement) sensorElement.textContent = newData.sensorAge;
    }
  }

  updatePumpPairingStatus() {
    if (!this.element) return;

    const isPaired = localStorage.getItem('pump-pairing') === 'true';
    const pumpSerial = localStorage.getItem('pump-serial') || '062A0A';

    if (isPaired) {
      // Update device ID
      const deviceIdElement = this.element.querySelector(".device-id-line");
      if (deviceIdElement) {
        deviceIdElement.textContent = pumpSerial;
        deviceIdElement.classList.remove('dashW');
      }

      // Update pairing status text
      const statusElement = this.element.querySelector(".muted-16");
      if (statusElement) {
        statusElement.textContent = "مقترن";
        statusElement.style.color = "#fff";
      }

      // Update pump icons and data when paired
      applyPreparationStyles();
    } else {
      // Reset to unpaired state
      const deviceIdElement = this.element.querySelector(".device-id-line");
      if (deviceIdElement) {
        deviceIdElement.textContent = "--";
        deviceIdElement.classList.add('dashW');
      }

      // Update pairing status text
      const statusElement = this.element.querySelector(".muted-16");
      if (statusElement) {
        statusElement.textContent = "غير مقترن";
        statusElement.style.color = "#fff";
      }

      // Reset pump icons and data when unpaired
      removePreparationStyles();
    }
  }

  // Static method to create multiple instances
  static createInstance(options) {
    return new ControlScreen(options);
  }
}
// Helper function for smooth page transitions
function smoothNavigate(url) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 150);
}

function handlePdaModeNavigation() {
  // Always navigate to the main page based on display mode
  var isPump = localStorage.getItem("display_mode");
  var href = "suspend.html";
  if (isPump && isPump === "pump") {
    href = "pda-mode.html?m=1";
  }
  if (
    isPump &&
    isPump !== "pump" &&
    (href === "pda-mode.html?m=1" || href === "pda-mode.html")
  ) {
    href = "suspend.html";
  }
  
  // Always go to main page with smooth transition
  smoothNavigate(href);
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = ControlScreen;
} else if (typeof window !== "undefined") {
  window.ControlScreen = ControlScreen;
  window.handlePdaModeNavigation = handlePdaModeNavigation;
  window.smoothNavigate = smoothNavigate;
}
// For direct browser usage
if (typeof window !== "undefined") {
  window.ControlScreen = ControlScreen;
  // Defer initialization until DOM is ready to avoid heavy work during first paint
  window.addEventListener("DOMContentLoaded", function () {
    // Prevent duplicate initialization
    if (window.__controlScreenInit) return;
    window.__controlScreenInit = true;
    const controlScreen = new ControlScreen({
      deviceId: "--",
      insulinAmount: "123 وحدة",
      cgmsId: "--",
      sensorAge: "15 يوم",
    });
    // Save instance globally for access from localStorage override
    window.controlScreenInstance = controlScreen;
    // Add click listener to headers with proper event delegation for Firefox compatibility
    const headers = document.querySelectorAll("header");
    headers.forEach((header) => {
      // Use passive: false to allow preventDefault if needed
      header.addEventListener("click", function(e) {
        // Check if header is visible before toggling
        if (header.offsetParent !== null) {
          controlScreen.toggle();
        }
      }, { passive: true });
    });
  });
}
/* ==========================
   Helper: wait for element
========================== */
function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
  } else {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

/* ==========================
   Preparation Functions
========================== */
function applyPreparationStyles() {
  const blocks2 = document.querySelectorAll(".icon-block.block2");
  blocks2.forEach((block) => {
    block.style.display = "block";
    block.style.backgroundColor = "transparent";
  });
  
  const blocks1 = document.querySelectorAll(".icon-block.block1");
  blocks1.forEach((block) => {
    block.style.display = "block";
    block.style.backgroundColor = "transparent";
  });
  
  // Update insulin amount text
  const dashStep1 = document.querySelector(".dash-step1");
  if (dashStep1) {
    dashStep1.textContent = "95 وحدة";
  }
  
  // Update battery level text
  const dashStep2 = document.querySelector(".dash-step2");
  if (dashStep2) {
    dashStep2.textContent = "95%";
  }
  
  // Change image backgrounds with !important to prevent CSS override
  const image2 = document.querySelector(".image.image-2");
  if (image2) {
    image2.style.setProperty('background-image', "url('./assets/sc1p.jpg')", 'important');
  }
  
  const image3 = document.querySelector(".image.image-3");
  if (image3) {
    image3.style.setProperty('background-image', "url('./assets/sc2p.jpg')", 'important');
  }
}

function removePreparationStyles() {
  const blocks2 = document.querySelectorAll(".icon-block.block2");
  blocks2.forEach((block) => {
    block.style.display = "";
    block.style.backgroundColor = "";
  });
  
  const blocks1 = document.querySelectorAll(".icon-block.block1");
  blocks1.forEach((block) => {
    block.style.display = "";
    block.style.backgroundColor = "";
  });
  
  // Reset insulin amount text
  const dashStep1 = document.querySelector(".dash-step1");
  if (dashStep1) {
    dashStep1.textContent = "--";
  }
  
  // Reset battery level text
  const dashStep2 = document.querySelector(".dash-step2");
  if (dashStep2) {
    dashStep2.textContent = "--";
  }
  
  // Reset image backgrounds
  const image2 = document.querySelector(".image.image-2");
  if (image2) {
    image2.style.removeProperty('background-image');
  }
  
  const image3 = document.querySelector(".image.image-3");
  if (image3) {
    image3.style.removeProperty('background-image');
  }
}

function updatePreparation() {
  const preparation = localStorage.getItem("preparation") === "true";
  if (preparation) {
    applyPreparationStyles();
  }
}

/* ==========================
   CGMS Pairing Functions
========================== */
function applyPairingStyles() {
  const cgmsSerial = localStorage.getItem("cgms_serial") || "--";
  const cgmsSection = document.querySelector(".cgms-middle-section");
  if (cgmsSection) cgmsSection.style.display = "block";

  const name20El = document.querySelector(".name-20");
  if (name20El) {
    name20El.textContent = cgmsSerial;
    const nextEl = name20El.nextElementSibling;
    if (nextEl) nextEl.textContent = "مقترن";
  }

  const blocks = document.querySelectorAll(".icon-block.block3");
  blocks.forEach((block) => {
    block.style.display = "block";
    block.style.backgroundColor = "transparent";
  });
  // DON'T set localStorage here - it causes infinite loops
  // The value is already set by the caller
}

function removePairingStyles() {
  const blocks = document.querySelectorAll(".icon-block.block3");
  blocks.forEach((block) => block.removeAttribute("style"));

  const name20El = document.querySelector(".name-20");
  if (name20El) {
    name20El.textContent = "--";
    const nextEl = name20El.nextElementSibling;
    if (nextEl) nextEl.textContent = "غير مقترن";
  }

  const cgmsSection = document.querySelector(".cgms-middle-section");
  if (cgmsSection) cgmsSection.style.display = "none";

  // DON'T set localStorage here - it causes infinite loops
  // The value is already set by the caller
}

// Debounce helper to prevent rapid re-execution
let updateCGMSTimeout = null;
function updateCGMS() {
  clearTimeout(updateCGMSTimeout);
  updateCGMSTimeout = setTimeout(() => {
    const paired = localStorage.getItem("cgms_paired") === "true";
    paired ? applyPairingStyles() : removePairingStyles();
  }, 10);
}

/* ==========================
   WiFi Styles
========================== */
let applyWifiStyleTimeout = null;
function applyWifiStyle() {
  clearTimeout(applyWifiStyleTimeout);
  applyWifiStyleTimeout = setTimeout(() => {
    // Use direct set to avoid triggering events for default values
    if (localStorage.getItem("wifi_switch") === null) {
      try {
        Object.getPrototypeOf(localStorage).setItem.call(localStorage, "wifi_switch", "false");
      } catch (e) {
        // Fallback if override hasn't been applied yet
        localStorage.setItem("wifi_switch", "false");
      }
    }

    const wifiState = localStorage.getItem("wifi_switch");
    const savedWifiValue = localStorage.getItem("wifi_network_name");

    const blocks = document.querySelectorAll(".icon-block.block4");
    const wifiNetworkEl = document.getElementById("wifi_network");

    if (wifiNetworkEl && savedWifiValue)
      wifiNetworkEl.textContent = savedWifiValue;

    blocks.forEach((block) =>
      block.classList.toggle("wifi-true", wifiState === "true")
    );

    const signalImage = document.querySelector(".image-4, .image-4p");
    if (signalImage) {
      signalImage.classList.toggle("image-4", wifiState !== "true");
      signalImage.classList.toggle("image-4p", wifiState === "true");
    }

    // Update wifi text
    const wifiTextElements = document.querySelectorAll(".wifi");
    wifiTextElements.forEach((el) => {
      el.textContent = wifiState === "true" ? "إشارة طبيعية" : "لا يوجد إِشارة";
    });
  }, 10);
}

/* ==========================
   Load Switch States
========================== */
function loadSwitchStates() {
  document.querySelectorAll(".auto-switch input").forEach((input) => {
    const state = localStorage.getItem(input.id);
    // Set default to false if not set - use direct set to avoid triggering events
    if (state === null) {
      try {
        Object.getPrototypeOf(localStorage).setItem.call(localStorage, input.id, "false");
      } catch (e) {
        localStorage.setItem(input.id, "false");
      }
      input.checked = false;
    } else {
      input.checked = state === "true";
    }
    
    // Handle multiple related items (e.g., _item, _time_item, etc.)
    document.querySelectorAll(`[id^="${input.id}_"][id$="_item"]`).forEach((itemEl) => {
      itemEl.style.display = input.checked ? "flex" : "none";
    });
    // Also handle the direct _item
    const itemEl = document.getElementById(input.id + "_item");
    if (itemEl)
      itemEl.style.display = input.checked ? "flex" : "none";
  });
}

/* ==========================
   Password Toggle
========================== */
function togglePassword() {
  const passwordInput = document.getElementById("password_input");
  const eyeIcon = document.getElementById("password_eye_icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}

// automode section
function updateAutoModeSection() {
  const autoModeSection = document.querySelector(".auto-mode-middle-section");
  const autoModeSwitch = localStorage.getItem("autoModeSwitch");

  if (autoModeSection) {
    if (autoModeSwitch === "true") {
      autoModeSection.style.display = "block";
    } else {
      autoModeSection.style.display = "none";
    }
  }
}

/* ==========================
   Brightness Control
========================== */
function applyBrightness() {
  const savedBrightness = localStorage.getItem('screen_brightness');
  const phoneContainer = document.querySelector('.phone-container');
  
  if (phoneContainer && savedBrightness) {
    const brightnessValue = savedBrightness / 100; // Convert to 0-1 range
    phoneContainer.style.filter = `brightness(${0.5 + (brightnessValue * 0.5)})`; // Range: 0.5 to 1.0
  }
}

/* ==========================
   On Page Load - CONSOLIDATED
========================== */
// Use a single DOMContentLoaded listener to prevent duplicate execution
window.addEventListener("DOMContentLoaded", function () {
  // Prevent duplicate initialization
  if (window.__pageInitialized) return;
  window.__pageInitialized = true;
  
  // ===== SMOOTH NAVIGATION SETUP =====
  // Fade out on page unload
  window.addEventListener('beforeunload', function() {
    document.body.classList.add('fade-out');
  });
  
  // Also handle pagehide for better browser support
  window.addEventListener('pagehide', function() {
    document.body.classList.add('fade-out');
  });
  
  // Click interceptor for immediate feedback
  document.addEventListener('click', function(e) {
    let target = e.target;
    
    // Walk up the DOM tree to find an element with onclick
    while (target && target !== document) {
      const onclick = target.getAttribute('onclick');
      
      if (onclick && onclick.includes('window.location')) {
        // Don't prevent default, just add fade class for visual feedback
        document.body.classList.add('fade-out');
        break;
      }
      
      target = target.parentElement;
    }
  }, true);
  
  // Initialize insulin-qaedy as false if not set - use direct set to avoid triggering events
  if (localStorage.getItem("insulin-qaedy") === null) {
    try {
      Object.getPrototypeOf(localStorage).setItem.call(localStorage, "insulin-qaedy", "false");
    } catch (e) {
      localStorage.setItem("insulin-qaedy", "false");
    }
  }
  
  loadSwitchStates();
  applyWifiStyle();
  updateCGMS();
  updateAutoModeSection();
  applyBrightness();
  
  // Check pump pairing status on load and apply styles accordingly
  const isPumpPaired = localStorage.getItem('pump-pairing') === 'true';
  if (isPumpPaired) {
    applyPreparationStyles();
  } else {
    removePreparationStyles();
  }
  
  // Switch listeners
  document.querySelectorAll(".auto-switch input").forEach((input) => {
    input.addEventListener("change", function () {
      localStorage.setItem(input.id, input.checked);
      // Handle multiple related items (e.g., _item, _time_item, etc.)
      document.querySelectorAll(`[id^="${input.id}_"][id$="_item"]`).forEach((itemEl) => {
        itemEl.style.display = input.checked ? "flex" : "none";
      });
      // Also handle the direct _item
      const itemEl = document.getElementById(input.id + "_item");
      if (itemEl)
        itemEl.style.display = input.checked ? "flex" : "none";
      if (input.id === "autoModeSwitch") {
        updateAutoModeSection();
      }
    });
  });

  // WiFi selection
  document
    .querySelectorAll('.control-item[selectable-target="wifi_network"]')
    .forEach((item) => {
      item.addEventListener("click", () => {
        const selectedValue = item
          .querySelector(".control-item-view")
          .textContent.trim();
        localStorage.setItem("wifi_network_name", selectedValue);
        localStorage.setItem("wifi_switch", "true");
      });
    });

  // CGMS Pair / Unpair Buttons
  const pairBtn = document.getElementById("pair-btn");
  if (pairBtn)
    pairBtn.addEventListener("click", () => {
      localStorage.setItem("cgms_serial", "22222C4JT");
      localStorage.setItem("cgms_paired", "true");
      updateCGMS();
    });

  const unpairConfirmBtn = document.getElementById("unpair-confirm");
  if (unpairConfirmBtn)
    unpairConfirmBtn.addEventListener("click", () => {
      localStorage.setItem("cgms_paired", "false");
      updateCGMS();
    });
});

/* ==========================
   Consolidated storage listener
========================== */
window.addEventListener("storage", (e) => {
  if (["wifi_switch", "wifi_network_name"].includes(e.key)) applyWifiStyle();
  if (["cgms_paired", "cgms_serial"].includes(e.key)) updateCGMS();
  if (e.key === "screen_brightness") applyBrightness(); // Apply brightness when changed
  if (e.key === "pump-pairing") {
    const isPaired = localStorage.getItem('pump-pairing') === 'true';
    if (isPaired) {
      applyPreparationStyles();
    } else {
      removePreparationStyles();
    }
    // Update ControlScreen instance if exists
    if (window.controlScreenInstance) {
      window.controlScreenInstance.updatePumpPairingStatus();
    }
    if (typeof updateNoInsulinBox === "function") updateNoInsulinBox();
  }
  if (e.key === "insulin-qaedy") {
    if (typeof updateNoInsulinBox === "function") updateNoInsulinBox();
  }

  const lsSwitches = [
    "quick_bolus_switch",
    "max_safe_insulin_switch",
    "auto_suspend_duration",
  ];
  if (lsSwitches.includes(e.key)) {
    if (e.key === "max_safe_insulin_switch") openModalMs("password_modal");
    else {
      const loadingModal = new bootstrap.Modal(
        document.getElementById("loadingModal")
      );
      loadingModal.show();
      setTimeout(() => {
        loadingModal.hide();
        document.getElementById("successPopup").classList.add("active");
        setTimeout(
          () =>
            document.getElementById("successPopup").classList.remove("active"),
          2000
        );
      }, 3000);
    }
  }
});

/* ==========================
   Override localStorage.setItem once
========================== */
if (!localStorage.__overrideDone) {
  const originalSetItem = localStorage.setItem;
  let isProcessingStorageChange = false; // Flag to prevent re-entry
  
  localStorage.setItem = function (key, value) {
    const oldValue = localStorage.getItem(key);
    if (String(oldValue) === String(value)) {
      return; // Avoid redundant writes and feedback loops
    }
    
    // Prevent re-entry during processing
    if (isProcessingStorageChange) {
      originalSetItem.apply(this, [key, value]);
      return;
    }
    
    isProcessingStorageChange = true;
    try {
      originalSetItem.apply(this, [key, value]);

      // Firefox-compatible StorageEvent
      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: key,
            oldValue: oldValue,
            newValue: value,
            storageArea: localStorage,
            url: location.href,
          })
        );
      } catch (e) {
        // Fallback for older browsers
        const event = document.createEvent('StorageEvent');
        event.initStorageEvent('storage', false, false, key, oldValue, value, location.href, localStorage);
        window.dispatchEvent(event);
      }

      if (["wifi_switch", "wifi_network_name"].includes(key)) applyWifiStyle();
      if (["cgms_paired", "cgms_serial"].includes(key)) updateCGMS();
      if (key === "screen_brightness") applyBrightness(); // Apply brightness when changed
      if (key === "pump-pairing") {
        const isPaired = value === 'true';
        console.log('pump-pairing changed to:', isPaired);
        if (isPaired) {
          applyPreparationStyles();
        } else {
          removePreparationStyles();
        }
        // Update ControlScreen instance if exists
        if (window.controlScreenInstance) {
          window.controlScreenInstance.updatePumpPairingStatus();
        }
        if (typeof updateNoInsulinBox === "function") updateNoInsulinBox();
      }
      if (key === "insulin-qaedy") {
        if (typeof updateNoInsulinBox === "function") updateNoInsulinBox();
      }
    } finally {
      isProcessingStorageChange = false;
    }
  };
  localStorage.__overrideDone = true;
}
