/* =====================================================================
 * Nexis Games — Client-side Security Hardening
 * - Blocks view-source: URLs
 * - Disables right-click & DevTools keyboard shortcuts (F12, Ctrl+U, Ctrl+Shift+I/J/C/K, Ctrl+S, Ctrl+P)
 * - Detects DevTools open via window size diff (lightweight: 2.5s interval)
 * - Suppresses console output
 *
 * NOTE: Client-side protection is best-effort. Determined users can still
 * inspect via proxy/network tools. Real security MUST live on the server.
 * =================================================================== */
(function () {
  "use strict";

  // 1. Block view-source: protocol (best effort — JS is disabled in view-source on most browsers,
  //    but covers cases where users copy/paste a view-source: URL into the address bar)
  try {
    var p = window.location.protocol;
    var h = String(window.location.href).toLowerCase();
    if (p === "view-source:" || h.indexOf("view-source:") === 0) {
      window.location.replace("about:blank");
      return;
    }
  } catch (e) {}

  // 2. Disable keyboard shortcuts commonly used to open DevTools / View Source / Save Page
  function blockKey(e) {
    var k = (e.key || "").toLowerCase();
    var kc = e.keyCode || e.which;
    // F12
    if (kc === 123 || k === "f12") { e.preventDefault(); e.stopImmediatePropagation(); return false; }
    // Ctrl/Cmd + (U | S | P)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (k === "u" || k === "s" || k === "p")) {
      e.preventDefault(); e.stopImmediatePropagation(); return false;
    }
    // Ctrl/Cmd + Shift + (I | J | C | K)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === "i" || k === "j" || k === "c" || k === "k")) {
      e.preventDefault(); e.stopImmediatePropagation(); return false;
    }
  }
  document.addEventListener("keydown", blockKey, true);
  window.addEventListener("keydown", blockKey, true);

  // 3. Disable right-click context menu
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); return false;
  }, true);

  // 4. Prevent dragging of images / svg (anti-leech)
  document.addEventListener("dragstart", function (e) {
    var t = e.target;
    if (t && (t.tagName === "IMG" || t.tagName === "SVG")) {
      e.preventDefault(); return false;
    }
  }, true);

  // 5. Silence console output (cheap, runs once)
  try {
    var noop = function () {};
    var methods = ["log", "debug", "info", "warn", "error", "trace",
                   "dir", "table", "group", "groupEnd", "time", "timeEnd"];
    for (var i = 0; i < methods.length; i++) {
      try { console[methods[i]] = noop; } catch (e) {}
    }
  } catch (e) {}

  // 6. DevTools size-based detection (lightweight: 2.5s interval)
  var devOpen = false;
  var threshold = 170;
  function detect() {
    var w = window.outerWidth - window.innerWidth;
    var h = window.outerHeight - window.innerHeight;
    if (w > threshold || h > threshold) {
      if (!devOpen) {
        devOpen = true;
        try {
          document.documentElement.innerHTML =
            '<body style="background:#030008;color:#e2e8f0;font-family:Fira Sans,sans-serif;margin:0;height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:24px">' +
              '<div>' +
                '<h1 style="background:linear-gradient(90deg,#a855f7,#c026d3);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:2.5rem;margin:0 0 12px;letter-spacing:.2em">NEXIS&nbsp;GAMES</h1>' +
                '<h2 style="color:#f43f5e;margin:0 0 20px">Developer tools detected</h2>' +
                '<p style="opacity:.8;max-width:520px;line-height:1.6">For security reasons, browser developer tools have been disabled on this page. Please close DevTools and reload to continue.</p>' +
              '</div>' +
            '</body>';
        } catch (e) {}
      }
    }
  }
  setInterval(detect, 2500);

  // 7. Console banner warning (visible briefly before console silencing kicks in)
  try {
    window.addEventListener("DOMContentLoaded", function () {
      try {
        var c = window.console;
        c && c.log && (window.console = c); // keep reference
      } catch (e) {}
    });
  } catch (e) {}
})();
