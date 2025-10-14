document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll(".virtual-keyboard-input").length !== 0) {
    initVirtualKeyboard();
  }
});

function initVirtualKeyboard() {
  if (document.getElementById("keyboard-container")) {
    return;
  }
  const keyboardContainer = document.createElement("div");
  keyboardContainer.id = "keyboard-container";
  keyboardContainer.innerHTML = `
    <div id="hide-keyboard-btn">
      <div class="keyboard-hide-arrow"></div>
    </div>
    <div id="keyboard"></div>
  </div>`;
  document.body
    .getElementsByClassName("phone-container")[0]
    .appendChild(keyboardContainer);
  new VirtualKeyboard();
}
class VirtualKeyboard {
  constructor() {
    this.activeInput = null;
    this.keyboardLayouts = {
      alpha: [
        ["A", "B", "C", "D", "E", "F", "G", "H"],
        ["I", "J", "K", "L", "M", "N", "O", "P"],
        ["Q", "R", "S", "T", "U", "V", "W", "X"],
        ["123", "Y", "Z", "BACKSPACE"],
      ],
      numeric: [
        ["1", "2", "3", "4", "5", "6", "7", "8"],
        ["9", "0", "@", "#", "$", "%", "&", "*"],
        ["_", "-", "+", "(", ")", '"', "'", ":"],
        ["ABC", ";", "!", "?", "BACKSPACE"],
      ],
    };
    this.elements = this.getDOMElements();
    this.init();
  }

  init() {
    this.generateKeyboard("alpha");
    this.addEventListeners();
    this.applyForcedStyles();
  }

  getDOMElements() {
    const ids = [
      "keyboard-container",
      "keyboard",
      "hide-keyboard-btn",
      "action-footer",
      "cancel-btn",
      "scan-btn",
    ];
    const elements = {};
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const camelCaseId = id.replace(/-(\w)/g, (_match, p1) =>
          p1.toUpperCase()
        );
        elements[camelCaseId] = el;
      }
    });
    return elements;
  }

  applyForcedStyles() {
    // Apply exact CGMS styling with forced application
    document.querySelectorAll(".text-gray-400").forEach((el) => {
      el.style.color = "rgb(231, 231, 231)";
    });

    document.querySelectorAll(".text-sm").forEach((el) => {
      el.style.fontSize = "1.075rem";
      el.style.lineHeight = "1.25rem";
    });

    document.querySelectorAll(".text-left").forEach((el) => {
      el.style.textAlign = "right";
    });

    document.querySelectorAll(".space-x-1\\.5").forEach((container) => {
      const children = Array.from(container.children).filter(
        (child) => child.style.display !== "none"
      );
      children.forEach((child, index) => {
        if (index > 0) {
          child.style.marginLeft = "0.05rem";
          child.style.marginRight = "0";
        }
      });
    });

    document.querySelectorAll(".justify-end").forEach((el) => {
      el.style.justifyContent = "flex-start";
    });

    document.querySelectorAll(".text-lg").forEach((el) => {
      el.style.fontSize = "1.125rem";
      el.style.lineHeight = "2.75rem";
    });

    document.querySelectorAll(".pt-2").forEach((el) => {
      el.style.paddingTop = "-0.5rem";
    });
  }

  addEventListeners() {
    // Input focus events - CGMS style
    document.querySelectorAll(".virtual-keyboard-input").forEach((input) => {
      input.addEventListener("focus", () => {
        this.activeInput = input;
        this.showKeyboard();
      });
    });

    // Keyboard key clicks
    this.elements.keyboard.addEventListener("click", (e) => {
      const keyElement = e.target.closest(".keyboard-key");
      if (!keyElement) return;
      const key = keyElement.getAttribute("data-key");
      if (key) this.handleKeyPress(key);
    });

    // Hide keyboard button
    if (this.elements.hideKeyboardBtn) {
      this.elements.hideKeyboardBtn.addEventListener("click", () =>
        this.hideKeyboard()
      );
    }

    // Action buttons
    if (this.elements.cancelBtn) {
      this.elements.cancelBtn.addEventListener("click", () =>
        this.hideKeyboard()
      );
    }

    // Click outside to hide - CGMS style
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".virtual-keyboard-input") &&
        !e.target.closest("#keyboard-container") &&
        !e.target.getAttribute("data-key")
      ) {
        this.hideKeyboard();
      }
    });
  }

  handleKeyPress(key) {
    if (!this.activeInput) return;

    if (key === "BACKSPACE") {
      this.activeInput.value = this.activeInput.value.slice(0, -1);
    } else if (key === "123") {
      this.generateKeyboard("numeric");
    } else if (key === "ABC") {
      this.generateKeyboard("alpha");
    } else {
      this.activeInput.value += key;
    }
    if (this.activeInput.dataset.usernameInput === "true") {
      this.activeInput.textContent =
        this.activeInput.textContent || "غير محدد";
    }
    // Trigger input event for button state updates
    this.activeInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  generateKeyboard(layout) {
    const keyboardRows = this.keyboardLayouts[layout];
    this.elements.keyboard.innerHTML = keyboardRows
      .map(
        (row) =>
          `<div class="keyboard-row last">
                        ${row
                          .map((key) => {
                            let flexClass = "flex-1";
                            let specialClass =
                              key === "123" ||
                              key === "ABC" ||
                              key === "BACKSPACE"
                                ? "special"
                                : "";
                            if (
                              key === "BACKSPACE" ||
                              key === "123" ||
                              key === "ABC"
                            )
                              flexClass = "flex-grow-[1.5]";
                            let style = "";
                            if(key === "Y" || key === "Z") {
                              style = "style='max-width: 60px;'";
                            }
                            const icon =
                              '<svg style=" width: 5rem; fill: transparent;" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" d="M12.5 10.5L14 12M14 12L15.5 13.5M14 12L15.5 10.5M14 12L12.5 13.5M9.82843 16H17C17.9428 16 18.4142 16 18.7071 15.7071C19 15.4142 19 14.9428 19 14V10C19 9.05719 19 8.58579 18.7071 8.29289C18.4142 8 17.9428 8 17 8H9.82843C9.41968 8 9.2153 8 9.03153 8.07612C8.84776 8.15224 8.70324 8.29676 8.41421 8.58579L6.41421 10.5858C5.74755 11.2525 5.41421 11.5858 5.41421 12C5.41421 12.4142 5.74755 12.7475 6.41421 13.4142L8.41421 15.4142C8.70324 15.7032 8.84776 15.8478 9.03153 15.9239C9.2153 16 9.41968 16 9.82843 16Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/></svg>';

                            return `<button data-key="${key}" class="keyboard-key ${specialClass}" ${style}>${
                              key === "BACKSPACE" ? icon : key
                            }</button>`;
                          })
                          .join("")}
                    </div>`
      )
      .join("");

    // Apply CGMS styling exactly like the original
    this.elements.keyboard
      .querySelectorAll(".keyboard-key")
      .forEach((el) => {});
  }

  showKeyboard() {
    this.elements.keyboardContainer.classList.add("visible");
    if (this.elements.actionFooter) {
      this.elements.actionFooter.classList.add("hidden");
    }
    // Add cursor animation to active input - CGMS style
    if (this.activeInput) {
      this.activeInput.classList.add("has-cursor");
    }
  }

  hideKeyboard() {
    this.activeInput = null;
    this.elements.keyboardContainer.classList.remove("visible");
    if (this.elements.actionFooter) {
      this.elements.actionFooter.classList.remove("hidden");
    }
    // Remove cursor animation from all inputs - CGMS style
    document.querySelectorAll(".virtual-keyboard-input").forEach((input) => {
      input.classList.remove("has-cursor");
    });
  }
}
