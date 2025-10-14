function enhancedShowImage(src) {
  let container = document.getElementById("app-container");
  let overlay = document.createElement("div");
  overlay.id = "image-overlay";
  overlay.style.position = "absolute";
  overlay.style.top = "40px";
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "calc(100% - 40px)"; 
  overlay.style.background = "rgba(0,0,0,0.9)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;
  overlay.style.overflow = "hidden";

  let imageContainer = document.createElement("div");
  imageContainer.style.width = "320px";
  imageContainer.style.height = "320px";
  imageContainer.style.position = "relative";
  imageContainer.style.borderRadius = "20px";
  imageContainer.style.overflow = "hidden";
  imageContainer.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5)";
  imageContainer.style.border = "3px solid rgba(255,255,255,0.2)";
  imageContainer.style.animation = "containerPulse 2s ease-in-out infinite";

  let img = document.createElement("img");
  img.src = src;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.animation = "imageAnimation 3s ease-in-out infinite";

  let scanLine = document.createElement("div");
  scanLine.style.position = "absolute";
  scanLine.style.width = "100%";
  scanLine.style.height = "3px";
  scanLine.style.background = "linear-gradient(90deg, transparent, rgba(38,87,158,0.8), transparent)";
  scanLine.style.boxShadow = "0 0 20px rgba(38,87,158,0.6)";
  scanLine.style.animation = "scanLine 2s linear infinite";

  let dots = document.createElement("div");
  dots.style.position = "absolute";
  dots.style.bottom = "20px";
  dots.style.left = "50%";
  dots.style.transform = "translateX(-50%)";
  dots.style.display = "flex";
  dots.style.gap = "10px";
  
  for(let i = 0; i < 3; i++) {
    let dot = document.createElement("div");
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.background = "white";
    dot.style.animation = `dotPulse 1.5s ease-in-out ${i * 0.3}s infinite`;
    dots.appendChild(dot);
  }

  let scanText = document.createElement("div");
  scanText.style.position = "absolute";
  scanText.style.top = "20px";
  scanText.style.left = "50%";
  scanText.style.transform = "translateX(-50%)";
  scanText.style.color = "white";
  scanText.style.fontSize = "18px";
  scanText.style.fontWeight = "bold";
  scanText.style.textShadow = "0 2px 10px rgba(0,0,0,0.5)";
  scanText.style.animation = "textPulse 1.5s ease-in-out infinite";
  scanText.textContent = "جاري المسح الضوئي...";

  imageContainer.appendChild(img);
  imageContainer.appendChild(scanLine);
  overlay.appendChild(scanText);
  overlay.appendChild(imageContainer);
  overlay.appendChild(dots);
  container.appendChild(overlay);

  setTimeout(() => { 
    overlay.style.animation = "fadeOut 0.5s ease-out forwards";
    setTimeout(() => overlay.remove(), 500);
  }, 4000);

  if (!document.getElementById("cgms-scanner-styles")) {
    let style = document.createElement("style");
    style.id = "cgms-scanner-styles";
    style.innerHTML = `
      @keyframes containerPulse {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.02) rotate(1deg); }
        50% { transform: scale(1) rotate(0deg); }
        75% { transform: scale(1.02) rotate(-1deg); }
      }
      
      @keyframes imageAnimation {
        0%, 100% { 
          filter: brightness(1) contrast(1) saturate(1);
          transform: scale(1);
        }
        25% { 
          filter: brightness(1.1) contrast(1.05) saturate(1.1);
          transform: scale(1.05);
        }
        50% { 
          filter: brightness(0.95) contrast(1.1) saturate(0.9);
          transform: scale(1);
        }
        75% { 
          filter: brightness(1.05) contrast(1) saturate(1.05);
          transform: scale(1.03);
        }
      }
      
      @keyframes scanLine {
        0% { top: -3px; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      
      @keyframes dotPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }
      
      @keyframes textPulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

window.enhancedShowImage = enhancedShowImage;

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (typeof SensorPairingApp !== 'undefined' && SensorPairingApp.prototype) {
      SensorPairingApp.prototype.showImage = enhancedShowImage;
    }
  }, 100);
});
