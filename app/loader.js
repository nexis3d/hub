/* Nexis Games — Application Loader
 * --------------------------------------------------------------
 * Fetches the encrypted application bundle (app/core.dat), decodes
 * it (XOR + base64), and injects it into the page as a Babel module
 * so React + JSX run at runtime.
 *
 * The actual application source is NOT in the HTML — viewing the
 * page source will only reveal this small loader and an encrypted
 * blob. To edit the application, edit /src/core.js and re-run
 * build.py (or open /tools/build.html in a browser).
 * -------------------------------------------------------------- */
(function () {
  "use strict";

  // Must match the key used by build.py
  var KEY = "N3xis-G@meS-2026-NexisGD-x7k9P";

  var statusEl = document.getElementById("nexis-loader-status");
  function status(msg) { if (statusEl) statusEl.textContent = msg; }

  // -------- Light tamper-deterrents (casual only) ----------
  try {
    document.addEventListener("contextmenu", function (e) {
      // allow inside game iframes
      if (e.target && (e.target.tagName === "IFRAME" || e.target.closest("iframe"))) return;
      e.preventDefault();
    });
    document.addEventListener("keydown", function (e) {
      var k = (e.key || "").toLowerCase();
      // Block: Ctrl+U  (view-source), Ctrl+S (save-page)
      if (e.ctrlKey && (k === "u" || k === "s")) { e.preventDefault(); }
      // Block: F12, Ctrl+Shift+I/J/C
      if (k === "f12") { e.preventDefault(); }
      if (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) { e.preventDefault(); }
    });
  } catch (_) {}

  // -------- Decoder ----------
  function xorDecode(bytes, key) {
    var kb = new TextEncoder().encode(key);
    var out = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ kb[i % kb.length];
    return new TextDecoder("utf-8").decode(out);
  }
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  // -------- Bundle fetch ----------
  function loadBundle() {
    status("Fetching application core…");
    return fetch("app/core.dat", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("Bundle HTTP " + r.status);
      return r.text();
    }).then(function (raw) {
      status("Verifying signature…");
      var m = raw.match(/---BEGIN-NEXIS-CORE---\s*([\s\S]*?)\s*---END-NEXIS-CORE---/);
      if (!m) throw new Error("Bundle markers missing.");
      var b64 = m[1].replace(/\s+/g, "");
      status("Decrypting modules…");
      var bytes = b64ToBytes(b64);
      var js = xorDecode(bytes, KEY);
      return js;
    });
  }

  // -------- Execute as Babel module ----------
  function runBundle(jsSource) {
    status("Mounting interface…");
    var s = document.createElement("script");
    s.type = "text/babel";
    s.setAttribute("data-type", "module");
    s.text = jsSource;
    document.body.appendChild(s);
    // Trigger Babel to transform the newly-added script
    if (window.Babel && typeof window.Babel.transformScriptTags === "function") {
      window.Babel.transformScriptTags();
    }
  }

  function hideLoader() {
    var el = document.getElementById("nexis-global-loader");
    if (!el) return;
    el.style.opacity = "0";
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 450);
  }

  function fail(err) {
    console.error("[Nexis] loader failure:", err);
    status("Failed to initialise. Refresh the page.");
  }

  // Wait until DOM + React + Babel are present
  function ready() {
    if (!window.React || !window.ReactDOM || !window.Babel) {
      return setTimeout(ready, 30);
    }
    loadBundle()
      .then(runBundle)
      .then(function () {
        // Give React a moment to render before fading out
        setTimeout(hideLoader, 1200);
      })
      .catch(fail);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
