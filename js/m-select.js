"use strict";
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}
function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _iterableToArray(iter) {
  if (
    (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) ||
    iter["@@iterator"] != null
  )
    return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i =
    arr == null
      ? null
      : (typeof Symbol !== "undefined" && arr[Symbol.iterator]) ||
        arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (obj) {
            return typeof obj;
          }
        : function (obj) {
            return obj &&
              "function" == typeof Symbol &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          }),
    _typeof(obj)
  );
}
var MobileSelect = (function () {
  "use strict";
  var S = Object.defineProperty;
  var D = function D(g, c, l) {
    return c in g
      ? S(g, c, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: l,
        })
      : (g[c] = l);
  };
  var h = function h(g, c, l) {
    return D(g, _typeof(c) != "symbol" ? c + "" : c, l), l;
  };
  function g() {
    // Always return false to use touch events (which also work with mouse)
    // This ensures both touch and mouse work on all browsers including Firefox
    return false;
  }
  var l = (function () {
    function l(t) {
      _classCallCheck(this, l);
      h(this, "mobileSelect");
      h(this, "trigger");
      h(this, "wheelList");
      h(this, "sliderList");
      h(this, "wheelsContain");
      h(this, "panel");
      h(this, "ensureBtn");
      h(this, "cancelBtn");
      h(this, "grayLayer");
      h(this, "popUp");
      h(this, "initPosition");
      h(this, "initColWidth");
      h(this, "wheelsData");
      h(this, "displayJson");
      h(this, "curValue");
      h(this, "curIndexArr");
      h(this, "isCascade");
      h(this, "isJsonType");
      h(this, "startY");
      h(this, "moveEndY");
      h(this, "moveY");
      h(this, "preMoveY");
      h(this, "offsetY");
      h(this, "offsetSum");
      h(this, "oversizeBorder");
      h(this, "enableClickStatus");
      h(this, "optionHeight");
      h(this, "curDistance");
      h(this, "cascadeJsonData");
      h(this, "eventHandleMap");
      h(this, "initDeepCount");
      h(this, "config");
      h(this, "separators");
      !l.checkRequiredConfig(t) ||
        ((this.config = Object.assign({}, l.defaultConfig, t)),
        (this.wheelsData = t.wheels),
        (this.separators = t.separators || []),
        (this.isJsonType = !1),
        (this.cascadeJsonData = []),
        (this.displayJson = []),
        (this.curValue = []),
        (this.curIndexArr = []),
        (this.isCascade = !1),
        this.startY,
        this.moveEndY,
        this.moveY,
        this.preMoveY,
        (this.offsetY = 0),
        (this.offsetSum = 0),
        this.oversizeBorder,
        (this.curDistance = []),
        (this.enableClickStatus = !1),
        (this.optionHeight = 0),
        (this.initPosition = t.position || []),
        (this.initColWidth = t.colWidth || []),
        this.init());
    }
    _createClass(
      l,
      [
        {
          key: "init",
          value: function init() {
            var _this = this;
            if (!this.checkTriggerAvailable()) return;
            var t = this.config;
            if (
              ((this.isJsonType = l.checkDataType(this.wheelsData)),
              this.renderComponent(this.wheelsData),
              (this.wheelList =
                this.mobileSelect.getElementsByClassName("ms-wheel")),
              (this.sliderList = this.mobileSelect.getElementsByClassName(
                "ms-select-container"
              )),
              (this.panel = this.mobileSelect.querySelector(".ms-panel")),
              (this.wheelsContain =
                this.mobileSelect.querySelector(".ms-wheels")),
              (this.ensureBtn = this.mobileSelect.querySelector(".ms-ensure")),
              (this.cancelBtn = this.mobileSelect.querySelector(".ms-cancel")),
              (this.grayLayer =
                this.mobileSelect.querySelector(".ms-gray-layer")),
              (this.popUp = this.mobileSelect.querySelector(".ms-content")),
              (this.optionHeight =
                this.mobileSelect.querySelector("li").offsetHeight),
              t.initValue && this.setTriggerInnerText(t.initValue),
              this.setStyle(t),
              (this.isCascade = this.checkCascade()),
              this.isCascade && this.initCascade(),
              t.initValue &&
                (this.initPosition = this.getPositionByInitValue()),
              this.initPosition.length < this.sliderList.length)
            ) {
              var e = this.sliderList.length - this.initPosition.length;
              for (var i = 0; i < e; i++) {
                this.initPosition.push(0);
              }
            }
            this.isCascade
              ? this.initPosition.forEach(function (e, i) {
                  _this.checkRange(i, _this.initPosition);
                })
              : this.setCurDistance(this.initPosition),
              (this.eventHandleMap = {
                cancelBtn: {
                  event: "click",
                  fn: function fn() {
                    var e, i, s, n;
                    _this.hide(),
                      (i = (e = _this.config).cancel) == null ||
                        i.call(e, _this.curIndexArr, _this.curValue, _this),
                      (n = (s = _this.config).onCancel) == null ||
                        n.call(s, _this.curValue, _this.curIndexArr, _this);
                  },
                },
                ensureBtn: {
                  event: "click",
                  fn: function fn() {
                    var e, i, s, n;
                    _this.hide(),
                      _this.optionHeight ||
                        (_this.optionHeight =
                          _this.mobileSelect.querySelector("li").offsetHeight),
                      _this.setTriggerInnerText(_this.getConnectedString()),
                      (_this.curIndexArr = _this.getIndexArr()),
                      (_this.curValue = _this.getCurValue()),
                      (i = (e = _this.config).callback) == null ||
                        i.call(e, _this.curIndexArr, _this.curValue, _this),
                      (n = (s = _this.config).onChange) == null ||
                        n.call(s, _this.curValue, _this.curIndexArr, _this);
                  },
                },
                trigger: {
                  event: "click",
                  fn: function fn() {
                    _this.show();
                  },
                },
                grayLayer: {
                  event: "click",
                  fn: function fn() {
                    return _this.hide();
                  },
               
                },
                popUp: {
                  event: "click",
                  fn: function fn(e) {
                    return e.stopPropagation();
                  },
                },
                panel: {
                  event: ["touchstart", "touchend", "touchmove", "mousedown", "mousemove", "mouseup", "mouseleave", "wheel"],
                  fn: function fn(e) {
                    return _this.touch(e);
                  },
                },
              }),
              this.registerEvents("add"),
              this.fixRowStyle(),
              t.autoFocus && this.show();
          },
        },
        {
          key: "checkTriggerAvailable",
          value: function checkTriggerAvailable() {
            var t = this.config;
            return (
              (this.trigger =
                t.trigger instanceof HTMLElement
                  ? t.trigger
                  : document.querySelector(t.trigger)),
              this.trigger
                ? !0
                : (l.log(
                    "error",
                    "trigger HTMLElement does not found on your document."
                  ),
                  !1)
            );
          },
        },
        {
          key: "getPositionByInitValue",
          value: function getPositionByInitValue() {
            var _this2 = this;
            var n;
            var _this$config = this.config,
              t = _this$config.keyMap,
              e = _this$config.connector,
              i = _this$config.initValue,
              s = (i == null ? void 0 : i.split(e)) || [];
            if (this.isJsonType) {
              var o = (n = this.wheelsData[0]) == null ? void 0 : n.data;
              return s.reduce(function (r, a) {
                var d;
                var u =
                  o == null
                    ? void 0
                    : o.findIndex(function (f) {
                        return f[t.value] == a;
                      });
                return (
                  r.push(u < 0 ? 0 : u),
                  (o = (d = o[u]) == null ? void 0 : d[t.childs]),
                  r
                );
              }, []);
            }
            return s.reduce(function (o, r, a) {
              var d, f;
              var u =
                (f = (d = _this2.wheelsData[a]) == null ? void 0 : d.data) ==
                null
                  ? void 0
                  : f.findIndex(function (m) {
                      return m == r;
                    });
              return o.push(u < 0 ? 0 : u), o;
            }, []);
          },
        },
        {
          key: "getConnectedString",
          value: function getConnectedString() {
            var t = "";
            for (var e = 0; e < this.wheelList.length; e++) {
              e == this.wheelList.length - 1
                ? (t += this.getInnerText(e))
                : (t += this.getInnerText(e) + this.config.connector);
            }
            return t;
          },
        },
        {
          key: "setTriggerInnerText",
          value: function setTriggerInnerText(t) {
            this.config.triggerDisplayValue && (this.trigger.textContent = t);
          },
        },
        {
          key: "setValue",
          value: function setValue(t) {
            var _this3 = this;
            if (!t || !t.length) return;
            if (
              (this.isJsonType && _typeof(t[0]) != "object") ||
              (!this.isJsonType && _typeof(t[0]) == "object")
            ) {
              l.log(
                "error",
                "The setValue() input format should be same with getValue(), like: ".concat(
                  JSON.stringify(this.getValue())
                )
              );
              return;
            }
            var e = this.config.keyMap;
            t.forEach(function (i, s) {
              var r;
              var n = _this3.isCascade
                  ? _this3.displayJson[s]
                  : (r = _this3.wheelsData[s]) == null
                  ? void 0
                  : r.data,
                o =
                  n == null
                    ? void 0
                    : n.findIndex(function (a) {
                        return _this3.isJsonType
                          ? i[e.id] == a[e.id] || i[e.value] == a[e.value]
                          : i == a;
                      });
              _this3.locatePosition(s, o);
            }),
              this.setTriggerInnerText(this.getConnectedString());
          },
        },
        {
          key: "setTitle",
          value: function setTitle(t) {
            this.mobileSelect.querySelector(".ms-title").innerHTML = t;
          },
        },
        {
          key: "setStyle",
          value: function setStyle(t) {
            if (
              (t.ensureBtnColor &&
                (this.ensureBtn.style.color = t.ensureBtnColor),
              t.cancelBtnColor &&
                (this.cancelBtn.style.color = t.cancelBtnColor),
              t.titleColor)
            ) {
              var e = this.mobileSelect.querySelector(".ms-title");
              e.style.color = t.titleColor;
            }
            if (
              (t.textColor &&
                ((this.panel = this.mobileSelect.querySelector(".ms-panel")),
                (this.panel.style.color = t.textColor)),
              t.titleBgColor)
            ) {
              var _e = this.mobileSelect.querySelector(".ms-btn-bar");
              _e.style.backgroundColor = t.titleBgColor;
            }
            if (t.bgColor) {
              this.panel = this.mobileSelect.querySelector(".ms-panel");
              var _e2 = this.mobileSelect.querySelector(".ms-shadow-mask");
              (this.panel.style.backgroundColor = t.bgColor),
                (_e2.style.background =
                  "linear-gradient(to bottom, " +
                  t.bgColor +
                  ", rgba(255, 255, 255, 0), " +
                  t.bgColor +
                  ")");
            }
            if (typeof t.maskOpacity == "number") {
              var _e3 = this.mobileSelect.querySelector(".ms-gray-layer");
              _e3.style.background = "rgba(0, 0, 0, " + t.maskOpacity + ")";
            }
          },
        },
        {
          key: "show",
          value: function show() {
            var t, e, i;
            this.mobileSelect.classList.add("ms-show"),
              (t = document.querySelector("body")) == null ||
                t.classList.add("ms-show"),
              typeof this.config.onShow == "function" &&
                ((i = (e = this.config).onShow) == null ||
                  i.call(e, this.curValue, this.curIndexArr, this));
          },
        },
        {
          key: "hide",
          value: function hide() {
            var t, e, i;
            this.mobileSelect.classList.remove("ms-show"),
              (t = document.querySelector("body")) == null ||
                t.classList.remove("ms-show"),
              typeof this.config.onHide == "function" &&
                ((i = (e = this.config).onHide) == null ||
                  i.call(e, this.curValue, this.curIndexArr, this));
          },
        },
        {
          key: "registerEvents",
          value: function registerEvents(t) {
            var _this4 = this;
            var _loop = function _loop() {
              var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                e = _Object$entries$_i[0],
                i = _Object$entries$_i[1];
              typeof i.event == "string"
                ? _this4[e]["".concat(t, "EventListener")](i.event, i.fn, {
                    passive: !1,
                  })
                : i.event.forEach(function (s) {
                    _this4[e]["".concat(t, "EventListener")](s, i.fn, {
                      passive: !1,
                    });
                  });
            };
            for (
              var _i = 0, _Object$entries = Object.entries(this.eventHandleMap);
              _i < _Object$entries.length;
              _i++
            ) {
              _loop();
            }
          },
        },
        {
          key: "destroy",
          value: function destroy() {
            var t, e;
            this.registerEvents("remove"),
              (e = (t = this.mobileSelect) == null ? void 0 : t.parentNode) ==
                null || e.removeChild(this.mobileSelect);
          },
        },
        {
          key: "getOptionsHtmlStr",
          value: function getOptionsHtmlStr(t) {
            var e = this.config.keyMap;
            var i = "";
            if (this.isJsonType)
              for (var s = 0; s < t.length; s++) {
                var n = t[s][e.id],
                  o = t[s][e.value];
                i += '<li data-id="'.concat(n, '">').concat(o, "</li>");
              }
            else
              for (var _s2 = 0; _s2 < t.length; _s2++) {
                i += "<li>" + t[_s2] + "</li>";
              }
            return i;
          },
        },
        {
          key: "renderComponent",
          value: function renderComponent(t) {
            (this.mobileSelect = document.createElement("div")),
              (this.mobileSelect.className = "ms-mobile-select"),
              (this.mobileSelect.innerHTML =
                '<div class="ms-gray-layer"></div>\n\
  <div class="ms-content">\n\
    <!-- Title bar stays on top -->\n\
    <div class="ms-title-bar">\n\
      <div class="ms-fix-width">\n\
        <div class="ms-title">'
                  .concat(
                    this.config.title || "",
                    '</div>\n\
      </div>\n\
    </div>\n\
\n\
    <!-- Panel -->\n\
    <div class="ms-panel">\n\
      <div class="ms-fix-width">\n\
        <div class="ms-wheels"></div>\n\
        <div class="ms-select-line"></div>\n\
        <div class="ms-shadow-mask"></div>\n\
      </div>\n\
    </div>\n\
\n\
    <!-- Footer with buttons -->\n\
    <div class="ms-footer-bar">\n\
      <div class="ms-fix-width">\n\
        <div class="ms-cancel">'
                  )
                  .concat(
                    this.config.cancelBtnText,
                    '</div>\n\
        <div class="ms-ensure">'
                  )
                  .concat(
                    this.config.ensureBtnText,
                    "</div>\n\
      </div>\n\
    </div>\n\
  </div>"
                  )),
              document
                .querySelector(".phone-container")
                .appendChild(this.mobileSelect);
            var e = "";
            for (var i = 0; i < t.length; i++) {
              (e += '<div class="ms-wheel" data-index="'.concat(
                i,
                '"><ul class="ms-select-container">'
              )),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += this.getOptionsHtmlStr(t[i].data)),
                (e += "</ul></div>");

              // Add separator if it exists and this is not the last wheel
              if (i < t.length - 1 && this.separators && this.separators[i]) {
                e +=
                  '<div class="ms-separator">' +
                  this.separators[i].replace(".", "•") +
                  "</div>";
              }
            }
            this.mobileSelect.querySelector(".ms-wheels").innerHTML = e;
          },
        },
        {
          key: "reRenderWheels",
          value: function reRenderWheels() {
            var t = this.wheelList.length - this.displayJson.length;
            if (t > 0)
              for (var e = 0; e < t; e++) {
                this.wheelsContain.removeChild(
                  this.wheelList[this.wheelList.length - 1]
                );
              }
            for (var _e4 = 0; _e4 < this.displayJson.length; _e4++) {
              if (this.wheelList[_e4])
                this.sliderList[_e4].innerHTML = this.getOptionsHtmlStr(
                  this.displayJson[_e4]
                );
              else {
                var i = document.createElement("div");
                (i.className = "ms-wheel"),
                  (i.innerHTML = '<ul class="ms-select-container">'.concat(
                    this.getOptionsHtmlStr(this.displayJson[_e4]),
                    "</ul>"
                  )),
                  i.setAttribute("data-index", _e4.toString()),
                  this.wheelsContain.appendChild(i);
              }
            }
          },
        },
        {
          key: "checkCascade",
          value: function checkCascade() {
            var e;
            var t = this.config.keyMap;
            if (this.isJsonType) {
              var i = this.wheelsData[0].data;
              for (var s = 0; s < i.length; s++) {
                if (
                  t.childs in i[s] &&
                  ((e = i[s][t.childs]) == null ? void 0 : e.length) > 0
                )
                  return (this.cascadeJsonData = this.wheelsData[0].data), !0;
              }
            }
            return !1;
          },
        },
        {
          key: "initCascade",
          value: function initCascade() {
            this.displayJson.push(this.cascadeJsonData),
              this.initPosition.length > 0
                ? ((this.initDeepCount = 0),
                  this.initCheckArrDeep(
                    this.cascadeJsonData[this.initPosition[0]]
                  ))
                : this.checkArrDeep(this.cascadeJsonData[0]),
              this.reRenderWheels();
          },
        },
        {
          key: "initCheckArrDeep",
          value: function initCheckArrDeep(t) {
            if (t) {
              var e = this.config.keyMap;
              if (e.childs in t && t[e.childs].length > 0) {
                this.displayJson.push(t[e.childs]), this.initDeepCount++;
                var i = t[e.childs][this.initPosition[this.initDeepCount]];
                i
                  ? this.initCheckArrDeep(i)
                  : this.checkArrDeep(t[e.childs][0]);
              }
            }
          },
        },
        {
          key: "checkArrDeep",
          value: function checkArrDeep(t) {
            if (!t) return;
            var e = this.config.keyMap;
            e.childs in t &&
              t[e.childs].length > 0 &&
              (this.displayJson.push(t[e.childs]),
              this.checkArrDeep(t[e.childs][0]));
          },
        },
        {
          key: "checkRange",
          value: function checkRange(t, e) {
            var o;
            var i = this.displayJson.length - 1 - t,
              s = this.config.keyMap;
            for (var r = 0; r < i; r++) {
              this.displayJson.pop();
            }
            var n;
            for (var _r = 0; _r <= t; _r++) {
              n =
                _r == 0
                  ? this.cascadeJsonData[e[0]]
                  : (o = n == null ? void 0 : n[s.childs]) == null
                  ? void 0
                  : o[e[_r]];
            }
            this.checkArrDeep(n),
              this.reRenderWheels(),
              this.fixRowStyle(),
              this.setCurDistance(this.resetPosition(t, e));
          },
        },
        {
          key: "resetPosition",
          value: function resetPosition(t, e) {
            var i = _toConsumableArray(e);
            var s;
            if (this.sliderList.length > e.length) {
              s = this.sliderList.length - e.length;
              for (var n = 0; n < s; n++) {
                i.push(0);
              }
            } else if (this.sliderList.length < e.length) {
              s = e.length - this.sliderList.length;
              for (var _n2 = 0; _n2 < s; _n2++) {
                i.pop();
              }
            }
            for (var _n3 = t + 1; _n3 < i.length; _n3++) {
              i[_n3] = 0;
            }
            return i;
          },
        },
        {
          key: "updateWheels",
          value: function updateWheels(t) {
            if (this.isCascade) {
              if (
                ((this.cascadeJsonData = t),
                (this.displayJson = []),
                this.initCascade(),
                this.initPosition.length < this.sliderList.length)
              ) {
                var e = this.sliderList.length - this.initPosition.length;
                for (var i = 0; i < e; i++) {
                  this.initPosition.push(0);
                }
              }
              this.setCurDistance(this.initPosition), this.fixRowStyle();
            }
          },
        },
        {
          key: "updateWheel",
          value: function updateWheel(t, e) {
            if (this.isCascade) {
              l.log(
                "error",
                "'updateWheel()' not support cascade json data, please use 'updateWheels()' instead to update the whole data source"
              );
              return;
            }
            var i = "";
            (i += this.getOptionsHtmlStr(e)),
              (this.wheelsData[t] = this.isJsonType
                ? {
                    data: e,
                  }
                : e),
              (this.sliderList[t].innerHTML = i);
          },
        },
        {
          key: "fixRowStyle",
          value: function fixRowStyle() {
            var _this5 = this;
            if (
              this.initColWidth.length &&
              this.initColWidth.length === this.wheelList.length
            ) {
              var e = this.initColWidth.reduce(function (i, s) {
                return i + s;
              }, 0);
              this.initColWidth.forEach(function (i, s) {
                _this5.wheelList[s].style.width =
                  ((i / e) * 100).toFixed(2) + "%";
              });
              return;
            }
            var t = (100 / this.wheelList.length).toFixed(2);
            for (var _e5 = 0; _e5 < this.wheelList.length; _e5++) {
              this.wheelList[_e5].style.width = t + "%";
            }
          },
        },
        {
          key: "getIndex",
          value: function getIndex(t) {
            return Math.round((2 * this.optionHeight - t) / this.optionHeight);
          },
        },
        {
          key: "getIndexArr",
          value: function getIndexArr() {
            var t = [];
            for (var e = 0; e < this.curDistance.length; e++) {
              t.push(this.getIndex(this.curDistance[e]));
            }
            return t;
          },
        },
        {
          key: "getCurValue",
          value: function getCurValue() {
            var t = [],
              e = this.getIndexArr(),
              i = this.config.keyMap;
            for (var _w = 0; _w < this.sliderList.length; _w++) {
              var _ul = this.sliderList[_w];
              if (!_ul) continue;
              var _lis = _ul.querySelectorAll("li");
              for (var _li = 0; _li < _lis.length; _li++) {
                _lis[_li].classList.remove("selected");
              }
            }
            if (this.isCascade) {
              for (var s = 0; s < this.wheelList.length; s++) {
                var n = this.displayJson[s] && this.displayJson[s][e[s]];
                if (n) {
                  var _obj = {};
                  _obj[i.id] = n[i.id];
                  _obj[i.value] = n[i.value];
                  t.push(_obj);
                } else {
                  t.push(null);
                }
                var _ul2 = this.sliderList[s];
                if (_ul2 && typeof e[s] !== "undefined") {
                  var _items2 = _ul2.querySelectorAll("li");
                  var _activeIndex2 = e[s];
                  if (_items2[_activeIndex2]) {
                    _items2[_activeIndex2].classList.add("selected");
                  }
                }
              }
            } else if (this.isJsonType) {
              for (var _s3 = 0; _s3 < this.curDistance.length; _s3++) {
                var idx = this.getIndex(this.curDistance[_s3]);
                t.push(this.wheelsData[_s3].data[idx]);
                var _ul3 = this.sliderList[_s3];
                if (_ul3) {
                  var _items3 = _ul3.querySelectorAll("li");
                  if (_items3[idx]) _items3[idx].classList.add("selected");
                }
              }
            } else {
              for (var _s4 = 0; _s4 < this.curDistance.length; _s4++) {
                var idx2 = this.getIndex(this.curDistance[_s4]);
                t.push(this.getInnerText(_s4));
                var _ul4 = this.sliderList[_s4];
                if (_ul4) {
                  var _items4 = _ul4.querySelectorAll("li");
                  if (_items4[idx2]) _items4[idx2].classList.add("selected");
                }
              }
            }
            return t;
          },
        },
        {
          key: "getValue",
          value: function getValue() {
            return this.getCurValue();
          },
        },
        {
          key: "calcDistance",
          value: function calcDistance(t) {
            return 2 * this.optionHeight - t * this.optionHeight;
          },
        },
        {
          key: "setCurDistance",
          value: function setCurDistance(t) {
            var e = [];
            for (var i = 0; i < this.sliderList.length; i++) {
              e.push(this.calcDistance(t[i])),
                this.movePosition(this.sliderList[i], e[i]);
            }
            this.curDistance = e;
          },
        },
        {
          key: "fixPosition",
          value: function fixPosition(t) {
            return -(this.getIndex(t) - 2) * this.optionHeight;
          },
        },
        {
          key: "movePosition",
          value: function movePosition(t, e) {
            this.getValue();
            t.style.transform = "translate3d(0," + e + "px, 0)";
          },
        },
        {
          key: "locatePosition",
          value: function locatePosition(t, e) {
            t === void 0 ||
              e === void 0 ||
              e < 0 ||
              ((this.curDistance[t] = this.calcDistance(e)),
              this.movePosition(this.sliderList[t], this.curDistance[t]),
              this.isCascade && this.checkRange(t, this.getIndexArr()));
          },
        },
        {
          key: "updateCurDistance",
          value: function updateCurDistance(t, e) {
            this.curDistance[e] = parseInt(t.style.transform.split(",")[1]);
          },
        },
        {
          key: "getInnerText",
          value: function getInnerText(t) {
            var s;
            var e = this.sliderList[t].getElementsByTagName("li").length;
            var i = this.getIndex(this.curDistance[t]);
            return (
              i >= e ? (i = e - 1) : i < 0 && (i = 0),
              ((s = this.sliderList[t].getElementsByTagName("li")[i]) == null
                ? void 0
                : s.textContent) || ""
            );
          },
        },
        {
          key: "touch",
          value: function touch(t) {
            var o, r, a, u, d, f, m, v;
            var i = (t.composedPath && t.composedPath()).find(function (p) {
              var y;
              return (y = p.classList) == null
                ? void 0
                : y.contains("ms-wheel");
            });
            if (!i) return;
            var s = i.firstChild,
              n = parseInt(i.getAttribute("data-index") || "0");
            switch (t.type) {
              case "touchstart":
              case "mousedown":
                try { t.preventDefault(); } catch(e) {}
                try { t.stopPropagation(); } catch(e) {}
                (s.style.transition = "none 0s ease-out"),
                  (this.startY = Math.floor(
                    (typeof TouchEvent !== 'undefined' && t instanceof TouchEvent) ? t.touches[0].clientY : t.clientY
                  )),
                  (this.preMoveY = this.startY);
                if (t.type === "mousedown") {
                  this.enableClickStatus = !0;
                  this._currentDraggingWheel = n;
                }
                break;
              case "touchmove":
              case "mousemove":
                try { t.preventDefault(); } catch(e) {}
                try { t.stopPropagation(); } catch(e) {}
                
                // Only allow mousemove if mouse button is pressed (dragging)
                if (t.type === "mousemove") {
                  // Check if mouse button is still pressed
                  if (!this.enableClickStatus || (t.buttons !== undefined && t.buttons !== 1)) {
                    this.enableClickStatus = !1;
                    break;
                  }
                }
                
                // Smooth movement without throttling for better responsiveness
                (this.moveY = Math.floor(
                  (typeof TouchEvent !== 'undefined' && t instanceof TouchEvent) ? t.touches[0].clientY : t.clientY
                )),
                  (this.offsetY =
                    (this.moveY - this.preMoveY) * this.config.scrollSpeed),
                  this.updateCurDistance(s, n),
                  (this.curDistance[n] = this.curDistance[n] + this.offsetY),
                  this.movePosition(s, this.curDistance[n]),
                  (this.preMoveY = this.moveY);
                break;
              case "wheel":
                try { t.preventDefault(); } catch(e) {}
                try { t.stopPropagation(); } catch(e) {}
                
                var wheelDelta = t.deltaY || t.detail || 0;
                
                // Get current position
                this.updateCurDistance(s, n);
                
                // Smooth incremental movement (same as insulin-sensitivity)
                var moveAmount = wheelDelta * 0.5;
                this.curDistance[n] = this.curDistance[n] - moveAmount;
                
                // No transition during wheel movement for immediate response
                s.style.transition = "none";
                this.movePosition(s, this.curDistance[n]);
                
                // Auto-snap to nearest item after wheel stops
                clearTimeout(this._wheelTimeout);
                this._wheelTimeout = setTimeout(function() {
                  // Smooth transition for snap
                  s.style.transition = "transform 0.2s ease-out";
                  
                  // Fix position to nearest item
                  var fixedPos = this.fixPosition(this.curDistance[n]);
                  
                  // Check boundaries
                  var oversizeBorder = -(s.getElementsByTagName("li").length - 3) * this.optionHeight;
                  if (fixedPos > 2 * this.optionHeight) {
                    fixedPos = 2 * this.optionHeight;
                  } else if (fixedPos < oversizeBorder) {
                    fixedPos = oversizeBorder;
                  }
                  
                  this.curDistance[n] = fixedPos;
                  this.movePosition(s, fixedPos);
                  
                  // Check cascade after snap
                  if (this.isCascade) {
                    this.checkRange(n, this.getIndexArr());
                  }
                }.bind(this), 150);
                break;
              case "touchend":
              case "mouseup":
                if (
                  ((s.style.transition = "transform 0.25s ease-out"),
                  (this.moveEndY = Math.floor(
                    (typeof TouchEvent !== 'undefined' && t instanceof TouchEvent)
                      ? t.changedTouches[0].clientY
                      : t.clientY
                  )),
                  (this.offsetSum = this.moveEndY - this.startY),
                  (this.oversizeBorder =
                    -(s.getElementsByTagName("li").length - 3) *
                    this.optionHeight),
                  this.offsetSum === 0)
                ) {
                  var p = Math.floor((window.innerHeight - this.moveEndY) / 40);
                  if (p != 2) {
                    var y = p - 2,
                      C = this.curDistance[n] + y * this.optionHeight;
                    C <= 2 * this.optionHeight &&
                      C >= this.oversizeBorder &&
                      ((this.curDistance[n] = C),
                      this.movePosition(s, this.curDistance[n]),
                      (r = (o = this.config).transitionEnd) == null ||
                        r.call(o, this.getIndexArr(), this.getCurValue(), this),
                      (u = (a = this.config).onTransitionEnd) == null ||
                        u.call(
                          a,
                          this.getCurValue(),
                          this.getIndexArr(),
                          this
                        ));
                  }
                } else
                  this.updateCurDistance(s, n),
                    (this.curDistance[n] = this.fixPosition(
                      this.curDistance[n]
                    )),
                    this.curDistance[n] > 2 * this.optionHeight
                      ? (this.curDistance[n] = 2 * this.optionHeight)
                      : this.curDistance[n] < this.oversizeBorder &&
                        (this.curDistance[n] = this.oversizeBorder),
                    this.movePosition(s, this.curDistance[n]),
                    (f = (d = this.config).transitionEnd) == null ||
                      f.call(d, this.getIndexArr(), this.getCurValue(), this),
                    (v = (m = this.config).onTransitionEnd) == null ||
                      v.call(m, this.getCurValue(), this.getIndexArr(), this);
                if (t.type === "mouseup") {
                  this.enableClickStatus = !1;
                  this._currentDraggingWheel = null;
                }
                this.isCascade && this.checkRange(n, this.getIndexArr());
                break;
              case "mouseleave":
                // Reset drag status when mouse leaves the panel
                if (this.enableClickStatus) {
                  this.enableClickStatus = !1;
                  this._currentDraggingWheel = null;
                  // Snap to nearest position
                  s.style.transition = "transform 0.25s ease-out";
                  this.updateCurDistance(s, n);
                  var fixedPosition = this.fixPosition(this.curDistance[n]);
                  var oversizeBorder = -(s.getElementsByTagName("li").length - 3) * this.optionHeight;
                  if (fixedPosition > 2 * this.optionHeight) {
                    fixedPosition = 2 * this.optionHeight;
                  } else if (fixedPosition < oversizeBorder) {
                    fixedPosition = oversizeBorder;
                  }
                  this.curDistance[n] = fixedPosition;
                  this.movePosition(s, fixedPosition);
                  if (this.isCascade) {
                    this.checkRange(n, this.getIndexArr());
                  }
                }
                break;
            }
          },
        },
      ],
      [
        {
          key: "checkDataType",
          value: function checkDataType(t) {
            var e, i;
            return (
              _typeof(
                (i = (e = t[0]) == null ? void 0 : e.data) == null
                  ? void 0
                  : i[0]
              ) == "object"
            );
          },
        },
        {
          key: "checkRequiredConfig",
          value: function checkRequiredConfig(t) {
            var e = l.REQUIRED_PARAMS;
            if (!t) {
              var i = e.map(function (s) {
                return "'".concat(s, "'");
              });
              return (
                l.log(
                  "error",
                  "missing required param ".concat(i.join(" and "), ".")
                ),
                !1
              );
            }
            for (var _i2 = 0; _i2 < e.length; _i2++) {
              var s = e[_i2];
              if (!t[s])
                return (
                  l.log("error", "missing required param '".concat(s, "'.")), !1
                );
            }
            return !0;
          },
        },
        {
          key: "log",
          value: function log(t, e) {
            var i;
            (i = console[t]) == null ||
              i.call(console, "[mobile-select]: ".concat(e));
          },
        },
      ]
    );
    return l;
  })();
  var c = l;
  return (
    h(c, "defaultConfig", {
      keyMap: {
        id: "id",
        value: "value",
        childs: "childs",
      },
      position: [],
      colWidth: [],
      title: "",
      connector: " ",
      ensureBtnText: "\u786E\u8BA4",
      cancelBtnText: "\u53D6\u6D88",
      triggerDisplayValue: true,
      scrollSpeed: 1,
    }),
    h(c, "REQUIRED_PARAMS", ["trigger", "wheels"]),
    c
  );
})();
document
  .querySelectorAll(".control-item:has(.switch-input)")
  .forEach((el, idx) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      let switchInput = el.querySelector(".switch-input");
      switchInput.checked = !switchInput.checked;
      // Dispatch change event to trigger modal logic in general-settings.html
      switchInput.dispatchEvent(new Event("change", { bubbles: true }));
      localStorage.setItem(switchInput.id, switchInput.checked);
    });
  });
document
  .querySelectorAll('.control-item:has([trigger="true"])')
  .forEach((el, idx) => {
    // onclick click tirgger
    el.addEventListener("click", (e) => {
      e.preventDefault();
      let trigger = el.querySelector('[trigger="true"]');
      if (trigger && trigger._mobileSelect) {
        trigger._mobileSelect.show();
      } else {
        // console.warn("MobileSelect instance not found for", trigger);
      }
    });
  });

document.querySelectorAll('[trigger="true"]').forEach((el, idx) => {
  if (!el.id) el.id = "trigger_auto_" + idx;

  let storedValue =
    localStorage.getItem(el.id) ||
    document.getElementById(el.id)?.value?.trim() ||
    document.getElementById(el.id)?.textContent?.trim() ||
    null;
  const wheels = [];
  
  // Custom wheel for sensitivity_default (199 to 200)
  if (el.id === "sensitivity_default") {
    const sensitivityValues = [];
    for (let i = 199; i <= 200; i++) {
      sensitivityValues.push(i.toString());
    }
    wheels.push({ data: sensitivityValues });
  } else {
    // Default wheel building logic
    let i = 1;
    while (true) {
      const suf = i === 1 ? "" : String(i);
      const valuesAttr = el.getAttribute("values" + suf);
      const startAttr = el.getAttribute("start" + suf);
      const endAttr = el.getAttribute("end" + suf);
      const stepAttr = el.getAttribute("step" + suf);

      if (!valuesAttr && !startAttr && !endAttr) break;

      let values = [];
      if (valuesAttr) {
        try {
          values = JSON.parse(valuesAttr) || [];
        } catch (e) {}
      }
      if (
        (!Array.isArray(values) || values.length === 0) &&
        startAttr &&
        endAttr
      ) {
        let start = parseInt(startAttr);
        let end = parseInt(endAttr);
        let step = parseInt(stepAttr) || 1;
        if (stepAttr == "0.5") {
          step = 0.5;
        }
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let v = start; v <= end; v++) {
            if ((v - start) % step === 0) {
              if (startAttr == "00" || startAttr == "01") {
                values.push(v.toString().padStart(2, "0"));
                continue;
              }
              values.push(v.toString());
            }
          }
        }
      }
      if (Array.isArray(values) && values.length > 0)
        wheels.push({ data: values });
      i++;
    }
  }
  
  if (wheels.length === 0) return;

  const separators = [];
  for (let s = 1; s < wheels.length; s++) {
    const attr = el.getAttribute(s === 1 ? "separator" : "separator" + s);
    separators.push(attr !== null ? attr : " ");
  }

  const joinWithSeps = (arr, seps) => {
    let out = "";
    for (let k = 0; k < arr.length; k++) {
      if (arr[k] == "قبل الظهر") arr[k] = "AM";
      if (arr[k] == "بعد الظهر") arr[k] = "PM";
      out += arr[k];
      if (k < seps.length) out += seps[k];
    }
    return out;
  };
  const splitStoredToValues = (str, wheels, seps) => {
    if (typeof str !== "string") return null;

    const convertAmPm = (val) => {
      if (val === "AM") return "قبل الظهر";
      if (val === "PM") return "بعد الظهر";
      return val;
    };

    if (seps.every((s) => s !== "")) {
      let remaining = str;
      const parts = [];
      for (let w = 0; w < wheels.length - 1; w++) {
        const sep = seps[w];
        const idx = remaining.indexOf(sep);
        if (idx < 0) return null;
        parts.push(convertAmPm(remaining.slice(0, idx)));
        remaining = remaining.slice(idx + sep.length);
      }
      parts.push(convertAmPm(remaining));
      return parts;
    }

    let remaining = str;
    const parts = [];
    for (let w = 0; w < wheels.length; w++) {
      const options = wheels[w].data
        .slice()
        .sort((a, b) => b.length - a.length);
      let match = options.find((opt) => remaining.startsWith(opt));
      if (!match) return null;
      parts.push(convertAmPm(match));
      remaining = remaining.slice(match.length);
      if (w < seps.length && seps[w] && remaining.startsWith(seps[w])) {
        remaining = remaining.slice(seps[w].length);
      }
    }
    if (remaining.length !== 0) return null;
    return parts;
  };
  let position = new Array(wheels.length).fill(0);

  if (storedValue) {
    const parts = splitStoredToValues(storedValue, wheels, separators);

    if (parts && parts.length === wheels.length) {
      position = parts.map((val, ix) => {
        const idxInWheel = wheels[ix].data.indexOf(val);
        return idxInWheel >= 0
          ? idxInWheel + wheels[ix].data.length * 2
          : wheels[ix].data.length * 2;
      });
    } else {
      const idx0 = wheels[0].data.indexOf(storedValue);
      if (idx0 >= 0) {
        position[0] = idx0 + wheels[0].data.length * 2;
      }
    }

    el.textContent = storedValue;
    document.querySelectorAll("." + el.id + "_preview").forEach((preview) => {
      preview.textContent = storedValue;
    });
  }

  position = position.map((p, ix) => {
    return p > 0 ? p : wheels[ix].data.length * 2;
  });

  // Set custom title based on element ID
  let customTitle = el.getAttribute("title") || "اختر قيمة";
  if (el.id === "sensitivity_default") {
    customTitle = "معامل حساسية الأنسولين (mg/dl/u)";
  }

  const ms = new MobileSelect({
    trigger: "#" + el.id,
    title: customTitle,
    wheels: wheels,
    separators: separators,
    ensureBtnText: "تأكيد",
    cancelBtnText: "إلغاء",
    position: position,
    onChange: function (data) {
      const combined = joinWithSeps(data, separators);
      el.textContent = combined;
      document.querySelectorAll("." + el.id + "_preview").forEach((preview) => {
        preview.textContent = combined;
      });
      localStorage.setItem(el.id, combined);
    },
  });

  ms.getValue();
  el._mobileSelect = ms;
});

document.querySelectorAll("[screen]").forEach((el, idx) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.getElementById(el.getAttribute("screen"))) {
      document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.remove("active");
      });
      document
        .getElementById(el.getAttribute("screen"))
        .classList.add("active");
    }
  });
});
function openModalMs(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const phoneContainer = document.querySelector('.phone-container');
    
    if (phoneContainer) {
      phoneContainer.classList.add("ms-show");
      const scrollTop = phoneContainer.scrollTop;
      
      // Position modal at current scroll position
      modal.style.top = scrollTop + 'px';
      
      // Prevent scrolling
      phoneContainer.style.overflow = 'hidden';
    }
    
    modal.classList.add("active", "ms-show");
    
    // Add click outside to close
    setTimeout(() => {
      modal.addEventListener('click', function(e) {
        // Check if clicked on the modal backdrop (not the content)
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
          closeModalMs(modalId);
        }
      });
    }, 100);
  }
}

function closeModalMs(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active", "ms-show");
    
    // Re-enable scrolling
    const phoneContainer = document.querySelector('.phone-container');
    const contentWrapper = phoneContainer ? phoneContainer.querySelector('.content-wrapper') : null;
    
    if (phoneContainer) {
      phoneContainer.classList.remove("ms-show");
      phoneContainer.style.overflow = '';
    }
    
    if (contentWrapper) {
      contentWrapper.style.overflow = '';
      
      // Restore scroll position
      if (contentWrapper.dataset.scrollPosition) {
        contentWrapper.scrollTop = contentWrapper.dataset.scrollPosition;
        delete contentWrapper.dataset.scrollPosition;
      }
    }
  }
}
function updateValue(el, delta) {
  let val = el.value !== undefined ? el.value : el.textContent;
  if (!val) return;

  const timeMatch = val.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    let minutes = parseInt(timeMatch[2], 10);
    let meridian = timeMatch[3].toUpperCase();

    minutes += delta;
    if (minutes < 0) {
      minutes = 59;
      hours -= 1;
    } else if (minutes > 59) {
      minutes = 0;
      hours += 1;
    }

    if (hours === 0) {
      hours = 12;
      meridian = meridian === "AM" ? "PM" : "AM";
    } else if (hours === 12 && minutes === 0 && delta > 0) {
      meridian = meridian === "AM" ? "PM" : "AM";
    } else if (hours > 12) {
      hours = 1;
    } else if (hours < 1) {
      hours = 12;
    }

    val = `${hours}:${minutes.toString().padStart(2, "0")} ${meridian}`;
  } else {
    const numMatch = val.match(/^(-?\d+)(.*)$/);
    if (numMatch) {
      let number = parseInt(numMatch[1], 10) + delta;
      let suffix = numMatch[2] || "";
      val = number + suffix;
    }
  }

  if (el.value !== undefined) {
    el.value = val;
  } else {
    el.textContent = val;
  }
}

document.querySelectorAll(".increment-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute("target");
    if (targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) updateValue(targetEl, 1);
    }
  });
});

document.querySelectorAll(".decrement-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute("target");
    if (targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) updateValue(targetEl, -1);
    }
  });
});

document.querySelectorAll("[selectable]").forEach(function (item) {
  item.addEventListener("click", function () {
    const target = item.getAttribute("selectable-target");
    document
      .querySelectorAll('[selectable-target="' + target + '"]')
      .forEach(function (el) {
        el.removeAttribute("selected");
      });
    item.setAttribute("selected", "true");
    if (target && document.getElementById(target)) {
      document.getElementById(target).innerText = item.innerText;
    }
  });
});
