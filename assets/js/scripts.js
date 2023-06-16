// Utility function
function Util() {}

/* 
	class manipulation functions
*/
Util.hasClass = function (el, className) {
  if (el.classList) return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function (el, className) {
  var classList = className.split(' ');
  if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0])) el.className += ' ' + classList[0];
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function (el, className) {
  var classList = className.split(' ');
  if (el.classList) el.classList.remove(classList[0]);
  else if (Util.hasClass(el, classList[0])) {
    var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.setAttributes = function (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function (el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className))
      childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function (elem, selector) {
  if (selector.nodeType) {
    return elem === selector;
  }

  var qa =
      typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : selector,
    length = qa.length,
    returnArr = [];

  while (length--) {
    if (qa[length] === elem) {
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function (start, to, element, duration, cb) {
  var change = to - start,
    currentTime = null;

  var animateHeight = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    var val = parseInt((progress / duration) * change + start);
    element.style.height = val + 'px';
    if (progress < duration) {
      window.requestAnimationFrame(animateHeight);
    } else {
      cb();
    }
  };

  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start + 'px';
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function (final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if (!scrollEl) start = window.scrollY || document.documentElement.scrollTop;

  var animateScroll = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final - start, duration);
    element.scrollTo(0, val);
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if (!element) element = document.getElementsByTagName('body')[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function (array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function (property, value) {
  if ('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function () {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (
          deep &&
          Object.prototype.toString.call(obj[prop]) === '[object Object]'
        ) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function () {
  if (!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

//Custom Event() constructor
if (typeof window.CustomEvent !== 'function') {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
  t /= d;
  return c * t * t * t * t + b;
};

Math.easeOutQuart = function (t, b, c, d) {
  t /= d;
  t--;
  return -c * (t * t * t * t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t * t + b;
  t -= 2;
  return (-c / 2) * (t * t * t * t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s = 1.70158;
  var p = d * 0.7;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
  return (
    a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
    c +
    b
  );
};

/* JS Utility Classes */
(function () {
  // make focus ring visible only for keyboard navigation (i.e., tab key)
  var focusTab = document.getElementsByClassName('js-tab-focus');
  function detectClick() {
    if (focusTab.length > 0) {
      resetFocusTabs(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
  }

  function detectTab(event) {
    if (event.keyCode !== 9) return;
    resetFocusTabs(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
  }

  function resetFocusTabs(bool) {
    var outlineStyle = bool ? '' : 'none';
    for (var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  }
  window.addEventListener('mousedown', detectClick);
})();

// File#: _1_accordion
// Usage: codyhouse.co/license
(function () {
  var Accordion = function (element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(
      this.element,
      "js-accordion__item"
    );
    this.version = this.element.getAttribute("data-version")
      ? "-" + this.element.getAttribute("data-version")
      : "";
    this.showClass = "accordion" + this.version + "__item--is-open";
    this.animateHeight = this.element.getAttribute("data-animation") == "on";
    this.multiItems = !(this.element.getAttribute("data-multi-items") == "off");
    // deep linking options
    this.deepLinkOn = this.element.getAttribute("data-deep-link") == "on";
    // init accordion
    this.initAccordion();
  };

  Accordion.prototype.initAccordion = function () {
    //set initial aria attributes
    for (var i = 0; i < this.items.length; i++) {
      var button = this.items[i].getElementsByTagName("button")[0],
        content = this.items[i].getElementsByClassName(
          "js-accordion__panel"
        )[0],
        isOpen = Util.hasClass(this.items[i], this.showClass)
          ? "true"
          : "false";
      Util.setAttributes(button, {
        "aria-expanded": isOpen,
        "aria-controls": "accordion-content-" + i,
        id: "accordion-header-" + i,
      });
      Util.addClass(button, "js-accordion__trigger");
      Util.setAttributes(content, {
        "aria-labelledby": "accordion-header-" + i,
        id: "accordion-content-" + i,
      });
    }

    //listen for Accordion events
    this.initAccordionEvents();

    // check deep linking option
    this.initDeepLink();
  };

  Accordion.prototype.initAccordionEvents = function () {
    var self = this;

    this.element.addEventListener("click", function (event) {
      var trigger = event.target.closest(".js-accordion__trigger");
      //check index to make sure the click didn't happen inside a children accordion
      if (
        trigger &&
        Util.getIndexInArray(self.items, trigger.parentElement) >= 0
      )
        self.triggerAccordion(trigger);
    });
  };

  Accordion.prototype.triggerAccordion = function (trigger) {
    var bool = trigger.getAttribute("aria-expanded") === "true";

    this.animateAccordion(trigger, bool, false);

    if (!bool && this.deepLinkOn) {
      history.replaceState(
        null,
        "",
        "#" + trigger.getAttribute("aria-controls")
      );
    }
  };

  Accordion.prototype.animateAccordion = function (trigger, bool, deepLink) {
    var self = this;
    var item = trigger.closest(".js-accordion__item"),
      content = item.getElementsByClassName("js-accordion__panel")[0],
      ariaValue = bool ? "false" : "true";

    if (!bool) Util.addClass(item, this.showClass);
    trigger.setAttribute("aria-expanded", ariaValue);
    self.resetContentVisibility(item, content, bool);

    if ((!this.multiItems && !bool) || deepLink) this.closeSiblings(item);
  };

  Accordion.prototype.resetContentVisibility = function (item, content, bool) {
    Util.toggleClass(item, this.showClass, !bool);
    content.removeAttribute("style");
    if (bool && !this.multiItems) {
      // accordion item has been closed -> check if there's one open to move inside viewport
      this.moveContent();
    }
  };

  Accordion.prototype.closeSiblings = function (item) {
    //if only one accordion can be open -> search if there's another one open
    var index = Util.getIndexInArray(this.items, item);
    for (var i = 0; i < this.items.length; i++) {
      if (Util.hasClass(this.items[i], this.showClass) && i != index) {
        this.animateAccordion(
          this.items[i].getElementsByClassName("js-accordion__trigger")[0],
          true,
          false
        );
        return false;
      }
    }
  };

  Accordion.prototype.moveContent = function () {
    // make sure title of the accordion just opened is inside the viewport
    var openAccordion = this.element.getElementsByClassName(this.showClass);
    if (openAccordion.length == 0) return;
    var boundingRect = openAccordion[0].getBoundingClientRect();
    if (boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
      var windowScrollTop =
        window.scrollY || document.documentElement.scrollTop;
      window.scrollTo(0, boundingRect.top + windowScrollTop);
    }
  };

  Accordion.prototype.initDeepLink = function () {
    if (!this.deepLinkOn) return;
    var hash = window.location.hash.substr(1);
    if (!hash || hash == "") return;
    var trigger = this.element.querySelector(
      '.js-accordion__trigger[aria-controls="' + hash + '"]'
    );
    if (trigger && trigger.getAttribute("aria-expanded") !== "true") {
      this.animateAccordion(trigger, false, true);
      setTimeout(function () {
        trigger.scrollIntoView(true);
      });
    }
  };

  window.Accordion = Accordion;

  //initialize the Accordion objects
  var accordions = document.getElementsByClassName("js-accordion");
  if (accordions.length > 0) {
    for (var i = 0; i < accordions.length; i++) {
      (function (i) {
        new Accordion(accordions[i]);
      })(i);
    }
  }
})();

// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function () {
  var SmoothScroll = function (element) {
    if (!("CSS" in window) || !CSS.supports("color", "var(--color-var)"))
      return;
    this.element = element;
    this.scrollDuration =
      parseInt(this.element.getAttribute("data-duration")) || 1000;
    this.dataElementY =
      this.element.getAttribute("data-scrollable-element-y") ||
      this.element.getAttribute("data-scrollable-element") ||
      this.element.getAttribute("data-element");
    this.scrollElementY = this.dataElementY
      ? document.querySelector(this.dataElementY)
      : window;
    this.dataElementX = this.element.getAttribute("data-scrollable-element-x");
    this.scrollElementX = this.dataElementY
      ? document.querySelector(this.dataElementX)
      : window;
    this.initScroll();
  };

  SmoothScroll.prototype.initScroll = function () {
    var self = this;

    //detect click on link
    this.element.addEventListener("click", function (event) {
      event.preventDefault();
      var targetId = event.target
          .closest(".js-smooth-scroll")
          .getAttribute("href")
          .replace("#", ""),
        target = document.getElementById(targetId),
        targetTabIndex = target.getAttribute("tabindex"),
        windowScrollTop =
          self.scrollElementY.scrollTop || document.documentElement.scrollTop;

      // scroll vertically
      if (!self.dataElementY)
        windowScrollTop = window.scrollY || document.documentElement.scrollTop;

      var scrollElementY = self.dataElementY ? self.scrollElementY : false;

      var fixedHeight = self.getFixedElementHeight(); // check if there's a fixed element on the page
      Util.scrollTo(
        target.getBoundingClientRect().top + windowScrollTop - fixedHeight,
        self.scrollDuration,
        function () {
          // scroll horizontally
          self.scrollHorizontally(target, fixedHeight);
          //move the focus to the target element - don't break keyboard navigation
          Util.moveFocus(target);
          history.pushState(false, false, "#" + targetId);
          self.resetTarget(target, targetTabIndex);
        },
        scrollElementY
      );
    });
  };

  SmoothScroll.prototype.scrollHorizontally = function (target, delta) {
    var scrollEl = this.dataElementX ? this.scrollElementX : false;
    var windowScrollLeft = this.scrollElementX
      ? this.scrollElementX.scrollLeft
      : document.documentElement.scrollLeft;
    var final = target.getBoundingClientRect().left + windowScrollLeft - delta,
      duration = this.scrollDuration;

    var element = scrollEl || window;
    var start = element.scrollLeft || document.documentElement.scrollLeft,
      currentTime = null;

    if (!scrollEl)
      start = window.scrollX || document.documentElement.scrollLeft;
    // return if there's no need to scroll
    if (Math.abs(start - final) < 5) return;

    var animateScroll = function (timestamp) {
      if (!currentTime) currentTime = timestamp;
      var progress = timestamp - currentTime;
      if (progress > duration) progress = duration;
      var val = Math.easeInOutQuad(progress, start, final - start, duration);
      element.scrollTo({
        left: val,
      });
      if (progress < duration) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

  SmoothScroll.prototype.resetTarget = function (target, tabindex) {
    if (parseInt(target.getAttribute("tabindex")) < 0) {
      target.style.outline = "none";
      !tabindex && target.removeAttribute("tabindex");
    }
  };

  SmoothScroll.prototype.getFixedElementHeight = function () {
    var scrollElementY = this.dataElementY
      ? this.scrollElementY
      : document.documentElement;
    var fixedElementDelta = parseInt(
      getComputedStyle(scrollElementY).getPropertyValue("scroll-padding")
    );
    if (isNaN(fixedElementDelta)) {
      // scroll-padding not supported
      fixedElementDelta = 0;
      var fixedElement = document.querySelector(
        this.element.getAttribute("data-fixed-element")
      );
      if (fixedElement)
        fixedElementDelta = parseInt(
          fixedElement.getBoundingClientRect().height
        );
    }
    return fixedElementDelta;
  };

  //initialize the Smooth Scroll objects
  var smoothScrollLinks = document.getElementsByClassName("js-smooth-scroll");
  if (
    smoothScrollLinks.length > 0 &&
    !Util.cssSupports("scroll-behavior", "smooth") &&
    window.requestAnimationFrame
  ) {
    // you need javascript only if css scroll-behavior is not supported
    for (var i = 0; i < smoothScrollLinks.length; i++) {
      (function (i) {
        new SmoothScroll(smoothScrollLinks[i]);
      })(i);
    }
  }
})();

/*!
 * Flickity PACKAGED v2.2.2
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2021 Metafizzy
 */
(function (e, i) {
  if (typeof define == "function" && define.amd) {
    define("jquery-bridget/jquery-bridget", ["jquery"], function (t) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("jquery"));
  } else {
    e.jQueryBridget = i(e, e.jQuery);
  }
})(window, function t(e, r) {
  "use strict";
  var o = Array.prototype.slice;
  var i = e.console;
  var u =
    typeof i == "undefined"
      ? function () {}
      : function (t) {
          i.error(t);
        };
  function n(h, s, c) {
    c = c || r || e.jQuery;
    if (!c) {
      return;
    }
    if (!s.prototype.option) {
      s.prototype.option = function (t) {
        if (!c.isPlainObject(t)) {
          return;
        }
        this.options = c.extend(true, this.options, t);
      };
    }
    c.fn[h] = function (t) {
      if (typeof t == "string") {
        var e = o.call(arguments, 1);
        return i(this, t, e);
      }
      n(this, t);
      return this;
    };
    function i(t, r, o) {
      var a;
      var l = "$()." + h + '("' + r + '")';
      t.each(function (t, e) {
        var i = c.data(e, h);
        if (!i) {
          u(h + " not initialized. Cannot call methods, i.e. " + l);
          return;
        }
        var n = i[r];
        if (!n || r.charAt(0) == "_") {
          u(l + " is not a valid method");
          return;
        }
        var s = n.apply(i, o);
        a = a === undefined ? s : a;
      });
      return a !== undefined ? a : t;
    }
    function n(t, n) {
      t.each(function (t, e) {
        var i = c.data(e, h);
        if (i) {
          i.option(n);
          i._init();
        } else {
          i = new s(e, n);
          c.data(e, h, i);
        }
      });
    }
    a(c);
  }
  function a(t) {
    if (!t || (t && t.bridget)) {
      return;
    }
    t.bridget = n;
  }
  a(r || e.jQuery);
  return n;
});
(function (t, e) {
  if (typeof define == "function" && define.amd) {
    define("ev-emitter/ev-emitter", e);
  } else if (typeof module == "object" && module.exports) {
    module.exports = e();
  } else {
    t.EvEmitter = e();
  }
})(typeof window != "undefined" ? window : this, function () {
  function t() {}
  var e = t.prototype;
  e.on = function (t, e) {
    if (!t || !e) {
      return;
    }
    var i = (this._events = this._events || {});
    var n = (i[t] = i[t] || []);
    if (n.indexOf(e) == -1) {
      n.push(e);
    }
    return this;
  };
  e.once = function (t, e) {
    if (!t || !e) {
      return;
    }
    this.on(t, e);
    var i = (this._onceEvents = this._onceEvents || {});
    var n = (i[t] = i[t] || {});
    n[e] = true;
    return this;
  };
  e.off = function (t, e) {
    var i = this._events && this._events[t];
    if (!i || !i.length) {
      return;
    }
    var n = i.indexOf(e);
    if (n != -1) {
      i.splice(n, 1);
    }
    return this;
  };
  e.emitEvent = function (t, e) {
    var i = this._events && this._events[t];
    if (!i || !i.length) {
      return;
    }
    i = i.slice(0);
    e = e || [];
    var n = this._onceEvents && this._onceEvents[t];
    for (var s = 0; s < i.length; s++) {
      var r = i[s];
      var o = n && n[r];
      if (o) {
        this.off(t, r);
        delete n[r];
      }
      r.apply(this, e);
    }
    return this;
  };
  e.allOff = function () {
    delete this._events;
    delete this._onceEvents;
  };
  return t;
});
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */
(function (t, e) {
  if (typeof define == "function" && define.amd) {
    define("get-size/get-size", e);
  } else if (typeof module == "object" && module.exports) {
    module.exports = e();
  } else {
    t.getSize = e();
  }
})(window, function t() {
  "use strict";
  function m(t) {
    var e = parseFloat(t);
    var i = t.indexOf("%") == -1 && !isNaN(e);
    return i && e;
  }
  function e() {}
  var i =
    typeof console == "undefined"
      ? e
      : function (t) {
          console.error(t);
        };
  var y = [
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marginBottom",
    "borderLeftWidth",
    "borderRightWidth",
    "borderTopWidth",
    "borderBottomWidth",
  ];
  var b = y.length;
  function E() {
    var t = {
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0,
    };
    for (var e = 0; e < b; e++) {
      var i = y[e];
      t[i] = 0;
    }
    return t;
  }
  function S(t) {
    var e = getComputedStyle(t);
    if (!e) {
      i(
        "Style returned " +
          e +
          ". Are you running this code in a hidden iframe on Firefox? " +
          "See https://bit.ly/getsizebug1"
      );
    }
    return e;
  }
  var n = false;
  var C;
  function x() {
    if (n) {
      return;
    }
    n = true;
    var t = document.createElement("div");
    t.style.width = "200px";
    t.style.padding = "1px 2px 3px 4px";
    t.style.borderStyle = "solid";
    t.style.borderWidth = "1px 2px 3px 4px";
    t.style.boxSizing = "border-box";
    var e = document.body || document.documentElement;
    e.appendChild(t);
    var i = S(t);
    C = Math.round(m(i.width)) == 200;
    s.isBoxSizeOuter = C;
    e.removeChild(t);
  }
  function s(t) {
    x();
    if (typeof t == "string") {
      t = document.querySelector(t);
    }
    if (!t || typeof t != "object" || !t.nodeType) {
      return;
    }
    var e = S(t);
    if (e.display == "none") {
      return E();
    }
    var i = {};
    i.width = t.offsetWidth;
    i.height = t.offsetHeight;
    var n = (i.isBorderBox = e.boxSizing == "border-box");
    for (var s = 0; s < b; s++) {
      var r = y[s];
      var o = e[r];
      var a = parseFloat(o);
      i[r] = !isNaN(a) ? a : 0;
    }
    var l = i.paddingLeft + i.paddingRight;
    var h = i.paddingTop + i.paddingBottom;
    var c = i.marginLeft + i.marginRight;
    var u = i.marginTop + i.marginBottom;
    var d = i.borderLeftWidth + i.borderRightWidth;
    var f = i.borderTopWidth + i.borderBottomWidth;
    var p = n && C;
    var v = m(e.width);
    if (v !== false) {
      i.width = v + (p ? 0 : l + d);
    }
    var g = m(e.height);
    if (g !== false) {
      i.height = g + (p ? 0 : h + f);
    }
    i.innerWidth = i.width - (l + d);
    i.innerHeight = i.height - (h + f);
    i.outerWidth = i.width + c;
    i.outerHeight = i.height + u;
    return i;
  }
  return s;
});
(function (t, e) {
  "use strict";
  if (typeof define == "function" && define.amd) {
    define("desandro-matches-selector/matches-selector", e);
  } else if (typeof module == "object" && module.exports) {
    module.exports = e();
  } else {
    t.matchesSelector = e();
  }
})(window, function t() {
  "use strict";
  var n = (function () {
    var t = window.Element.prototype;
    if (t.matches) {
      return "matches";
    }
    if (t.matchesSelector) {
      return "matchesSelector";
    }
    var e = ["webkit", "moz", "ms", "o"];
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      var s = n + "MatchesSelector";
      if (t[s]) {
        return s;
      }
    }
  })();
  return function t(e, i) {
    return e[n](i);
  };
});
(function (e, i) {
  if (typeof define == "function" && define.amd) {
    define("fizzy-ui-utils/utils", [
      "desandro-matches-selector/matches-selector",
    ], function (t) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("desandro-matches-selector"));
  } else {
    e.fizzyUIUtils = i(e, e.matchesSelector);
  }
})(window, function t(h, r) {
  var c = {};
  c.extend = function (t, e) {
    for (var i in e) {
      t[i] = e[i];
    }
    return t;
  };
  c.modulo = function (t, e) {
    return ((t % e) + e) % e;
  };
  var i = Array.prototype.slice;
  c.makeArray = function (t) {
    if (Array.isArray(t)) {
      return t;
    }
    if (t === null || t === undefined) {
      return [];
    }
    var e = typeof t == "object" && typeof t.length == "number";
    if (e) {
      return i.call(t);
    }
    return [t];
  };
  c.removeFrom = function (t, e) {
    var i = t.indexOf(e);
    if (i != -1) {
      t.splice(i, 1);
    }
  };
  c.getParent = function (t, e) {
    while (t.parentNode && t != document.body) {
      t = t.parentNode;
      if (r(t, e)) {
        return t;
      }
    }
  };
  c.getQueryElement = function (t) {
    if (typeof t == "string") {
      return document.querySelector(t);
    }
    return t;
  };
  c.handleEvent = function (t) {
    var e = "on" + t.type;
    if (this[e]) {
      this[e](t);
    }
  };
  c.filterFindElements = function (t, n) {
    t = c.makeArray(t);
    var s = [];
    t.forEach(function (t) {
      if (!(t instanceof HTMLElement)) {
        return;
      }
      if (!n) {
        s.push(t);
        return;
      }
      if (r(t, n)) {
        s.push(t);
      }
      var e = t.querySelectorAll(n);
      for (var i = 0; i < e.length; i++) {
        s.push(e[i]);
      }
    });
    return s;
  };
  c.debounceMethod = function (t, e, n) {
    n = n || 100;
    var s = t.prototype[e];
    var r = e + "Timeout";
    t.prototype[e] = function () {
      var t = this[r];
      clearTimeout(t);
      var e = arguments;
      var i = this;
      this[r] = setTimeout(function () {
        s.apply(i, e);
        delete i[r];
      }, n);
    };
  };
  c.docReady = function (t) {
    var e = document.readyState;
    if (e == "complete" || e == "interactive") {
      setTimeout(t);
    } else {
      document.addEventListener("DOMContentLoaded", t);
    }
  };
  c.toDashed = function (t) {
    return t
      .replace(/(.)([A-Z])/g, function (t, e, i) {
        return e + "-" + i;
      })
      .toLowerCase();
  };
  var u = h.console;
  c.htmlInit = function (a, l) {
    c.docReady(function () {
      var t = c.toDashed(l);
      var s = "data-" + t;
      var e = document.querySelectorAll("[" + s + "]");
      var i = document.querySelectorAll(".js-" + t);
      var n = c.makeArray(e).concat(c.makeArray(i));
      var r = s + "-options";
      var o = h.jQuery;
      n.forEach(function (e) {
        var t = e.getAttribute(s) || e.getAttribute(r);
        var i;
        try {
          i = t && JSON.parse(t);
        } catch (t) {
          if (u) {
            u.error("Error parsing " + s + " on " + e.className + ": " + t);
          }
          return;
        }
        var n = new a(e, i);
        if (o) {
          o.data(e, l, n);
        }
      });
    });
  };
  return c;
});
(function (e, i) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/cell", ["get-size/get-size"], function (t) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("get-size"));
  } else {
    e.Flickity = e.Flickity || {};
    e.Flickity.Cell = i(e, e.getSize);
  }
})(window, function t(e, i) {
  function n(t, e) {
    this.element = t;
    this.parent = e;
    this.create();
  }
  var s = n.prototype;
  s.create = function () {
    this.element.style.position = "absolute";
    this.element.setAttribute("aria-hidden", "true");
    this.x = 0;
    this.shift = 0;
  };
  s.destroy = function () {
    this.unselect();
    this.element.style.position = "";
    var t = this.parent.originSide;
    this.element.style[t] = "";
    this.element.removeAttribute("aria-hidden");
  };
  s.getSize = function () {
    this.size = i(this.element);
  };
  s.setPosition = function (t) {
    this.x = t;
    this.updateTarget();
    this.renderPosition(t);
  };
  s.updateTarget = s.setDefaultTarget = function () {
    var t = this.parent.originSide == "left" ? "marginLeft" : "marginRight";
    this.target =
      this.x + this.size[t] + this.size.width * this.parent.cellAlign;
  };
  s.renderPosition = function (t) {
    var e = this.parent.originSide;
    this.element.style[e] = this.parent.getPositionValue(t);
  };
  s.select = function () {
    this.element.classList.add("is-selected");
    this.element.removeAttribute("aria-hidden");
  };
  s.unselect = function () {
    this.element.classList.remove("is-selected");
    this.element.setAttribute("aria-hidden", "true");
  };
  s.wrapShift = function (t) {
    this.shift = t;
    this.renderPosition(this.x + this.parent.slideableWidth * t);
  };
  s.remove = function () {
    this.element.parentNode.removeChild(this.element);
  };
  return n;
});
(function (t, e) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/slide", e);
  } else if (typeof module == "object" && module.exports) {
    module.exports = e();
  } else {
    t.Flickity = t.Flickity || {};
    t.Flickity.Slide = e();
  }
})(window, function t() {
  "use strict";
  function e(t) {
    this.parent = t;
    this.isOriginLeft = t.originSide == "left";
    this.cells = [];
    this.outerWidth = 0;
    this.height = 0;
  }
  var i = e.prototype;
  i.addCell = function (t) {
    this.cells.push(t);
    this.outerWidth += t.size.outerWidth;
    this.height = Math.max(t.size.outerHeight, this.height);
    if (this.cells.length == 1) {
      this.x = t.x;
      var e = this.isOriginLeft ? "marginLeft" : "marginRight";
      this.firstMargin = t.size[e];
    }
  };
  i.updateTarget = function () {
    var t = this.isOriginLeft ? "marginRight" : "marginLeft";
    var e = this.getLastCell();
    var i = e ? e.size[t] : 0;
    var n = this.outerWidth - (this.firstMargin + i);
    this.target = this.x + this.firstMargin + n * this.parent.cellAlign;
  };
  i.getLastCell = function () {
    return this.cells[this.cells.length - 1];
  };
  i.select = function () {
    this.cells.forEach(function (t) {
      t.select();
    });
  };
  i.unselect = function () {
    this.cells.forEach(function (t) {
      t.unselect();
    });
  };
  i.getCellElements = function () {
    return this.cells.map(function (t) {
      return t.element;
    });
  };
  return e;
});
(function (e, i) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/animate", ["fizzy-ui-utils/utils"], function (t) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("fizzy-ui-utils"));
  } else {
    e.Flickity = e.Flickity || {};
    e.Flickity.animatePrototype = i(e, e.fizzyUIUtils);
  }
})(window, function t(e, i) {
  var n = {};
  n.startAnimation = function () {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.restingFrames = 0;
    this.animate();
  };
  n.animate = function () {
    this.applyDragForce();
    this.applySelectedAttraction();
    var t = this.x;
    this.integratePhysics();
    this.positionSlider();
    this.settle(t);
    if (this.isAnimating) {
      var e = this;
      requestAnimationFrame(function t() {
        e.animate();
      });
    }
  };
  n.positionSlider = function () {
    var t = this.x;
    if (this.options.wrapAround && this.cells.length > 1) {
      t = i.modulo(t, this.slideableWidth);
      t -= this.slideableWidth;
      this.shiftWrapCells(t);
    }
    this.setTranslateX(t, this.isAnimating);
    this.dispatchScrollEvent();
  };
  n.setTranslateX = function (t, e) {
    t += this.cursorPosition;
    t = this.options.rightToLeft ? -t : t;
    var i = this.getPositionValue(t);
    this.slider.style.transform = e
      ? "translate3d(" + i + ",0,0)"
      : "translateX(" + i + ")";
  };
  n.dispatchScrollEvent = function () {
    var t = this.slides[0];
    if (!t) {
      return;
    }
    var e = -this.x - t.target;
    var i = e / this.slidesWidth;
    this.dispatchEvent("scroll", null, [i, e]);
  };
  n.positionSliderAtSelected = function () {
    if (!this.cells.length) {
      return;
    }
    this.x = -this.selectedSlide.target;
    this.velocity = 0;
    this.positionSlider();
  };
  n.getPositionValue = function (t) {
    if (this.options.percentPosition) {
      return Math.round((t / this.size.innerWidth) * 1e4) * 0.01 + "%";
    } else {
      return Math.round(t) + "px";
    }
  };
  n.settle = function (t) {
    var e =
      !this.isPointerDown && Math.round(this.x * 100) == Math.round(t * 100);
    if (e) {
      this.restingFrames++;
    }
    if (this.restingFrames > 2) {
      this.isAnimating = false;
      delete this.isFreeScrolling;
      this.positionSlider();
      this.dispatchEvent("settle", null, [this.selectedIndex]);
    }
  };
  n.shiftWrapCells = function (t) {
    var e = this.cursorPosition + t;
    this._shiftCells(this.beforeShiftCells, e, -1);
    var i =
      this.size.innerWidth - (t + this.slideableWidth + this.cursorPosition);
    this._shiftCells(this.afterShiftCells, i, 1);
  };
  n._shiftCells = function (t, e, i) {
    for (var n = 0; n < t.length; n++) {
      var s = t[n];
      var r = e > 0 ? i : 0;
      s.wrapShift(r);
      e -= s.size.outerWidth;
    }
  };
  n._unshiftCells = function (t) {
    if (!t || !t.length) {
      return;
    }
    for (var e = 0; e < t.length; e++) {
      t[e].wrapShift(0);
    }
  };
  n.integratePhysics = function () {
    this.x += this.velocity;
    this.velocity *= this.getFrictionFactor();
  };
  n.applyForce = function (t) {
    this.velocity += t;
  };
  n.getFrictionFactor = function () {
    return (
      1 - this.options[this.isFreeScrolling ? "freeScrollFriction" : "friction"]
    );
  };
  n.getRestingPosition = function () {
    return this.x + this.velocity / (1 - this.getFrictionFactor());
  };
  n.applyDragForce = function () {
    if (!this.isDraggable || !this.isPointerDown) {
      return;
    }
    var t = this.dragX - this.x;
    var e = t - this.velocity;
    this.applyForce(e);
  };
  n.applySelectedAttraction = function () {
    var t = this.isDraggable && this.isPointerDown;
    if (t || this.isFreeScrolling || !this.slides.length) {
      return;
    }
    var e = this.selectedSlide.target * -1 - this.x;
    var i = e * this.options.selectedAttraction;
    this.applyForce(i);
  };
  return n;
});
(function (o, a) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/flickity", [
      "ev-emitter/ev-emitter",
      "get-size/get-size",
      "fizzy-ui-utils/utils",
      "./cell",
      "./slide",
      "./animate",
    ], function (t, e, i, n, s, r) {
      return a(o, t, e, i, n, s, r);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = a(
      o,
      require("ev-emitter"),
      require("get-size"),
      require("fizzy-ui-utils"),
      require("./cell"),
      require("./slide"),
      require("./animate")
    );
  } else {
    var t = o.Flickity;
    o.Flickity = a(
      o,
      o.EvEmitter,
      o.getSize,
      o.fizzyUIUtils,
      t.Cell,
      t.Slide,
      t.animatePrototype
    );
  }
})(window, function t(n, e, i, a, s, o, r) {
  var l = n.jQuery;
  var h = n.getComputedStyle;
  var c = n.console;
  function u(t, e) {
    t = a.makeArray(t);
    while (t.length) {
      e.appendChild(t.shift());
    }
  }
  var d = 0;
  var f = {};
  function p(t, e) {
    var i = a.getQueryElement(t);
    if (!i) {
      if (c) {
        c.error("Bad element for Flickity: " + (i || t));
      }
      return;
    }
    this.element = i;
    if (this.element.flickityGUID) {
      var n = f[this.element.flickityGUID];
      if (n) n.option(e);
      return n;
    }
    if (l) {
      this.$element = l(this.element);
    }
    this.options = a.extend({}, this.constructor.defaults);
    this.option(e);
    this._create();
  }
  p.defaults = {
    accessibility: true,
    cellAlign: "center",
    freeScrollFriction: 0.075,
    friction: 0.28,
    namespaceJQueryEvents: true,
    percentPosition: true,
    resize: true,
    selectedAttraction: 0.025,
    setGallerySize: true,
  };
  p.createMethods = [];
  var v = p.prototype;
  a.extend(v, e.prototype);
  v._create = function () {
    var t = (this.guid = ++d);
    this.element.flickityGUID = t;
    f[t] = this;
    this.selectedIndex = 0;
    this.restingFrames = 0;
    this.x = 0;
    this.velocity = 0;
    this.originSide = this.options.rightToLeft ? "right" : "left";
    this.viewport = document.createElement("div");
    this.viewport.className = "flickity-viewport";
    this._createSlider();
    if (this.options.resize || this.options.watchCSS) {
      n.addEventListener("resize", this);
    }
    for (var e in this.options.on) {
      var i = this.options.on[e];
      this.on(e, i);
    }
    p.createMethods.forEach(function (t) {
      this[t]();
    }, this);
    if (this.options.watchCSS) {
      this.watchCSS();
    } else {
      this.activate();
    }
  };
  v.option = function (t) {
    a.extend(this.options, t);
  };
  v.activate = function () {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.element.classList.add("flickity-enabled");
    if (this.options.rightToLeft) {
      this.element.classList.add("flickity-rtl");
    }
    this.getSize();
    var t = this._filterFindCellElements(this.element.children);
    u(t, this.slider);
    this.viewport.appendChild(this.slider);
    this.element.appendChild(this.viewport);
    this.reloadCells();
    if (this.options.accessibility) {
      this.element.tabIndex = 0;
      this.element.addEventListener("keydown", this);
    }
    this.emitEvent("activate");
    this.selectInitialIndex();
    this.isInitActivated = true;
    this.dispatchEvent("ready");
  };
  v._createSlider = function () {
    var t = document.createElement("div");
    t.className = "flickity-slider";
    t.style[this.originSide] = 0;
    this.slider = t;
  };
  v._filterFindCellElements = function (t) {
    return a.filterFindElements(t, this.options.cellSelector);
  };
  v.reloadCells = function () {
    this.cells = this._makeCells(this.slider.children);
    this.positionCells();
    this._getWrapShiftCells();
    this.setGallerySize();
  };
  v._makeCells = function (t) {
    var e = this._filterFindCellElements(t);
    var i = e.map(function (t) {
      return new s(t, this);
    }, this);
    return i;
  };
  v.getLastCell = function () {
    return this.cells[this.cells.length - 1];
  };
  v.getLastSlide = function () {
    return this.slides[this.slides.length - 1];
  };
  v.positionCells = function () {
    this._sizeCells(this.cells);
    this._positionCells(0);
  };
  v._positionCells = function (t) {
    t = t || 0;
    this.maxCellHeight = t ? this.maxCellHeight || 0 : 0;
    var e = 0;
    if (t > 0) {
      var i = this.cells[t - 1];
      e = i.x + i.size.outerWidth;
    }
    var n = this.cells.length;
    for (var s = t; s < n; s++) {
      var r = this.cells[s];
      r.setPosition(e);
      e += r.size.outerWidth;
      this.maxCellHeight = Math.max(r.size.outerHeight, this.maxCellHeight);
    }
    this.slideableWidth = e;
    this.updateSlides();
    this._containSlides();
    this.slidesWidth = n
      ? this.getLastSlide().target - this.slides[0].target
      : 0;
  };
  v._sizeCells = function (t) {
    t.forEach(function (t) {
      t.getSize();
    });
  };
  v.updateSlides = function () {
    this.slides = [];
    if (!this.cells.length) {
      return;
    }
    var n = new o(this);
    this.slides.push(n);
    var t = this.originSide == "left";
    var s = t ? "marginRight" : "marginLeft";
    var r = this._getCanCellFit();
    this.cells.forEach(function (t, e) {
      if (!n.cells.length) {
        n.addCell(t);
        return;
      }
      var i = n.outerWidth - n.firstMargin + (t.size.outerWidth - t.size[s]);
      if (r.call(this, e, i)) {
        n.addCell(t);
      } else {
        n.updateTarget();
        n = new o(this);
        this.slides.push(n);
        n.addCell(t);
      }
    }, this);
    n.updateTarget();
    this.updateSelectedSlide();
  };
  v._getCanCellFit = function () {
    var t = this.options.groupCells;
    if (!t) {
      return function () {
        return false;
      };
    } else if (typeof t == "number") {
      var e = parseInt(t, 10);
      return function (t) {
        return t % e !== 0;
      };
    }
    var i = typeof t == "string" && t.match(/^(\d+)%$/);
    var n = i ? parseInt(i[1], 10) / 100 : 1;
    return function (t, e) {
      return e <= (this.size.innerWidth + 1) * n;
    };
  };
  v._init = v.reposition = function () {
    this.positionCells();
    this.positionSliderAtSelected();
  };
  v.getSize = function () {
    this.size = i(this.element);
    this.setCellAlign();
    this.cursorPosition = this.size.innerWidth * this.cellAlign;
  };
  var g = {
    center: { left: 0.5, right: 0.5 },
    left: { left: 0, right: 1 },
    right: { right: 0, left: 1 },
  };
  v.setCellAlign = function () {
    var t = g[this.options.cellAlign];
    this.cellAlign = t ? t[this.originSide] : this.options.cellAlign;
  };
  v.setGallerySize = function () {
    if (this.options.setGallerySize) {
      var t =
        this.options.adaptiveHeight && this.selectedSlide
          ? this.selectedSlide.height
          : this.maxCellHeight;
      this.viewport.style.height = t + "px";
    }
  };
  v._getWrapShiftCells = function () {
    if (!this.options.wrapAround) {
      return;
    }
    this._unshiftCells(this.beforeShiftCells);
    this._unshiftCells(this.afterShiftCells);
    var t = this.cursorPosition;
    var e = this.cells.length - 1;
    this.beforeShiftCells = this._getGapCells(t, e, -1);
    t = this.size.innerWidth - this.cursorPosition;
    this.afterShiftCells = this._getGapCells(t, 0, 1);
  };
  v._getGapCells = function (t, e, i) {
    var n = [];
    while (t > 0) {
      var s = this.cells[e];
      if (!s) {
        break;
      }
      n.push(s);
      e += i;
      t -= s.size.outerWidth;
    }
    return n;
  };
  v._containSlides = function () {
    if (
      !this.options.contain ||
      this.options.wrapAround ||
      !this.cells.length
    ) {
      return;
    }
    var t = this.options.rightToLeft;
    var e = t ? "marginRight" : "marginLeft";
    var i = t ? "marginLeft" : "marginRight";
    var n = this.slideableWidth - this.getLastCell().size[i];
    var s = n < this.size.innerWidth;
    var r = this.cursorPosition + this.cells[0].size[e];
    var o = n - this.size.innerWidth * (1 - this.cellAlign);
    this.slides.forEach(function (t) {
      if (s) {
        t.target = n * this.cellAlign;
      } else {
        t.target = Math.max(t.target, r);
        t.target = Math.min(t.target, o);
      }
    }, this);
  };
  v.dispatchEvent = function (t, e, i) {
    var n = e ? [e].concat(i) : i;
    this.emitEvent(t, n);
    if (l && this.$element) {
      t += this.options.namespaceJQueryEvents ? ".flickity" : "";
      var s = t;
      if (e) {
        var r = new l.Event(e);
        r.type = t;
        s = r;
      }
      this.$element.trigger(s, i);
    }
  };
  v.select = function (t, e, i) {
    if (!this.isActive) {
      return;
    }
    t = parseInt(t, 10);
    this._wrapSelect(t);
    if (this.options.wrapAround || e) {
      t = a.modulo(t, this.slides.length);
    }
    if (!this.slides[t]) {
      return;
    }
    var n = this.selectedIndex;
    this.selectedIndex = t;
    this.updateSelectedSlide();
    if (i) {
      this.positionSliderAtSelected();
    } else {
      this.startAnimation();
    }
    if (this.options.adaptiveHeight) {
      this.setGallerySize();
    }
    this.dispatchEvent("select", null, [t]);
    if (t != n) {
      this.dispatchEvent("change", null, [t]);
    }
    this.dispatchEvent("cellSelect");
  };
  v._wrapSelect = function (t) {
    var e = this.slides.length;
    var i = this.options.wrapAround && e > 1;
    if (!i) {
      return t;
    }
    var n = a.modulo(t, e);
    var s = Math.abs(n - this.selectedIndex);
    var r = Math.abs(n + e - this.selectedIndex);
    var o = Math.abs(n - e - this.selectedIndex);
    if (!this.isDragSelect && r < s) {
      t += e;
    } else if (!this.isDragSelect && o < s) {
      t -= e;
    }
    if (t < 0) {
      this.x -= this.slideableWidth;
    } else if (t >= e) {
      this.x += this.slideableWidth;
    }
  };
  v.previous = function (t, e) {
    this.select(this.selectedIndex - 1, t, e);
  };
  v.next = function (t, e) {
    this.select(this.selectedIndex + 1, t, e);
  };
  v.updateSelectedSlide = function () {
    var t = this.slides[this.selectedIndex];
    if (!t) {
      return;
    }
    this.unselectSelectedSlide();
    this.selectedSlide = t;
    t.select();
    this.selectedCells = t.cells;
    this.selectedElements = t.getCellElements();
    this.selectedCell = t.cells[0];
    this.selectedElement = this.selectedElements[0];
  };
  v.unselectSelectedSlide = function () {
    if (this.selectedSlide) {
      this.selectedSlide.unselect();
    }
  };
  v.selectInitialIndex = function () {
    var t = this.options.initialIndex;
    if (this.isInitActivated) {
      this.select(this.selectedIndex, false, true);
      return;
    }
    if (t && typeof t == "string") {
      var e = this.queryCell(t);
      if (e) {
        this.selectCell(t, false, true);
        return;
      }
    }
    var i = 0;
    if (t && this.slides[t]) {
      i = t;
    }
    this.select(i, false, true);
  };
  v.selectCell = function (t, e, i) {
    var n = this.queryCell(t);
    if (!n) {
      return;
    }
    var s = this.getCellSlideIndex(n);
    this.select(s, e, i);
  };
  v.getCellSlideIndex = function (t) {
    for (var e = 0; e < this.slides.length; e++) {
      var i = this.slides[e];
      var n = i.cells.indexOf(t);
      if (n != -1) {
        return e;
      }
    }
  };
  v.getCell = function (t) {
    for (var e = 0; e < this.cells.length; e++) {
      var i = this.cells[e];
      if (i.element == t) {
        return i;
      }
    }
  };
  v.getCells = function (t) {
    t = a.makeArray(t);
    var i = [];
    t.forEach(function (t) {
      var e = this.getCell(t);
      if (e) {
        i.push(e);
      }
    }, this);
    return i;
  };
  v.getCellElements = function () {
    return this.cells.map(function (t) {
      return t.element;
    });
  };
  v.getParentCell = function (t) {
    var e = this.getCell(t);
    if (e) {
      return e;
    }
    t = a.getParent(t, ".flickity-slider > *");
    return this.getCell(t);
  };
  v.getAdjacentCellElements = function (t, e) {
    if (!t) {
      return this.selectedSlide.getCellElements();
    }
    e = e === undefined ? this.selectedIndex : e;
    var i = this.slides.length;
    if (1 + t * 2 >= i) {
      return this.getCellElements();
    }
    var n = [];
    for (var s = e - t; s <= e + t; s++) {
      var r = this.options.wrapAround ? a.modulo(s, i) : s;
      var o = this.slides[r];
      if (o) {
        n = n.concat(o.getCellElements());
      }
    }
    return n;
  };
  v.queryCell = function (t) {
    if (typeof t == "number") {
      return this.cells[t];
    }
    if (typeof t == "string") {
      if (t.match(/^[#.]?[\d/]/)) {
        return;
      }
      t = this.element.querySelector(t);
    }
    return this.getCell(t);
  };
  v.uiChange = function () {
    this.emitEvent("uiChange");
  };
  v.childUIPointerDown = function (t) {
    if (t.type != "touchstart") {
      t.preventDefault();
    }
    this.focus();
  };
  v.onresize = function () {
    this.watchCSS();
    this.resize();
  };
  a.debounceMethod(p, "onresize", 150);
  v.resize = function () {
    if (!this.isActive) {
      return;
    }
    this.getSize();
    if (this.options.wrapAround) {
      this.x = a.modulo(this.x, this.slideableWidth);
    }
    this.positionCells();
    this._getWrapShiftCells();
    this.setGallerySize();
    this.emitEvent("resize");
    var t = this.selectedElements && this.selectedElements[0];
    this.selectCell(t, false, true);
  };
  v.watchCSS = function () {
    var t = this.options.watchCSS;
    if (!t) {
      return;
    }
    var e = h(this.element, ":after").content;
    if (e.indexOf("flickity") != -1) {
      this.activate();
    } else {
      this.deactivate();
    }
  };
  v.onkeydown = function (t) {
    var e = document.activeElement && document.activeElement != this.element;
    if (!this.options.accessibility || e) {
      return;
    }
    var i = p.keyboardHandlers[t.keyCode];
    if (i) {
      i.call(this);
    }
  };
  p.keyboardHandlers = {
    37: function () {
      var t = this.options.rightToLeft ? "next" : "previous";
      this.uiChange();
      this[t]();
    },
    39: function () {
      var t = this.options.rightToLeft ? "previous" : "next";
      this.uiChange();
      this[t]();
    },
  };
  v.focus = function () {
    var t = n.pageYOffset;
    this.element.focus({ preventScroll: true });
    if (n.pageYOffset != t) {
      n.scrollTo(n.pageXOffset, t);
    }
  };
  v.deactivate = function () {
    if (!this.isActive) {
      return;
    }
    this.element.classList.remove("flickity-enabled");
    this.element.classList.remove("flickity-rtl");
    this.unselectSelectedSlide();
    this.cells.forEach(function (t) {
      t.destroy();
    });
    this.element.removeChild(this.viewport);
    u(this.slider.children, this.element);
    if (this.options.accessibility) {
      this.element.removeAttribute("tabIndex");
      this.element.removeEventListener("keydown", this);
    }
    this.isActive = false;
    this.emitEvent("deactivate");
  };
  v.destroy = function () {
    this.deactivate();
    n.removeEventListener("resize", this);
    this.allOff();
    this.emitEvent("destroy");
    if (l && this.$element) {
      l.removeData(this.element, "flickity");
    }
    delete this.element.flickityGUID;
    delete f[this.guid];
  };
  a.extend(v, r);
  p.data = function (t) {
    t = a.getQueryElement(t);
    var e = t && t.flickityGUID;
    return e && f[e];
  };
  a.htmlInit(p, "flickity");
  if (l && l.bridget) {
    l.bridget("flickity", p);
  }
  p.setJQuery = function (t) {
    l = t;
  };
  p.Cell = s;
  p.Slide = o;
  return p;
});
/*!
 * Unipointer v2.3.0
 * base class for doing one thing with pointer event
 * MIT license
 */
(function (e, i) {
  if (typeof define == "function" && define.amd) {
    define("unipointer/unipointer", ["ev-emitter/ev-emitter"], function (t) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("ev-emitter"));
  } else {
    e.Unipointer = i(e, e.EvEmitter);
  }
})(window, function t(s, e) {
  function i() {}
  function n() {}
  var r = (n.prototype = Object.create(e.prototype));
  r.bindStartEvent = function (t) {
    this._bindStartEvent(t, true);
  };
  r.unbindStartEvent = function (t) {
    this._bindStartEvent(t, false);
  };
  r._bindStartEvent = function (t, e) {
    e = e === undefined ? true : e;
    var i = e ? "addEventListener" : "removeEventListener";
    var n = "mousedown";
    if (s.PointerEvent) {
      n = "pointerdown";
    } else if ("ontouchstart" in s) {
      n = "touchstart";
    }
    t[i](n, this);
  };
  r.handleEvent = function (t) {
    var e = "on" + t.type;
    if (this[e]) {
      this[e](t);
    }
  };
  r.getTouch = function (t) {
    for (var e = 0; e < t.length; e++) {
      var i = t[e];
      if (i.identifier == this.pointerIdentifier) {
        return i;
      }
    }
  };
  r.onmousedown = function (t) {
    var e = t.button;
    if (e && e !== 0 && e !== 1) {
      return;
    }
    this._pointerDown(t, t);
  };
  r.ontouchstart = function (t) {
    this._pointerDown(t, t.changedTouches[0]);
  };
  r.onpointerdown = function (t) {
    this._pointerDown(t, t);
  };
  r._pointerDown = function (t, e) {
    if (t.button || this.isPointerDown) {
      return;
    }
    this.isPointerDown = true;
    this.pointerIdentifier =
      e.pointerId !== undefined ? e.pointerId : e.identifier;
    this.pointerDown(t, e);
  };
  r.pointerDown = function (t, e) {
    this._bindPostStartEvents(t);
    this.emitEvent("pointerDown", [t, e]);
  };
  var o = {
    mousedown: ["mousemove", "mouseup"],
    touchstart: ["touchmove", "touchend", "touchcancel"],
    pointerdown: ["pointermove", "pointerup", "pointercancel"],
  };
  r._bindPostStartEvents = function (t) {
    if (!t) {
      return;
    }
    var e = o[t.type];
    e.forEach(function (t) {
      s.addEventListener(t, this);
    }, this);
    this._boundPointerEvents = e;
  };
  r._unbindPostStartEvents = function () {
    if (!this._boundPointerEvents) {
      return;
    }
    this._boundPointerEvents.forEach(function (t) {
      s.removeEventListener(t, this);
    }, this);
    delete this._boundPointerEvents;
  };
  r.onmousemove = function (t) {
    this._pointerMove(t, t);
  };
  r.onpointermove = function (t) {
    if (t.pointerId == this.pointerIdentifier) {
      this._pointerMove(t, t);
    }
  };
  r.ontouchmove = function (t) {
    var e = this.getTouch(t.changedTouches);
    if (e) {
      this._pointerMove(t, e);
    }
  };
  r._pointerMove = function (t, e) {
    this.pointerMove(t, e);
  };
  r.pointerMove = function (t, e) {
    this.emitEvent("pointerMove", [t, e]);
  };
  r.onmouseup = function (t) {
    this._pointerUp(t, t);
  };
  r.onpointerup = function (t) {
    if (t.pointerId == this.pointerIdentifier) {
      this._pointerUp(t, t);
    }
  };
  r.ontouchend = function (t) {
    var e = this.getTouch(t.changedTouches);
    if (e) {
      this._pointerUp(t, e);
    }
  };
  r._pointerUp = function (t, e) {
    this._pointerDone();
    this.pointerUp(t, e);
  };
  r.pointerUp = function (t, e) {
    this.emitEvent("pointerUp", [t, e]);
  };
  r._pointerDone = function () {
    this._pointerReset();
    this._unbindPostStartEvents();
    this.pointerDone();
  };
  r._pointerReset = function () {
    this.isPointerDown = false;
    delete this.pointerIdentifier;
  };
  r.pointerDone = i;
  r.onpointercancel = function (t) {
    if (t.pointerId == this.pointerIdentifier) {
      this._pointerCancel(t, t);
    }
  };
  r.ontouchcancel = function (t) {
    var e = this.getTouch(t.changedTouches);
    if (e) {
      this._pointerCancel(t, e);
    }
  };
  r._pointerCancel = function (t, e) {
    this._pointerDone();
    this.pointerCancel(t, e);
  };
  r.pointerCancel = function (t, e) {
    this.emitEvent("pointerCancel", [t, e]);
  };
  n.getPointerPoint = function (t) {
    return { x: t.pageX, y: t.pageY };
  };
  return n;
});
/*!
 * Unidragger v2.3.1
 * Draggable base class
 * MIT license
 */
(function (e, i) {
  if (typeof define == "function" && define.amd) {
    define("unidragger/unidragger", ["unipointer/unipointer"], function (t) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("unipointer"));
  } else {
    e.Unidragger = i(e, e.Unipointer);
  }
})(window, function t(r, e) {
  function i() {}
  var n = (i.prototype = Object.create(e.prototype));
  n.bindHandles = function () {
    this._bindHandles(true);
  };
  n.unbindHandles = function () {
    this._bindHandles(false);
  };
  n._bindHandles = function (t) {
    t = t === undefined ? true : t;
    var e = t ? "addEventListener" : "removeEventListener";
    var i = t ? this._touchActionValue : "";
    for (var n = 0; n < this.handles.length; n++) {
      var s = this.handles[n];
      this._bindStartEvent(s, t);
      s[e]("click", this);
      if (r.PointerEvent) {
        s.style.touchAction = i;
      }
    }
  };
  n._touchActionValue = "none";
  n.pointerDown = function (t, e) {
    var i = this.okayPointerDown(t);
    if (!i) {
      return;
    }
    this.pointerDownPointer = { pageX: e.pageX, pageY: e.pageY };
    t.preventDefault();
    this.pointerDownBlur();
    this._bindPostStartEvents(t);
    this.emitEvent("pointerDown", [t, e]);
  };
  var s = { TEXTAREA: true, INPUT: true, SELECT: true, OPTION: true };
  var o = {
    radio: true,
    checkbox: true,
    button: true,
    submit: true,
    image: true,
    file: true,
  };
  n.okayPointerDown = function (t) {
    var e = s[t.target.nodeName];
    var i = o[t.target.type];
    var n = !e || i;
    if (!n) {
      this._pointerReset();
    }
    return n;
  };
  n.pointerDownBlur = function () {
    var t = document.activeElement;
    var e = t && t.blur && t != document.body;
    if (e) {
      t.blur();
    }
  };
  n.pointerMove = function (t, e) {
    var i = this._dragPointerMove(t, e);
    this.emitEvent("pointerMove", [t, e, i]);
    this._dragMove(t, e, i);
  };
  n._dragPointerMove = function (t, e) {
    var i = {
      x: e.pageX - this.pointerDownPointer.pageX,
      y: e.pageY - this.pointerDownPointer.pageY,
    };
    if (!this.isDragging && this.hasDragStarted(i)) {
      this._dragStart(t, e);
    }
    return i;
  };
  n.hasDragStarted = function (t) {
    return Math.abs(t.x) > 3 || Math.abs(t.y) > 3;
  };
  n.pointerUp = function (t, e) {
    this.emitEvent("pointerUp", [t, e]);
    this._dragPointerUp(t, e);
  };
  n._dragPointerUp = function (t, e) {
    if (this.isDragging) {
      this._dragEnd(t, e);
    } else {
      this._staticClick(t, e);
    }
  };
  n._dragStart = function (t, e) {
    this.isDragging = true;
    this.isPreventingClicks = true;
    this.dragStart(t, e);
  };
  n.dragStart = function (t, e) {
    this.emitEvent("dragStart", [t, e]);
  };
  n._dragMove = function (t, e, i) {
    if (!this.isDragging) {
      return;
    }
    this.dragMove(t, e, i);
  };
  n.dragMove = function (t, e, i) {
    t.preventDefault();
    this.emitEvent("dragMove", [t, e, i]);
  };
  n._dragEnd = function (t, e) {
    this.isDragging = false;
    setTimeout(
      function () {
        delete this.isPreventingClicks;
      }.bind(this)
    );
    this.dragEnd(t, e);
  };
  n.dragEnd = function (t, e) {
    this.emitEvent("dragEnd", [t, e]);
  };
  n.onclick = function (t) {
    if (this.isPreventingClicks) {
      t.preventDefault();
    }
  };
  n._staticClick = function (t, e) {
    if (this.isIgnoringMouseUp && t.type == "mouseup") {
      return;
    }
    this.staticClick(t, e);
    if (t.type != "mouseup") {
      this.isIgnoringMouseUp = true;
      setTimeout(
        function () {
          delete this.isIgnoringMouseUp;
        }.bind(this),
        400
      );
    }
  };
  n.staticClick = function (t, e) {
    this.emitEvent("staticClick", [t, e]);
  };
  i.getPointerPoint = e.getPointerPoint;
  return i;
});
(function (n, s) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/drag", [
      "./flickity",
      "unidragger/unidragger",
      "fizzy-ui-utils/utils",
    ], function (t, e, i) {
      return s(n, t, e, i);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = s(
      n,
      require("./flickity"),
      require("unidragger"),
      require("fizzy-ui-utils")
    );
  } else {
    n.Flickity = s(n, n.Flickity, n.Unidragger, n.fizzyUIUtils);
  }
})(window, function t(n, e, i, a) {
  a.extend(e.defaults, { draggable: ">1", dragThreshold: 3 });
  e.createMethods.push("_createDrag");
  var s = e.prototype;
  a.extend(s, i.prototype);
  s._touchActionValue = "pan-y";
  var r = "createTouch" in document;
  var o = false;
  s._createDrag = function () {
    this.on("activate", this.onActivateDrag);
    this.on("uiChange", this._uiChangeDrag);
    this.on("deactivate", this.onDeactivateDrag);
    this.on("cellChange", this.updateDraggable);
    if (r && !o) {
      n.addEventListener("touchmove", function () {});
      o = true;
    }
  };
  s.onActivateDrag = function () {
    this.handles = [this.viewport];
    this.bindHandles();
    this.updateDraggable();
  };
  s.onDeactivateDrag = function () {
    this.unbindHandles();
    this.element.classList.remove("is-draggable");
  };
  s.updateDraggable = function () {
    if (this.options.draggable == ">1") {
      this.isDraggable = this.slides.length > 1;
    } else {
      this.isDraggable = this.options.draggable;
    }
    if (this.isDraggable) {
      this.element.classList.add("is-draggable");
    } else {
      this.element.classList.remove("is-draggable");
    }
  };
  s.bindDrag = function () {
    this.options.draggable = true;
    this.updateDraggable();
  };
  s.unbindDrag = function () {
    this.options.draggable = false;
    this.updateDraggable();
  };
  s._uiChangeDrag = function () {
    delete this.isFreeScrolling;
  };
  s.pointerDown = function (t, e) {
    if (!this.isDraggable) {
      this._pointerDownDefault(t, e);
      return;
    }
    var i = this.okayPointerDown(t);
    if (!i) {
      return;
    }
    this._pointerDownPreventDefault(t);
    this.pointerDownFocus(t);
    if (document.activeElement != this.element) {
      this.pointerDownBlur();
    }
    this.dragX = this.x;
    this.viewport.classList.add("is-pointer-down");
    this.pointerDownScroll = h();
    n.addEventListener("scroll", this);
    this._pointerDownDefault(t, e);
  };
  s._pointerDownDefault = function (t, e) {
    this.pointerDownPointer = { pageX: e.pageX, pageY: e.pageY };
    this._bindPostStartEvents(t);
    this.dispatchEvent("pointerDown", t, [e]);
  };
  var l = { INPUT: true, TEXTAREA: true, SELECT: true };
  s.pointerDownFocus = function (t) {
    var e = l[t.target.nodeName];
    if (!e) {
      this.focus();
    }
  };
  s._pointerDownPreventDefault = function (t) {
    var e = t.type == "touchstart";
    var i = t.pointerType == "touch";
    var n = l[t.target.nodeName];
    if (!e && !i && !n) {
      t.preventDefault();
    }
  };
  s.hasDragStarted = function (t) {
    return Math.abs(t.x) > this.options.dragThreshold;
  };
  s.pointerUp = function (t, e) {
    delete this.isTouchScrolling;
    this.viewport.classList.remove("is-pointer-down");
    this.dispatchEvent("pointerUp", t, [e]);
    this._dragPointerUp(t, e);
  };
  s.pointerDone = function () {
    n.removeEventListener("scroll", this);
    delete this.pointerDownScroll;
  };
  s.dragStart = function (t, e) {
    if (!this.isDraggable) {
      return;
    }
    this.dragStartPosition = this.x;
    this.startAnimation();
    n.removeEventListener("scroll", this);
    this.dispatchEvent("dragStart", t, [e]);
  };
  s.pointerMove = function (t, e) {
    var i = this._dragPointerMove(t, e);
    this.dispatchEvent("pointerMove", t, [e, i]);
    this._dragMove(t, e, i);
  };
  s.dragMove = function (t, e, i) {
    if (!this.isDraggable) {
      return;
    }
    t.preventDefault();
    this.previousDragX = this.dragX;
    var n = this.options.rightToLeft ? -1 : 1;
    if (this.options.wrapAround) {
      i.x %= this.slideableWidth;
    }
    var s = this.dragStartPosition + i.x * n;
    if (!this.options.wrapAround && this.slides.length) {
      var r = Math.max(-this.slides[0].target, this.dragStartPosition);
      s = s > r ? (s + r) * 0.5 : s;
      var o = Math.min(-this.getLastSlide().target, this.dragStartPosition);
      s = s < o ? (s + o) * 0.5 : s;
    }
    this.dragX = s;
    this.dragMoveTime = new Date();
    this.dispatchEvent("dragMove", t, [e, i]);
  };
  s.dragEnd = function (t, e) {
    if (!this.isDraggable) {
      return;
    }
    if (this.options.freeScroll) {
      this.isFreeScrolling = true;
    }
    var i = this.dragEndRestingSelect();
    if (this.options.freeScroll && !this.options.wrapAround) {
      var n = this.getRestingPosition();
      this.isFreeScrolling =
        -n > this.slides[0].target && -n < this.getLastSlide().target;
    } else if (!this.options.freeScroll && i == this.selectedIndex) {
      i += this.dragEndBoostSelect();
    }
    delete this.previousDragX;
    this.isDragSelect = this.options.wrapAround;
    this.select(i);
    delete this.isDragSelect;
    this.dispatchEvent("dragEnd", t, [e]);
  };
  s.dragEndRestingSelect = function () {
    var t = this.getRestingPosition();
    var e = Math.abs(this.getSlideDistance(-t, this.selectedIndex));
    var i = this._getClosestResting(t, e, 1);
    var n = this._getClosestResting(t, e, -1);
    var s = i.distance < n.distance ? i.index : n.index;
    return s;
  };
  s._getClosestResting = function (t, e, i) {
    var n = this.selectedIndex;
    var s = Infinity;
    var r =
      this.options.contain && !this.options.wrapAround
        ? function (t, e) {
            return t <= e;
          }
        : function (t, e) {
            return t < e;
          };
    while (r(e, s)) {
      n += i;
      s = e;
      e = this.getSlideDistance(-t, n);
      if (e === null) {
        break;
      }
      e = Math.abs(e);
    }
    return { distance: s, index: n - i };
  };
  s.getSlideDistance = function (t, e) {
    var i = this.slides.length;
    var n = this.options.wrapAround && i > 1;
    var s = n ? a.modulo(e, i) : e;
    var r = this.slides[s];
    if (!r) {
      return null;
    }
    var o = n ? this.slideableWidth * Math.floor(e / i) : 0;
    return t - (r.target + o);
  };
  s.dragEndBoostSelect = function () {
    if (
      this.previousDragX === undefined ||
      !this.dragMoveTime ||
      new Date() - this.dragMoveTime > 100
    ) {
      return 0;
    }
    var t = this.getSlideDistance(-this.dragX, this.selectedIndex);
    var e = this.previousDragX - this.dragX;
    if (t > 0 && e > 0) {
      return 1;
    } else if (t < 0 && e < 0) {
      return -1;
    }
    return 0;
  };
  s.staticClick = function (t, e) {
    var i = this.getParentCell(t.target);
    var n = i && i.element;
    var s = i && this.cells.indexOf(i);
    this.dispatchEvent("staticClick", t, [e, n, s]);
  };
  s.onscroll = function () {
    var t = h();
    var e = this.pointerDownScroll.x - t.x;
    var i = this.pointerDownScroll.y - t.y;
    if (Math.abs(e) > 3 || Math.abs(i) > 3) {
      this._pointerDone();
    }
  };
  function h() {
    return { x: n.pageXOffset, y: n.pageYOffset };
  }
  return e;
});
(function (n, s) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/prev-next-button", [
      "./flickity",
      "unipointer/unipointer",
      "fizzy-ui-utils/utils",
    ], function (t, e, i) {
      return s(n, t, e, i);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = s(
      n,
      require("./flickity"),
      require("unipointer"),
      require("fizzy-ui-utils")
    );
  } else {
    s(n, n.Flickity, n.Unipointer, n.fizzyUIUtils);
  }
})(window, function t(e, i, n, s) {
  "use strict";
  var r = "http://www.w3.org/2000/svg";
  function o(t, e) {
    this.direction = t;
    this.parent = e;
    this._create();
  }
  o.prototype = Object.create(n.prototype);
  o.prototype._create = function () {
    this.isEnabled = true;
    this.isPrevious = this.direction == -1;
    var t = this.parent.options.rightToLeft ? 1 : -1;
    this.isLeft = this.direction == t;
    var e = (this.element = document.createElement("button"));
    e.className = "flickity-button flickity-prev-next-button";
    e.className += this.isPrevious ? " previous" : " next";
    e.setAttribute("type", "button");
    this.disable();
    e.setAttribute("aria-label", this.isPrevious ? "Previous" : "Next");
    var i = this.createSVG();
    e.appendChild(i);
    this.parent.on("select", this.update.bind(this));
    this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent));
  };
  o.prototype.activate = function () {
    this.bindStartEvent(this.element);
    this.element.addEventListener("click", this);
    this.parent.element.appendChild(this.element);
  };
  o.prototype.deactivate = function () {
    this.parent.element.removeChild(this.element);
    this.unbindStartEvent(this.element);
    this.element.removeEventListener("click", this);
  };
  o.prototype.createSVG = function () {
    var t = document.createElementNS(r, "svg");
    t.setAttribute("class", "flickity-button-icon");
    t.setAttribute("viewBox", "0 0 100 100");
    var e = document.createElementNS(r, "path");
    var i = a(this.parent.options.arrowShape);
    e.setAttribute("d", i);
    e.setAttribute("class", "arrow");
    if (!this.isLeft) {
      e.setAttribute("transform", "translate(100, 100) rotate(180) ");
    }
    t.appendChild(e);
    return t;
  };
  function a(t) {
    if (typeof t == "string") {
      return t;
    }
    return (
      "M " +
      t.x0 +
      ",50" +
      " L " +
      t.x1 +
      "," +
      (t.y1 + 50) +
      " L " +
      t.x2 +
      "," +
      (t.y2 + 50) +
      " L " +
      t.x3 +
      ",50 " +
      " L " +
      t.x2 +
      "," +
      (50 - t.y2) +
      " L " +
      t.x1 +
      "," +
      (50 - t.y1) +
      " Z"
    );
  }
  o.prototype.handleEvent = s.handleEvent;
  o.prototype.onclick = function () {
    if (!this.isEnabled) {
      return;
    }
    this.parent.uiChange();
    var t = this.isPrevious ? "previous" : "next";
    this.parent[t]();
  };
  o.prototype.enable = function () {
    if (this.isEnabled) {
      return;
    }
    this.element.disabled = false;
    this.isEnabled = true;
  };
  o.prototype.disable = function () {
    if (!this.isEnabled) {
      return;
    }
    this.element.disabled = true;
    this.isEnabled = false;
  };
  o.prototype.update = function () {
    var t = this.parent.slides;
    if (this.parent.options.wrapAround && t.length > 1) {
      this.enable();
      return;
    }
    var e = t.length ? t.length - 1 : 0;
    var i = this.isPrevious ? 0 : e;
    var n = this.parent.selectedIndex == i ? "disable" : "enable";
    this[n]();
  };
  o.prototype.destroy = function () {
    this.deactivate();
    this.allOff();
  };
  s.extend(i.defaults, {
    prevNextButtons: true,
    arrowShape: { x0: 10, x1: 60, y1: 50, x2: 70, y2: 40, x3: 30 },
  });
  i.createMethods.push("_createPrevNextButtons");
  var l = i.prototype;
  l._createPrevNextButtons = function () {
    if (!this.options.prevNextButtons) {
      return;
    }
    this.prevButton = new o(-1, this);
    this.nextButton = new o(1, this);
    this.on("activate", this.activatePrevNextButtons);
  };
  l.activatePrevNextButtons = function () {
    this.prevButton.activate();
    this.nextButton.activate();
    this.on("deactivate", this.deactivatePrevNextButtons);
  };
  l.deactivatePrevNextButtons = function () {
    this.prevButton.deactivate();
    this.nextButton.deactivate();
    this.off("deactivate", this.deactivatePrevNextButtons);
  };
  i.PrevNextButton = o;
  return i;
});
(function (n, s) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/page-dots", [
      "./flickity",
      "unipointer/unipointer",
      "fizzy-ui-utils/utils",
    ], function (t, e, i) {
      return s(n, t, e, i);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = s(
      n,
      require("./flickity"),
      require("unipointer"),
      require("fizzy-ui-utils")
    );
  } else {
    s(n, n.Flickity, n.Unipointer, n.fizzyUIUtils);
  }
})(window, function t(e, i, n, s) {
  function r(t) {
    this.parent = t;
    this._create();
  }
  r.prototype = Object.create(n.prototype);
  r.prototype._create = function () {
    this.holder = document.createElement("ol");
    this.holder.className = "flickity-page-dots";
    this.dots = [];
    this.handleClick = this.onClick.bind(this);
    this.on("pointerDown", this.parent.childUIPointerDown.bind(this.parent));
  };
  r.prototype.activate = function () {
    this.setDots();
    this.holder.addEventListener("click", this.handleClick);
    this.bindStartEvent(this.holder);
    this.parent.element.appendChild(this.holder);
  };
  r.prototype.deactivate = function () {
    this.holder.removeEventListener("click", this.handleClick);
    this.unbindStartEvent(this.holder);
    this.parent.element.removeChild(this.holder);
  };
  r.prototype.setDots = function () {
    var t = this.parent.slides.length - this.dots.length;
    if (t > 0) {
      this.addDots(t);
    } else if (t < 0) {
      this.removeDots(-t);
    }
  };
  r.prototype.addDots = function (t) {
    var e = document.createDocumentFragment();
    var i = [];
    var n = this.dots.length;
    var s = n + t;
    for (var r = n; r < s; r++) {
      var o = document.createElement("li");
      o.className = "dot";
      o.setAttribute("aria-label", "Page dot " + (r + 1));
      e.appendChild(o);
      i.push(o);
    }
    this.holder.appendChild(e);
    this.dots = this.dots.concat(i);
  };
  r.prototype.removeDots = function (t) {
    var e = this.dots.splice(this.dots.length - t, t);
    e.forEach(function (t) {
      this.holder.removeChild(t);
    }, this);
  };
  r.prototype.updateSelected = function () {
    if (this.selectedDot) {
      this.selectedDot.className = "dot";
      this.selectedDot.removeAttribute("aria-current");
    }
    if (!this.dots.length) {
      return;
    }
    this.selectedDot = this.dots[this.parent.selectedIndex];
    this.selectedDot.className = "dot is-selected";
    this.selectedDot.setAttribute("aria-current", "step");
  };
  r.prototype.onTap = r.prototype.onClick = function (t) {
    var e = t.target;
    if (e.nodeName != "LI") {
      return;
    }
    this.parent.uiChange();
    var i = this.dots.indexOf(e);
    this.parent.select(i);
  };
  r.prototype.destroy = function () {
    this.deactivate();
    this.allOff();
  };
  i.PageDots = r;
  s.extend(i.defaults, { pageDots: true });
  i.createMethods.push("_createPageDots");
  var o = i.prototype;
  o._createPageDots = function () {
    if (!this.options.pageDots) {
      return;
    }
    this.pageDots = new r(this);
    this.on("activate", this.activatePageDots);
    this.on("select", this.updateSelectedPageDots);
    this.on("cellChange", this.updatePageDots);
    this.on("resize", this.updatePageDots);
    this.on("deactivate", this.deactivatePageDots);
  };
  o.activatePageDots = function () {
    this.pageDots.activate();
  };
  o.updateSelectedPageDots = function () {
    this.pageDots.updateSelected();
  };
  o.updatePageDots = function () {
    this.pageDots.setDots();
  };
  o.deactivatePageDots = function () {
    this.pageDots.deactivate();
  };
  i.PageDots = r;
  return i;
});
(function (t, n) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/player", [
      "ev-emitter/ev-emitter",
      "fizzy-ui-utils/utils",
      "./flickity",
    ], function (t, e, i) {
      return n(t, e, i);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = n(
      require("ev-emitter"),
      require("fizzy-ui-utils"),
      require("./flickity")
    );
  } else {
    n(t.EvEmitter, t.fizzyUIUtils, t.Flickity);
  }
})(window, function t(e, i, n) {
  function s(t) {
    this.parent = t;
    this.state = "stopped";
    this.onVisibilityChange = this.visibilityChange.bind(this);
    this.onVisibilityPlay = this.visibilityPlay.bind(this);
  }
  s.prototype = Object.create(e.prototype);
  s.prototype.play = function () {
    if (this.state == "playing") {
      return;
    }
    var t = document.hidden;
    if (t) {
      document.addEventListener("visibilitychange", this.onVisibilityPlay);
      return;
    }
    this.state = "playing";
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.tick();
  };
  s.prototype.tick = function () {
    if (this.state != "playing") {
      return;
    }
    var t = this.parent.options.autoPlay;
    t = typeof t == "number" ? t : 3e3;
    var e = this;
    this.clear();
    this.timeout = setTimeout(function () {
      e.parent.next(true);
      e.tick();
    }, t);
  };
  s.prototype.stop = function () {
    this.state = "stopped";
    this.clear();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  };
  s.prototype.clear = function () {
    clearTimeout(this.timeout);
  };
  s.prototype.pause = function () {
    if (this.state == "playing") {
      this.state = "paused";
      this.clear();
    }
  };
  s.prototype.unpause = function () {
    if (this.state == "paused") {
      this.play();
    }
  };
  s.prototype.visibilityChange = function () {
    var t = document.hidden;
    this[t ? "pause" : "unpause"]();
  };
  s.prototype.visibilityPlay = function () {
    this.play();
    document.removeEventListener("visibilitychange", this.onVisibilityPlay);
  };
  i.extend(n.defaults, { pauseAutoPlayOnHover: true });
  n.createMethods.push("_createPlayer");
  var r = n.prototype;
  r._createPlayer = function () {
    this.player = new s(this);
    this.on("activate", this.activatePlayer);
    this.on("uiChange", this.stopPlayer);
    this.on("pointerDown", this.stopPlayer);
    this.on("deactivate", this.deactivatePlayer);
  };
  r.activatePlayer = function () {
    if (!this.options.autoPlay) {
      return;
    }
    this.player.play();
    this.element.addEventListener("mouseenter", this);
  };
  r.playPlayer = function () {
    this.player.play();
  };
  r.stopPlayer = function () {
    this.player.stop();
  };
  r.pausePlayer = function () {
    this.player.pause();
  };
  r.unpausePlayer = function () {
    this.player.unpause();
  };
  r.deactivatePlayer = function () {
    this.player.stop();
    this.element.removeEventListener("mouseenter", this);
  };
  r.onmouseenter = function () {
    if (!this.options.pauseAutoPlayOnHover) {
      return;
    }
    this.player.pause();
    this.element.addEventListener("mouseleave", this);
  };
  r.onmouseleave = function () {
    this.player.unpause();
    this.element.removeEventListener("mouseleave", this);
  };
  n.Player = s;
  return n;
});
(function (i, n) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/add-remove-cell", [
      "./flickity",
      "fizzy-ui-utils/utils",
    ], function (t, e) {
      return n(i, t, e);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = n(i, require("./flickity"), require("fizzy-ui-utils"));
  } else {
    n(i, i.Flickity, i.fizzyUIUtils);
  }
})(window, function t(e, i, n) {
  function l(t) {
    var e = document.createDocumentFragment();
    t.forEach(function (t) {
      e.appendChild(t.element);
    });
    return e;
  }
  var s = i.prototype;
  s.insert = function (t, e) {
    var i = this._makeCells(t);
    if (!i || !i.length) {
      return;
    }
    var n = this.cells.length;
    e = e === undefined ? n : e;
    var s = l(i);
    var r = e == n;
    if (r) {
      this.slider.appendChild(s);
    } else {
      var o = this.cells[e].element;
      this.slider.insertBefore(s, o);
    }
    if (e === 0) {
      this.cells = i.concat(this.cells);
    } else if (r) {
      this.cells = this.cells.concat(i);
    } else {
      var a = this.cells.splice(e, n - e);
      this.cells = this.cells.concat(i).concat(a);
    }
    this._sizeCells(i);
    this.cellChange(e, true);
  };
  s.append = function (t) {
    this.insert(t, this.cells.length);
  };
  s.prepend = function (t) {
    this.insert(t, 0);
  };
  s.remove = function (t) {
    var e = this.getCells(t);
    if (!e || !e.length) {
      return;
    }
    var i = this.cells.length - 1;
    e.forEach(function (t) {
      t.remove();
      var e = this.cells.indexOf(t);
      i = Math.min(e, i);
      n.removeFrom(this.cells, t);
    }, this);
    this.cellChange(i, true);
  };
  s.cellSizeChange = function (t) {
    var e = this.getCell(t);
    if (!e) {
      return;
    }
    e.getSize();
    var i = this.cells.indexOf(e);
    this.cellChange(i);
  };
  s.cellChange = function (t, e) {
    var i = this.selectedElement;
    this._positionCells(t);
    this._getWrapShiftCells();
    this.setGallerySize();
    var n = this.getCell(i);
    if (n) {
      this.selectedIndex = this.getCellSlideIndex(n);
    }
    this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
    this.emitEvent("cellChange", [t]);
    this.select(this.selectedIndex);
    if (e) {
      this.positionSliderAtSelected();
    }
  };
  return i;
});
(function (i, n) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/lazyload", [
      "./flickity",
      "fizzy-ui-utils/utils",
    ], function (t, e) {
      return n(i, t, e);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = n(i, require("./flickity"), require("fizzy-ui-utils"));
  } else {
    n(i, i.Flickity, i.fizzyUIUtils);
  }
})(window, function t(e, i, o) {
  "use strict";
  i.createMethods.push("_createLazyload");
  var n = i.prototype;
  n._createLazyload = function () {
    this.on("select", this.lazyLoad);
  };
  n.lazyLoad = function () {
    var t = this.options.lazyLoad;
    if (!t) {
      return;
    }
    var e = typeof t == "number" ? t : 0;
    var i = this.getAdjacentCellElements(e);
    var n = [];
    i.forEach(function (t) {
      var e = s(t);
      n = n.concat(e);
    });
    n.forEach(function (t) {
      new r(t, this);
    }, this);
  };
  function s(t) {
    if (t.nodeName == "IMG") {
      var e = t.getAttribute("data-flickity-lazyload");
      var i = t.getAttribute("data-flickity-lazyload-src");
      var n = t.getAttribute("data-flickity-lazyload-srcset");
      if (e || i || n) {
        return [t];
      }
    }
    var s =
      "img[data-flickity-lazyload], " +
      "img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]";
    var r = t.querySelectorAll(s);
    return o.makeArray(r);
  }
  function r(t, e) {
    this.img = t;
    this.flickity = e;
    this.load();
  }
  r.prototype.handleEvent = o.handleEvent;
  r.prototype.load = function () {
    this.img.addEventListener("load", this);
    this.img.addEventListener("error", this);
    var t =
      this.img.getAttribute("data-flickity-lazyload") ||
      this.img.getAttribute("data-flickity-lazyload-src");
    var e = this.img.getAttribute("data-flickity-lazyload-srcset");
    this.img.src = t;
    if (e) {
      this.img.setAttribute("srcset", e);
    }
    this.img.removeAttribute("data-flickity-lazyload");
    this.img.removeAttribute("data-flickity-lazyload-src");
    this.img.removeAttribute("data-flickity-lazyload-srcset");
  };
  r.prototype.onload = function (t) {
    this.complete(t, "flickity-lazyloaded");
  };
  r.prototype.onerror = function (t) {
    this.complete(t, "flickity-lazyerror");
  };
  r.prototype.complete = function (t, e) {
    this.img.removeEventListener("load", this);
    this.img.removeEventListener("error", this);
    var i = this.flickity.getParentCell(this.img);
    var n = i && i.element;
    this.flickity.cellSizeChange(n);
    this.img.classList.add(e);
    this.flickity.dispatchEvent("lazyLoad", t, n);
  };
  i.LazyLoader = r;
  return i;
});
/*!
 * Flickity v2.2.2
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2021 Metafizzy
 */
(function (t, e) {
  if (typeof define == "function" && define.amd) {
    define("flickity/js/index", [
      "./flickity",
      "./drag",
      "./prev-next-button",
      "./page-dots",
      "./player",
      "./add-remove-cell",
      "./lazyload",
    ], e);
  } else if (typeof module == "object" && module.exports) {
    module.exports = e(
      require("./flickity"),
      require("./drag"),
      require("./prev-next-button"),
      require("./page-dots"),
      require("./player"),
      require("./add-remove-cell"),
      require("./lazyload")
    );
  }
})(window, function t(e) {
  return e;
});
/*!
 * Flickity asNavFor v2.0.2
 * enable asNavFor for Flickity
 */
(function (t, e) {
  if (typeof define == "function" && define.amd) {
    define("flickity-as-nav-for/as-nav-for", [
      "flickity/js/index",
      "fizzy-ui-utils/utils",
    ], e);
  } else if (typeof module == "object" && module.exports) {
    module.exports = e(require("flickity"), require("fizzy-ui-utils"));
  } else {
    t.Flickity = e(t.Flickity, t.fizzyUIUtils);
  }
})(window, function t(n, s) {
  n.createMethods.push("_createAsNavFor");
  var e = n.prototype;
  e._createAsNavFor = function () {
    this.on("activate", this.activateAsNavFor);
    this.on("deactivate", this.deactivateAsNavFor);
    this.on("destroy", this.destroyAsNavFor);
    var e = this.options.asNavFor;
    if (!e) {
      return;
    }
    var i = this;
    setTimeout(function t() {
      i.setNavCompanion(e);
    });
  };
  e.setNavCompanion = function (t) {
    t = s.getQueryElement(t);
    var e = n.data(t);
    if (!e || e == this) {
      return;
    }
    this.navCompanion = e;
    var i = this;
    this.onNavCompanionSelect = function () {
      i.navCompanionSelect();
    };
    e.on("select", this.onNavCompanionSelect);
    this.on("staticClick", this.onNavStaticClick);
    this.navCompanionSelect(true);
  };
  e.navCompanionSelect = function (t) {
    var e = this.navCompanion && this.navCompanion.selectedCells;
    if (!e) {
      return;
    }
    var i = e[0];
    var n = this.navCompanion.cells.indexOf(i);
    var s = n + e.length - 1;
    var r = Math.floor(a(n, s, this.navCompanion.cellAlign));
    this.selectCell(r, false, t);
    this.removeNavSelectedElements();
    if (r >= this.cells.length) {
      return;
    }
    var o = this.cells.slice(n, s + 1);
    this.navSelectedElements = o.map(function (t) {
      return t.element;
    });
    this.changeNavSelectedClass("add");
  };
  function a(t, e, i) {
    return (e - t) * i + t;
  }
  e.changeNavSelectedClass = function (e) {
    this.navSelectedElements.forEach(function (t) {
      t.classList[e]("is-nav-selected");
    });
  };
  e.activateAsNavFor = function () {
    this.navCompanionSelect(true);
  };
  e.removeNavSelectedElements = function () {
    if (!this.navSelectedElements) {
      return;
    }
    this.changeNavSelectedClass("remove");
    delete this.navSelectedElements;
  };
  e.onNavStaticClick = function (t, e, i, n) {
    if (typeof n == "number") {
      this.navCompanion.selectCell(n);
    }
  };
  e.deactivateAsNavFor = function () {
    this.removeNavSelectedElements();
  };
  e.destroyAsNavFor = function () {
    if (!this.navCompanion) {
      return;
    }
    this.navCompanion.off("select", this.onNavCompanionSelect);
    this.off("staticClick", this.onNavStaticClick);
    delete this.navCompanion;
  };
  return n;
});
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function (e, i) {
  "use strict";
  if (typeof define == "function" && define.amd) {
    define("imagesloaded/imagesloaded", ["ev-emitter/ev-emitter"], function (
      t
    ) {
      return i(e, t);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = i(e, require("ev-emitter"));
  } else {
    e.imagesLoaded = i(e, e.EvEmitter);
  }
})(typeof window !== "undefined" ? window : this, function t(e, i) {
  var s = e.jQuery;
  var r = e.console;
  function o(t, e) {
    for (var i in e) {
      t[i] = e[i];
    }
    return t;
  }
  var n = Array.prototype.slice;
  function a(t) {
    if (Array.isArray(t)) {
      return t;
    }
    var e = typeof t == "object" && typeof t.length == "number";
    if (e) {
      return n.call(t);
    }
    return [t];
  }
  function l(t, e, i) {
    if (!(this instanceof l)) {
      return new l(t, e, i);
    }
    var n = t;
    if (typeof t == "string") {
      n = document.querySelectorAll(t);
    }
    if (!n) {
      r.error("Bad element for imagesLoaded " + (n || t));
      return;
    }
    this.elements = a(n);
    this.options = o({}, this.options);
    if (typeof e == "function") {
      i = e;
    } else {
      o(this.options, e);
    }
    if (i) {
      this.on("always", i);
    }
    this.getImages();
    if (s) {
      this.jqDeferred = new s.Deferred();
    }
    setTimeout(this.check.bind(this));
  }
  l.prototype = Object.create(i.prototype);
  l.prototype.options = {};
  l.prototype.getImages = function () {
    this.images = [];
    this.elements.forEach(this.addElementImages, this);
  };
  l.prototype.addElementImages = function (t) {
    if (t.nodeName == "IMG") {
      this.addImage(t);
    }
    if (this.options.background === true) {
      this.addElementBackgroundImages(t);
    }
    var e = t.nodeType;
    if (!e || !h[e]) {
      return;
    }
    var i = t.querySelectorAll("img");
    for (var n = 0; n < i.length; n++) {
      var s = i[n];
      this.addImage(s);
    }
    if (typeof this.options.background == "string") {
      var r = t.querySelectorAll(this.options.background);
      for (n = 0; n < r.length; n++) {
        var o = r[n];
        this.addElementBackgroundImages(o);
      }
    }
  };
  var h = { 1: true, 9: true, 11: true };
  l.prototype.addElementBackgroundImages = function (t) {
    var e = getComputedStyle(t);
    if (!e) {
      return;
    }
    var i = /url\((['"])?(.*?)\1\)/gi;
    var n = i.exec(e.backgroundImage);
    while (n !== null) {
      var s = n && n[2];
      if (s) {
        this.addBackground(s, t);
      }
      n = i.exec(e.backgroundImage);
    }
  };
  l.prototype.addImage = function (t) {
    var e = new c(t);
    this.images.push(e);
  };
  l.prototype.addBackground = function (t, e) {
    var i = new u(t, e);
    this.images.push(i);
  };
  l.prototype.check = function () {
    var n = this;
    this.progressedCount = 0;
    this.hasAnyBroken = false;
    if (!this.images.length) {
      this.complete();
      return;
    }
    function e(t, e, i) {
      setTimeout(function () {
        n.progress(t, e, i);
      });
    }
    this.images.forEach(function (t) {
      t.once("progress", e);
      t.check();
    });
  };
  l.prototype.progress = function (t, e, i) {
    this.progressedCount++;
    this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded;
    this.emitEvent("progress", [this, t, e]);
    if (this.jqDeferred && this.jqDeferred.notify) {
      this.jqDeferred.notify(this, t);
    }
    if (this.progressedCount == this.images.length) {
      this.complete();
    }
    if (this.options.debug && r) {
      r.log("progress: " + i, t, e);
    }
  };
  l.prototype.complete = function () {
    var t = this.hasAnyBroken ? "fail" : "done";
    this.isComplete = true;
    this.emitEvent(t, [this]);
    this.emitEvent("always", [this]);
    if (this.jqDeferred) {
      var e = this.hasAnyBroken ? "reject" : "resolve";
      this.jqDeferred[e](this);
    }
  };
  function c(t) {
    this.img = t;
  }
  c.prototype = Object.create(i.prototype);
  c.prototype.check = function () {
    var t = this.getIsImageComplete();
    if (t) {
      this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
      return;
    }
    this.proxyImage = new Image();
    this.proxyImage.addEventListener("load", this);
    this.proxyImage.addEventListener("error", this);
    this.img.addEventListener("load", this);
    this.img.addEventListener("error", this);
    this.proxyImage.src = this.img.src;
  };
  c.prototype.getIsImageComplete = function () {
    return this.img.complete && this.img.naturalWidth;
  };
  c.prototype.confirm = function (t, e) {
    this.isLoaded = t;
    this.emitEvent("progress", [this, this.img, e]);
  };
  c.prototype.handleEvent = function (t) {
    var e = "on" + t.type;
    if (this[e]) {
      this[e](t);
    }
  };
  c.prototype.onload = function () {
    this.confirm(true, "onload");
    this.unbindEvents();
  };
  c.prototype.onerror = function () {
    this.confirm(false, "onerror");
    this.unbindEvents();
  };
  c.prototype.unbindEvents = function () {
    this.proxyImage.removeEventListener("load", this);
    this.proxyImage.removeEventListener("error", this);
    this.img.removeEventListener("load", this);
    this.img.removeEventListener("error", this);
  };
  function u(t, e) {
    this.url = t;
    this.element = e;
    this.img = new Image();
  }
  u.prototype = Object.create(c.prototype);
  u.prototype.check = function () {
    this.img.addEventListener("load", this);
    this.img.addEventListener("error", this);
    this.img.src = this.url;
    var t = this.getIsImageComplete();
    if (t) {
      this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
      this.unbindEvents();
    }
  };
  u.prototype.unbindEvents = function () {
    this.img.removeEventListener("load", this);
    this.img.removeEventListener("error", this);
  };
  u.prototype.confirm = function (t, e) {
    this.isLoaded = t;
    this.emitEvent("progress", [this, this.element, e]);
  };
  l.makeJQueryPlugin = function (t) {
    t = t || e.jQuery;
    if (!t) {
      return;
    }
    s = t;
    s.fn.imagesLoaded = function (t, e) {
      var i = new l(this, t, e);
      return i.jqDeferred.promise(s(this));
    };
  };
  l.makeJQueryPlugin();
  return l;
});
/*!
 * Flickity imagesLoaded v2.0.0
 * enables imagesLoaded option for Flickity
 */
(function (i, n) {
  if (typeof define == "function" && define.amd) {
    define(["flickity/js/index", "imagesloaded/imagesloaded"], function (t, e) {
      return n(i, t, e);
    });
  } else if (typeof module == "object" && module.exports) {
    module.exports = n(i, require("flickity"), require("imagesloaded"));
  } else {
    i.Flickity = n(i, i.Flickity, i.imagesLoaded);
  }
})(window, function t(e, i, s) {
  "use strict";
  i.createMethods.push("_createImagesLoaded");
  var n = i.prototype;
  n._createImagesLoaded = function () {
    this.on("activate", this.imagesLoaded);
  };
  n.imagesLoaded = function () {
    if (!this.options.imagesLoaded) {
      return;
    }
    var n = this;
    function t(t, e) {
      var i = n.getParentCell(e.img);
      n.cellSizeChange(i && i.element);
      if (!n.options.freeScroll) {
        n.positionSliderAtSelected();
      }
    }
    s(this.slider).on("progress", t);
  };
  return i;
});

const collectionSwipers = document.querySelectorAll(".swiper-collection");

collectionSwipers.forEach((swiper) => {
  const swiperWithoutLoop = swiper.classList.contains("noLoop");
  const collectionSwiper = new Swiper(swiper, {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: !swiperWithoutLoop ? false : true,
    centeredSlides: swiperWithoutLoop ? false : true,
    freeMode: swiperWithoutLoop ? false : true,
    zoom: {
      maxRatio: swiperWithoutLoop ? 3 : 1,
    },
  });
});

var ogl=function(t){"use strict";function e(t){let e=t[0],i=t[1],r=t[2];return Math.sqrt(e*e+i*i+r*r)}function i(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function r(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t}function s(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t}function n(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t}function a(t,e){let i=e[0],r=e[1],s=e[2],n=i*i+r*r+s*s;return n>0&&(n=1/Math.sqrt(n)),t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t}function h(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}const o=function(){const t=[0,0,0],e=[0,0,0];return function(r,s){i(t,r),i(e,s),a(t,t),a(e,e);let n=h(t,e);return n>1?0:n<-1?Math.PI:Math.acos(n)}}();class l extends Array{constructor(t=0,e=t,i=t){return super(t,e,i),this}get x(){return this[0]}set x(t){this[0]=t}get y(){return this[1]}set y(t){this[1]=t}get z(){return this[2]}set z(t){this[2]=t}set(t,e=t,i=t){return t.length?this.copy(t):(function(t,e,i,r){t[0]=e,t[1]=i,t[2]=r}(this,t,e,i),this)}copy(t){return i(this,t),this}add(t,e){return e?r(this,t,e):r(this,this,t),this}sub(t,e){return e?s(this,t,e):s(this,this,t),this}multiply(t){var e,i,r;return t.length?(i=this,r=t,(e=this)[0]=i[0]*r[0],e[1]=i[1]*r[1],e[2]=i[2]*r[2]):n(this,this,t),this}divide(t){var e,i,r;return t.length?(i=this,r=t,(e=this)[0]=i[0]/r[0],e[1]=i[1]/r[1],e[2]=i[2]/r[2]):n(this,this,1/t),this}inverse(t=this){var e,i;return i=t,(e=this)[0]=1/i[0],e[1]=1/i[1],e[2]=1/i[2],this}len(){return e(this)}distance(t){return t?function(t,e){let i=e[0]-t[0],r=e[1]-t[1],s=e[2]-t[2];return Math.sqrt(i*i+r*r+s*s)}(this,t):e(this)}squaredLen(){return this.squaredDistance()}squaredDistance(t){return t?function(t,e){let i=e[0]-t[0],r=e[1]-t[1],s=e[2]-t[2];return i*i+r*r+s*s}(this,t):function(t){let e=t[0],i=t[1],r=t[2];return e*e+i*i+r*r}(this)}negate(t=this){var e,i;return i=t,(e=this)[0]=-i[0],e[1]=-i[1],e[2]=-i[2],this}cross(t,e){return function(t,e,i){let r=e[0],s=e[1],n=e[2],a=i[0],h=i[1],o=i[2];t[0]=s*o-n*h,t[1]=n*a-r*o,t[2]=r*h-s*a}(this,t,e),this}scale(t){return n(this,this,t),this}normalize(){return a(this,this),this}dot(t){return h(this,t)}equals(t){return i=t,(e=this)[0]===i[0]&&e[1]===i[1]&&e[2]===i[2];var e,i}applyMatrix4(t){return function(t,e,i){let r=e[0],s=e[1],n=e[2],a=i[3]*r+i[7]*s+i[11]*n+i[15];a=a||1,t[0]=(i[0]*r+i[4]*s+i[8]*n+i[12])/a,t[1]=(i[1]*r+i[5]*s+i[9]*n+i[13])/a,t[2]=(i[2]*r+i[6]*s+i[10]*n+i[14])/a}(this,this,t),this}applyQuaternion(t){return function(t,e,i){let r=e[0],s=e[1],n=e[2],a=i[0],h=i[1],o=i[2],l=h*n-o*s,u=o*r-a*n,c=a*s-h*r,d=h*c-o*u,g=o*l-a*c,p=a*u-h*l,m=2*i[3];l*=m,u*=m,c*=m,d*=2,g*=2,p*=2,t[0]=r+l+d,t[1]=s+u+g,t[2]=n+c+p}(this,this,t),this}angle(t){return o(this,t)}lerp(t,e){return function(t,e,i,r){let s=e[0],n=e[1],a=e[2];t[0]=s+r*(i[0]-s),t[1]=n+r*(i[1]-n),t[2]=a+r*(i[2]-a)}(this,this,t,e),this}clone(){return new l(this[0],this[1],this[2])}fromArray(t,e=0){return this[0]=t[e],this[1]=t[e+1],this[2]=t[e+2],this}toArray(t=[],e=0){return t[e]=this[0],t[e+1]=this[1],t[e+2]=this[2],t}transformDirection(t){const e=this[0],i=this[1],r=this[2];return this[0]=t[0]*e+t[4]*i+t[8]*r,this[1]=t[1]*e+t[5]*i+t[9]*r,this[2]=t[2]*e+t[6]*i+t[10]*r,this.normalize()}}const u=new l;let c=0,d=0;class g{constructor(t,e={}){this.gl=t,this.attributes=e,this.id=c++,this.VAOs={},this.drawRange={start:0,count:0},this.instancedCount=0,this.gl.renderer.bindVertexArray(null),this.gl.renderer.currentGeometry=null,this.glState=this.gl.renderer.state;for(let t in e)this.addAttribute(t,e[t])}addAttribute(t,e){if(this.attributes[t]=e,e.id=d++,e.size=e.size||1,e.type=e.type||(e.data.constructor===Float32Array?this.gl.FLOAT:e.data.constructor===Uint16Array?this.gl.UNSIGNED_SHORT:this.gl.UNSIGNED_INT),e.target="index"===t?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,e.normalize=e.normalize||!1,e.buffer=this.gl.createBuffer(),e.count=e.data.length/e.size,e.divisor=e.instanced||0,e.needsUpdate=!1,this.updateAttribute(e),e.divisor){if(this.isInstanced=!0,this.instancedCount&&this.instancedCount!==e.count*e.divisor)return console.warn("geometry has multiple instanced buffers of different length"),this.instancedCount=Math.min(this.instancedCount,e.count*e.divisor);this.instancedCount=e.count*e.divisor}else"index"===t?this.drawRange.count=e.count:this.attributes.index||(this.drawRange.count=Math.max(this.drawRange.count,e.count))}updateAttribute(t){this.glState.boundBuffer!==t.id&&(this.gl.bindBuffer(t.target,t.buffer),this.glState.boundBuffer=t.id),this.gl.bufferData(t.target,t.data,this.gl.STATIC_DRAW),t.needsUpdate=!1}setIndex(t){this.addAttribute("index",t)}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}setInstancedCount(t){this.instancedCount=t}createVAO(t){this.VAOs[t.attributeOrder]=this.gl.renderer.createVertexArray(),this.gl.renderer.bindVertexArray(this.VAOs[t.attributeOrder]),this.bindAttributes(t)}bindAttributes(t){t.attributeLocations.forEach((t,e)=>{if(!this.attributes[e])return void console.warn(`active attribute ${e} not being supplied`);const i=this.attributes[e];this.gl.bindBuffer(i.target,i.buffer),this.glState.boundBuffer=i.id,this.gl.vertexAttribPointer(t,i.size,i.type,i.normalize,0,0),this.gl.enableVertexAttribArray(t),this.gl.renderer.vertexAttribDivisor(t,i.divisor)}),this.attributes.index&&this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.attributes.index.buffer)}draw({program:t,mode:e=this.gl.TRIANGLES}){this.gl.renderer.currentGeometry!==`${this.id}_${t.attributeOrder}`&&(this.VAOs[t.attributeOrder]||this.createVAO(t),this.gl.renderer.bindVertexArray(this.VAOs[t.attributeOrder]),this.gl.renderer.currentGeometry=`${this.id}_${t.attributeOrder}`),t.attributeLocations.forEach((t,e)=>{const i=this.attributes[e];i.needsUpdate&&this.updateAttribute(i)}),this.isInstanced?this.attributes.index?this.gl.renderer.drawElementsInstanced(e,this.drawRange.count,this.attributes.index.type,this.drawRange.start,this.instancedCount):this.gl.renderer.drawArraysInstanced(e,this.drawRange.start,this.drawRange.count,this.instancedCount):this.attributes.index?this.gl.drawElements(e,this.drawRange.count,this.attributes.index.type,this.drawRange.start):this.gl.drawArrays(e,this.drawRange.start,this.drawRange.count)}computeBoundingBox(t){!t&&this.attributes.position&&(t=this.attributes.position.data),t||console.warn("No position buffer found to compute bounds"),this.bounds||(this.bounds={min:new l,max:new l,center:new l,scale:new l,radius:1/0});const e=this.bounds.min,i=this.bounds.max,r=this.bounds.center,s=this.bounds.scale;e.set(1/0),i.set(-1/0);for(let r=0,s=t.length;r<s;r+=3){const s=t[r],n=t[r+1],a=t[r+2];e.x=Math.min(s,e.x),e.y=Math.min(n,e.y),e.z=Math.min(a,e.z),i.x=Math.max(s,i.x),i.y=Math.max(n,i.y),i.z=Math.max(a,i.z)}s.sub(i,e),r.add(e,i).divide(2)}computeBoundingSphere(t){!t&&this.attributes.position&&(t=this.attributes.position.data),t||console.warn("No position buffer found to compute bounds"),this.bounds||this.computeBoundingBox(t);let e=0;for(let i=0,r=t.length;i<r;i+=3)u.fromArray(t,i),e=Math.max(e,this.bounds.center.squaredDistance(u));this.bounds.radius=Math.sqrt(e)}remove(){this.vao&&this.gl.renderer.deleteVertexArray(this.vao);for(let t in this.attributes)this.gl.deleteBuffer(this.attributes[t].buffer),delete this.attributes[t]}}let p=0;const m={};class f{constructor(t,{vertex:e,fragment:i,uniforms:r={},transparent:s=!1,cullFace:n=t.BACK,frontFace:a=t.CCW,depthTest:h=!0,depthWrite:o=!0,depthFunc:l=t.LESS}={}){this.gl=t,this.uniforms=r,this.id=p++,e||console.warn("vertex shader not supplied"),i||console.warn("fragment shader not supplied"),this.transparent=s,this.cullFace=n,this.frontFace=a,this.depthTest=h,this.depthWrite=o,this.depthFunc=l,this.blendFunc={},this.blendEquation={},this.transparent&&!this.blendFunc.src&&(this.gl.renderer.premultipliedAlpha?this.setBlendFunc(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA):this.setBlendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA));const u=t.createShader(t.VERTEX_SHADER);t.shaderSource(u,e),t.compileShader(u),""!==t.getShaderInfoLog(u)&&console.warn(`${t.getShaderInfoLog(u)}\nVertex Shader\n${w(e)}`);const c=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(c,i),t.compileShader(c),""!==t.getShaderInfoLog(c)&&console.warn(`${t.getShaderInfoLog(c)}\nFragment Shader\n${w(i)}`),this.program=t.createProgram(),t.attachShader(this.program,u),t.attachShader(this.program,c),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))return console.warn(t.getProgramInfoLog(this.program));t.deleteShader(u),t.deleteShader(c),this.uniformLocations=new Map;let d=t.getProgramParameter(this.program,t.ACTIVE_UNIFORMS);for(let e=0;e<d;e++){let i=t.getActiveUniform(this.program,e);this.uniformLocations.set(i,t.getUniformLocation(this.program,i.name));const r=i.name.match(/(\w+)/g);i.uniformName=r[0],3===r.length?(i.isStructArray=!0,i.structIndex=Number(r[1]),i.structProperty=r[2]):2===r.length&&isNaN(Number(r[1]))&&(i.isStruct=!0,i.structProperty=r[1])}this.attributeLocations=new Map;const g=[],m=t.getProgramParameter(this.program,t.ACTIVE_ATTRIBUTES);for(let e=0;e<m;e++){const i=t.getActiveAttrib(this.program,e),r=t.getAttribLocation(this.program,i.name);g[r]=i.name,this.attributeLocations.set(i.name,r)}this.attributeOrder=g.join("")}setBlendFunc(t,e,i,r){this.blendFunc.src=t,this.blendFunc.dst=e,this.blendFunc.srcAlpha=i,this.blendFunc.dstAlpha=r,t&&(this.transparent=!0)}setBlendEquation(t,e){this.blendEquation.modeRGB=t,this.blendEquation.modeAlpha=e}applyState(){this.depthTest?this.gl.renderer.enable(this.gl.DEPTH_TEST):this.gl.renderer.disable(this.gl.DEPTH_TEST),this.cullFace?this.gl.renderer.enable(this.gl.CULL_FACE):this.gl.renderer.disable(this.gl.CULL_FACE),this.blendFunc.src?this.gl.renderer.enable(this.gl.BLEND):this.gl.renderer.disable(this.gl.BLEND),this.cullFace&&this.gl.renderer.setCullFace(this.cullFace),this.gl.renderer.setFrontFace(this.frontFace),this.gl.renderer.setDepthMask(this.depthWrite),this.gl.renderer.setDepthFunc(this.depthFunc),this.blendFunc.src&&this.gl.renderer.setBlendFunc(this.blendFunc.src,this.blendFunc.dst,this.blendFunc.srcAlpha,this.blendFunc.dstAlpha),this.blendEquation.modeRGB&&this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB,this.blendEquation.modeAlpha)}use({flipFaces:t=!1}={}){let e=-1;this.gl.renderer.currentProgram===this.id||(this.gl.useProgram(this.program),this.gl.renderer.currentProgram=this.id),this.uniformLocations.forEach((t,i)=>{let r=i.uniformName,s=this.uniforms[r];if(i.isStruct&&(s=s[i.structProperty],r+=`.${i.structProperty}`),i.isStructArray&&(s=s[i.structIndex][i.structProperty],r+=`[${i.structIndex}].${i.structProperty}`),!s)return M(`Active uniform ${r} has not been supplied`);if(s&&void 0===s.value)return M(`${r} uniform is missing a value parameter`);if(s.value.texture)return e+=1,s.value.update(e),x(this.gl,i.type,t,e);if(s.value.length&&s.value[0].texture){const r=[];return s.value.forEach(t=>{e+=1,t.update(e),r.push(e)}),x(this.gl,i.type,t,r)}x(this.gl,i.type,t,s.value)}),this.applyState(),t&&this.gl.renderer.setFrontFace(this.frontFace===this.gl.CCW?this.gl.CW:this.gl.CCW)}remove(){this.gl.deleteProgram(this.program)}}function x(t,e,i,r){r=r.length?function(t){const e=t.length,i=t[0].length;if(void 0===i)return t;const r=e*i;let s=m[r];s||(m[r]=s=new Float32Array(r));for(let r=0;r<e;r++)s.set(t[r],r*i);return s}(r):r;const s=t.renderer.state.uniformLocations.get(i);if(r.length)if(void 0===s)t.renderer.state.uniformLocations.set(i,r.slice(0));else{if(function(t,e){if(t.length!==e.length)return!1;for(let i=0,r=t.length;i<r;i++)if(t[i]!==e[i])return!1;return!0}(s,r))return;s.set(r),t.renderer.state.uniformLocations.set(i,s)}else{if(s===r)return;t.renderer.state.uniformLocations.set(i,r)}switch(e){case 5126:return r.length?t.uniform1fv(i,r):t.uniform1f(i,r);case 35664:return t.uniform2fv(i,r);case 35665:return t.uniform3fv(i,r);case 35666:return t.uniform4fv(i,r);case 35670:case 5124:case 35678:case 35680:return r.length?t.uniform1iv(i,r):t.uniform1i(i,r);case 35671:case 35667:return t.uniform2iv(i,r);case 35672:case 35668:return t.uniform3iv(i,r);case 35673:case 35669:return t.uniform4iv(i,r);case 35674:return t.uniformMatrix2fv(i,!1,r);case 35675:return t.uniformMatrix3fv(i,!1,r);case 35676:return t.uniformMatrix4fv(i,!1,r)}}function w(t){let e=t.split("\n");for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join("\n")}let b=0;function M(t){b>100||(console.warn(t),++b>100&&console.warn("More than 100 program warnings - stopping logs."))}const v=new l;function A(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function E(t,e,i,r,s){return t[0]=e,t[1]=i,t[2]=r,t[3]=s,t}function y(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=i*i+r*r+s*s+n*n;return a>0&&(a=1/Math.sqrt(a)),t[0]=i*a,t[1]=r*a,t[2]=s*a,t[3]=n*a,t}function F(t,e,i){let r=e[0],s=e[1],n=e[2],a=e[3],h=i[0],o=i[1],l=i[2],u=i[3];return t[0]=r*u+a*h+s*l-n*o,t[1]=s*u+a*o+n*h-r*l,t[2]=n*u+a*l+r*o-s*h,t[3]=a*u-r*h-s*o-n*l,t}const T=A,_=E,R=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]},S=y;class N extends Array{constructor(t=0,e=0,i=0,r=1){return super(t,e,i,r),this.onChange=(()=>{}),this}get x(){return this[0]}set x(t){this[0]=t,this.onChange()}get y(){return this[1]}set y(t){this[1]=t,this.onChange()}get z(){return this[2]}set z(t){this[2]=t,this.onChange()}get w(){return this[3]}set w(t){this[3]=t,this.onChange()}identity(){var t;return(t=this)[0]=0,t[1]=0,t[2]=0,t[3]=1,this.onChange(),this}set(t,e,i,r){return t.length?this.copy(t):(_(this,t,e,i,r),this.onChange(),this)}rotateX(t){return function(t,e,i){i*=.5;let r=e[0],s=e[1],n=e[2],a=e[3],h=Math.sin(i),o=Math.cos(i);t[0]=r*o+a*h,t[1]=s*o+n*h,t[2]=n*o-s*h,t[3]=a*o-r*h}(this,this,t),this.onChange(),this}rotateY(t){return function(t,e,i){i*=.5;let r=e[0],s=e[1],n=e[2],a=e[3],h=Math.sin(i),o=Math.cos(i);t[0]=r*o-n*h,t[1]=s*o+a*h,t[2]=n*o+r*h,t[3]=a*o-s*h}(this,this,t),this.onChange(),this}rotateZ(t){return function(t,e,i){i*=.5;let r=e[0],s=e[1],n=e[2],a=e[3],h=Math.sin(i),o=Math.cos(i);t[0]=r*o+s*h,t[1]=s*o-r*h,t[2]=n*o+a*h,t[3]=a*o-n*h}(this,this,t),this.onChange(),this}inverse(t=this){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=i*i+r*r+s*s+n*n,h=a?1/a:0;t[0]=-i*h,t[1]=-r*h,t[2]=-s*h,t[3]=n*h}(this,t),this.onChange(),this}conjugate(t=this){var e,i;return i=t,(e=this)[0]=-i[0],e[1]=-i[1],e[2]=-i[2],e[3]=i[3],this.onChange(),this}copy(t){return T(this,t),this.onChange(),this}normalize(t=this){return S(this,t),this.onChange(),this}multiply(t,e){return e?F(this,t,e):F(this,this,t),this.onChange(),this}dot(t){return R(this,t)}fromMatrix3(t){return function(t,e){let i,r=e[0]+e[4]+e[8];if(r>0)i=Math.sqrt(r+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{let r=0;e[4]>e[0]&&(r=1),e[8]>e[3*r+r]&&(r=2);let s=(r+1)%3,n=(r+2)%3;i=Math.sqrt(e[3*r+r]-e[3*s+s]-e[3*n+n]+1),t[r]=.5*i,i=.5/i,t[3]=(e[3*s+n]-e[3*n+s])*i,t[s]=(e[3*s+r]+e[3*r+s])*i,t[n]=(e[3*n+r]+e[3*r+n])*i}}(this,t),this.onChange(),this}fromEuler(t){return function(t,e,i="YXZ"){let r=Math.sin(.5*e[0]),s=Math.cos(.5*e[0]),n=Math.sin(.5*e[1]),a=Math.cos(.5*e[1]),h=Math.sin(.5*e[2]),o=Math.cos(.5*e[2]);"XYZ"===i?(t[0]=r*a*o+s*n*h,t[1]=s*n*o-r*a*h,t[2]=s*a*h+r*n*o,t[3]=s*a*o-r*n*h):"YXZ"===i?(t[0]=r*a*o+s*n*h,t[1]=s*n*o-r*a*h,t[2]=s*a*h-r*n*o,t[3]=s*a*o+r*n*h):"ZXY"===i?(t[0]=r*a*o-s*n*h,t[1]=s*n*o+r*a*h,t[2]=s*a*h+r*n*o,t[3]=s*a*o-r*n*h):"ZYX"===i?(t[0]=r*a*o-s*n*h,t[1]=s*n*o+r*a*h,t[2]=s*a*h-r*n*o,t[3]=s*a*o+r*n*h):"YZX"===i?(t[0]=r*a*o+s*n*h,t[1]=s*n*o+r*a*h,t[2]=s*a*h-r*n*o,t[3]=s*a*o-r*n*h):"XZY"===i&&(t[0]=r*a*o-s*n*h,t[1]=s*n*o-r*a*h,t[2]=s*a*h+r*n*o,t[3]=s*a*o+r*n*h)}(this,t,t.order),this}fromAxisAngle(t,e){return function(t,e,i){i*=.5;let r=Math.sin(i);t[0]=r*e[0],t[1]=r*e[1],t[2]=r*e[2],t[3]=Math.cos(i)}(this,t,e),this}slerp(t,e){return function(t,e,i,r){let s,n,a,h,o,l=e[0],u=e[1],c=e[2],d=e[3],g=i[0],p=i[1],m=i[2],f=i[3];(n=l*g+u*p+c*m+d*f)<0&&(n=-n,g=-g,p=-p,m=-m,f=-f),1-n>1e-6?(s=Math.acos(n),a=Math.sin(s),h=Math.sin((1-r)*s)/a,o=Math.sin(r*s)/a):(h=1-r,o=r),t[0]=h*l+o*g,t[1]=h*u+o*p,t[2]=h*c+o*m,t[3]=h*d+o*f}(this,this,t,e),this}fromArray(t,e=0){return this[0]=t[e],this[1]=t[e+1],this[2]=t[e+2],this[3]=t[e+3],this}toArray(t=[],e=0){return t[e]=this[0],t[e+1]=this[1],t[e+2]=this[2],t[e+3]=this[3],t}}function L(t,e,i){let r=e[0],s=e[1],n=e[2],a=e[3],h=e[4],o=e[5],l=e[6],u=e[7],c=e[8],d=e[9],g=e[10],p=e[11],m=e[12],f=e[13],x=e[14],w=e[15],b=i[0],M=i[1],v=i[2],A=i[3];return t[0]=b*r+M*h+v*c+A*m,t[1]=b*s+M*o+v*d+A*f,t[2]=b*n+M*l+v*g+A*x,t[3]=b*a+M*u+v*p+A*w,b=i[4],M=i[5],v=i[6],A=i[7],t[4]=b*r+M*h+v*c+A*m,t[5]=b*s+M*o+v*d+A*f,t[6]=b*n+M*l+v*g+A*x,t[7]=b*a+M*u+v*p+A*w,b=i[8],M=i[9],v=i[10],A=i[11],t[8]=b*r+M*h+v*c+A*m,t[9]=b*s+M*o+v*d+A*f,t[10]=b*n+M*l+v*g+A*x,t[11]=b*a+M*u+v*p+A*w,b=i[12],M=i[13],v=i[14],A=i[15],t[12]=b*r+M*h+v*c+A*m,t[13]=b*s+M*o+v*d+A*f,t[14]=b*n+M*l+v*g+A*x,t[15]=b*a+M*u+v*p+A*w,t}class P extends Array{constructor(t=1,e=0,i=0,r=0,s=0,n=1,a=0,h=0,o=0,l=0,u=1,c=0,d=0,g=0,p=0,m=1){return super(t,e,i,r,s,n,a,h,o,l,u,c,d,g,p,m),this}set x(t){this[12]=t}get x(){return this[12]}set y(t){this[13]=t}get y(){return this[13]}set z(t){this[14]=t}get z(){return this[14]}set w(t){this[15]=t}get w(){return this[15]}set(t,e,i,r,s,n,a,h,o,l,u,c,d,g,p,m){return t.length?this.copy(t):(function(t,e,i,r,s,n,a,h,o,l,u,c,d,g,p,m,f){t[0]=e,t[1]=i,t[2]=r,t[3]=s,t[4]=n,t[5]=a,t[6]=h,t[7]=o,t[8]=l,t[9]=u,t[10]=c,t[11]=d,t[12]=g,t[13]=p,t[14]=m,t[15]=f}(this,t,e,i,r,s,n,a,h,o,l,u,c,d,g,p,m),this)}translate(t,e=this){return function(t,e,i){let r,s,n,a,h,o,l,u,c,d,g,p,m=i[0],f=i[1],x=i[2];e===t?(t[12]=e[0]*m+e[4]*f+e[8]*x+e[12],t[13]=e[1]*m+e[5]*f+e[9]*x+e[13],t[14]=e[2]*m+e[6]*f+e[10]*x+e[14],t[15]=e[3]*m+e[7]*f+e[11]*x+e[15]):(r=e[0],s=e[1],n=e[2],a=e[3],h=e[4],o=e[5],l=e[6],u=e[7],c=e[8],d=e[9],g=e[10],p=e[11],t[0]=r,t[1]=s,t[2]=n,t[3]=a,t[4]=h,t[5]=o,t[6]=l,t[7]=u,t[8]=c,t[9]=d,t[10]=g,t[11]=p,t[12]=r*m+h*f+c*x+e[12],t[13]=s*m+o*f+d*x+e[13],t[14]=n*m+l*f+g*x+e[14],t[15]=a*m+u*f+p*x+e[15])}(this,e,t),this}rotateX(t,e=this){return function(t,e,i){let r=Math.sin(i),s=Math.cos(i),n=e[4],a=e[5],h=e[6],o=e[7],l=e[8],u=e[9],c=e[10],d=e[11];e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=n*s+l*r,t[5]=a*s+u*r,t[6]=h*s+c*r,t[7]=o*s+d*r,t[8]=l*s-n*r,t[9]=u*s-a*r,t[10]=c*s-h*r,t[11]=d*s-o*r}(this,e,t),this}rotateY(t,e=this){return function(t,e,i){let r=Math.sin(i),s=Math.cos(i),n=e[0],a=e[1],h=e[2],o=e[3],l=e[8],u=e[9],c=e[10],d=e[11];e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=n*s-l*r,t[1]=a*s-u*r,t[2]=h*s-c*r,t[3]=o*s-d*r,t[8]=n*r+l*s,t[9]=a*r+u*s,t[10]=h*r+c*s,t[11]=o*r+d*s}(this,e,t),this}rotateZ(t,e=this){return function(t,e,i){let r=Math.sin(i),s=Math.cos(i),n=e[0],a=e[1],h=e[2],o=e[3],l=e[4],u=e[5],c=e[6],d=e[7];e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=n*s+l*r,t[1]=a*s+u*r,t[2]=h*s+c*r,t[3]=o*s+d*r,t[4]=l*s-n*r,t[5]=u*s-a*r,t[6]=c*s-h*r,t[7]=d*s-o*r}(this,e,t),this}scale(t,e=this){return function(t,e,i){let r=i[0],s=i[1],n=i[2];t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*s,t[5]=e[5]*s,t[6]=e[6]*s,t[7]=e[7]*s,t[8]=e[8]*n,t[9]=e[9]*n,t[10]=e[10]*n,t[11]=e[11]*n,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]}(this,e,"number"==typeof t?[t,t,t]:t),this}multiply(t,e){return e?L(this,t,e):L(this,this,t),this}identity(){var t;return(t=this)[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}copy(t){var e,i;return i=t,(e=this)[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}fromPerspective({fov:t,aspect:e,near:i,far:r}={}){return function(t,e,i,r,s){let n=1/Math.tan(e/2),a=1/(r-s);t[0]=n/i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(s+r)*a,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*s*r*a,t[15]=0}(this,t,e,i,r),this}fromOrthogonal({left:t,right:e,bottom:i,top:r,near:s,far:n}){return function(t,e,i,r,s,n,a){let h=1/(e-i),o=1/(r-s),l=1/(n-a);t[0]=-2*h,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*l,t[11]=0,t[12]=(e+i)*h,t[13]=(s+r)*o,t[14]=(a+n)*l,t[15]=1}(this,t,e,i,r,s,n),this}fromQuaternion(t){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=i+i,h=r+r,o=s+s,l=i*a,u=r*a,c=r*h,d=s*a,g=s*h,p=s*o,m=n*a,f=n*h,x=n*o;t[0]=1-c-p,t[1]=u+x,t[2]=d-f,t[3]=0,t[4]=u-x,t[5]=1-l-p,t[6]=g+m,t[7]=0,t[8]=d+f,t[9]=g-m,t[10]=1-l-c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1}(this,t),this}setPosition(t){return this.x=t[0],this.y=t[1],this.z=t[2],this}inverse(t=this){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=e[4],h=e[5],o=e[6],l=e[7],u=e[8],c=e[9],d=e[10],g=e[11],p=e[12],m=e[13],f=e[14],x=e[15],w=i*h-r*a,b=i*o-s*a,M=i*l-n*a,v=r*o-s*h,A=r*l-n*h,E=s*l-n*o,y=u*m-c*p,F=u*f-d*p,T=u*x-g*p,_=c*f-d*m,R=c*x-g*m,S=d*x-g*f,N=w*S-b*R+M*_+v*T-A*F+E*y;N&&(N=1/N,t[0]=(h*S-o*R+l*_)*N,t[1]=(s*R-r*S-n*_)*N,t[2]=(m*E-f*A+x*v)*N,t[3]=(d*A-c*E-g*v)*N,t[4]=(o*T-a*S-l*F)*N,t[5]=(i*S-s*T+n*F)*N,t[6]=(f*M-p*E-x*b)*N,t[7]=(u*E-d*M+g*b)*N,t[8]=(a*R-h*T+l*y)*N,t[9]=(r*T-i*R-n*y)*N,t[10]=(p*A-m*M+x*w)*N,t[11]=(c*M-u*A-g*w)*N,t[12]=(h*F-a*_-o*y)*N,t[13]=(i*_-r*F+s*y)*N,t[14]=(m*b-p*v-f*w)*N,t[15]=(u*v-c*b+d*w)*N)}(this,t),this}compose(t,e,i){return function(t,e,i,r){let s=e[0],n=e[1],a=e[2],h=e[3],o=s+s,l=n+n,u=a+a,c=s*o,d=s*l,g=s*u,p=n*l,m=n*u,f=a*u,x=h*o,w=h*l,b=h*u,M=r[0],v=r[1],A=r[2];t[0]=(1-(p+f))*M,t[1]=(d+b)*M,t[2]=(g-w)*M,t[3]=0,t[4]=(d-b)*v,t[5]=(1-(c+f))*v,t[6]=(m+x)*v,t[7]=0,t[8]=(g+w)*A,t[9]=(m-x)*A,t[10]=(1-(c+p))*A,t[11]=0,t[12]=i[0],t[13]=i[1],t[14]=i[2],t[15]=1}(this,t,e,i),this}getRotation(t){return function(t,e){let i=e[0]+e[5]+e[10],r=0;i>0?(r=2*Math.sqrt(i+1),t[3]=.25*r,t[0]=(e[6]-e[9])/r,t[1]=(e[8]-e[2])/r,t[2]=(e[1]-e[4])/r):e[0]>e[5]&&e[0]>e[10]?(r=2*Math.sqrt(1+e[0]-e[5]-e[10]),t[3]=(e[6]-e[9])/r,t[0]=.25*r,t[1]=(e[1]+e[4])/r,t[2]=(e[8]+e[2])/r):e[5]>e[10]?(r=2*Math.sqrt(1+e[5]-e[0]-e[10]),t[3]=(e[8]-e[2])/r,t[0]=(e[1]+e[4])/r,t[1]=.25*r,t[2]=(e[6]+e[9])/r):(r=2*Math.sqrt(1+e[10]-e[0]-e[5]),t[3]=(e[1]-e[4])/r,t[0]=(e[8]+e[2])/r,t[1]=(e[6]+e[9])/r,t[2]=.25*r)}(t,this),this}getTranslation(t){var e,i;return i=this,(e=t)[0]=i[12],e[1]=i[13],e[2]=i[14],this}getScaling(t){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[4],a=e[5],h=e[6],o=e[8],l=e[9],u=e[10];t[0]=Math.sqrt(i*i+r*r+s*s),t[1]=Math.sqrt(n*n+a*a+h*h),t[2]=Math.sqrt(o*o+l*l+u*u)}(t,this),this}getMaxScaleOnAxis(){return function(t){let e=t[0],i=t[1],r=t[2],s=t[4],n=t[5],a=t[6],h=t[8],o=t[9],l=t[10];const u=e*e+i*i+r*r,c=s*s+n*n+a*a,d=h*h+o*o+l*l;return Math.sqrt(Math.max(u,c,d))}(this)}lookAt(t,e,i){return function(t,e,i,r){let s=e[0],n=e[1],a=e[2],h=r[0],o=r[1],l=r[2],u=s-i[0],c=n-i[1],d=a-i[2],g=u*u+c*c+d*d;g>0&&(u*=g=1/Math.sqrt(g),c*=g,d*=g);let p=o*d-l*c,m=l*u-h*d,f=h*c-o*u;(g=p*p+m*m+f*f)>0&&(p*=g=1/Math.sqrt(g),m*=g,f*=g),t[0]=p,t[1]=m,t[2]=f,t[3]=0,t[4]=c*f-d*m,t[5]=d*p-u*f,t[6]=u*m-c*p,t[7]=0,t[8]=u,t[9]=c,t[10]=d,t[11]=0,t[12]=s,t[13]=n,t[14]=a,t[15]=1}(this,t,e,i),this}determinant(){return function(t){let e=t[0],i=t[1],r=t[2],s=t[3],n=t[4],a=t[5],h=t[6],o=t[7],l=t[8],u=t[9],c=t[10],d=t[11],g=t[12],p=t[13],m=t[14],f=t[15];return(e*a-i*n)*(c*f-d*m)-(e*h-r*n)*(u*f-d*p)+(e*o-s*n)*(u*m-c*p)+(i*h-r*a)*(l*f-d*g)-(i*o-s*a)*(l*m-c*g)+(r*o-s*h)*(l*p-u*g)}(this)}}const O=new P;class B extends Array{constructor(t=0,e=t,i=t,r="YXZ"){return super(t,e,i),this.order=r,this.onChange=(()=>{}),this}get x(){return this[0]}set x(t){this[0]=t,this.onChange()}get y(){return this[1]}set y(t){this[1]=t,this.onChange()}get z(){return this[2]}set z(t){this[2]=t,this.onChange()}set(t,e=t,i=t){return t.length?this.copy(t):(this[0]=t,this[1]=e,this[2]=i,this.onChange(),this)}copy(t){return this[0]=t[0],this[1]=t[1],this[2]=t[2],this}reorder(t){return this.order=t,this.onChange(),this}fromRotationMatrix(t,e=this.order){return function(t,e,i="YXZ"){"XYZ"===i?(t[1]=Math.asin(Math.min(Math.max(e[8],-1),1)),Math.abs(e[8])<.99999?(t[0]=Math.atan2(-e[9],e[10]),t[2]=Math.atan2(-e[4],e[0])):(t[0]=Math.atan2(e[6],e[5]),t[2]=0)):"YXZ"===i?(t[0]=Math.asin(-Math.min(Math.max(e[9],-1),1)),Math.abs(e[9])<.99999?(t[1]=Math.atan2(e[8],e[10]),t[2]=Math.atan2(e[1],e[5])):(t[1]=Math.atan2(-e[2],e[0]),t[2]=0)):"ZXY"===i?(t[0]=Math.asin(Math.min(Math.max(e[6],-1),1)),Math.abs(e[6])<.99999?(t[1]=Math.atan2(-e[2],e[10]),t[2]=Math.atan2(-e[4],e[5])):(t[1]=0,t[2]=Math.atan2(e[1],e[0]))):"ZYX"===i?(t[1]=Math.asin(-Math.min(Math.max(e[2],-1),1)),Math.abs(e[2])<.99999?(t[0]=Math.atan2(e[6],e[10]),t[2]=Math.atan2(e[1],e[0])):(t[0]=0,t[2]=Math.atan2(-e[4],e[5]))):"YZX"===i?(t[2]=Math.asin(Math.min(Math.max(e[1],-1),1)),Math.abs(e[1])<.99999?(t[0]=Math.atan2(-e[9],e[5]),t[1]=Math.atan2(-e[2],e[0])):(t[0]=0,t[1]=Math.atan2(e[8],e[10]))):"XZY"===i&&(t[2]=Math.asin(-Math.min(Math.max(e[4],-1),1)),Math.abs(e[4])<.99999?(t[0]=Math.atan2(e[6],e[5]),t[1]=Math.atan2(e[8],e[0])):(t[0]=Math.atan2(-e[9],e[10]),t[1]=0))}(this,t,e),this}fromQuaternion(t,e=this.order){return O.fromQuaternion(t),this.fromRotationMatrix(O,e)}}class C{constructor(){this.parent=null,this.children=[],this.visible=!0,this.matrix=new P,this.worldMatrix=new P,this.matrixAutoUpdate=!0,this.position=new l,this.quaternion=new N,this.scale=new l(1),this.rotation=new B,this.up=new l(0,1,0),this.rotation.onChange=(()=>this.quaternion.fromEuler(this.rotation)),this.quaternion.onChange=(()=>this.rotation.fromQuaternion(this.quaternion))}setParent(t,e=!0){e&&this.parent&&t!==this.parent&&this.parent.removeChild(this,!1),this.parent=t,e&&t&&t.addChild(this,!1)}addChild(t,e=!0){~this.children.indexOf(t)||this.children.push(t),e&&t.setParent(this,!1)}removeChild(t,e=!0){~this.children.indexOf(t)&&this.children.splice(this.children.indexOf(t),1),e&&t.setParent(null,!1)}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.worldMatrixNeedsUpdate||t)&&(null===this.parent?this.worldMatrix.copy(this.matrix):this.worldMatrix.multiply(this.parent.worldMatrix,this.matrix),this.worldMatrixNeedsUpdate=!1,t=!0);for(let e=0,i=this.children.length;e<i;e++)this.children[e].updateMatrixWorld(t)}updateMatrix(){this.matrix.compose(this.quaternion,this.position,this.scale),this.worldMatrixNeedsUpdate=!0}traverse(t){if(!t(this))for(let e=0,i=this.children.length;e<i;e++)this.children[e].traverse(t)}decompose(){this.matrix.getTranslation(this.position),this.matrix.getRotation(this.quaternion),this.matrix.getScaling(this.scale),this.rotation.fromQuaternion(this.quaternion)}lookAt(t,e=!1){e?this.matrix.lookAt(this.position,t,this.up):this.matrix.lookAt(t,this.position,this.up),this.matrix.getRotation(this.quaternion),this.rotation.fromQuaternion(this.quaternion)}}const D=new P,U=new l,z=new l;function I(t,e,i){let r=e[0],s=e[1],n=e[2],a=e[3],h=e[4],o=e[5],l=e[6],u=e[7],c=e[8],d=i[0],g=i[1],p=i[2],m=i[3],f=i[4],x=i[5],w=i[6],b=i[7],M=i[8];return t[0]=d*r+g*a+p*l,t[1]=d*s+g*h+p*u,t[2]=d*n+g*o+p*c,t[3]=m*r+f*a+x*l,t[4]=m*s+f*h+x*u,t[5]=m*n+f*o+x*c,t[6]=w*r+b*a+M*l,t[7]=w*s+b*h+M*u,t[8]=w*n+b*o+M*c,t}class q extends Array{constructor(t=1,e=0,i=0,r=0,s=1,n=0,a=0,h=0,o=1){return super(t,e,i,r,s,n,a,h,o),this}set(t,e,i,r,s,n,a,h,o){return t.length?this.copy(t):(function(t,e,i,r,s,n,a,h,o,l){t[0]=e,t[1]=i,t[2]=r,t[3]=s,t[4]=n,t[5]=a,t[6]=h,t[7]=o,t[8]=l}(this,t,e,i,r,s,n,a,h,o),this)}translate(t,e=this){return function(t,e,i){let r=e[0],s=e[1],n=e[2],a=e[3],h=e[4],o=e[5],l=e[6],u=e[7],c=e[8],d=i[0],g=i[1];t[0]=r,t[1]=s,t[2]=n,t[3]=a,t[4]=h,t[5]=o,t[6]=d*r+g*a+l,t[7]=d*s+g*h+u,t[8]=d*n+g*o+c}(this,e,t),this}rotate(t,e=this){return function(t,e,i){let r=e[0],s=e[1],n=e[2],a=e[3],h=e[4],o=e[5],l=e[6],u=e[7],c=e[8],d=Math.sin(i),g=Math.cos(i);t[0]=g*r+d*a,t[1]=g*s+d*h,t[2]=g*n+d*o,t[3]=g*a-d*r,t[4]=g*h-d*s,t[5]=g*o-d*n,t[6]=l,t[7]=u,t[8]=c}(this,e,t),this}scale(t,e=this){return function(t,e,i){let r=i[0],s=i[1];t[0]=r*e[0],t[1]=r*e[1],t[2]=r*e[2],t[3]=s*e[3],t[4]=s*e[4],t[5]=s*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8]}(this,e,t),this}multiply(t,e){return e?I(this,t,e):I(this,this,t),this}identity(){var t;return(t=this)[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,this}copy(t){var e,i;return i=t,(e=this)[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}fromMatrix4(t){var e,i;return i=t,(e=this)[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[4],e[4]=i[5],e[5]=i[6],e[6]=i[8],e[7]=i[9],e[8]=i[10],this}fromQuaternion(t){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=i+i,h=r+r,o=s+s,l=i*a,u=r*a,c=r*h,d=s*a,g=s*h,p=s*o,m=n*a,f=n*h,x=n*o;t[0]=1-c-p,t[3]=u-x,t[6]=d+f,t[1]=u+x,t[4]=1-l-p,t[7]=g-m,t[2]=d-f,t[5]=g+m,t[8]=1-l-c}(this,t),this}fromBasis(t,e,i){return this.set(t[0],t[1],t[2],e[0],e[1],e[2],i[0],i[1],i[2]),this}inverse(t=this){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=e[4],h=e[5],o=e[6],l=e[7],u=e[8],c=u*a-h*l,d=-u*n+h*o,g=l*n-a*o,p=i*c+r*d+s*g;p&&(p=1/p,t[0]=c*p,t[1]=(-u*r+s*l)*p,t[2]=(h*r-s*a)*p,t[3]=d*p,t[4]=(u*i-s*o)*p,t[5]=(-h*i+s*n)*p,t[6]=g*p,t[7]=(-l*i+r*o)*p,t[8]=(a*i-r*n)*p)}(this,t),this}getNormalMatrix(t){return function(t,e){let i=e[0],r=e[1],s=e[2],n=e[3],a=e[4],h=e[5],o=e[6],l=e[7],u=e[8],c=e[9],d=e[10],g=e[11],p=e[12],m=e[13],f=e[14],x=e[15],w=i*h-r*a,b=i*o-s*a,M=i*l-n*a,v=r*o-s*h,A=r*l-n*h,E=s*l-n*o,y=u*m-c*p,F=u*f-d*p,T=u*x-g*p,_=c*f-d*m,R=c*x-g*m,S=d*x-g*f,N=w*S-b*R+M*_+v*T-A*F+E*y;N&&(N=1/N,t[0]=(h*S-o*R+l*_)*N,t[1]=(o*T-a*S-l*F)*N,t[2]=(a*R-h*T+l*y)*N,t[3]=(s*R-r*S-n*_)*N,t[4]=(i*S-s*T+n*F)*N,t[5]=(r*T-i*R-n*y)*N,t[6]=(m*E-f*A+x*v)*N,t[7]=(f*M-p*E-x*b)*N,t[8]=(p*A-m*M+x*w)*N)}(this,t),this}}let G=0;class Y extends C{constructor(t,{geometry:e,program:i,mode:r=t.TRIANGLES,frustumCulled:s=!0,renderOrder:n=0}={}){super(t),this.gl=t,this.id=G++,this.geometry=e,this.program=i,this.mode=r,this.frustumCulled=s,this.renderOrder=n,this.modelViewMatrix=new P,this.normalMatrix=new q,this.program.uniforms.modelMatrix||Object.assign(this.program.uniforms,{modelMatrix:{value:null},viewMatrix:{value:null},modelViewMatrix:{value:null},normalMatrix:{value:null},projectionMatrix:{value:null},cameraPosition:{value:null}})}draw({camera:t}={}){this.onBeforeRender&&this.onBeforeRender({mesh:this,camera:t}),t&&(this.program.uniforms.projectionMatrix.value=t.projectionMatrix,this.program.uniforms.cameraPosition.value=t.position,this.program.uniforms.viewMatrix.value=t.viewMatrix,this.modelViewMatrix.multiply(t.viewMatrix,this.worldMatrix),this.normalMatrix.getNormalMatrix(this.modelViewMatrix),this.program.uniforms.modelMatrix.value=this.worldMatrix,this.program.uniforms.modelViewMatrix.value=this.modelViewMatrix,this.program.uniforms.normalMatrix.value=this.normalMatrix);let e=this.program.cullFace&&this.worldMatrix.determinant()<0;this.program.use({flipFaces:e}),this.geometry.draw({mode:this.mode,program:this.program}),this.onAfterRender&&this.onAfterRender({mesh:this,camera:t})}}const k=new Uint8Array(4);function V(t){return 0==(t&t-1)}let X=0;class W{constructor(t,{image:e,target:i=t.TEXTURE_2D,type:r=t.UNSIGNED_BYTE,format:s=t.RGBA,internalFormat:n=s,wrapS:a=t.CLAMP_TO_EDGE,wrapT:h=t.CLAMP_TO_EDGE,generateMipmaps:o=!0,minFilter:l=(o?t.NEAREST_MIPMAP_LINEAR:t.LINEAR),magFilter:u=t.LINEAR,premultiplyAlpha:c=!1,unpackAlignment:d=4,flipY:g=!0,level:p=0,width:m,height:f=m}={}){this.gl=t,this.id=X++,this.image=e,this.target=i,this.type=r,this.format=s,this.internalFormat=n,this.minFilter=l,this.magFilter=u,this.wrapS=a,this.wrapT=h,this.generateMipmaps=o,this.premultiplyAlpha=c,this.unpackAlignment=d,this.flipY=g,this.level=p,this.width=m,this.height=f,this.texture=this.gl.createTexture(),this.store={image:null},this.glState=this.gl.renderer.state,this.state={},this.state.minFilter=this.gl.NEAREST_MIPMAP_LINEAR,this.state.magFilter=this.gl.LINEAR,this.state.wrapS=this.gl.REPEAT,this.state.wrapT=this.gl.REPEAT}bind(){this.glState.textureUnits[this.glState.activeTextureUnit]!==this.id&&(this.gl.bindTexture(this.target,this.texture),this.glState.textureUnits[this.glState.activeTextureUnit]=this.id)}update(t=0){const e=!(this.image===this.store.image&&!this.needsUpdate);(e||this.glState.textureUnits[t]!==this.id)&&(this.gl.renderer.activeTexture(t),this.bind()),e&&(this.needsUpdate=!1,this.flipY!==this.glState.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this.flipY),this.glState.flipY=this.flipY),this.premultiplyAlpha!==this.glState.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),this.glState.premultiplyAlpha=this.premultiplyAlpha),this.unpackAlignment!==this.glState.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this.unpackAlignment),this.glState.unpackAlignment=this.unpackAlignment),this.minFilter!==this.state.minFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MIN_FILTER,this.minFilter),this.state.minFilter=this.minFilter),this.magFilter!==this.state.magFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MAG_FILTER,this.magFilter),this.state.magFilter=this.magFilter),this.wrapS!==this.state.wrapS&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_S,this.wrapS),this.state.wrapS=this.wrapS),this.wrapT!==this.state.wrapT&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_T,this.wrapT),this.state.wrapT=this.wrapT),this.image?(this.image.width&&(this.width=this.image.width,this.height=this.image.height),this.gl.renderer.isWebgl2||ArrayBuffer.isView(this.image)?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,this.image):this.gl.texImage2D(this.target,this.level,this.internalFormat,this.format,this.type,this.image),this.generateMipmaps&&(this.gl.renderer.isWebgl2||V(this.image.width)&&V(this.image.height)?this.gl.generateMipmap(this.target):(this.generateMipmaps=!1,this.wrapS=this.wrapT=this.gl.CLAMP_TO_EDGE,this.minFilter=this.gl.LINEAR))):this.width?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,null):this.gl.texImage2D(this.target,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,k),this.store.image=this.image,this.onUpdate&&this.onUpdate())}}class j{constructor(t,{width:e=t.canvas.width,height:i=t.canvas.height,target:r=t.FRAMEBUFFER,color:s=1,depth:n=!0,stencil:a=!1,depthTexture:h=!1,wrapS:o=t.CLAMP_TO_EDGE,wrapT:l=t.CLAMP_TO_EDGE,minFilter:u=t.LINEAR,magFilter:c=u,type:d=t.UNSIGNED_BYTE,format:g=t.RGBA,internalFormat:p=g,unpackAlignment:m,premultiplyAlpha:f}={}){this.gl=t,this.width=e,this.height=i,this.buffer=this.gl.createFramebuffer(),this.target=r,this.gl.bindFramebuffer(this.target,this.buffer),this.textures=[];for(let r=0;r<s;r++)this.textures.push(new W(t,{width:e,height:i,wrapS:o,wrapT:l,minFilter:u,magFilter:c,type:d,format:g,internalFormat:p,unpackAlignment:m,premultiplyAlpha:f,flipY:!1,generateMipmaps:!1})),this.textures[r].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+r,this.gl.TEXTURE_2D,this.textures[r].texture,0);this.texture=this.textures[0],h&&(this.gl.renderer.isWebgl2||this.gl.renderer.getExtension("WEBGL_depth_texture"))?(this.depthTexture=new W(t,{width:e,height:i,wrapS:o,wrapT:l,minFilter:this.gl.NEAREST,magFilter:this.gl.NEAREST,flipY:!1,format:this.gl.DEPTH_COMPONENT,internalFormat:t.renderer.isWebgl2?this.gl.DEPTH_COMPONENT24:this.gl.DEPTH_COMPONENT,type:this.gl.UNSIGNED_INT,generateMipmaps:!1}),this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(n&&!a&&(this.depthBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,e,i),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.RENDERBUFFER,this.depthBuffer)),a&&!n&&(this.stencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,e,i),this.gl.framebufferRenderbuffer(this.target,this.gl.STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.stencilBuffer)),n&&a&&(this.depthStencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,e,i),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.depthStencilBuffer))),this.gl.bindFramebuffer(this.target,null)}}class H extends Array{constructor(t=0,e=0,i=0){return"string"==typeof t&&([t,e,i]=H.hexToRGB(t)),super(t,e,i),this}get r(){return this[0]}set r(t){this[0]=t}get g(){return this[1]}set g(t){this[1]=t}get b(){return this[2]}set b(t){this[2]=t}set(t,e,i){return"string"==typeof t&&([t,e,i]=H.hexToRGB(t)),t.length?this.copy(t):(this[0]=t,this[1]=e,this[2]=i,this)}copy(t){return this[0]=t[0],this[1]=t[1],this[2]=t[2],this}static hexToRGB(t){4===t.length&&(t=t[0]+t[1]+t[1]+t[2]+t[2]+t[3]+t[3]);const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e||console.warn(`Unable to convert hex string ${t} to rgb values`),[parseInt(e[1],16)/255,parseInt(e[2],16)/255,parseInt(e[3],16)/255]}}function Z(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t}function $(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t}function Q(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t}function K(t){var e=t[0],i=t[1];return Math.sqrt(e*e+i*i)}class J extends Array{constructor(t=0,e=t){return super(t,e),this}get x(){return this[0]}set x(t){this[0]=t}get y(){return this[1]}set y(t){this[1]=t}set(t,e=t){return t.length?this.copy(t):(function(t,e,i){t[0]=e,t[1]=i}(this,t,e),this)}copy(t){var e,i;return i=t,(e=this)[0]=i[0],e[1]=i[1],this}add(t,e){return e?Z(this,t,e):Z(this,this,t),this}sub(t,e){return e?$(this,t,e):$(this,this,t),this}multiply(t){var e,i,r;return t.length?(i=this,r=t,(e=this)[0]=i[0]*r[0],e[1]=i[1]*r[1]):Q(this,this,t),this}divide(t){var e,i,r;return t.length?(i=this,r=t,(e=this)[0]=i[0]/r[0],e[1]=i[1]/r[1]):Q(this,this,1/t),this}inverse(t=this){var e,i;return i=t,(e=this)[0]=1/i[0],e[1]=1/i[1],this}len(){return K(this)}distance(t){return t?(e=this,r=(i=t)[0]-e[0],s=i[1]-e[1],Math.sqrt(r*r+s*s)):K(this);var e,i,r,s}squaredLen(){return this.squaredDistance()}squaredDistance(t){return t?(e=this,r=(i=t)[0]-e[0],s=i[1]-e[1],r*r+s*s):function(t){var e=t[0],i=t[1];return e*e+i*i}(this);var e,i,r,s}negate(t=this){var e,i;return i=t,(e=this)[0]=-i[0],e[1]=-i[1],this}cross(t,e){return r=e,(i=t)[0]*r[1]-i[1]*r[0];var i,r}scale(t){return Q(this,this,t),this}normalize(){var t,e,i,r,s;return t=this,i=(e=this)[0],r=e[1],(s=i*i+r*r)>0&&(s=1/Math.sqrt(s)),t[0]=e[0]*s,t[1]=e[1]*s,this}dot(t){return i=t,(e=this)[0]*i[0]+e[1]*i[1];var e,i}equals(t){return i=t,(e=this)[0]===i[0]&&e[1]===i[1];var e,i}applyMatrix3(t){var e,i,r,s,n;return e=this,r=t,s=(i=this)[0],n=i[1],e[0]=r[0]*s+r[3]*n+r[6],e[1]=r[1]*s+r[4]*n+r[7],this}applyMatrix4(t){return function(t,e,i){let r=e[0],s=e[1];t[0]=i[0]*r+i[4]*s+i[12],t[1]=i[1]*r+i[5]*s+i[13]}(this,this,t),this}lerp(t,e){!function(t,e,i,r){var s=e[0],n=e[1];t[0]=s+r*(i[0]-s),t[1]=n+r*(i[1]-n)}(this,this,t,e)}clone(){return new J(this[0],this[1])}fromArray(t,e=0){return this[0]=t[e],this[1]=t[e+1],this}toArray(t=[],e=0){return t[e]=this[0],t[e+1]=this[1],t}}class tt extends g{constructor(t,{width:e=1,height:i=1,widthSegments:r=1,heightSegments:s=1,attributes:n={}}={}){const a=r,h=s,o=(a+1)*(h+1),l=a*h*6,u=new Float32Array(3*o),c=new Float32Array(3*o),d=new Float32Array(2*o),g=o>65536?new Uint32Array(l):new Uint16Array(l);tt.buildPlane(u,c,d,g,e,i,0,a,h),Object.assign(n,{position:{size:3,data:u},normal:{size:3,data:c},uv:{size:2,data:d},index:{data:g}}),super(t,n)}static buildPlane(t,e,i,r,s,n,a,h,o,l=0,u=1,c=2,d=1,g=-1,p=0,m=0){const f=p,x=s/h,w=n/o;for(let b=0;b<=o;b++){let M=b*w-n/2;for(let n=0;n<=h;n++,p++){let w=n*x-s/2;if(t[3*p+l]=w*d,t[3*p+u]=M*g,t[3*p+c]=a/2,e[3*p+l]=0,e[3*p+u]=0,e[3*p+c]=a>=0?1:-1,i[2*p]=n/h,i[2*p+1]=1-b/o,b===o||n===h)continue;let v=f+n+b*(h+1),A=f+n+(b+1)*(h+1),E=f+n+(b+1)*(h+1)+1,y=f+n+b*(h+1)+1;r[6*m]=v,r[6*m+1]=A,r[6*m+2]=y,r[6*m+3]=A,r[6*m+4]=E,r[6*m+5]=y,m++}}}}const et={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,DOLLY_PAN:3},it=new l,rt=new J,st=new J;const nt=new l,at=new l,ht=new l,ot=new P;const lt="\n    attribute vec2 uv;\n    attribute vec2 position;\n\n    varying vec2 vUv;\n\n    void main() {\n        vUv = uv;\n        gl_Position = vec4(position, 0, 1);\n    }\n",ut="\n    precision highp float;\n\n    uniform sampler2D tMap;\n    varying vec2 vUv;\n\n    void main() {\n        gl_FragColor = texture2D(tMap, vUv);\n    }\n",ct=new l,dt=new N,gt=new l,pt=new l,mt=new N,ft=new l;class xt{constructor({objects:t,data:e}){this.objects=t,this.data=e,this.elapsed=0,this.weight=1,this.duration=e.frames.length-1}update(t=1,e){const i=e?1:this.weight/t,r=this.elapsed%this.duration,s=Math.floor(r),n=r-s,a=this.data.frames[s],h=this.data.frames[(s+1)%this.duration];this.objects.forEach((t,e)=>{ct.fromArray(a.position,3*e),dt.fromArray(a.quaternion,4*e),gt.fromArray(a.scale,3*e),pt.fromArray(h.position,3*e),mt.fromArray(h.quaternion,4*e),ft.fromArray(h.scale,3*e),ct.lerp(pt,n),dt.slerp(mt,n),gt.lerp(ft,n),t.position.lerp(ct,i),t.quaternion.slerp(dt,i),t.scale.lerp(gt,i)})}}const wt=new P;const bt="\nprecision highp float;\nprecision highp int;\n\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat3 normalMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec3 vNormal;\n\nvoid main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n",Mt="\nprecision highp float;\nprecision highp int;\n\nvarying vec3 vNormal;\n\nvoid main() {\n    gl_FragColor.rgb = normalize(vNormal);\n    gl_FragColor.a = 1.0;\n}\n";const vt="\n    attribute vec2 uv;\n    attribute vec2 position;\n\n    varying vec2 vUv;\n\n    void main() {\n        vUv = uv;\n        gl_Position = vec4(position, 0, 1);\n    }\n",At="\n    precision highp float;\n\n    uniform sampler2D tMap;\n\n    uniform float uFalloff;\n    uniform float uAlpha;\n    uniform float uDissipation;\n\n    uniform float uAspect;\n    uniform vec2 uMouse;\n    uniform vec2 uVelocity;\n\n    varying vec2 vUv;\n\n    void main() {\n\n      vec2 cursor = vUv - uMouse;\n\n        vec4 color = texture2D(tMap, vUv) * uDissipation;\n\n        cursor.x *= uAspect;\n\n        vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));\n        float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;\n\n        color.rgb = mix(color.rgb, stamp, vec3(falloff));\n\n        gl_FragColor = color;\n    }\n";const Et="\n    attribute vec2 uv;\n    attribute vec2 position;\n\n    varying vec2 vUv;\n\n    void main() {\n        vUv = uv;\n        gl_Position = vec4(position, 0, 1);\n    }\n",yt="\n    precision highp float;\n\n    uniform sampler2D tMap;\n    varying vec2 vUv;\n\n    void main() {\n        gl_FragColor = texture2D(tMap, vUv);\n    }\n";return t.Animation=xt,t.Box=class extends g{constructor(t,{width:e=1,height:i=1,depth:r=1,widthSegments:s=1,heightSegments:n=1,depthSegments:a=1,attributes:h={}}={}){const o=s,l=n,u=a,c=(o+1)*(l+1)*2+(o+1)*(u+1)*2+(l+1)*(u+1)*2,d=6*(o*l*2+o*u*2+l*u*2),g=new Float32Array(3*c),p=new Float32Array(3*c),m=new Float32Array(2*c),f=c>65536?new Uint32Array(d):new Uint16Array(d);let x=0,w=0;tt.buildPlane(g,p,m,f,r,i,e,u,l,2,1,0,-1,-1,x,w),tt.buildPlane(g,p,m,f,r,i,-e,u,l,2,1,0,1,-1,x+=(u+1)*(l+1),w+=u*l),tt.buildPlane(g,p,m,f,e,r,i,u,l,0,2,1,1,1,x+=(u+1)*(l+1),w+=u*l),tt.buildPlane(g,p,m,f,e,r,-i,u,l,0,2,1,1,-1,x+=(o+1)*(u+1),w+=o*u),tt.buildPlane(g,p,m,f,e,i,-r,o,l,0,1,2,-1,-1,x+=(o+1)*(u+1),w+=o*u),tt.buildPlane(g,p,m,f,e,i,r,o,l,0,1,2,1,-1,x+=(o+1)*(l+1),w+=o*l),Object.assign(h,{position:{size:3,data:g},normal:{size:3,data:p},uv:{size:2,data:m},index:{data:f}}),super(t,h)}},t.Camera=class extends C{constructor(t,{near:e=.1,far:i=100,fov:r=45,aspect:s=1,left:n,right:a,bottom:h,top:o}={}){super(t),this.near=e,this.far=i,this.fov=r,this.aspect=s,this.projectionMatrix=new P,this.viewMatrix=new P,this.projectionViewMatrix=new P,n||a?this.orthographic({left:n,right:a,bottom:h,top:o}):this.perspective()}perspective({near:t=this.near,far:e=this.far,fov:i=this.fov,aspect:r=this.aspect}={}){return this.projectionMatrix.fromPerspective({fov:i*(Math.PI/180),aspect:r,near:t,far:e}),this.type="perspective",this}orthographic({near:t=this.near,far:e=this.far,left:i=-1,right:r=1,bottom:s=-1,top:n=1}={}){return this.projectionMatrix.fromOrthogonal({left:i,right:r,bottom:s,top:n,near:t,far:e}),this.type="orthographic",this}updateMatrixWorld(){return super.updateMatrixWorld(),this.viewMatrix.inverse(this.worldMatrix),this.projectionViewMatrix.multiply(this.projectionMatrix,this.viewMatrix),this}lookAt(t){return super.lookAt(t,!0),this}project(t){return t.applyMatrix4(this.viewMatrix),t.applyMatrix4(this.projectionMatrix),this}unproject(t){return t.applyMatrix4(D.inverse(this.projectionMatrix)),t.applyMatrix4(this.worldMatrix),this}updateFrustum(){this.frustum||(this.frustum=[new l,new l,new l,new l,new l,new l]);const t=this.projectionViewMatrix;this.frustum[0].set(t[3]-t[0],t[7]-t[4],t[11]-t[8]).constant=t[15]-t[12],this.frustum[1].set(t[3]+t[0],t[7]+t[4],t[11]+t[8]).constant=t[15]+t[12],this.frustum[2].set(t[3]+t[1],t[7]+t[5],t[11]+t[9]).constant=t[15]+t[13],this.frustum[3].set(t[3]-t[1],t[7]-t[5],t[11]-t[9]).constant=t[15]-t[13],this.frustum[4].set(t[3]-t[2],t[7]-t[6],t[11]-t[10]).constant=t[15]-t[14],this.frustum[5].set(t[3]+t[2],t[7]+t[6],t[11]+t[10]).constant=t[15]+t[14];for(let t=0;t<6;t++){const e=1/this.frustum[t].distance();this.frustum[t].multiply(e),this.frustum[t].constant*=e}}frustumIntersectsMesh(t){if(!t.geometry.attributes.position)return!0;t.geometry.bounds&&t.geometry.bounds.radius!==1/0||t.geometry.computeBoundingSphere();const e=U;e.copy(t.geometry.bounds.center),e.applyMatrix4(t.worldMatrix);const i=t.geometry.bounds.radius*t.worldMatrix.getMaxScaleOnAxis();return this.frustumIntersectsSphere(e,i)}frustumIntersectsSphere(t,e){const i=z;for(let r=0;r<6;r++){const s=this.frustum[r];if(i.copy(s).dot(t)+s.constant<-e)return!1}return!0}},t.Color=H,t.Cylinder=class extends g{constructor(t,{radius:e=.5,height:i=1,radialSegments:r=16,heightSegments:s=1,attributes:n={}}={}){const a=r,h=s,o=(r+1)*(s+1)+2,u=r*(2+2*s)*3,c=new Float32Array(3*o),d=new Float32Array(3*o),g=new Float32Array(2*o),p=o>65536?new Uint32Array(u):new Uint16Array(u);let m,f,x,w=0,b=new l;m=0,f=-.5*i,x=0,c[3*w+0]=m,c[3*w+1]=f,c[3*w+2]=x,b.set(m,f,x).normalize(),d[3*w]=b.x,d[3*w+1]=b.y,d[3*w+2]=b.z,g[2*w]=0,g[2*w+1]=1;let M=w;m=0,f=.5*i,x=0,c[3*++w+0]=m,c[3*w+1]=f,c[3*w+2]=x,b.set(m,f,x).normalize(),d[3*w]=b.x,d[3*w+1]=b.y,d[3*w+2]=b.z,g[2*w]=0,g[2*w+1]=0;let v=w;w++;for(var A=0;A<a+1;A++){let t=A/a;for(var E=0;E<h+1;E++){let r=E/h;m=Math.cos(t*Math.PI*2)*e,f=(r-.5)*i,x=Math.sin(t*Math.PI*2)*e,c[3*w+0]=m,c[3*w+1]=f,c[3*w+2]=x,b.set(m,f,x).normalize(),d[3*w]=b.x,d[3*w+1]=b.y,d[3*w+2]=b.z,g[2*w]=t,g[2*w+1]=1-r,w++}}let y=0,F=h+1;for(A=0;A<a;A++){let t=A+1;for(p[3*y+0]=M,p[3*y+1]=2+A*F,p[3*y+2]=2+t*F,y++,E=0;E<h;E++)p[3*y+0]=2+A*F+(E+0),p[3*y+1]=2+A*F+(E+1),p[3*y+2]=2+t*F+(E+0),p[3*++y+0]=2+t*F+(E+0),p[3*y+1]=2+A*F+(E+1),p[3*y+2]=2+t*F+(E+1),y++;p[3*y+0]=2+t*F+h,p[3*y+1]=2+A*F+h,p[3*y+2]=v,y++}Object.assign(n,{position:{size:3,data:c},normal:{size:3,data:d},uv:{size:2,data:g},index:{data:p}}),super(t,n)}},t.Euler=B,t.Flowmap=class{constructor(t,{size:e=512,falloff:i=.3,alpha:r=1,dissipation:s=.96}={}){const n=this;this.gl=t,this.uniform={value:null},this.mask={read:null,write:null,swap:()=>{let t=n.mask.read;n.mask.read=n.mask.write,n.mask.write=t,n.uniform.value=n.mask.read.texture}},function(){let i=t.renderer.extensions[`OES_texture_${t.renderer.isWebgl2?"":"half_"}float_linear`];const r={width:e,height:e,type:t.renderer.isWebgl2?t.HALF_FLOAT:t.renderer.extensions.OES_texture_half_float?t.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES:t.UNSIGNED_BYTE,format:t.RGBA,internalFormat:t.renderer.isWebgl2?t.RGBA16F:t.RGBA,minFilter:i?t.LINEAR:t.NEAREST,depth:!1};n.mask.read=new j(t,r),n.mask.write=new j(t,r),n.mask.swap()}(),this.aspect=1,this.mouse=new J,this.velocity=new J,this.mesh=new Y(t,{geometry:new g(t,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}}),program:new f(t,{vertex:vt,fragment:At,uniforms:{tMap:n.uniform,uFalloff:{value:.5*i},uAlpha:{value:r},uDissipation:{value:s},uAspect:{value:1},uMouse:{value:n.mouse},uVelocity:{value:n.velocity}},depthTest:!1})})}update(){this.mesh.program.uniforms.uAspect.value=this.aspect,this.gl.renderer.render({scene:this.mesh,target:this.mask.write,clear:!1}),this.mask.swap()}},t.GPGPU=class{constructor(t,{data:e=new Float32Array(16),geometry:i=new g(t,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}})}){this.gl=t;const r=e;this.passes=[],this.geometry=i,this.dataLength=r.length/4,this.size=Math.pow(2,Math.ceil(Math.log(Math.ceil(Math.sqrt(this.dataLength)))/Math.LN2)),this.coords=new Float32Array(2*this.dataLength);for(let t=0;t<this.dataLength;t++){const e=t%this.size/this.size,i=Math.floor(t/this.size)/this.size;this.coords.set([e,i],2*t)}const s=(()=>{if(r.length===this.size*this.size*4)return r;{const t=new Float32Array(this.size*this.size*4);return t.set(r),t}})();this.uniform={value:new W(t,{image:s,target:t.TEXTURE_2D,type:t.FLOAT,format:t.RGBA,internalFormat:t.renderer.isWebgl2?t.RGBA32F:t.RGBA,wrapS:t.CLAMP_TO_EDGE,wrapT:t.CLAMP_TO_EDGE,generateMipmaps:!1,minFilter:t.NEAREST,magFilter:t.NEAREST,width:this.size,flipY:!1})};const n={width:this.size,height:this.size,type:t.renderer.isWebgl2?t.HALF_FLOAT:t.renderer.extensions.OES_texture_half_float?t.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES:t.UNSIGNED_BYTE,format:t.RGBA,internalFormat:t.renderer.isWebgl2?t.RGBA16F:t.RGBA,minFilter:t.NEAREST,depth:!1,unpackAlignment:1};this.fbo={read:new j(t,n),write:new j(t,n),swap:()=>{let t=this.fbo.read;this.fbo.read=this.fbo.write,this.fbo.write=t,this.uniform.value=this.fbo.read.texture}}}addPass({vertex:t=Et,fragment:e=yt,uniforms:i={},textureUniform:r="tMap",enabled:s=!0}={}){i[r]=this.uniform;const n=new f(this.gl,{vertex:t,fragment:e,uniforms:i}),a={mesh:new Y(this.gl,{geometry:this.geometry,program:n}),program:n,uniforms:i,enabled:s,textureUniform:r};return this.passes.push(a),a}render(){this.passes.filter(t=>t.enabled).forEach((t,e)=>{this.gl.renderer.render({scene:t.mesh,target:this.fbo.write,clear:!1}),this.fbo.swap()})}},t.Geometry=g,t.Mat3=q,t.Mat4=P,t.Mesh=Y,t.NormalProgram=function(t){return new f(t,{vertex:bt,fragment:Mt})},t.Orbit=function(t,{element:e=document,enabled:i=!0,target:r=new l,ease:s=.25,inertia:n=.85,enableRotate:a=!0,rotateSpeed:h=.1,enableZoom:o=!0,zoomSpeed:u=1,enablePan:c=!0,panSpeed:d=.1,minPolarAngle:g=0,maxPolarAngle:p=Math.PI,minAzimuthAngle:m=-1/0,maxAzimuthAngle:f=1/0,minDistance:x=0,maxDistance:w=1/0}={}){this.enabled=i,this.target=r,s=s||1,n=n||1,this.minDistance=x,this.maxDistance=w;const b={radius:1,phi:0,theta:0},M={radius:1,phi:0,theta:0},v={radius:1,phi:0,theta:0},A=new l,E=new l;E.copy(t.position).sub(this.target),v.radius=M.radius=E.distance(),v.theta=M.theta=Math.atan2(E.x,E.z),v.phi=M.phi=Math.acos(Math.min(Math.max(E.y/M.radius,-1),1)),this.update=(()=>{M.radius*=b.radius,M.theta+=b.theta,M.phi+=b.phi,M.theta=Math.max(m,Math.min(f,M.theta)),M.phi=Math.max(g,Math.min(p,M.phi)),M.radius=Math.max(this.minDistance,Math.min(this.maxDistance,M.radius)),v.phi+=(M.phi-v.phi)*s,v.theta+=(M.theta-v.theta)*s,v.radius+=(M.radius-v.radius)*s,this.target.add(A);let e=v.radius*Math.sin(Math.max(1e-6,v.phi));E.x=e*Math.sin(v.theta),E.y=v.radius*Math.cos(v.phi),E.z=e*Math.cos(v.theta),t.position.copy(this.target).add(E),t.lookAt(this.target),b.theta*=n,b.phi*=n,A.multiply(n),b.radius=1});const y=new J,F=new J,T=new J;let _=et.NONE;function R(){return Math.pow(.95,u)}this.mouseButtons={ORBIT:0,ZOOM:1,PAN:2};const S=(i,r)=>{let s=e===document?document.body:e;it.copy(t.position).sub(this.target);let n=it.distance();(function(t,e){it.set(e[0],e[1],e[2]),it.multiply(-t),A.add(it)})(2*i*(n*=Math.tan((t.fov||45)/2*Math.PI/180))/s.clientHeight,t.matrix),function(t,e){it.set(e[4],e[5],e[6]),it.multiply(t),A.add(it)}(2*r*n/s.clientHeight,t.matrix)};function N(t){b.radius/=t}function L(t,i){rt.set(t,i),st.sub(rt,y).multiply(h);let r=e===document?document.body:e;b.theta-=2*Math.PI*st.x/r.clientHeight,b.phi-=2*Math.PI*st.y/r.clientHeight,y.copy(rt)}function P(t,e){rt.set(t,e),st.sub(rt,F).multiply(d),S(st.x,st.y),F.copy(rt)}const O=t=>{if(this.enabled){switch(t.button){case this.mouseButtons.ORBIT:if(!1===a)return;y.set(t.clientX,t.clientY),_=et.ROTATE;break;case this.mouseButtons.ZOOM:if(!1===o)return;T.set(t.clientX,t.clientY),_=et.DOLLY;break;case this.mouseButtons.PAN:if(!1===c)return;F.set(t.clientX,t.clientY),_=et.PAN}_!==et.NONE&&(window.addEventListener("mousemove",B,!1),window.addEventListener("mouseup",C,!1))}},B=t=>{if(this.enabled)switch(_){case et.ROTATE:if(!1===a)return;L(t.clientX,t.clientY);break;case et.DOLLY:if(!1===o)return;!function(t){rt.set(t.clientX,t.clientY),st.sub(rt,T),st.y>0?N(R()):st.y<0&&N(1/R()),T.copy(rt)}(t);break;case et.PAN:if(!1===c)return;P(t.clientX,t.clientY)}},C=()=>{this.enabled&&(document.removeEventListener("mousemove",B,!1),document.removeEventListener("mouseup",C,!1),_=et.NONE)},D=t=>{this.enabled&&o&&(_===et.NONE||_===et.ROTATE)&&(t.stopPropagation(),t.deltaY<0?N(1/R()):t.deltaY>0&&N(R()))},U=t=>{if(this.enabled)switch(t.preventDefault(),t.touches.length){case 1:if(!1===a)return;y.set(t.touches[0].pageX,t.touches[0].pageY),_=et.ROTATE;break;case 2:if(!1===o&&!1===c)return;!function(t){if(o){let e=t.touches[0].pageX-t.touches[1].pageX,i=t.touches[0].pageY-t.touches[1].pageY,r=Math.sqrt(e*e+i*i);T.set(0,r)}if(c){let e=.5*(t.touches[0].pageX+t.touches[1].pageX),i=.5*(t.touches[0].pageY+t.touches[1].pageY);F.set(e,i)}}(t),_=et.DOLLY_PAN;break;default:_=et.NONE}},z=t=>{if(this.enabled)switch(t.preventDefault(),t.stopPropagation(),t.touches.length){case 1:if(!1===a)return;L(t.touches[0].pageX,t.touches[0].pageY);break;case 2:if(!1===o&&!1===c)return;!function(t){if(o){let e=t.touches[0].pageX-t.touches[1].pageX,i=t.touches[0].pageY-t.touches[1].pageY,r=Math.sqrt(e*e+i*i);rt.set(0,r),st.set(0,Math.pow(rt.y/T.y,u)),N(st.y),T.copy(rt)}c&&P(.5*(t.touches[0].pageX+t.touches[1].pageX),.5*(t.touches[0].pageY+t.touches[1].pageY))}(t);break;default:_=et.NONE}},I=()=>{this.enabled&&(_=et.NONE)},q=t=>{this.enabled&&t.preventDefault()};this.remove=function(){e.removeEventListener("contextmenu",q,!1),e.removeEventListener("mousedown",O,!1),window.removeEventListener("wheel",D,!1),e.removeEventListener("touchstart",U,!1),e.removeEventListener("touchend",I,!1),e.removeEventListener("touchmove",z,!1),window.removeEventListener("mousemove",B,!1),window.removeEventListener("mouseup",C,!1)},e.addEventListener("contextmenu",q,!1),e.addEventListener("mousedown",O,!1),window.addEventListener("wheel",D,!1),e.addEventListener("touchstart",U,{passive:!1}),e.addEventListener("touchend",I,!1),e.addEventListener("touchmove",z,{passive:!1})},t.Plane=tt,t.Post=class{constructor(t,{width:e,height:i,dpr:r,wrapS:s=t.CLAMP_TO_EDGE,wrapT:n=t.CLAMP_TO_EDGE,minFilter:a=t.LINEAR,magFilter:h=t.LINEAR,geometry:o=new g(t,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}})}={}){this.gl=t,this.options={wrapS:s,wrapT:n,minFilter:a,magFilter:h},this.passes=[],this.geometry=o;const l=this.fbo={read:null,write:null,swap:()=>{let t=l.read;l.read=l.write,l.write=t}};this.resize({width:e,height:i,dpr:r})}addPass({vertex:t=lt,fragment:e=ut,uniforms:i={},textureUniform:r="tMap",enabled:s=!0}={}){i[r]={value:this.fbo.read.texture};const n=new f(this.gl,{vertex:t,fragment:e,uniforms:i}),a={mesh:new Y(this.gl,{geometry:this.geometry,program:n}),program:n,uniforms:i,enabled:s,textureUniform:r};return this.passes.push(a),a}resize({width:t,height:e,dpr:i}={}){i&&(this.dpr=i),t&&(this.width=t,this.height=e||t),i=this.dpr||this.gl.renderer.dpr,t=(this.width||this.gl.renderer.width)*i,e=(this.height||this.gl.renderer.height)*i,this.options.width=t,this.options.height=e,this.fbo.read=new j(this.gl,this.options),this.fbo.write=new j(this.gl,this.options)}render({scene:t,camera:e,target:i=null,update:r=!0,sort:s=!0,frustumCull:n=!0}){const a=this.passes.filter(t=>t.enabled);this.gl.renderer.render({scene:t,camera:e,target:a.length?this.fbo.write:i,update:r,sort:s,frustumCull:n}),this.fbo.swap(),a.forEach((t,e)=>{t.mesh.program.uniforms[t.textureUniform].value=this.fbo.read.texture,this.gl.renderer.render({scene:t.mesh,target:e===a.length-1?i:this.fbo.write,clear:!1}),this.fbo.swap()})}},t.Program=f,t.Quat=N,t.Raycast=class{constructor(t){this.gl=t,this.origin=new l,this.direction=new l}castMouse(t,e=[0,0]){t.worldMatrix.getTranslation(this.origin),this.direction.set(e[0],e[1],.5),t.unproject(this.direction),this.direction.sub(this.origin).normalize()}intersectBounds(t){Array.isArray(t)||(t=[t]);const e=ot,i=nt,r=at,s=[];return t.forEach(t=>{t.geometry.bounds||t.geometry.computeBoundingBox(),"sphere"===t.geometry.raycast&&t.geometry.bounds===1/0&&t.geometry.computeBoundingSphere(),e.inverse(t.worldMatrix),i.copy(this.origin).applyMatrix4(e),r.copy(this.direction).transformDirection(e);let n=0;(n="sphere"===t.geometry.raycast?this.intersectSphere(t.geometry.bounds,i,r):this.intersectBox(t.geometry.bounds,i,r))&&(t.hit||(t.hit={localPoint:new l}),t.hit.distance=n,t.hit.localPoint.copy(r).multiply(n).add(i),s.push(t))}),s.sort((t,e)=>t.hit.distance-e.hit.distance),s}intersectSphere(t,e=this.origin,i=this.direction){const r=ht;r.sub(t.center,e);const s=r.dot(i),n=r.dot(r)-s*s,a=t.radius*t.radius;if(n>a)return 0;const h=Math.sqrt(a-n),o=s-h,l=s+h;return o<0&&l<0?0:o<0?l:o}intersectBox(t,e=this.origin,i=this.direction){let r,s,n,a,h,o;const l=1/i.x,u=1/i.y,c=1/i.z,d=t.min,g=t.max;return r=((l>=0?d.x:g.x)-e.x)*l,s=((l>=0?g.x:d.x)-e.x)*l,n=((u>=0?d.y:g.y)-e.y)*u,r>(a=((u>=0?g.y:d.y)-e.y)*u)||n>s?0:(n>r&&(r=n),a<s&&(s=a),h=((c>=0?d.z:g.z)-e.z)*c,r>(o=((c>=0?g.z:d.z)-e.z)*c)||h>s?0:(h>r&&(r=h),o<s&&(s=o),s<0?0:r>=0?r:s))}},t.RenderTarget=j,t.Renderer=class{constructor({canvas:t=document.createElement("canvas"),width:e=300,height:i=150,dpr:r=1,alpha:s=!1,depth:n=!0,stencil:a=!1,antialias:h=!1,premultipliedAlpha:o=!1,preserveDrawingBuffer:l=!1,powerPreference:u="default",autoClear:c=!0,webgl:d=2}={}){const g={alpha:s,depth:n,stencil:a,antialias:h,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:u};this.dpr=r,this.alpha=s,this.color=!0,this.depth=n,this.stencil=a,this.premultipliedAlpha=o,this.autoClear=c,2===d&&(this.gl=t.getContext("webgl2",g)),this.isWebgl2=!!this.gl,this.gl||(this.gl=t.getContext("webgl",g)||t.getContext("experimental-webgl",g)),this.gl.renderer=this,this.setSize(e,i),this.parameters={},this.parameters.maxTextureUnits=this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),this.state={},this.state.blendFunc={src:this.gl.ONE,dst:this.gl.ZERO},this.state.blendEquation={modeRGB:this.gl.FUNC_ADD},this.state.cullFace=null,this.state.frontFace=this.gl.CCW,this.state.depthMask=!0,this.state.depthFunc=this.gl.LESS,this.state.premultiplyAlpha=!1,this.state.flipY=!1,this.state.unpackAlignment=4,this.state.framebuffer=null,this.state.viewport={width:null,height:null},this.state.textureUnits=[],this.state.activeTextureUnit=0,this.state.boundBuffer=null,this.state.uniformLocations=new Map,this.extensions={},this.isWebgl2?(this.getExtension("EXT_color_buffer_float"),this.getExtension("OES_texture_float_linear")):(this.getExtension("OES_texture_float"),this.getExtension("OES_texture_float_linear"),this.getExtension("OES_texture_half_float"),this.getExtension("OES_texture_half_float_linear"),this.getExtension("OES_element_index_uint"),this.getExtension("OES_standard_derivatives"),this.getExtension("EXT_sRGB"),this.getExtension("WEBGL_depth_texture")),this.vertexAttribDivisor=this.getExtension("ANGLE_instanced_arrays","vertexAttribDivisor","vertexAttribDivisorANGLE"),this.drawArraysInstanced=this.getExtension("ANGLE_instanced_arrays","drawArraysInstanced","drawArraysInstancedANGLE"),this.drawElementsInstanced=this.getExtension("ANGLE_instanced_arrays","drawElementsInstanced","drawElementsInstancedANGLE"),this.createVertexArray=this.getExtension("OES_vertex_array_object","createVertexArray","createVertexArrayOES"),this.bindVertexArray=this.getExtension("OES_vertex_array_object","bindVertexArray","bindVertexArrayOES"),this.deleteVertexArray=this.getExtension("OES_vertex_array_object","deleteVertexArray","deleteVertexArrayOES")}setSize(t,e){this.width=t,this.height=e,this.gl.canvas.width=t*this.dpr,this.gl.canvas.height=e*this.dpr,Object.assign(this.gl.canvas.style,{width:t+"px",height:e+"px"})}setViewport(t,e){this.state.viewport.width===t&&this.state.viewport.height===e||(this.state.viewport.width=t,this.state.viewport.height=e,this.gl.viewport(0,0,t,e))}enable(t){!0!==this.state[t]&&(this.gl.enable(t),this.state[t]=!0)}disable(t){!1!==this.state[t]&&(this.gl.disable(t),this.state[t]=!1)}setBlendFunc(t,e,i,r){this.state.blendFunc.src===t&&this.state.blendFunc.dst===e&&this.state.blendFunc.srcAlpha===i&&this.state.blendFunc.dstAlpha===r||(this.state.blendFunc.src=t,this.state.blendFunc.dst=e,this.state.blendFunc.srcAlpha=i,this.state.blendFunc.dstAlpha=r,void 0!==i?this.gl.blendFuncSeparate(t,e,i,r):this.gl.blendFunc(t,e))}setBlendEquation(t,e){this.state.blendEquation.modeRGB===t&&this.state.blendEquation.modeAlpha===e||(this.state.blendEquation.modeRGB=t,this.state.blendEquation.modeAlpha=e,void 0!==e?this.gl.blendEquationSeparate(t,e):this.gl.blendEquation(t))}setCullFace(t){this.state.cullFace!==t&&(this.state.cullFace=t,this.gl.cullFace(t))}setFrontFace(t){this.state.frontFace!==t&&(this.state.frontFace=t,this.gl.frontFace(t))}setDepthMask(t){this.state.depthMask!==t&&(this.state.depthMask=t,this.gl.depthMask(t))}setDepthFunc(t){this.state.depthFunc!==t&&(this.state.depthFunc=t,this.gl.depthFunc(t))}activeTexture(t){this.state.activeTextureUnit!==t&&(this.state.activeTextureUnit=t,this.gl.activeTexture(this.gl.TEXTURE0+t))}bindFramebuffer({target:t=this.gl.FRAMEBUFFER,buffer:e=null}={}){this.state.framebuffer!==e&&(this.state.framebuffer=e,this.gl.bindFramebuffer(t,e))}getExtension(t,e,i){return e&&this.gl[e]?this.gl[e].bind(this.gl):(this.extensions[t]||(this.extensions[t]=this.gl.getExtension(t)),e?this.extensions[t][i].bind(this.extensions[t]):this.extensions[t])}sortOpaque(t,e){return t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.program.id!==e.program.id?t.program.id-e.program.id:t.zDepth!==e.zDepth?t.zDepth-e.zDepth:e.id-t.id}sortTransparent(t,e){return t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.zDepth!==e.zDepth?e.zDepth-t.zDepth:e.id-t.id}sortUI(t,e){return t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.program.id!==e.program.id?t.program.id-e.program.id:e.id-t.id}getRenderList({scene:t,camera:e,frustumCull:i,sort:r}){let s=[];if(e&&i&&e.updateFrustum(),t.traverse(t=>{if(!t.visible)return!0;t.draw&&(i&&t.frustumCulled&&e&&!e.frustumIntersectsMesh(t)||s.push(t))}),r){const t=[],i=[],r=[];s.forEach(s=>{s.program.transparent?s.program.depthTest?i.push(s):r.push(s):t.push(s),s.zDepth=0,0===s.renderOrder&&s.program.depthTest&&e&&(s.worldMatrix.getTranslation(v),v.applyMatrix4(e.projectionViewMatrix),s.zDepth=v.z)}),t.sort(this.sortOpaque),i.sort(this.sortTransparent),r.sort(this.sortUI),s=t.concat(i,r)}return s}render({scene:t,camera:e,target:i=null,update:r=!0,sort:s=!0,frustumCull:n=!0,clear:a}){null===i?(this.bindFramebuffer(),this.setViewport(this.width*this.dpr,this.height*this.dpr)):(this.bindFramebuffer(i),this.setViewport(i.width,i.height)),(a||this.autoClear&&!1!==a)&&(!this.depth||i&&i.depth||(this.enable(this.gl.DEPTH_TEST),this.setDepthMask(!0)),this.gl.clear((this.color?this.gl.COLOR_BUFFER_BIT:0)|(this.depth?this.gl.DEPTH_BUFFER_BIT:0)|(this.stencil?this.gl.STENCIL_BUFFER_BIT:0))),r&&t.updateMatrixWorld(),e&&null===e.parent&&e.updateMatrixWorld(),this.getRenderList({scene:t,camera:e,frustumCull:n,sort:s}).forEach(t=>{t.draw({camera:e})})}},t.Skin=class extends Y{constructor(t,{rig:e,geometry:i,program:r,mode:s=t.TRIANGLES}={}){super(t,{geometry:i,program:r,mode:s}),this.createBones(e),this.createBoneTexture(),this.animations=[],Object.assign(this.program.uniforms,{boneTexture:{value:this.boneTexture},boneTextureSize:{value:this.boneTextureSize}})}createBones(t){if(this.root=new C,this.bones=[],t.bones&&t.bones.length){for(let e=0;e<t.bones.length;e++){const i=new C;i.position.fromArray(t.bindPose.position,3*e),i.quaternion.fromArray(t.bindPose.quaternion,4*e),i.scale.fromArray(t.bindPose.scale,3*e),this.bones.push(i)}t.bones.forEach((t,e)=>{if(this.bones[e].name=t.name,-1===t.parent)return this.bones[e].setParent(this.root);this.bones[e].setParent(this.bones[t.parent])}),this.root.updateMatrixWorld(!0),this.bones.forEach(t=>{t.bindInverse=new P(...t.worldMatrix).inverse()})}}createBoneTexture(){if(!this.bones.length)return;const t=Math.max(4,Math.pow(2,Math.ceil(Math.log(Math.sqrt(4*this.bones.length))/Math.LN2)));this.boneMatrices=new Float32Array(t*t*4),this.boneTextureSize=t,this.boneTexture=new W(this.gl,{image:this.boneMatrices,generateMipmaps:!1,type:this.gl.FLOAT,internalFormat:this.gl.renderer.isWebgl2?this.gl.RGBA16F:this.gl.RGBA,flipY:!1,width:t})}addAnimation(t){const e=new xt({objects:this.bones,data:t});return this.animations.push(e),e}update(){let t=0;this.animations.forEach(e=>t+=e.weight),this.animations.forEach((e,i)=>{e.update(t,0===i)})}draw({camera:t}={}){this.root.updateMatrixWorld(!0),this.bones.forEach((t,e)=>{wt.multiply(t.worldMatrix,t.bindInverse),this.boneMatrices.set(wt,16*e)}),this.boneTexture&&(this.boneTexture.needsUpdate=!0),super.draw({camera:t})}},t.Sphere=class extends g{constructor(t,{radius:e=.5,widthSegments:i=16,heightSegments:r=Math.ceil(.5*i),phiStart:s=0,phiLength:n=2*Math.PI,thetaStart:a=0,thetaLength:h=Math.PI,attributes:o={}}={}){const u=i,c=r,d=s,g=n,p=a,m=h,f=(u+1)*(c+1),x=u*c*6,w=new Float32Array(3*f),b=new Float32Array(3*f),M=new Float32Array(2*f),v=f>65536?new Uint32Array(x):new Uint16Array(x);let A=0,E=0,y=0,F=p+m;const T=[];let _=new l;for(let t=0;t<=c;t++){let i=[],r=t/c;for(let t=0;t<=u;t++,A++){let s=t/u,n=-e*Math.cos(d+s*g)*Math.sin(p+r*m),a=e*Math.cos(p+r*m),h=e*Math.sin(d+s*g)*Math.sin(p+r*m);w[3*A]=n,w[3*A+1]=a,w[3*A+2]=h,_.set(n,a,h).normalize(),b[3*A]=_.x,b[3*A+1]=_.y,b[3*A+2]=_.z,M[2*A]=s,M[2*A+1]=1-r,i.push(E++)}T.push(i)}for(let t=0;t<c;t++)for(let e=0;e<u;e++){let i=T[t][e+1],r=T[t][e],s=T[t+1][e],n=T[t+1][e+1];(0!==t||p>0)&&(v[3*y]=i,v[3*y+1]=r,v[3*y+2]=n,y++),(t!==c-1||F<Math.PI)&&(v[3*y]=r,v[3*y+1]=s,v[3*y+2]=n,y++)}Object.assign(o,{position:{size:3,data:w},normal:{size:3,data:b},uv:{size:2,data:M},index:{data:v}}),super(t,o)}},t.Text=function({font:t,text:e,width:i=1/0,align:r="left",size:s=1,letterSpacing:n=0,lineHeight:a=1.4,wordSpacing:h=0,wordBreak:o=!1}){const l=this;let u,c,d,g,p;const m=/\n/,f=/\s/;function x(){d=t.common.lineHeight,g=t.common.base,p=s/g;let i=e.replace(/[ \n]/g,"").length;c={position:new Float32Array(4*i*3),uv:new Float32Array(4*i*2),id:new Float32Array(4*i),index:new Uint16Array(6*i)};for(let t=0;t<i;t++)c.id[t]=t,c.index.set([4*t,4*t+2,4*t+1,4*t+1,4*t+2,4*t+3],6*t);w()}function w(){const d=[];let g=0,x=0,w=0,M=v();function v(){const t={width:0,glyphs:[]};return d.push(t),x=g,w=0,t}let A=0;for(;g<e.length&&A<100;){A++;const t=e[g];if(!M.width&&f.test(t)){x=++g,w=0;continue}if(m.test(t)){g++,M=v();continue}const r=u[t];if(M.glyphs.length){const t=M.glyphs[M.glyphs.length-1][0];let e=b(r.id,t.id)*p;M.width+=e,w+=e}M.glyphs.push([r,M.width]);let a=0;if(f.test(t)?(x=g,w=0,a+=h*s):a+=n*s,a+=r.xadvance*p,M.width+=a,w+=a,M.width>i){if(o&&M.glyphs.length>1){M.width-=a,M.glyphs.pop(),M=v();continue}if(!o&&w!==M.width){let t=g-x+1;M.glyphs.splice(-t,t),g=x,M.width-=w,M=v();continue}}g++}M.width||d.pop(),function(e){const i=t.common.scaleW,n=t.common.scaleH;let h=.07*s,o=0;for(let t=0;t<e.length;t++){let l=e[t];for(let t=0;t<l.glyphs.length;t++){const e=l.glyphs[t][0];let s=l.glyphs[t][1];if("center"===r?s-=.5*l.width:"right"===r&&(s-=l.width),f.test(e.char))continue;s+=e.xoffset*p,h-=e.yoffset*p;let a=e.width*p,u=e.height*p;c.position.set([s,h-u,0,s,h,0,s+a,h-u,0,s+a,h,0],4*o*3);let d=e.x/i,g=e.width/i,m=1-e.y/n,x=e.height/n;c.uv.set([d,m-x,d,m,d+g,m-x,d+g,m],4*o*2),h+=e.yoffset*p,o++}h-=s*a}l.buffers=c,l.numLines=e.length,l.height=l.numLines*s*a}(d)}function b(e,i){for(let r=0;r<t.kernings.length;r++){let s=t.kernings[r];if(!(s.first<e||s.second<i))return s.first>e?0:s.first===e&&s.second>i?0:s.amount}return 0}u={},t.chars.forEach(t=>u[t.char]=t),x(),this.resize=function(t){({width:i}=t),w()},this.update=function(t){({text:e}=t),x()}},t.Texture=W,t.Transform=C,t.Vec2=J,t.Vec3=l,t.Vec4=class extends Array{constructor(t=0,e=t,i=t,r=t){return super(t,e,i,r),this}get x(){return this[0]}set x(t){this[0]=t}get y(){return this[1]}set y(t){this[1]=t}get z(){return this[2]}set z(t){this[2]=t}get w(){return this[3]}set w(t){this[3]=t}set(t,e,i,r){return t.length?this.copy(t):(E(this,t,e,i,r),this)}copy(t){return A(this,t),this}normalize(){return y(this,this),this}fromArray(t,e=0){return this[0]=t[e],this[1]=t[e+1],this[2]=t[e+2],this[3]=t[e+3],this}toArray(t=[],e=0){return t[e]=this[0],t[e+1]=this[1],t[e+2]=this[2],t[e+3]=this[3],t}},t}({});

const container = document.querySelector("body");
const sections = document.querySelectorAll("section");
const collections = document.querySelectorAll("#collections article");
const navigation = document.querySelector(".navigation");
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

ScrollTrigger.defaults({
  markers: false,
});

ScrollTrigger.saveStyles(collections);

ScrollTrigger.matchMedia({
  "(min-width: 48rem)": function () {
    for (let [index, collection] of collections.entries()) {
      const imageContainer = collection.querySelector(".image-slider");

      gsap.to(imageContainer, {
        xPercent: () => `-=100`,
        ease: "none",
        scrollTrigger: {
          trigger: imageContainer,
          start: () => `+=${220} center`,
          // start: () =>
          //   `+=${imageContainer.parentNode.offsetHeight - 670} center`,
          end: () => `+=${imageContainer.offsetWidth * 2}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: 0.1,
        },
      });
    }

    let proxy = { skew: 0 },
      skewSetter = gsap.quickSetter(
        "#collections .image-collection",
        "rotate",
        "deg"
      ), // fast
      clamp = gsap.utils.clamp(-1, 1); // don't let the skew go beyond 20 degrees.

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -1000);
        // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.1,
            ease: "sine",
            overwrite: true,
            onUpdate: () => {
              skewSetter(proxy.skew);
            },
          });
        }
      },
    });
  },
});

window.onload = () => {
  const flowImages = document.querySelectorAll(".flow-image");
  for (let [index, flowImage] of flowImages.entries()) {
    const section = flowImage.parentElement;
    const staticImage = flowImage.querySelector(".static-image");

    gsap.to(flowImages[0], {
      x: () => `-=${window.innerWidth * 1.6}`,
      y: () => `+=${section.offsetHeight * 0.8}`,
      rotate: Math.random() * -90,
      ease: "none",
      scrollTrigger: {
        trigger: staticImage,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.5,
      },
    });
    gsap.to(flowImages[1], {
      x: () => `+=${window.innerWidth * 0.3}`,
      y: () => `+=${section.offsetHeight * 0.4}`,
      scale: 1.5,
      rotate: Math.random() * 30,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });
  }
};

"use strict";

const filterAccordion = document.querySelector(".filter-accordion");
const infoButtons = document.querySelectorAll(".info-button");

// Calculate Viewport height for VH
function resetHeight() {
  let viewportHeight = window.innerHeight + "px";
  let root = document.documentElement;
  document.querySelector("body").style.height = viewportHeight;
  root.style.setProperty("--viewport-height", viewportHeight);
}
window.addEventListener("resize", function () {
  resetHeight();
});
resetHeight();

for (let infoButton of infoButtons) {
  infoButton.onclick = () => {
    document.querySelector(".info-box").classList.toggle("info-box-open");
  };
}

const lookbookCarousel = document.querySelector(".fullscreen-carousel");
let lookbookCarouselInstance;

if (lookbookCarousel) {
  lookbookCarouselInstance = {
    flkty: new Flickity(document.querySelector(".fullscreen-carousel"), {
      lazyLoad: 1,
      pageDots: false,
      cellSelector: ".carousel-cell",
    }),
    carousel: document.querySelector(".fullscreen-carousel"),
    lookbookImages: document.querySelectorAll(
      "#lookbook .image-container picture"
    ),
    closeButton: document.querySelector("#close-fullscreen"),
    isVisible: false,
  };

  lookbookCarouselInstance.closeButton?.addEventListener("click", () => {
    lookbookCarouselInstance.carousel.style.visibility = "hidden";
  });

  for (let i = 0; i < lookbookCarouselInstance.lookbookImages.length; i++) {
    const image = lookbookCarouselInstance.lookbookImages[i];
    image.addEventListener("click", () => {
      lookbookCarouselInstance.carousel.style.visibility = "visible";
      lookbookCarouselInstance.flkty.select(i, true, true);
    });
  }

  window.onresize = () => lookbookCarouselInstance.flkty.resize();
}

//TERMS AND CONDITIONS POP UP
const openTerms = document.querySelector(".open-terms");

if (openTerms) {
  const termsPopup = document.querySelector(".terms-conditions");
  const closeTerms = document.querySelector(" #close-terms");
  openTerms.onclick = () => {
    termsPopup.style.visibility = "visible";
  };
  closeTerms.onclick = () => {
    termsPopup.style.visibility = "hidden";
  };
}

// FIX FOR BETTER SWIPE ON MOBILE DEVICES

(function () {
  var touchingCarousel = false,
    touchStartCoords;

  document.body.addEventListener("touchstart", function (e) {
    if (e.target.closest(".flickity-slider")) {
      touchingCarousel = true;
    } else {
      touchingCarousel = false;
      return;
    }

    touchStartCoords = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
  });

  document.body.addEventListener(
    "touchmove",
    function (e) {
      if (!(touchingCarousel && e.cancelable)) {
        return;
      }

      var moveVector = {
        x: e.touches[0].pageX - touchStartCoords.x,
        y: e.touches[0].pageY - touchStartCoords.y,
      };

      if (Math.abs(moveVector.x) > 7) e.preventDefault();
    },
    { passive: false }
  );
})();

// ACCORDION FILTER
filterAccordion?.addEventListener("click", (el) => {
  filterAccordion.classList.toggle("is-open");
  let heightAccordion = filterAccordion.parentNode.style;
  let heightFilterButton = filterAccordion.scrollHeight;
  let heightFilterList =
    filterAccordion.parentNode.querySelector("ul").scrollHeight +
    heightFilterButton;

  filterAccordion.classList.contains("is-open")
    ? (heightAccordion.height = heightFilterList + "px")
    : (heightAccordion.height = heightFilterButton + "px");
});

// ---------------------------------
// Change style of current menu when page scrolls in viewport
// ---------------------------------

(function () {
  var anchorsArray = document.querySelectorAll(".sub-menu a");
  var sections = document.querySelectorAll("article");
  var sectionsArray = [];

  // Collect all sections and push to sectionsArray
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    sectionsArray.push(section);
  }
  changeSubmenuStyle();

  window.onscroll = function () {
    changeSubmenuStyle();
  };
  function changeSubmenuStyle() {
    var scrollPosition = window.scrollY;

    for (var i = 0; i < anchorsArray.length; i++) {
      // Get hrefs from each anchor
      var anchorID = anchorsArray[i].getAttribute("href");
      var sectionHeight = sectionsArray[i]?.offsetHeight;
      var sectionTop = sectionsArray[i]?.offsetTop;

      if (anchorID.includes("#")) {
        if (
          scrollPosition + 140 >= sectionTop &&
          scrollPosition + 140 < sectionTop + sectionHeight
        ) {
          document
            .querySelector('.sub-menu a[href="' + anchorID + '"]')
            .classList.add("is-active");
        } else {
          document
            .querySelector('.sub-menu a[href="' + anchorID + '"]')
            .classList.remove("is-active");
        }
      }
    }
  }
})();
