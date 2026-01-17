# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical Pump Simulator (Pancares) - A web-based educational simulator for an insulin pump management system ("EQUAL" insulin pump). This is a vanilla HTML/CSS/JavaScript application that simulates a medical device interface for training and demonstration purposes.

**Language:** Arabic (RTL) with full bidirectional text support

## Running the Application

**Local Server (Recommended):**
```bash
python -m http.server 8080
# Then visit: http://localhost:8080/login.html
```

**Windows:**
```batch
start.bat
```

**VSCode Live Server:** Port 5509

**Standalone:** Open `login.html` directly (note: page transitions will flicker)

## Architecture

### State Management

The application uses **LocalStorage** for all state persistence. Key state values:
- `pump-pairing` - Pump device pairing status (true/false)
- `cgms_paired` - Continuous Glucose Monitoring System pairing (true/false)
- `autoModeSwitch` - Automatic insulin delivery mode (true/false)
- `insulin-qaedy` - Insulin settings enabled (true/false)
- `activeTab` - Current active screen

### Shared Rules System (`js/shared-rules.js`)

Central state validation that enforces business rules across all pages:
- Intercepts `localStorage.setItem()` to enforce cross-page dependencies
- **Critical Rule:** If pump is not paired, insulin settings must be disabled
- Auto mode requires: pump paired + insulin settings + CGMS paired + glucose limits + active time + daily dose
- Dispatches `storageRulesChanged` and `sharedRulesUpdate` custom events for cross-page updates

### Key JavaScript Components

| File | Purpose |
|------|---------|
| `js/control-screen.js` | Reusable device status panel component |
| `js/keyboard.js` | Virtual Arabic/English keyboard |
| `js/m-select.js` | Mobile-style scrollable picker (transpiled) |
| `js/ruler.js` | Canvas-based horizontal slider ruler |
| `js/smooth-navigation.js` | Cross-fade page transitions |
| `js/modal-handler.js` | Universal modal management |

### Page Structure

Entry point is `login.html`. Main screens include:
- `pda-mode.html` - Main dashboard
- `CGMS.html` - Glucose sensor management
- `automatic-mode.html` - Auto insulin delivery settings
- `basal.html` - Background insulin rates
- `bolus.html` - Meal-time insulin dosing
- `insulin-sensitivity.html` - Correction factors
- `general-settings.html` - Device configuration

### UI Patterns

- **Screen switching:** Pages use `[screen]` data attributes for internal navigation
- **Selectable items:** Use `[selectable]` data attribute for picker items
- **Virtual keyboard targets:** Use `.virtual-keyboard-input` class
- **Modal system:** Bootstrap modals + custom `.modal-overlay` elements

### CSS Structure

- `css/app.css` - Main styles (133KB)
- `css/keyboard.css` - Virtual keyboard styles
- `css/switches-fix.css` - Toggle switch overrides

**Key CSS conventions:**
- Phone container: 480px max-width, 800px height
- Base zoom: 60% for device simulation
- Uses Bootstrap 5.3.0 + Tailwind CSS (CDN)

## Tech Stack

- Vanilla JavaScript (ES6+)
- Bootstrap 5.3.0
- Tailwind CSS (CDN)
- Font Awesome 6.4.0
- Google Fonts (Noto Naskh Arabic)
- Python HTTP server (for local development)

No build process, npm, or external dependencies required.
