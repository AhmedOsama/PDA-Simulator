// Constants
const minValue = 20;
const maxValue = 600;
const step = 1;
const unitsVisible = 40;
const unitWidth = 14;

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle helper function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const itemHeight = 40;
const wheelHeight = 210;
const centerOffset = wheelHeight / 2 - itemHeight / 2;

// Picker Functions
function getSelectedValue(list, data) {
  const top = parseFloat(list.style.top) || 0;
  const index = Math.round((centerOffset - top) / itemHeight);
  const normalizedIndex = ((index % data.length) + data.length) % data.length;
  return data[normalizedIndex];
}

function snapToValue(list, data, value, animate = true) {
  const index = data.indexOf(value);
  if (index === -1) return;
  const targetTop =
    centerOffset - index * itemHeight - data.length * itemHeight * 2;
  list.style.transition = animate ? "top 0.2s ease-out" : "none";
  list.style.top = `${targetTop}px`;
  updateAppearance(list, targetTop);
}

function snapToList(list, data) {
  const currentTop = parseFloat(list.style.top);
  const targetIndex = Math.round((centerOffset - currentTop) / itemHeight);
  const newTop = centerOffset - targetIndex * itemHeight;
  list.style.top = `${newTop}px`;
  updateAppearance(list, newTop);
}

function populateWheel(listElement, data) {
  listElement.innerHTML = "";
  const fragment = document.createDocumentFragment();
  [...data, ...data, ...data, ...data, ...data].forEach((val) => {
    const div = document.createElement("div");
    div.className = "picker-item";
    div.textContent = val;
    div.dataset.value = val;
    fragment.appendChild(div);
  });
  listElement.appendChild(fragment);
}

window.editInsulinSensitivity = function (button) {
  const row = button.closest(
    ".d-flex.justify-content-between.align-items-center"
  );
  if (row) {
    const sensitivityElement = row.querySelector(".fs-6:last-child");
    if (sensitivityElement) {
      const currentValue = sensitivityElement.textContent
        .replace("mg/dl/u", "")
        .trim();
      window.editingRow = row;
      const picker = document.getElementById("sensitivityPicker");
      if (picker && picker.pickerConfig) {
        snapToValue(picker, picker.pickerConfig.data, currentValue, false);
      }
      showModal("sensitivityModal");
    }
  }
};

window.deleteInsulinSensitivity = function (button) {
  const row = button.closest(
    ".d-flex.justify-content-between.align-items-center"
  );
  if (row) {
    row.remove();
  }
};

function saveValuesToLocalStorage() {
  localStorage.setItem("selectedValues", JSON.stringify(selectedValues));
}

function loadValuesFromLocalStorage() {
  const saved = localStorage.getItem("selectedValues");
  if (saved) {
    const parsedValues = JSON.parse(saved);
    // Only update if values are not null
    if (parsedValues.sensitivity !== null) {
      selectedValues.sensitivity = parsedValues.sensitivity;
    }
    if (parsedValues.activeTime !== null) {
      selectedValues.activeTime = parsedValues.activeTime;
    }
    if (parsedValues.dailyDose !== null) {
      selectedValues.dailyDose = parsedValues.dailyDose;
    }
  }
  
  // Load individual values from localStorage if available (these override saved values)
  const sensitivityFromStorage = localStorage.getItem("sensitivity_default");
  if (sensitivityFromStorage) {
    selectedValues.sensitivity = sensitivityFromStorage;
  }
  
  // Load from insulin-sensitivity.html if available
  const activeTimeFromOtherPage = localStorage.getItem("active_time");
  if (activeTimeFromOtherPage) {
    selectedValues.activeTime = activeTimeFromOtherPage;
  }
  
  // Load daily dose if available
  const dailyDoseFromStorage = localStorage.getItem("daily_dose");
  if (dailyDoseFromStorage) {
    selectedValues.dailyDose = dailyDoseFromStorage;
  }
  
  // Update display for all values (including defaults if no saved values)
  updateDisplayValue("sensitivity", selectedValues.sensitivity);
  updateDisplayValue("activeTime", selectedValues.activeTime);
  updateDisplayValue("dailyDose", selectedValues.dailyDose);
}

window.confirmSelection = function(modalId, type) {
  console.log("confirmSelection called with:", modalId, type); // Debug log
  const picker = document.getElementById(modalId.replace("Modal", "Picker"));
  const selectedItem = picker.querySelector(".picker-item.selected");
  
  if (selectedItem) {
    const newValue = selectedItem.textContent.trim();
    console.log("Selected value:", newValue); // Debug log
    
    if (type === "sensitivity" && window.editingRow) {
      const sensitivityElement =
        window.editingRow.querySelector(".fs-6:last-child");
      if (sensitivityElement) {
        sensitivityElement.textContent = newValue + " mg/dl/u";
        sensitivityElement.style.color = "#1b52a4";
      }
      window.editingRow = null;
      // Also save to localStorage when editing a row
      localStorage.setItem("sensitivity_selected", "true");
      localStorage.setItem("sensitivity_default", newValue);
    } else {
      selectedValues[type] = newValue;
      updateDisplayValue(type, newValue);
      saveValuesToLocalStorage();
      
      // Save individual status flags for each field
      if (type === "sensitivity") {
        localStorage.setItem("sensitivity_selected", "true");
        localStorage.setItem("sensitivity_default", newValue);
        console.log("Saved sensitivity_selected to localStorage"); // Debug log
      } else if (type === "activeTime") {
        localStorage.setItem("active_time_selected", "true");
        localStorage.setItem("active_time", newValue);
        console.log("Saved active_time_selected to localStorage"); // Debug log
      } else if (type === "dailyDose") {
        localStorage.setItem("daily_dose_selected", "true");
        localStorage.setItem("daily_dose", newValue);
        console.log("Saved daily_dose_selected to localStorage"); // Debug log
      }
    }
  }
  hideModal(modalId);
}

function setupWheel(list, data, defaultValue) {
  const wheel = list.parentElement;
  let isDragging = false,
    startY,
    startTop;
  const dataLength = data.length;
  const totalHeight = dataLength * 40;
  const centerOffset = 210 / 2 - 40 / 2;
  const middleSetStartTop = centerOffset - totalHeight * 2;
  list.style.top = `${middleSetStartTop}px`;
  snapToValue(list, data, defaultValue, false);
  const onStart = (y) => {
    isDragging = true;
    startY = y;
    startTop = parseFloat(list.style.top);
    list.style.transition = "none";
  };
  const onMove = throttle((y) => {
    if (!isDragging) return;
    let newTop = startTop + (y - startY);
    list.style.top = `${newTop}px`;
    updateAppearance(list, newTop);
  }, 16);
  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    let currentTop = parseFloat(list.style.top);
    if (currentTop > centerOffset - totalHeight) {
      currentTop -= totalHeight * 2;
      list.style.top = `${currentTop}px`;
    } else if (currentTop < centerOffset - totalHeight * 3) {
      currentTop += totalHeight * 2;
      list.style.top = `${currentTop}px`;
    }
    setTimeout(() => {
      list.style.transition = "top 0.2s ease-out";
      snapToList(list, data);
    }, 10);
  };
  // Remove old listeners before adding new ones
  const mouseDownHandler = (e) => {
    e.preventDefault();
    onStart(e.clientY);
  };
  const mouseMoveHandler = (e) => onMove(e.clientY);
  
  wheel.addEventListener("mousedown", mouseDownHandler);
  wheel.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", onEnd);
  wheel.addEventListener("mouseleave", onEnd);
  wheel.addEventListener(
    "touchstart",
    (e) => {
      onStart(e.touches[0].clientY);
    },
    { passive: false }
  );
  wheel.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      onMove(e.touches[0].clientY);
    },
    { passive: false }
  );
  wheel.addEventListener("touchend", onEnd);
  wheel.addEventListener("touchcancel", onEnd);
  updateAppearance(list, parseFloat(list.style.top));
}

function updateAppearance(list, top) {
  const items = list.children;
  const itemHeight = 40;
  const wheelHeight = 210;
  const centerOffset = wheelHeight / 2 - itemHeight / 2;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemTop = top + i * itemHeight;
    const distance = Math.abs(centerOffset - itemTop);
    const scale = Math.max(0.4, 1 - distance / (wheelHeight * 1.1));
    item.style.transform = `scale(${scale})`;
    item.classList.toggle("selected", distance < itemHeight / 2);
  }
}

// Glucose Ruler
let currentValue = 90;
const glucoseValue = document.getElementById("glucoseValue");
const ruler = document.getElementById("ruler");
const ticksContainer = document.getElementById("ticks");

function updateGlucoseText() {
  // Check if glucoseValue element exists
  if (!glucoseValue) return;
  
  // Determine color based on glucose value
  let color = "#33cc7a"; // Green (default for < 180)
  if (currentValue >= 180) {
    color = "#FFD700"; // Yellow/Gold
  }
  
  glucoseValue.style.color = color;
  glucoseValue.innerHTML = `${currentValue}<div style="position: absolute; top: 80px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 10px solid ${color};"></div>`;
  
  // Update pointer color to match ruler color
  const pointer = document.getElementById("pointer");
  if (pointer) {
    pointer.style.backgroundColor = color;
  }
}

function showModal(modalId, force = false) {
  const modal = document.getElementById(modalId);
  modal.classList.add("active");
  updateModalGlucoseValue();
  
  // Add click outside to close functionality
  setTimeout(() => {
    modal.addEventListener('click', handleModalOutsideClick);
  }, 100);
}

function handleModalOutsideClick(e) {
  const modal = e.currentTarget;
  const modalContent = modal.querySelector('.picker-container, .modal-content');
  
  // Check if click is outside the modal content
  if (modalContent && !modalContent.contains(e.target)) {
    const modalId = modal.id;
    
    // Don't close certain modals by clicking outside (like calibration or success modals)
    const nonClosableModals = ['calibrationModal', 'successModal', 'confclose'];
    if (nonClosableModals.includes(modalId)) {
      return;
    }
    
    hideModal(modalId);
    
    // Auto-save the current selected value when closing
    autoSaveModalValue(modalId);
  }
}

function autoSaveModalValue(modalId) {
  // Map modal IDs to their types
  const modalTypeMap = {
    'sensitivityModal': 'sensitivity',
    'activeTimeModal': 'activeTime',
    'dailyDoseModal': 'dailyDose'
  };
  
  const type = modalTypeMap[modalId];
  if (!type) return;
  
  const pickerId = modalId.replace('Modal', 'Picker');
  const picker = document.getElementById(pickerId);
  const selectedItem = picker?.querySelector('.picker-item.selected');
  
  if (selectedItem) {
    const newValue = selectedItem.textContent.trim();
    selectedValues[type] = newValue;
    updateDisplayValue(type, newValue);
    saveValuesToLocalStorage();
    
    // Save individual status flags for each field
    if (type === 'sensitivity') {
      localStorage.setItem('sensitivity_selected', 'true');
      localStorage.setItem('sensitivity_default', newValue);
    } else if (type === 'activeTime') {
      localStorage.setItem('active_time_selected', 'true');
      localStorage.setItem('active_time', newValue);
    } else if (type === 'dailyDose') {
      localStorage.setItem('daily_dose_selected', 'true');
      localStorage.setItem('daily_dose', newValue);
    }
  }
}

function checkWhatModal() {
  const bloodSugarValue = currentValue;
  localStorage.setItem("glucoseValue", bloodSugarValue);
  
  // Update the glucose value in both modals
  document.getElementById("modalGlucoseValue").textContent = bloodSugarValue;
  document.getElementById("modalGlucoseValue2").textContent = bloodSugarValue;
  
  // Calculate deviation based on current value (10% for calibration modal, 35% for notconnection modal)
  const deviation10 = (bloodSugarValue * 0.1).toFixed(0);
  const deviation35 = (bloodSugarValue * 0.35).toFixed(0);
  
  // Update deviation text in both modals
  const showValElement = document.querySelector(".show-val");
  if (showValElement) {
    const deviation = bloodSugarValue <= 170 ? deviation10 : deviation35;
    const percentage = bloodSugarValue <= 170 ? 10 : 35;
    showValElement.innerText = `${bloodSugarValue.toFixed(1)} ± ${deviation} (%${percentage})`;
  }
  
  // Update notconnection modal deviation (35% always)
  const notconnectionDeviationElement = document.getElementById("notconnectionDeviation");
  if (notconnectionDeviationElement) {
    notconnectionDeviationElement.innerText = `${bloodSugarValue.toFixed(1)} ± ${deviation35} (%35)`;
  }

  // Show appropriate modal based on glucose value
  if (bloodSugarValue <= 170) {
    // Show calibration modal for values 170 or less (10% deviation)
    showModal("calibrationModal", true);
  } else {
    // Show notconnection modal for values greater than 170 (35% deviation)
    showModal("notconnection", true);
  }
}

// Optimized: Generate ruler only once and cache it
let rulerGenerated = false;

function generateRuler() {
  if (rulerGenerated) return; // Prevent regeneration
  
  // Check if ruler and ticksContainer exist
  if (!ruler || !ticksContainer) return;
  
  ruler.innerHTML = "";
  ticksContainer.innerHTML = "";
  
  // Use DocumentFragment for better performance
  const ticksFragment = document.createDocumentFragment();
  const rulerFragment = document.createDocumentFragment();
  
  for (let i = minValue; i <= maxValue; i++) {
    const tick = document.createElement("div");
    tick.style.cssText = `position: relative; flex: 0 0 ${unitWidth}px; max-width: ${unitWidth}px; text-align: center;`;
    
    // Determine line color based on value
    let lineColor = 'gray';
    if (i % 10 === 0) {
      lineColor = 'black';
    } else {
      if (i < 180) lineColor = '#33cc7a'; // Green
      else lineColor = '#FFD700'; // Yellow
    }
    
    const line = document.createElement("div");
    line.style.cssText = `height: ${i % 10 === 0 ? '26px' : '12px'}; background: ${lineColor}; margin: 2px auto; width: 2px;`;
    tick.appendChild(line);
    
    if (i % 10 === 0) {
      const label = document.createElement("div");
      label.innerText = i;
      label.style.cssText = `font-size: 20px; font-weight: bold; margin-top: 10px; color: #333;`;
      tick.appendChild(label);
    }
    ticksFragment.appendChild(tick);
    
    const rulerSegment = document.createElement("div");
    let flexValue = `0 0 ${unitWidth}px`;
    if (i == 79) flexValue = '0 0 8px';
    if (i == 80) flexValue = '0 0 20px';
    
    let bgColor = "#33cc7a"; // Green for < 180
    if (i >= 180) bgColor = "#FFD700"; // Yellow for 180+
    
    rulerSegment.style.cssText = `flex: ${flexValue}; height: 6px; background-color: ${bgColor};`;
    rulerFragment.appendChild(rulerSegment);
  }
  
  ticksContainer.appendChild(ticksFragment);
  ruler.appendChild(rulerFragment);
  rulerGenerated = true; // Mark as generated
}

function updateRulerPosition() {
  // Check if ruler and ticksContainer exist
  if (!ruler || !ticksContainer) return;
  
  const centerIndex = currentValue - minValue;
  const containerWidth =
    ruler.parentElement.offsetWidth ||
    document.querySelector(".phone-container").clientWidth;
  const centerOffset = containerWidth / 2;
  const newLeft = -(centerIndex * unitWidth - centerOffset) - 7.5;
  ruler.style.left = `${newLeft}px`;
  ticksContainer.style.left = `${newLeft}px`;
}

function updateModalGlucoseValue() {
  const modalValues = document.querySelectorAll(".modalGlucoseValue");
  modalValues.forEach((el) => {
    el.textContent = 115; // Always show 115
  });
}

function updateView() {
  updateGlucoseText();
  updateRulerPosition();
  updateModalGlucoseValue();

  const modalValue = document.getElementById("modalGlucoseValue");
  if (modalValue) {
    modalValue.textContent = 115; // Always show 115
  }
}

const debouncedCheckModal = debounce(checkWhatModal, 300);

// Add null checks for increment/decrement buttons
const incrementBtn = document.getElementById("increment");
if (incrementBtn) {
  incrementBtn.onclick = () => {
    if (currentValue + step <= maxValue) {
      currentValue += step;
      updateView();
      debouncedCheckModal();
    }
  };
}

const decrementBtn = document.getElementById("decrement");
if (decrementBtn) {
  decrementBtn.onclick = () => {
    if (currentValue - step >= minValue) {
      currentValue -= step;
      updateView();
      debouncedCheckModal();
    }
  };
}

let isDragging = false;
let startX = 0;
let initialLeft = 0;
const container = document.getElementById("ruler-container");

const startDrag = (x) => {
  if (!ruler) return; // Check if ruler exists
  isDragging = true;
  startX = x;
  initialLeft = parseFloat(getComputedStyle(ruler).left);
  ruler.style.transition = "none";
};

const moveDrag = throttle((x) => {
  if (!isDragging || !ruler || !ticksContainer || !container) return;
  const diffX = x - startX;
  let newLeft = initialLeft + diffX;
  const maxLeft = 0;
  const minLeft =
    -(maxValue - minValue) * unitWidth + container.offsetWidth / 2;
  newLeft = Math.min(maxLeft, Math.max(newLeft, minLeft));
  ruler.style.left = `${newLeft}px`;
  ticksContainer.style.left = `${newLeft}px`;
  const centerOffset = container.offsetWidth / 2;
  const centerIndex = Math.round((centerOffset - newLeft) / unitWidth);
  currentValue = Math.min(maxValue, Math.max(minValue, minValue + centerIndex));
  updateGlucoseText();
}, 16);

const endDrag = () => {
  if (isDragging) {
    isDragging = false;
    updateRulerPosition();
    updateModalGlucoseValue();
  }
};

// Optimized: Use single event listener with delegation
const mouseDownHandler = (e) => startDrag(e.clientX);
const mouseMoveHandler = (e) => {
  if (isDragging) moveDrag(e.clientX);
};

// Add event listeners only if container exists
if (container) {
  container.addEventListener("mousedown", mouseDownHandler);
  container.addEventListener(
    "touchstart",
    (e) => startDrag(e.touches[0].clientX),
    { passive: false }
  );
  container.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      moveDrag(e.touches[0].clientX);
    },
    { passive: false }
  );
  container.addEventListener("touchend", endDrag);
  container.addEventListener("touchcancel", endDrag);
}

// Document-level listeners can be added regardless
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("mouseup", endDrag);

let selectedValues = { sensitivity: null, activeTime: null, dailyDose: null };

window.showScreen = function(screenId) {
  console.log("showScreen called with:", screenId); // Debug log
  
  if (screenId === "screen2") {
    if (checkRequiredFields()) {
      console.log("All requirements met, proceeding to screen2"); // Debug log
      // All checks passed, proceed with original showScreen logic
      const screens = document.querySelectorAll(".screen");
      screens.forEach((screen) => {
        screen.classList.remove("active");
        screen.style.display = "none";
      });

      const targetScreen = document.querySelector(`#${screenId}`);
      if (targetScreen) {
        console.log("Found screen2, showing it"); // Debug log
        targetScreen.style.display = "block";
        requestAnimationFrame(() => {
          targetScreen.classList.add("active");
        });
      } else {
        console.error("screen2 not found"); // Debug log
      }
    }
    // If checks fail, modal is shown by checkRequiredFields, so don't proceed
  } else {
    // For other screens, use original logic
    const screens = document.querySelectorAll(".screen");
    screens.forEach((screen) => {
      screen.classList.remove("active");
      screen.style.display = "none";
    });

    const targetScreen = document.querySelector(`#${screenId}`);
    if (targetScreen) {
      targetScreen.style.display = "block";
      requestAnimationFrame(() => {
        targetScreen.classList.add("active");
      });
    }
  }
};

// Automode Screen
window.openAutomodeScreen = function() {
  // Find target screen first
  const automodeScreen = document.querySelector('[screen="screen-Automode"]');
  if (!automodeScreen) {
    console.error("الشاشة screen-Automode مش موجودة");
    return;
  }

  // Hide all screens efficiently
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
    screen.style.display = "none";
  });

  // Show target screen
  automodeScreen.style.display = "block";
  requestAnimationFrame(() => {
    automodeScreen.classList.add("active");
  });
}


function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("active");
  
  // Remove the click outside listener
  modal.removeEventListener('click', handleModalOutsideClick);
}

function selectPickerItem(pickerId, value) {
  const picker = document.getElementById(pickerId);
  const items = picker.querySelectorAll(".picker-item");
  items.forEach((item) => {
    item.classList.remove("selected");
    if (item.textContent === value) item.classList.add("selected");
  });
}

function updateDisplayValue(type, value) {
  let displayText = value;
  switch (type) {
    case "sensitivity":
      // Check if value is null, undefined, or empty
      if (!value || value === "null" || value === "undefined") {
        displayText = "غير محدد";
        document.querySelectorAll(".senVal").forEach((el) => {
          el.textContent = displayText;
          el.classList.remove('selected-value');
          el.classList.add('default-value');
        });
      } else {
        displayText = value + " mg/dl/u";
        document.querySelectorAll(".senVal").forEach((el) => {
          el.textContent = displayText;
          el.classList.remove('default-value');
          el.classList.add('selected-value');
        });
        // Also save to localStorage immediately
        localStorage.setItem("sensitivity_selected", "true");
        localStorage.setItem("sensitivity_default", value);
      }
      break;
    case "activeTime":
      // Check if value is null, undefined, or empty
      if (!value || value === "null" || value === "undefined") {
        displayText = "غير محدد";
        document.querySelectorAll(".actIn").forEach((el) => {
          el.textContent = displayText;
          el.classList.remove('selected-value');
          el.classList.add('default-value');
        });
      } else {
        displayText = value + " ساعة";
        document.querySelectorAll(".actIn").forEach((el) => {
          el.textContent = displayText;
          el.classList.remove('default-value');
          el.classList.add('selected-value');
        });
        // Also save to localStorage immediately
        localStorage.setItem("active_time_selected", "true");
        localStorage.setItem("active_time", value);
      }
      break;
    case "dailyDose":
      // Check if value is null, undefined, or empty
      if (!value || value === "null" || value === "undefined") {
        displayText = "غير محدد";
        document.querySelectorAll(".dailyDose").forEach((el) => {
          el.textContent = displayText;
          el.classList.remove('selected-value');
          el.classList.add('default-value');
        });
      } else {
        displayText = value + " وحدة";
        document.querySelectorAll(".dailyDose").forEach((el) => {
          el.textContent = displayText;
          el.classList.remove('default-value');
          el.classList.add('selected-value');
        });
        // Also save to localStorage immediately
        localStorage.setItem("daily_dose_selected", "true");
        localStorage.setItem("daily_dose", value);
      }
      break;
  }
}

var autoModeSwitch = document.getElementById("autoModeSwitch");
var originalSetItem = originalSetItem || localStorage.setItem;
const dailyDoseEl = document.querySelector(".dailyDose");
const actInEl = document.querySelector(".actIn");
const senValEl = document.querySelector(".senVal");
const cgmsStatusEl = document.querySelector(".text-primary.text-end");

let dailyDose = null;
let actIn = null;
let senVal = null;
let cgmsPaired = false;
let isAutoDisabling = false;

function saveAutoModeState() {
  if (autoModeSwitch) {
    originalSetItem.call(localStorage, "autoModeSwitch", autoModeSwitch.checked ? "true" : "false");
  }
}

// Function to force visual update of the switch
function updateSwitchVisual() {
  if (!autoModeSwitch) {
    // Try to get it again
    autoModeSwitch = document.getElementById('autoModeSwitch');
    if (!autoModeSwitch) {
      console.log("❌ updateSwitchVisual: autoModeSwitch not found");
      return;
    }
  }
  
  const track = autoModeSwitch.parentElement?.querySelector('.switch-track');
  const thumb = autoModeSwitch.parentElement?.querySelector('.switch-thumb');
  
  console.log("🔄 Updating switch visual:", {
    checked: autoModeSwitch.checked,
    track: track ? "found" : "not found",
    thumb: thumb ? "found" : "not found"
  });
  
  if (autoModeSwitch.checked) {
    // Apply checked styles (blue)
    if (track) {
      track.style.cssText = 'background: #c7d9f0 !important; background-color: #c7d9f0 !important; position: absolute; top: 2px; left: 0; width: 40px; height: 20px; border-radius: 16px; transition: background 0.3s ease;';
    }
    if (thumb) {
      thumb.style.cssText = 'background: #2056a8 !important; background-color: #2056a8 !important; transform: translateX(15px) !important; position: absolute; top: -2px; left: 0; width: 25px; height: 25px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.3s ease, background 0.3s ease;';
    }
    console.log("✅ Applied CHECKED styles (blue)");
  } else {
    // Apply unchecked styles (gray)
    if (track) {
      track.style.cssText = 'background: #d1d1d6 !important; background-color: #d1d1d6 !important; position: absolute; top: 2px; left: 0; width: 40px; height: 20px; border-radius: 16px; transition: background 0.3s ease;';
    }
    if (thumb) {
      thumb.style.cssText = 'background: #9e9e9e !important; background-color: #9e9e9e !important; transform: translateX(0) !important; position: absolute; top: -2px; left: 0; width: 25px; height: 25px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.3s ease, background 0.3s ease;';
    }
    console.log("⚫ Applied UNCHECKED styles (gray)");
  }
}

// Initialize the switch immediately when this function is available
if (typeof window !== 'undefined') {
  window.updateSwitchVisual = updateSwitchVisual;
}

// Global function for debugging
window.debugAutoSwitch = function() {
  const sw = document.getElementById('autoModeSwitch');
  const track = sw?.parentElement?.querySelector('.switch-track');
  const thumb = sw?.parentElement?.querySelector('.switch-thumb');
  
  console.log("🔍 Auto Switch Debug:");
  console.log("  Switch element:", sw ? "found" : "not found");
  console.log("  Switch checked:", sw?.checked);
  console.log("  localStorage:", localStorage.getItem('autoModeSwitch'));
  console.log("  Track element:", track ? "found" : "not found");
  console.log("  Track background:", track?.style.background);
  console.log("  Thumb element:", thumb ? "found" : "not found");
  console.log("  Thumb background:", thumb?.style.background);
  console.log("  Thumb transform:", thumb?.style.transform);
  
  return {
    switch: sw,
    track: track,
    thumb: thumb,
    checked: sw?.checked,
    localStorage: localStorage.getItem('autoModeSwitch')
  };
}

// Function to manually toggle the switch for testing
window.toggleAutoSwitch = function() {
  const sw = document.getElementById('autoModeSwitch');
  if (sw) {
    sw.checked = !sw.checked;
    sw.dispatchEvent(new Event('change', { bubbles: true }));
    updateSwitchVisual();
    console.log("🔄 Toggled to:", sw.checked);
  }
}

// Function to fix the switch if it's stuck
window.fixAutoSwitch = function() {
  console.log("🔧 Fixing auto switch...");
  
  // Get fresh reference
  autoModeSwitch = document.getElementById('autoModeSwitch');
  if (!autoModeSwitch) {
    console.error("❌ Cannot find autoModeSwitch element!");
    return;
  }
  
  // Remove all event listeners by cloning
  const parent = autoModeSwitch.parentNode;
  const newSwitch = autoModeSwitch.cloneNode(true);
  parent.replaceChild(newSwitch, autoModeSwitch);
  autoModeSwitch = newSwitch;
  
  // Re-attach event listener with proper binding
  autoModeSwitch.addEventListener('change', function(e) {
    console.log("🎆 Change event fired! Checked:", this.checked);
    handleAutoModeSwitchChange(e);
  });
  
  // Add direct click handler
  autoModeSwitch.addEventListener('click', function(e) {
    console.log("🖱️ Direct click on checkbox");
    setTimeout(() => updateSwitchVisual(), 10);
  });
  
  // Update visual state
  updateSwitchVisual();
  
  console.log("✅ Auto switch fixed and ready!");
  return autoModeSwitch;
}

// Auto-fix removed - now handled by fix-switches.js

// Direct handlers removed - now handled by fix-switches.js

function loadAutoModeState() {
  if (!autoModeSwitch) {
    console.error("autoModeSwitch element not found!");
    return;
  }
  const savedState = localStorage.getItem("autoModeSwitch");
  console.log("Loading autoModeSwitch state from localStorage:", savedState);
  
  // Force the visual state to update
  if (savedState === "true") {
    autoModeSwitch.checked = true;
    autoModeSwitch.setAttribute('checked', 'checked');
  } else {
    autoModeSwitch.checked = false;
    autoModeSwitch.removeAttribute('checked');
  }
  
  // Force visual update
  updateSwitchVisual();
  
  console.log("autoModeSwitch.checked loaded as:", autoModeSwitch.checked);
}

const cgmsStatuses = document.querySelectorAll("#cgmsStatus");
const basalStatusEl = document.getElementById("basalStatus");
const pumpStatusEl = document.getElementById("pumpStatus");

function updateCGMSAndPumpStatus() {
  const cgmsPaired = localStorage.getItem("cgms_paired") === "true";
  const pumpPaired = localStorage.getItem("pump-pairing") === "true";

  cgmsStatuses.forEach((el) => {
    if (cgmsPaired) {
      el.textContent = "جاهز";
      el.style.color = "#1b52a4";
    } else {
      el.textContent = "غير جاهز";
      el.style.color = "#7b7b7b";
    }
  });

  if (pumpStatusEl) {
    if (pumpPaired) {
      pumpStatusEl.textContent = "جاهز";
      pumpStatusEl.style.color = "#1b52a4";
    } else {
      pumpStatusEl.textContent = "غير جاهز";
      pumpStatusEl.style.color = "#7b7b7b";
    }
  }
}

function updateFinalStatusScreen() {
  const insulinQaedy = localStorage.getItem("insulin-qaedy");
  
  if (autoModeSwitch && autoModeSwitch.checked) {
    if (dailyDoseEl) dailyDoseEl.textContent = dailyDose || "غير محدد";
    if (actInEl) actInEl.textContent = actIn || "غير محدد";
    if (senValEl) senValEl.textContent = senVal || "غير محدد";
    [dailyDoseEl, actInEl, senValEl].forEach((el) => {
      if (el) {
        el.style.color = el.textContent === "غير محدد" ? "#999" : "#1b52a4";
      }
    });
    cgmsStatuses.forEach((el) => {
      el.textContent = "جاهز";
      el.style.color = "#1b52a4";
    });
    if (basalStatusEl) {
      if (insulinQaedy === "true") {
        basalStatusEl.textContent = "تعيين";
        basalStatusEl.style.color = "#1b52a4";
      } else {
        basalStatusEl.textContent = "غير محدد";
        basalStatusEl.style.color = "#7b7b7b";
      }
    }
  } else {
    if (dailyDoseEl) dailyDoseEl.textContent = "غير محدد";
    if (actInEl) actInEl.textContent = "غير محدد";
    if (senValEl) senValEl.textContent = "غير محدد";
    [dailyDoseEl, actInEl, senValEl].forEach(
      (el) => {
        if (el) el.style.color = "#999";
      }
    );
    cgmsStatuses.forEach((el) => {
      el.textContent = "غير جاهز";
      el.style.color = "#7b7b7b";
    });
    if (basalStatusEl) {
      if (insulinQaedy === "true") {
        basalStatusEl.textContent = "تعيين";
        basalStatusEl.style.color = "#1b52a4";
      } else {
        basalStatusEl.textContent = "غير محدد";
        basalStatusEl.style.color = "#7b7b7b";
      }
    }
  }
  saveAutoModeState();
}

// Define the change handler function separately to avoid duplicates
function handleAutoModeSwitchChange(event) {
    // Get fresh reference to ensure we're working with the current element
    const currentSwitch = document.getElementById('autoModeSwitch');
    if (!currentSwitch) {
      console.error("Switch element lost!");
      return;
    }
    
    // Update global reference
    autoModeSwitch = currentSwitch;
    
    // Skip if this is a programmatic change during load
    if (event && !event.isTrusted && !event.bubbles) {
      return;
    }
    
    if (isAutoDisabling) {
      console.log("⏭️ Skipping event - triggered by auto-disable");
      return;
    }
    
    console.log("🎯 handleAutoModeSwitchChange called, checked:", autoModeSwitch.checked);
    
    // Check if user is trying to enable auto mode
    if (autoModeSwitch.checked) {
      // Check all requirements before allowing enable
      const pumpPaired = localStorage.getItem("pump-pairing") === "true";
      const insulinQaedy = localStorage.getItem("insulin-qaedy") === "true";
      const glucoseLimitsCleared = localStorage.getItem("glucose_limits_v2_cleared") === "true";
      const activeTimeSelected = localStorage.getItem("active_time_selected") === "true";
      const dailyDoseSelected = localStorage.getItem("daily_dose_selected") === "true";
      const cgmsPaired = localStorage.getItem("cgms_paired") === "true";
      
      const allRequirementsMet = pumpPaired && insulinQaedy && glucoseLimitsCleared && 
                                  activeTimeSelected && dailyDoseSelected && cgmsPaired;
      
      if (!allRequirementsMet) {
        // Requirements not met, prevent enabling and show appropriate message
        console.log("❌ Cannot enable auto mode - requirements not met");
        autoModeSwitch.checked = false;
        autoModeSwitch.removeAttribute('checked');
        updateSwitchVisual();
        
        // Show specific missing requirement message
        if (!pumpPaired) {
          showConfirmationModal("لم يتم إقتران مضخة الانسولين, لا يمكن تمكين الوضع التلقائي");
        } else if (!insulinQaedy) {
          showConfirmationModal("يرجى ضبط القاعدي");
        } else if (!glucoseLimitsCleared) {
          showConfirmationModal("يرجى ضبط معامل حساسية الأنسولين");
        } else if (!activeTimeSelected) {
          showConfirmationModal("يرجى ضبط معامل الإنسولين النشط");
        } else if (!dailyDoseSelected) {
          showConfirmationModal("يرجى ضبط اجمالي كمية الأنسولين اليومية");
        } else if (!cgmsPaired) {
          showConfirmationModal("يرجى إقران نظام المراقبة المستمرة للجلوكوز");
        }
        
        originalSetItem.call(localStorage, "autoModeSwitch", "false");
        return;
      }
    }
    
    // Allow the toggle to proceed
    originalSetItem.call(localStorage, "autoModeSwitch", autoModeSwitch.checked ? "true" : "false");
    console.log("💾 User manually changed autoModeSwitch to:", autoModeSwitch.checked);
    
    if (autoModeSwitch.checked) {
      autoModeSwitch.setAttribute('checked', 'checked');
    } else {
      autoModeSwitch.removeAttribute('checked');
    }
    
    // Force visual update
    setTimeout(() => {
      updateSwitchVisual();
    }, 10);
    
    updateFinalStatusScreen();
    handleCheckboxModeSwitch();
    updateModalGlucoseValue();
    updateInsulinButtonState();
    
    if (!autoModeSwitch.checked) {
      const exerciseSwitch = document.getElementById("exerciseautoModeSwitch");
      if (exerciseSwitch) {
        exerciseSwitch.checked = false;
        localStorage.setItem("exerciseautoModeSwitch", "false");
      }
    }
}

// This will be attached in DOMContentLoaded instead

// Global handler to ensure switch always works
window.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'autoModeSwitch') {
    console.log("🌍 Global click handler detected switch click");
    setTimeout(() => {
      const sw = document.getElementById('autoModeSwitch');
      if (sw) {
        updateSwitchVisual();
      }
    }, 100);
  }
}, true);

window.addEventListener("storage", (e) => {
  if (e.key === "cgms_paired" || e.key === "pump-pairing") {
    updateCGMSAndPumpStatus();
  }
  
  if (e.key === "pump-pairing" || 
      e.key === "insulin-qaedy" || 
      e.key === "glucose_limits_v2_cleared" || 
      e.key === "active_time_selected" || 
      e.key === "daily_dose_selected" || 
      e.key === "cgms_paired") {
    checkAndDisableAutoMode();
  }
});

window.addEventListener("storageRulesChanged", (e) => {
  const key = e.detail.key;
  
  if (key === "cgms_paired" || key === "pump-pairing") {
    updateCGMSAndPumpStatus();
  }
  
  if (key === "pump-pairing" || 
      key === "insulin-qaedy" || 
      key === "glucose_limits_v2_cleared" || 
      key === "active_time_selected" || 
      key === "daily_dose_selected" || 
      key === "cgms_paired") {
    console.log(`📢 Received storageRulesChanged for: ${key}`);
    checkAndDisableAutoMode();
  }
});

window.checkAutoModeNow = function() {
  console.log("Manual check triggered...");
  console.log("Requirements:");
  console.log("  pump-pairing:", localStorage.getItem("pump-pairing"));
  console.log("  insulin-qaedy:", localStorage.getItem("insulin-qaedy"));
  console.log("  glucose_limits_v2_cleared:", localStorage.getItem("glucose_limits_v2_cleared"));
  console.log("  active_time_selected:", localStorage.getItem("active_time_selected"));
  console.log("  daily_dose_selected:", localStorage.getItem("daily_dose_selected"));
  console.log("  cgms_paired:", localStorage.getItem("cgms_paired"));
  console.log("  autoModeSwitch.checked:", autoModeSwitch ? autoModeSwitch.checked : "null");
  console.log("  localStorage autoModeSwitch:", localStorage.getItem("autoModeSwitch"));
  checkAndDisableAutoMode();
};

let missingElementWarningLogged = false;

function checkAndDisableAutoMode() {
  if (!autoModeSwitch) {
    if (!missingElementWarningLogged) {
      console.log("⚠️ autoModeSwitch element not found, skipping DOM updates");
      missingElementWarningLogged = true;
    }
  }
  
  const pumpPaired = localStorage.getItem("pump-pairing") === "true";
  let insulinQaedy = localStorage.getItem("insulin-qaedy") === "true";
  const glucoseLimitsCleared = localStorage.getItem("glucose_limits_v2_cleared") === "true";
  const activeTimeSelected = localStorage.getItem("active_time_selected") === "true";
  const dailyDoseSelected = localStorage.getItem("daily_dose_selected") === "true";
  const cgmsPaired = localStorage.getItem("cgms_paired") === "true";
  
  if (!pumpPaired && insulinQaedy) {
    console.log("⚠️ Pump not paired but insulin-qaedy is true, fixing...");
    originalSetItem.call(localStorage, "insulin-qaedy", "false");
    insulinQaedy = false;
  }
  
  const allRequirementsMet = pumpPaired && insulinQaedy && glucoseLimitsCleared && 
                              activeTimeSelected && dailyDoseSelected && cgmsPaired;
  
  if (autoModeSwitch) {
    console.log(`Requirements met: ${allRequirementsMet}, autoModeSwitch.checked: ${autoModeSwitch.checked}, localStorage: ${localStorage.getItem("autoModeSwitch")}`);
  }
  
  if (!allRequirementsMet) {
    const failedRequirements = [];
    if (!pumpPaired) failedRequirements.push("pump-pairing");
    if (!insulinQaedy) failedRequirements.push("insulin-qaedy");
    if (!glucoseLimitsCleared) failedRequirements.push("glucose_limits_v2_cleared");
    if (!activeTimeSelected) failedRequirements.push("active_time_selected");
    if (!dailyDoseSelected) failedRequirements.push("daily_dose_selected");
    if (!cgmsPaired) failedRequirements.push("cgms_paired");
    
    const localStorageValue = localStorage.getItem("autoModeSwitch");
    
    if ((autoModeSwitch && autoModeSwitch.checked) || localStorageValue === "true") {
      console.log(`❌ Disabling autoModeSwitch - ${failedRequirements.length} requirement(s) failed: ${failedRequirements.join(", ")}`);
      console.table({
        "✅/❌ pump-pairing": pumpPaired,
        "✅/❌ insulin-qaedy": insulinQaedy,
        "✅/❌ glucose_limits_v2_cleared": glucoseLimitsCleared,
        "✅/❌ active_time_selected": activeTimeSelected,
        "✅/❌ daily_dose_selected": dailyDoseSelected,
        "✅/❌ cgms_paired": cgmsPaired,
        "autoModeSwitch.checked (DOM)": autoModeSwitch ? autoModeSwitch.checked : "N/A",
        "localStorage value": localStorageValue
      });
      
      if (autoModeSwitch) {
        isAutoDisabling = true;
        autoModeSwitch.checked = false;
        autoModeSwitch.removeAttribute('checked');
        setTimeout(() => { isAutoDisabling = false; }, 100);
      }
      originalSetItem.call(localStorage, "autoModeSwitch", "false");
      
      if (typeof updateFinalStatusScreen === 'function') {
        updateFinalStatusScreen();
      }
      
      const exerciseSwitch = document.getElementById("exerciseautoModeSwitch");
      if (exerciseSwitch) {
        exerciseSwitch.checked = false;
          originalSetItem.call(localStorage, "exerciseautoModeSwitch", "false");
      }
      
      console.log("✅ autoModeSwitch disabled successfully!");
      console.log("   - DOM checked:", autoModeSwitch ? autoModeSwitch.checked : "null");
      console.log("   - localStorage:", localStorage.getItem("autoModeSwitch"));
      console.log("🔒 Rule: ANY requirement = false → autoModeSwitch = false");
    } else if (autoModeSwitch) {
      console.log(`ℹ️ autoModeSwitch already disabled. Failed requirements: ${failedRequirements.join(", ")}`);
    }
  } else {
    console.log("✅ All 6 requirements met - autoModeSwitch can be enabled");
  }
}

function handleCalibrationClick() {
  if (autoModeSwitch && autoModeSwitch.checked === true) {
    handlePdaModeNavigation();
    hideModal("calibrationModal");
  } else {
    handleCalibration();
    handlePdaModeNavigation();
    hideModal("calibrationModal");
  }
}

function backToFinalStatusScreen() {
  console.log("backToFinalStatusScreen called");
  
  // Hide all screens
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
    screen.style.display = "none";
  });
  
  // Show finalStatusScreen
  const finalScreen = document.getElementById("finalStatusScreen");
  if (finalScreen) {
    console.log("Found finalStatusScreen, showing it");
    finalScreen.style.display = "block";
    finalScreen.classList.add("active");
  } else {
    console.error("finalStatusScreen not found!");
  }
}

function handleCalibration() {
  if (autoModeSwitch) {
    autoModeSwitch.checked = true;
  }
  updateFinalStatusScreen();
  dailyDose = "11";
  actIn = "2.0";
  senVal = "200";
  updateDisplayValue("dailyDose", dailyDose);
  updateDisplayValue("activeTime", actIn);
  updateDisplayValue("sensitivity", senVal);
  saveValuesToLocalStorage();
  currentValue = 90;
  updateView();
  cgmsPaired = true;
}

function handleCheckboxModeSwitch() {
  if (
    document.getElementById("finalStatusScreen") &&
    document.getElementById("finalStatusScreen").classList.contains("active")
  ) {
    localStorage.setItem(
      "checkboxModeSwitch",
      autoModeSwitch && autoModeSwitch.checked ? "true" : "false"
    );
  }
}

// Event listener already added above (line 863-881) - removed duplicate

// Picker Wheel Dragging
function enablePickerWheelDragging(pickerId) {
  const list = document.getElementById(pickerId);
  if (!list) return;
  const wheel = list.parentElement;
  let isDragging = false;
  let startY = 0;
  let startTop = 0;
  const itemHeight = 40;
  const wheelHeight = 210;
  const centerOffset = wheelHeight / 2 - itemHeight / 2;
  const dataLength = list.children.length / 5;
  const totalHeight = dataLength * itemHeight;
  const middleSetStartTop = centerOffset - totalHeight * 2;
  list.style.top = `${middleSetStartTop}px`;
  const startDrag = (y) => {
    isDragging = true;
    startY = y;
    startTop = parseFloat(list.style.top);
    list.style.transition = "none";
  };
  const moveDrag = throttle((y) => {
    if (!isDragging) return;
    const diffY = y - startY;
    let newTop = startTop + diffY;
    list.style.top = `${newTop}px`;
    updateAppearance(list, newTop);
  }, 16);
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    let currentTop = parseFloat(list.style.top);
    if (currentTop > centerOffset - totalHeight) {
      currentTop -= totalHeight * 2;
      list.style.top = `${currentTop}px`;
    } else if (currentTop < centerOffset - totalHeight * 3) {
      currentTop += totalHeight * 2;
      list.style.top = `${currentTop}px`;
    }
    setTimeout(() => {
      list.style.transition = "top 0.2s ease-out";
      snapToList(
        list,
        Array.from(list.children).map((item) => item.dataset.value)
      );
      updateView();
    }, 10);
  };
  // Optimized: Reuse handlers
  const mouseDownHandler = (e) => {
    e.preventDefault();
    startDrag(e.clientY);
  };
  const mouseMoveHandler = (e) => moveDrag(e.clientY);
  
  wheel.addEventListener("mousedown", mouseDownHandler);
  wheel.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", endDrag);
  wheel.addEventListener("mouseleave", endDrag);
  wheel.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientY), {
    passive: false,
  });
  wheel.addEventListener(
    "touchmove",
    (e) => {
      if (e.cancelable) e.preventDefault();
      moveDrag(e.touches[0].clientY);
    },
    { passive: false }
  );
  wheel.addEventListener("touchend", endDrag);
  wheel.addEventListener("touchcancel", endDrag);
  updateAppearance(list, parseFloat(list.style.top));
}

document.addEventListener("DOMContentLoaded", () => {
    
  // Prevent duplicate initialization
  if (window.__automaticModeInit) {
    console.log("Already initialized, skipping");
    return;
  }
  window.__automaticModeInit = true;
  
  // Re-get autoModeSwitch element after DOM is loaded
  autoModeSwitch = document.getElementById("autoModeSwitch");
  
  // Attach the event listener properly
  if (autoModeSwitch) {
    // Setup event delegation on parent to ensure events always work
    const switchContainer = autoModeSwitch.closest('.auto-switch');
    if (switchContainer) {
      // Remove old handlers
      switchContainer.replaceWith(switchContainer.cloneNode(true));
      const newContainer = document.querySelector('.auto-switch');
      autoModeSwitch = newContainer.querySelector('#autoModeSwitch');
      
      // Use event delegation for reliability
      newContainer.addEventListener('click', function(e) {
        const checkbox = this.querySelector('#autoModeSwitch');
        if (checkbox && e.target !== checkbox) {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
    
    // Direct event listener on the checkbox
    autoModeSwitch.addEventListener('change', handleAutoModeSwitchChange);
    autoModeSwitch.__listenerAttached = true; // Mark as attached
    
    // Additional click handler for visual update
    autoModeSwitch.addEventListener('click', function() {
      console.log("🖱️ Direct click on checkbox");
      setTimeout(() => {
        updateSwitchVisual();
      }, 50);
    });
    
    console.log("✅ Event listeners attached successfully");
    
    // Force initial visual update
    setTimeout(() => {
      updateSwitchVisual();
    }, 100);
  } else {
    console.error("❌ autoModeSwitch element not found in DOM!");
  }
    
  // Load autoModeSwitch state from localStorage first
  loadAutoModeState();
  
  // IMPORTANT: Ensure insulin-qaedy is false if pump is not paired
  const pumpPairedOnLoad = localStorage.getItem("pump-pairing") === "true";
  const insulinQaedyOnLoad = localStorage.getItem("insulin-qaedy") === "true";
  if (!pumpPairedOnLoad && insulinQaedyOnLoad) {
    console.log("🔴 On load: Pump not paired but insulin-qaedy is true, fixing...");
    console.log("   Before fix - insulin-qaedy:", localStorage.getItem("insulin-qaedy"));
    originalSetItem.call(localStorage, "insulin-qaedy", "false");
    console.log("   After fix - insulin-qaedy:", localStorage.getItem("insulin-qaedy"));
  }
  
  // Force check all requirements immediately on load
  console.log("🔍 Checking autoMode requirements on page load...");
  console.log("📊 Current values:");
  console.log("   pump-pairing:", localStorage.getItem("pump-pairing"));
  console.log("   insulin-qaedy:", localStorage.getItem("insulin-qaedy"));
  console.log("   glucose_limits_v2_cleared:", localStorage.getItem("glucose_limits_v2_cleared"));
  console.log("   active_time_selected:", localStorage.getItem("active_time_selected"));
  console.log("   daily_dose_selected:", localStorage.getItem("daily_dose_selected"));
  console.log("   cgms_paired:", localStorage.getItem("cgms_paired"));
  console.log("   autoModeSwitch (before check):", localStorage.getItem("autoModeSwitch"));
  
  checkAndDisableAutoMode();
  
  console.log("   autoModeSwitch (after check):", localStorage.getItem("autoModeSwitch"));
  
  
  updateFinalStatusScreen();

  const allScreens = document.querySelectorAll(".screen");
  
  if (allScreens.length === 0) {
    console.error("CRITICAL: No screens with class 'screen' found in the page!");
    const mainContainer = document.querySelector('body > div') || document.querySelector('.container');
    if (mainContainer) {
      mainContainer.style.display = 'block';
    }
    return;
  }
  
  allScreens.forEach((screen) => {
    screen.classList.remove("active");
  });

  let screenShown = false;
  
  if (autoModeSwitch && autoModeSwitch.checked) {
    const finalScreen = document.getElementById("finalStatusScreen");
    if (finalScreen) {
      finalScreen.classList.add("active");
      screenShown = true;
      console.log("Showing finalStatusScreen");
    }
  }
  
  if (!screenShown) {
    const firstScreen = allScreens[0];
    if (firstScreen) {
      firstScreen.classList.add("active");
      console.log("Showing first screen:", firstScreen.id || "unnamed");
    }
  }

  updateCGMSAndPumpStatus();
  
  console.log("ℹ️ AutoMode monitoring via storage events only (no polling)");

  if (ruler && ticksContainer) {
    generateRuler();
  }
  
  const activeTimePicker = document.getElementById("activeTimePicker");
  if (activeTimePicker) {
    const activeTimeValues = [];
    for (let i = 2.0; i <= 8.0; i += 0.5) {
      activeTimeValues.push(i.toFixed(1));
    }
    populateWheel(activeTimePicker, activeTimeValues);
    activeTimePicker.pickerConfig = { data: activeTimeValues };
    setupWheel(activeTimePicker, activeTimeValues, "5.5");
  }
  
  enablePickerWheelDragging("sensitivityPicker");
  enablePickerWheelDragging("activeTimePicker");
  enablePickerWheelDragging("dailyDosePicker");
  loadValuesFromLocalStorage();

  const savedValue = localStorage.getItem("glucoseValue");
  if (savedValue && !isNaN(parseInt(savedValue))) {
    currentValue = parseInt(savedValue);
    updateView();
  } else {
    currentValue = 90;
    updateView();
  }

  const calibrationModal = document.getElementById("calibrationModal");
  if (calibrationModal) {
    calibrationModal.addEventListener("click", function () {
      updateModalGlucoseValue();
    });
  }
  
  });

const switches = document.querySelectorAll(".switch-input");
switches.forEach((sw) => {
  sw.checked = false;
});

function updateInsulinButtonState() {
  const buttonsActive = localStorage.getItem("buttonsActive") === "true";
  const insulinButtonActiveRaw = localStorage.getItem("insulinButtonActive");
  const insulinButtonActive =
    insulinButtonActiveRaw === null ? true : insulinButtonActiveRaw === "true";
  const insulinPumpBtn = document.querySelector(".btn-action.insulin");
  const btnIcons = document.querySelectorAll(".icon-btn");

  if (insulinPumpBtn) {
    insulinPumpBtn.disabled = !buttonsActive || !insulinButtonActive;
  }
  btnIcons.forEach((btn) => {
    btn.disabled = !buttonsActive;
  });
}
updateInsulinButtonState();

let exerciseSelectedMinutes = 30;
let exercisePickerData = [];

for (let i = 1; i <= 120; i++) {
  exercisePickerData.push(i);
}

const exerciseAutoModeSwitchEl = document.getElementById("exerciseautoModeSwitch");
if (exerciseAutoModeSwitchEl) {
  exerciseAutoModeSwitchEl.addEventListener("change", function () {
    if (this.checked) {
      showExerciseTimePicker();
    } else {
      localStorage.setItem("exerciseautoModeSwitch", "false");
    }
  });
}

function showExerciseTimePicker() {
  const overlay = document.getElementById("exerciseTimePickerOverlay");
  overlay.style.display = "flex";
  initExerciseWheelPicker();
  
  setTimeout(() => {
    overlay.addEventListener('click', handleExerciseModalOutsideClick);
  }, 100);
}

function handleExerciseModalOutsideClick(e) {
  const overlay = e.currentTarget;
  const modalContent = overlay.querySelector('.picker-container');
  
  if (modalContent && !modalContent.contains(e.target)) {
    cancelExerciseTimePicker();
  }
}

function initExerciseWheelPicker() {
  const container = document.getElementById("exercisePickerItems");
  const repeatedData = [
    ...exercisePickerData,
    ...exercisePickerData,
    ...exercisePickerData,
  ];

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  repeatedData.forEach((min) => {
    const div = document.createElement("div");
    div.className = "picker-item";
    div.style.cssText = "height: 50px; line-height: 50px; text-align: center; font-size: 24px; color: #999; font-weight: normal;";
    div.dataset.value = min;
    div.textContent = min;
    fragment.appendChild(div);
  });
  container.appendChild(fragment);

  let currentIndex = exercisePickerData.length + 29;
  exerciseSelectedMinutes = 30;
  let startY = 0;
  let isDragging = false;

  function updatePosition(index) {
    index = Math.max(0, Math.min(index, repeatedData.length - 1));

    const offset = 94 - index * 50;
    container.style.top = offset + "px";

    const items = container.querySelectorAll(".picker-item");
    items.forEach((item, idx) => {
      if (idx === index) {
        item.style.color = "white";
        item.style.fontWeight = "bold";
        item.style.fontSize = "28px";
      } else {
        item.style.color = "#999";
        item.style.fontWeight = "normal";
        item.style.fontSize = "24px";
      }
    });

    const actualIndex = index % exercisePickerData.length;
    exerciseSelectedMinutes = exercisePickerData[actualIndex];

    localStorage.setItem("exerciseSelectedMinutes", exerciseSelectedMinutes);
  }

  container.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
    container.style.transition = "none";

    if (!container.style.top) {
      container.style.top = 94 - currentIndex * 50 + "px";
    }
  });

  const throttledTouchMove = throttle((e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newTop = 94 - currentIndex * 50 + deltaY;
    container.style.top = newTop + "px";
  }, 16);
  
  container.addEventListener("touchmove", throttledTouchMove);

  container.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;

    let currentTop = parseInt(container.style.top);
    if (isNaN(currentTop)) currentTop = 94 - currentIndex * 50;

    let newIndex = Math.round((94 - currentTop) / 50);
    currentIndex = Math.max(0, Math.min(newIndex, repeatedData.length - 1));

    // Adjusted infinite scroll boundaries for 3 repetitions
    if (currentIndex < exercisePickerData.length * 0.5) {
      currentIndex += exercisePickerData.length;
      container.style.transition = "none";
      updatePosition(currentIndex);
      setTimeout(() => {
        container.style.transition = "top 0.3s";
      }, 50);
    } else if (currentIndex >= exercisePickerData.length * 2.5) {
      currentIndex -= exercisePickerData.length;
      container.style.transition = "none";
      updatePosition(currentIndex);
      setTimeout(() => {
        container.style.transition = "top 0.3s";
      }, 50);
    }

    container.style.transition = "top 0.3s";
    updatePosition(currentIndex);
  });

  container.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startY = e.clientY;
    isDragging = true;
    container.style.transition = "none";
    if (!container.style.top) {
      container.style.top = 94 - currentIndex * 50 + "px";
    }
  });

  const throttledMouseMove = throttle((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaY = e.clientY - startY;
    const newTop = 94 - currentIndex * 50 + deltaY;
    container.style.top = newTop + "px";
  }, 16);
  
  container.addEventListener("mousemove", throttledMouseMove);

  const handleMouseEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    let currentTop = parseInt(container.style.top);
    if (isNaN(currentTop)) currentTop = 94 - currentIndex * 50;

    let newIndex = Math.round((94 - currentTop) / 50);
    currentIndex = Math.max(0, Math.min(newIndex, repeatedData.length - 1));

    // Adjusted infinite scroll boundaries for 3 repetitions
    if (currentIndex < exercisePickerData.length * 0.5) {
      currentIndex += exercisePickerData.length;
      container.style.transition = "none";
      updatePosition(currentIndex);
      setTimeout(() => {
        container.style.transition = "top 0.3s";
      }, 50);
    } else if (currentIndex >= exercisePickerData.length * 2.5) {
      currentIndex -= exercisePickerData.length;
      container.style.transition = "none";
      updatePosition(currentIndex);
      setTimeout(() => {
        container.style.transition = "top 0.3s";
      }, 50);
    }

    container.style.transition = "top 0.3s";
    updatePosition(currentIndex);
  };

  container.addEventListener("mouseup", handleMouseEnd);
  container.addEventListener("mouseleave", handleMouseEnd);

  container.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.deltaY > 0) {
      currentIndex++;
    } else {
      currentIndex--;
    }

    currentIndex = Math.max(0, Math.min(currentIndex, repeatedData.length - 1));

    if (currentIndex < exercisePickerData.length * 0.5) {
      currentIndex += exercisePickerData.length;
    } else if (currentIndex >= exercisePickerData.length * 2.5) {
      currentIndex -= exercisePickerData.length;
    }

    container.style.transition = "top 0.2s ease-out";
    updatePosition(currentIndex);
  });
  updatePosition(currentIndex);
}

function showLoadingModal(callback) {
  const modalEl = document.getElementById("loadingModal");
  if (!modalEl) {
    if (callback) callback();
    return;
  }

  const loadingModal = new bootstrap.Modal(modalEl, {
    backdrop: false,
    keyboard: false,
  });
  
  loadingModal.show();
  
  setTimeout(() => {
    loadingModal.hide();
    if (callback) callback();
  }, 2000);
}

function cancelExerciseTimePicker() {
  const overlay = document.getElementById("exerciseTimePickerOverlay");
  overlay.style.display = "none";
  overlay.removeEventListener('click', handleExerciseModalOutsideClick);
  const exerciseSwitch = document.getElementById("exerciseautoModeSwitch");
  exerciseSwitch.checked = false;
  localStorage.setItem("exerciseautoModeSwitch", "false");
}

function confirmExerciseTimePicker() {
  const overlay = document.getElementById("exerciseTimePickerOverlay");
  overlay.style.display = "none";
  overlay.removeEventListener('click', handleExerciseModalOutsideClick);
  localStorage.setItem("exerciseautoModeSwitch", "true");
  localStorage.setItem("exerciseSelectedMinutes", exerciseSelectedMinutes);
  console.log("Selected minutes:", exerciseSelectedMinutes);

  showLoadingModal(() => {
    openStopwatchScreen();
  });
}

let stopwatchInterval = null;
let stopwatchSeconds = 0;
let totalExerciseSeconds = 0;
let isStopwatchRunning = false;
let stopwatchSessions = 0;

function openStopwatchScreen() {
  document
    .querySelectorAll(".screen")
    .forEach((s) => (s.style.display = "none"));

  const stopWatchScreen = document.getElementById("stopWatchScreen");
  const header = document.querySelector("header");
  
  if (stopWatchScreen) {
    stopWatchScreen.style.display = "flex";
    stopWatchScreen.style.position = "absolute";
    stopWatchScreen.style.top = "0";
    stopWatchScreen.style.left = "0";
    stopWatchScreen.style.width = "100%";
    stopWatchScreen.style.height = "100%";
    stopWatchScreen.style.zIndex = "9999";
    
    if (header) {
      header.style.display = "block";
      header.style.position = "relative";
      header.style.zIndex = "10000";
    }
    
    loadExerciseMinutes();
  }
}

function loadExerciseMinutes() {
  const savedMinutes = localStorage.getItem("exerciseSelectedMinutes");
  if (savedMinutes) {
    document.getElementById("exerciseMinutes").textContent = savedMinutes;
    stopwatchSeconds = parseInt(savedMinutes) * 60;
    totalExerciseSeconds = stopwatchSeconds;
    updateStopwatchDisplay();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    createMinuteMarks();
    loadExerciseMinutes();
  });
} else {
  createMinuteMarks();
  loadExerciseMinutes();
}

function createMinuteMarks() {
  const marksGroup = document.getElementById("minuteMarks");
  if (!marksGroup) return;

  marksGroup.innerHTML = "";

  for (let i = 0; i < 60; i++) {
    const angle = ((i * 6 - 90) * Math.PI) / 180;
    const innerRadius = i % 5 === 0 ? 120 : 125;
    const outerRadius = 130;

    const x1 = 140 + innerRadius * Math.cos(angle);
    const y1 = 140 + innerRadius * Math.sin(angle);
    const x2 = 140 + outerRadius * Math.cos(angle);
    const y2 = 140 + outerRadius * Math.sin(angle);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", i % 5 === 0 ? "#999" : "#ccc");
    line.setAttribute("stroke-width", i % 5 === 0 ? "2" : "1");

    marksGroup.appendChild(line);
  }
}

function toggleStopwatch() {
  const btn = document.getElementById("stopwatchControlBtn");
  const btnIcon = btn.querySelector("div");

  if (isStopwatchRunning) {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    btnIcon.style.background = "#1b4a91";
    btnIcon.style.borderRadius = "4px";
    btnIcon.style.width = "24px";
    btnIcon.style.height = "24px";
  } else {
    isStopwatchRunning = true;
    btnIcon.style.background = "#FF3B30";
    btnIcon.style.borderRadius = "2px";
    btnIcon.style.width = "20px";
    btnIcon.style.height = "20px";

    stopwatchInterval = setInterval(() => {
      if (stopwatchSeconds > 0) {
        stopwatchSeconds--;
        updateStopwatchDisplay();

        if (stopwatchSeconds === 0) {
          clearInterval(stopwatchInterval);
          isStopwatchRunning = false;
          btnIcon.style.background = "#1b4a91";
          btnIcon.style.borderRadius = "4px";
          btnIcon.style.width = "24px";
          btnIcon.style.height = "24px";
          alert("انتهى وقت التمرين!");
        }
      }
    }, 1000);
  }
}

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchSeconds / 3600);
  const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
  const seconds = stopwatchSeconds % 60;

  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
  document.getElementById("stopwatchTime").textContent = timeStr;
}

function updateStopwatchStats() {
  const totalMinutes = Math.floor(stopwatchSeconds / 60);
  document.getElementById(
    "stopwatchStats"
  ).textContent = `المجموع ${stopwatchSessions} • ${totalMinutes} دقيقة`;
}

function closestopwatch() {
  document.getElementById("confclose").style.display = "flex";
}

function cancelCloseStopwatch() {
  document.getElementById("confclose").style.display = "none";
}

function confirmCloseStopwatch() {
  document.getElementById("confclose").style.display = "none";
  document.getElementById("stopWatchScreen").style.display = "none";

  const automodeScreen = document.querySelector('[screen="screen-Automode"]');
  if (automodeScreen) {
    automodeScreen.style.display = "block";
  }

  if (isStopwatchRunning) {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    const btn = document.getElementById("stopwatchControlBtn");
    const btnIcon = btn.querySelector("div");
    btnIcon.style.background = "#1b4a91";
    btnIcon.style.borderRadius = "4px";
    btnIcon.style.width = "24px";
    btnIcon.style.height = "24px";
  }

  const savedMinutes = localStorage.getItem("exerciseSelectedMinutes");
  if (savedMinutes) {
    stopwatchSeconds = parseInt(savedMinutes) * 60;
  } else {
    stopwatchSeconds = 0;
  }
  updateStopwatchDisplay();
}

function showOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.add("active");
  }
}

function hideOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.remove("active");
  }
}

function checkRequiredFields() {
  const pumpPaired = localStorage.getItem("pump-pairing") === "true";
  if (!pumpPaired) {
    showConfirmationModal("لم يتم إقتران مضخة الانسولين, لا يمكن تمكين الوضع التلقائي");
    return false;
  }

  const insulinQaedy = localStorage.getItem("insulin-qaedy") === "true";
  if (!insulinQaedy) {
    showConfirmationModal("يرجى ضبط القاعدي");
    return false;
  }

  // Check glucose limits
  const glucoseLimitsCleared = localStorage.getItem("glucose_limits_v2_cleared") === "true";
  if (!glucoseLimitsCleared) {
    showConfirmationModal("يرجى ضبط معامل حساسية الأنسولين");
    return false;
  }

  const activeTimeSelected = localStorage.getItem("active_time_selected") === "true";
  if (!activeTimeSelected) {
    showConfirmationModal("يرجى ضبط معامل الإنسولين النشط");
    return false;
  }

  // Check daily dose selection
  const dailyDoseSelected = localStorage.getItem("daily_dose_selected") === "true";
  if (!dailyDoseSelected) {
    showConfirmationModal("يرجى ضبط اجمالي كمية الأنسولين اليومية");
    return false;
  }

  // Check CGMS pairing
  const cgmsPaired = localStorage.getItem("cgms_paired") === "true";
  if (!cgmsPaired) {
    showConfirmationModal("يرجى إقران نظام المراقبة المستمرة للجلوكوز");
    return false;
  }

  // All checks passed, proceed to screen2
  return true;
}

// Function to show confirmation modal with custom message
function showConfirmationModal(message) {
  const modal = document.getElementById("confirmautomode");
  if (modal) {
    // Update the message in the modal
    const modalTitle = modal.querySelector(".modal-title");
    if (modalTitle) {
      modalTitle.textContent = message;
    }

    // Show the modal
    modal.classList.add("active");

    // Add click handler for the "نعم" button to close modal
    const yesButton = modal.querySelector(".btn-primary");
    if (yesButton) {
      const originalClick = yesButton.onclick;
      yesButton.onclick = function() {
        modal.classList.remove("active");
        if (originalClick) originalClick();
      };
    }
  }
}

// Clear old default values on first load (one-time cleanup)
if (!localStorage.getItem("defaults_cleared")) {
  localStorage.removeItem("sensitivity_default");
  localStorage.removeItem("active_time");
  localStorage.removeItem("daily_dose");
  localStorage.removeItem("carb_ratio");
  localStorage.removeItem("upper_glucose_limit");
  localStorage.removeItem("lower_glucose_limit");
  localStorage.setItem("defaults_cleared", "true");
}

// Helper functions to check if each field has been selected
window.isSensitivitySelected = function() {
  return localStorage.getItem("sensitivity_selected") === "true";
}

window.isActiveTimeSelected = function() {
  return localStorage.getItem("active_time_selected") === "true";
}

window.isDailyDoseSelected = function() {
  return localStorage.getItem("daily_dose_selected") === "true";
}

// Function to reset selection status
window.resetFieldSelectionStatus = function(fieldType) {
  if (fieldType === "sensitivity") {
    localStorage.removeItem("sensitivity_selected");
    localStorage.removeItem("sensitivity_default");
  } else if (fieldType === "activeTime") {
    localStorage.removeItem("active_time_selected");
    localStorage.removeItem("active_time");
  } else if (fieldType === "dailyDose") {
    localStorage.removeItem("daily_dose_selected");
    localStorage.removeItem("daily_dose");
  }
}

// Function to get all selection statuses
window.getFieldSelectionStatus = function() {
  return {
    sensitivity: isSensitivitySelected(),
    activeTime: isActiveTimeSelected(),
    dailyDose: isDailyDoseSelected()
  };
}

// Load and update values from localStorage on page load
window.addEventListener("load", function () {
  // Sensitivity value
  const sensitivity = localStorage.getItem("sensitivity_default");
  const senValElements = document.querySelectorAll(".senVal");
  if (sensitivity && senValElements.length > 0) {
    senValElements.forEach((element) => {
      element.textContent = sensitivity + " mg/dl/u";
      element.classList.remove("default-value");
      element.classList.add("selected-value");
    });
  }

  // Active insulin time
  const activeTime = localStorage.getItem("active_time");
  const actInElements = document.querySelectorAll(".actIn");
  if (activeTime && actInElements.length > 0) {
    actInElements.forEach((element) => {
      element.textContent = activeTime + " ساعة";
      element.classList.remove("default-value");
      element.classList.add("selected-value");
    });
  }

  // Daily dose - check if there's a saved value
  const dailyDose = localStorage.getItem("daily_dose");
  const dailyDoseElements = document.querySelectorAll(".dailyDose");
  if (dailyDose && dailyDoseElements.length > 0) {
    dailyDoseElements.forEach((element) => {
      element.textContent = dailyDose + " وحدة";
      element.classList.remove("default-value");
      element.classList.add("selected-value");
    });
  }

  // CGMS Paired Status
  const cgmsPaired = localStorage.getItem("cgms_paired");
  const cgmsPairedStatusElement = document.getElementById("cgmsPairedStatus");
  if (cgmsPairedStatusElement) {
    if (cgmsPaired === "true") {
      cgmsPairedStatusElement.textContent = "مقترن";
      cgmsPairedStatusElement.classList.add("text-primary");
      cgmsPairedStatusElement.classList.remove("text-muted");
    } else {
      cgmsPairedStatusElement.textContent = "غير مقترن";
      cgmsPairedStatusElement.classList.remove("text-primary");
      cgmsPairedStatusElement.classList.add("text-muted");
    }
  }

  // Basal Status
  const insulinQaedy = localStorage.getItem("insulin-qaedy");
  const basalStatusElement = document.getElementById("basalStatus");
  if (basalStatusElement) {
    if (insulinQaedy === "true") {
      basalStatusElement.textContent = "تعيين";
      basalStatusElement.style.color = "rgb(27, 82, 164)";
    } else {
      basalStatusElement.textContent = "غير محدد";
      basalStatusElement.style.color = "#7b7b7b";
    }
  }

  // Override hideModal function after all scripts are loaded
  setTimeout(function () {
    const originalHideModal = window.hideModal;
    window.hideModal = function (modalId) {
      if (modalId === "dailyDoseModal") {
        const picker = document.getElementById("dailyDosePicker");
        const selectedItem = picker?.querySelector(".picker-item.selected");
        if (selectedItem) {
          const value = selectedItem.textContent.trim();
          const dailyDoseElements = document.querySelectorAll(".dailyDose");
          if (dailyDoseElements.length > 0 && value) {
            dailyDoseElements.forEach((element) => {
              element.textContent = value + " وحدة";
              element.classList.remove("default-value");
              element.classList.add("selected-value");
            });
            localStorage.setItem("daily_dose", value);
            localStorage.setItem("daily_dose_selected", "true");
          }
        }
      }

      if (originalHideModal) {
        originalHideModal(modalId);
      }
    };
  }, 100);
});
