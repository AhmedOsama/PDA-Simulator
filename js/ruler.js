/*
 * @Desc: slide ruler
 * @Author: simbawu
 * @Date: 2019-04-16 20:15:13
 * @LastEditors: simbawu
 * @LastEditTime: 2019-08-07 14:00:00
 */
(function () {
  class sliderRuler {
    constructor(options = {}) {
      this.value = "";
      this.options = {
        canvasWidth:
          document.getElementsByClassName("phone-container")?.offsetWidth ||
          480,
        canvasHeight: 83,
        boxColor: "#E4E4E4",
        scrollLeft: 0,
        heightDecimal: 35,
        heightDigit: 18,
        lineWidth: 2,
        colorDecimal: "#555",
        colorDigit: "#E4E4E4",
        divide: 10,
        precision: 1,
        fontSize: 20,
        fontColor: "#666",
        fontMarginTop: 35,
        maxValue: 230,
        minValue: 100,
        currentValue: 160,
        borderColoring: [], // [{start:1, end:10, color:'#333'}, {start:10,end:50,color:'red'}]
      };

      this.localState = {
        startX: 0,
        startY: 0,
        isTouchEnd: true,
        touchPoints: [],
      };

      this.browserEnv = window.hasOwnProperty("ontouchstart");

      this.options = {
        ...this.options,
        ...options,
      };

      this.init(this.options);
      this.setValue = this.setValue.bind(this);
      this.getCurrentBorderColor = this.getCurrentBorderColor.bind(this);
    }

    _renderBox(container) {
      const box = document.createElement("div"),
        canvas = document.createElement("canvas");
      this.canvas = canvas;
      box.className = "box";
      box.appendChild(canvas);
      container.appendChild(box);
      this._renderCanvas();
    }

    _renderCanvas() {
      const { canvasWidth, canvasHeight } = this.options,
        canvas = this.canvas;
      canvas.width = canvasWidth * 2;
      canvas.height = canvasHeight * 2;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.className = "canvas";
      if (this.browserEnv) {
        canvas.addEventListener('touchstart', this.touchStart.bind(this), { passive: false });
        canvas.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
        canvas.addEventListener('touchend', this.touchEnd.bind(this), { passive: false });
      } else {
        canvas.onmousedown = this.touchStart.bind(this);
        canvas.onmousemove = this.touchMove.bind(this);
        canvas.onmouseup = this.touchEnd.bind(this);
      }
      this.dreawCanvas();
    }

    touchStart(e) {
      e.preventDefault();
      if (e || this.localState.isTouchEnd) {
        this.touchPoints(e);
        let touch = (e.touches && e.touches[0]) || e;
        this.localState.startX = touch.pageX;
        this.localState.startY = touch.pageY;
        this.localState.startT = new Date().getTime();
        this.localState.isTouchEnd = false;
      }
    }

    touchMove(e) {
      if (!this.browserEnv && (e.which !== 1 || e.buttons === 0)) return;
      this.touchPoints(e);
      let touch = (e.touches && e.touches[0]) || e,
        deltaX = touch.pageX - this.localState.startX,
        deltaY = touch.pageY - this.localState.startY;
      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(Math.round(deltaX / this.options.divide)) > 0
      ) {
        if (this.browserEnv && !this.rebound(deltaX)) {
          return;
        }
        this.moveDreaw(deltaX);
        this.localState.startX = touch.pageX;
        this.localState.startY = touch.pageY;
      }
    }

    touchEnd() {
      this.moveDreaw(this.browserEnv ? this.inertialShift() : 0);
      this.localState.isTouchEnd = true;
      this.localState.touchPoints = [];
      this.canvas.style.transform = "translate3d(0, 0, 0)";
    }

    touchPoints(e) {
      let touch = (e.touches && e.touches[0]) || e,
        time = new Date().getTime(),
        shift = touch.pageX;
      this.localState.touchPoints.push({
        time: time,
        shift: shift,
      });
    }

    inertialShift() {
      let s = 0;
      if (this.localState.touchPoints.length >= 4) {
        let _points = this.localState.touchPoints.slice(-4),
          v =
            ((_points[3].shift - _points[0].shift) /
              (_points[3].time - _points[0].time)) *
            1000;
        const a = 6000;
        s = (Math.sign(v) * Math.pow(v, 2)) / (2 * a);
      }
      return s;
    }

    rebound(deltaX) {
      const { currentValue, maxValue, minValue } = this.options;
      if (
        (currentValue === minValue && deltaX > 0) ||
        (currentValue === maxValue && deltaX < 0)
      ) {
        let reboundX =
          Math.sign(deltaX) * 1.5988 * Math.pow(Math.abs(deltaX), 0.7962);
        this.canvas.style.transform = `translate3d(${reboundX}px, 0, 0)`;
        return false;
      }
      return true;
    }

    moveDreaw(shift) {
      const { divide, precision } = this.options;
      let moveValue = Math.round(-shift / divide),
        _moveValue = Math.abs(moveValue),
        draw = () => {
          if (_moveValue < 1) {
            return;
          }
          this.options.currentValue += Math.sign(moveValue) * precision;
          this.dreawCanvas();
          window.requestAnimationFrame(draw);
          _moveValue--;
        };

      draw();
    }

    dreawCanvas() {
      const canvas = this.canvas,
        context = canvas.getContext("2d");
      canvas.height = canvas.height;
      let {
        canvasWidth,
        canvasHeight,
        maxValue,
        minValue,
        currentValue,
        handleValue,
        precision,
        divide,
        heightDecimal,
        heightDigit,
        lineWidth,
        colorDecimal,
        colorDigit,
        fontSize,
        fontColor,
        fontMarginTop,
        borderColoring,
      } = this.options;

      currentValue =
        currentValue > minValue
          ? currentValue < maxValue
            ? currentValue
            : maxValue
          : minValue;
      currentValue =
        (Math.round((currentValue * 10) / precision) * precision) / 10;
      this.options.currentValue = currentValue;
      handleValue && handleValue(currentValue);

      let diffCurrentMin = ((currentValue - minValue) * divide) / precision,
        startValue =
          currentValue - Math.floor(canvasWidth / 2 / divide) * precision;
      startValue =
        startValue > minValue
          ? startValue < maxValue
            ? startValue
            : maxValue
          : minValue;
      let endValue = startValue + (canvasWidth / divide) * precision;
      endValue = endValue < maxValue ? endValue : maxValue;

      let origin = {
        x:
          diffCurrentMin > canvasWidth / 2
            ? (canvasWidth / 2 -
                ((currentValue - startValue) * divide) / precision) *
              2
            : (canvasWidth / 2 - diffCurrentMin) * 2,
        y: canvasHeight * 2,
      };

      heightDecimal = heightDecimal * 2;
      heightDigit = heightDigit * 2;
      lineWidth = lineWidth * 2;
      fontSize = fontSize * 2;
      fontMarginTop = fontMarginTop * 2;
      divide = divide * 2;
      const derivative = 1 / precision;

      // draw ticks and numbers
      // Ensure we iterate through the visible range properly
      const startIter = Math.floor(startValue / precision);
      const endIter = Math.ceil(endValue / precision);
      
      for (let i = startIter; i <= endIter; i++) {
        const value = i * precision;
        if (value < minValue || value > maxValue) continue;
        
        const xPos = origin.x + ((value - startValue) / precision) * divide;
        
        // Only draw if within canvas bounds
        if (xPos < 0 || xPos > canvasWidth * 2) continue;
        
        context.beginPath();
        context.moveTo(xPos, 0);
        context.lineTo(
          xPos,
          i % 10 === 0 ? heightDecimal : heightDigit
        );
        context.lineWidth = lineWidth;
        context.strokeStyle = i % 10 === 0 ? colorDecimal : colorDigit;
        context.stroke();
        context.closePath();

        // Draw numbers for multiples of 10
        if (i % 10 === 0) {
          context.fillStyle = colorDecimal;
          context.textAlign = "center";
          context.textBaseline = "top";
          context.font = `${fontSize}px Arial`;
          const labelText = Math.round(value).toString();
          context.fillText(
            labelText,
            xPos,
            fontMarginTop
          );
        }
      }

      // draw top border coloring
      if (borderColoring && borderColoring.length > 0) {
        borderColoring.forEach((seg) => {
          const sVal = Math.max(seg.start, minValue);
          const eVal = Math.min(seg.end, maxValue);
          if (sVal >= eVal) return;

          const sX = origin.x + ((sVal - startValue) / precision) * divide;
          const eX = origin.x + ((eVal - startValue) / precision) * divide;

          context.beginPath();
          context.moveTo(sX, 0);
          context.lineTo(eX, 0);
          context.lineWidth = 20; // thickness of border
          context.strokeStyle = seg.color;
          context.stroke();
          context.closePath();
        });
      }
    }

    init(options) {
      this._renderBox(options.el);
    }
    setValue(val) {
      // clamp between min and max
      const { minValue, maxValue, precision } = this.options;
      let newVal = Math.min(Math.max(val, minValue), maxValue);

      // snap to precision
      newVal = Math.round(newVal / precision) * precision;

      this.options.currentValue = newVal;
      this.dreawCanvas();
    }
    getCurrentBorderColor() {
      const { currentValue, borderColoring } = this.options;
      if (!borderColoring || borderColoring.length === 0) return null;

      const segment = borderColoring.find(
        (seg) => currentValue >= seg.start && currentValue <= seg.end
      );

      return segment ? segment.color : null;
    }
  }

  // expose globally
  window.sliderRuler = sliderRuler;

  document.querySelectorAll('[hasRuller="true"]').forEach((el, idx) => {
    var value = localStorage.getItem(el.id.replace("_ruler", "") + "_value");
    if (
      value &&
      value !== "null" &&
      value !== "undefined" &&
      document.getElementById(el.id.replace("_ruler", "") + "_value")
    ) {
      document.getElementById(
        el.id.replace("_ruler", "") + "_value"
      ).innerText = value;
    }    if (
      value &&
      value !== "null" &&
      value !== "undefined" &&
      document.getElementById(el.id.replace("_ruler", "") + "_value_preview")
    ) {
      document.getElementById(
        el.id.replace("_ruler", "") + "_value_preview"
      ).innerText = value;
    }
    if (!value || value == "null" || value == "undefined") {
      value = document.getElementById(
        el.id.replace("_ruler", "") + "_value"
      ).innerText;
    }
    // If value is still invalid, use currentValue attribute or middle of range
    // But don't update the preview element - only use it for ruler position
    var initialValue = value;
    if (!value || value == "null" || value == "undefined" || value == "غير محدد" || value == "--") {
      const minVal = parseFloat(el.getAttribute("minValue") || 0);
      const maxVal = parseFloat(el.getAttribute("maxValue") || 100);
      value = el.getAttribute("currentValue") || ((minVal + maxVal) / 2);
    }
    // Ensure value is a number
    value = parseFloat(value) || 0;
    el.dir = "ltr";
    el.style.direction = "ltr";
    var hasStoredValue = initialValue && initialValue !== "null" && initialValue !== "undefined" && initialValue !== "غير محدد" && initialValue !== "--";
    const ruler = new sliderRuler({
      el: el,
      minValue: parseFloat(el.getAttribute("minValue") || 0),
      maxValue: parseFloat(el.getAttribute("maxValue") || 100),
      currentValue: value,
      borderColoring: JSON.parse(el.getAttribute("borderColoring") || "[]"),
      divide: parseFloat(el.getAttribute("divide") || 10),
      precision: parseFloat(el.getAttribute("precision") || 1),
      handleValue: (val) => {
        if (el._ruler) {
          el.style.setProperty(
            "--ruler-border-color",
            el._ruler.getCurrentBorderColor() || "#E4E4E4"
          );
        }

        // Always show the current value and color in the preview/value elements
        const previewEl = document.getElementById(
          el.id.replace("_ruler", "") + "_value_preview"
        );
        if (previewEl) {
          previewEl.innerText = val;
          if (el._ruler) {
            previewEl.style.setProperty(
              "color",
              el._ruler.getCurrentBorderColor() || "#000"
            );
          }
        }

        const valueEl = document.getElementById(
          el.id.replace("_ruler", "") + "_value"
        );
        if (valueEl) {
          valueEl.innerText = val;
          if (el._ruler) {
            valueEl.style.setProperty(
              "color",
              el._ruler.getCurrentBorderColor() || "#000"
            );
          }
        }

        // Don't update any other preview classes here – closeModalMs handles final formatting
      },
    });
    el._ruler = ruler;
    
    // Force initial canvas redraw to ensure tick labels are visible
    if (el._ruler && el._ruler.canvas) {
      setTimeout(() => {
        el._ruler.dreawCanvas();
      }, 0);
    }
    
    // Mark as user interacted when they touch/drag the ruler
    el.addEventListener('touchstart', function() {
      el._userInteracted = true;
    });
    el.addEventListener('mousedown', function() {
      el._userInteracted = true;
    });
    
    // Initialize display values after ruler is created (only once)
    if (el._ruler && !el._initialized) {
      el._initialized = true;
      const currentVal = el._ruler.options.currentValue;
      const borderColor = el._ruler.getCurrentBorderColor() || "#000";
      
      el.style.setProperty("--ruler-border-color", borderColor);
      
      const previewEl = document.getElementById(
        el.id.replace("_ruler", "") + "_value_preview"
      );
      if (previewEl) {
        previewEl.innerText = currentVal;
        previewEl.style.setProperty("color", borderColor);
      }

      const valueEl = document.getElementById(
        el.id.replace("_ruler", "") + "_value"
      );
      if (valueEl) {
        valueEl.innerText = currentVal;
        valueEl.style.setProperty("color", borderColor);
      }
    }
  });

  document
    .querySelectorAll("button.btn.increment[target]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        const targetId = button.getAttribute("target");
        const targetElement = document.getElementById(
          targetId + "_value_preview"
        );
        const targetRuler = document.getElementById(targetId + "_ruler")._ruler;
        if (targetRuler) {
          targetRuler.setValue(parseInt(targetElement.textContent || "0") + 1);
        }
      });
    });
  document
    .querySelectorAll("button.btn.decrement[target]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        const targetId = button.getAttribute("target");
        const targetElement = document.getElementById(
          targetId + "_value_preview"
        );
        const targetRuler = document.getElementById(targetId + "_ruler")._ruler;
        if (targetRuler) {
          targetRuler.setValue(parseInt(targetElement.textContent || "0") - 1);
        }
      });
    });
})();

// export default sliderRuler;
