/* Shared helpers: progress (this browser + synced to the masar-sync worker), subject icons, lookups. */
(function () {
  "use strict";
  var KEY = "lab11.progress.v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  var ICONS = {
    physics: '<ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" fill="none" stroke="currentColor" stroke-width="1.8"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
    chemistry: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 15h10" stroke="currentColor" stroke-width="1.8"/><circle cx="11" cy="18" r="1" fill="currentColor"/><circle cx="14" cy="17" r=".8" fill="currentColor"/>',
    biology: '<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 19L14 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    math: '<path d="M18 5H7l6 7-6 7h11" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    geology: '<path d="M2 20l6-10 4 6 3-4 7 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 16h14M3.5 18.5h17" stroke="currentColor" stroke-width="1.2" opacity=".6"/>',
    review: '<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6L12 16.3 6.6 19.3l1.3-6-4.6-4.1 6.1-.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'
  };


  /* light / dark: follows the device until the student picks one; the choice stays on this device */
  var TKEY = "masar.theme";
  function curTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function themeButton() {
    var host = document.querySelector(".top .nav") || document.querySelector(".top");
    if (!host || document.querySelector(".theme-btn")) return;
    var b = document.createElement("button");
    b.className = "theme-btn"; b.type = "button";
    function paint() { var d = curTheme() === "dark"; b.textContent = d ? "☀" : "☾"; b.setAttribute("aria-label", d ? "الوضع النهاري" : "الوضع الليلي"); }
    paint();
    b.addEventListener("click", function () {
      var next = curTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(TKEY, next); } catch (e) {}
      paint();
      window.dispatchEvent(new Event("masar-theme"));
    });
    host.appendChild(b);
    if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { paint(); window.dispatchEvent(new Event("masar-theme")); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", themeButton); else themeButton();

  /* ---------- sync to Cloudflare (masar-sync worker) ----------
     The iPad is linked once by opening any page with ?link=<token>; after that every
     finished lesson, quiz and check is queued here and pushed. Nothing is lost offline:
     the queue stays in this browser until the worker accepts it. */
  var SYNC_URL = "https://masar-sync.insightosis.workers.dev";
  var SKEY = "masar.sync.v1", QKEY = "masar.queue.v1";
  function syncToken() { try { return localStorage.getItem(SKEY) || ""; } catch (e) { return ""; } }
  (function takeLink() {
    try {
      var u = new URL(location.href), t = u.searchParams.get("link");
      if (t && /^[0-9a-f]{32}$/.test(t)) {
        localStorage.setItem(SKEY, t);
        u.searchParams.delete("link");
        history.replaceState(null, "", u.pathname + (u.search || "") + u.hash);
        sessionStorage.setItem("masar.justLinked", "1");
      }
    } catch (e) {}
  })();
  function queue() { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch (e) { return []; } }
  function setQueue(q) { try { localStorage.setItem(QKEY, JSON.stringify(q.slice(-1500))); } catch (e) {} }
  function eid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function log(type, data) {
    var e = Object.assign({ t: new Date().toISOString(), type: type, eid: eid() }, data || {});
    var q = queue(); q.push(e); setQueue(q); schedulePush();
  }
  function mergeInto(local, remote) {
    var changed = false, id;
    for (id in remote) {
      var r = remote[id] || {}, l = local[id] || {};
      if (r.done && !l.done) { l.done = true; l.date = r.date; changed = true; }
      if (r.quiz && !l.quiz) { l.quiz = r.quiz; changed = true; }
      local[id] = l;
    }
    return changed;
  }
  var pushTimer = null, pushing = false;
  var syncState = { linked: !!syncToken(), last: null, error: null };
  function schedulePush(ms) { if (!syncToken()) return; clearTimeout(pushTimer); pushTimer = setTimeout(push, ms == null ? 1200 : ms); }
  function push(keepalive) {
    var tok = syncToken(); if (!tok || pushing) return;
    var q = queue(), sent = q.length;
    pushing = true;
    return fetch(SYNC_URL + "/push", {
      method: "POST", keepalive: !!keepalive,
      headers: { "Authorization": "Bearer " + tok, "Content-Type": "application/json" },
      body: JSON.stringify({ progress: load(), events: q.slice(0, 400) })
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function () {
      setQueue(queue().slice(Math.min(sent, 400)));
      syncState.last = new Date().toISOString(); syncState.error = null;
      try { localStorage.setItem("masar.lastSync", syncState.last); } catch (e) {}
      window.dispatchEvent(new Event("masar-sync"));
      if (queue().length) schedulePush(300);
    }).catch(function (e) { syncState.error = String(e.message || e); })
      .then(function () { pushing = false; });
  }
  function pull() {
    var tok = syncToken(); if (!tok) return;
    fetch(SYNC_URL + "/state", { headers: { "Authorization": "Bearer " + tok } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (s) {
        var p = load();
        if (mergeInto(p, s.progress || {})) {
          save(p);
          if (!sessionStorage.getItem("masar.restored")) { sessionStorage.setItem("masar.restored", "1"); location.reload(); return; }
        }
        push();
      }).catch(function (e) { syncState.error = String(e.message || e); });
  }

  /* lesson pages: time actually spent with the page visible, sent when the page is left */
  function trackLesson() {
    var id = window.LESSON_ID; if (!id) return;
    log("open", { id: id });
    var acc = 0, since = document.visibilityState === "visible" ? Date.now() : 0;
    function flush(final) {
      if (since) { acc += (Date.now() - since) / 1000; since = 0; }
      if (acc >= 5) { log("time", { id: id, sec: Math.round(acc) }); acc = 0; }
      if (final) push(true);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") since = Date.now(); else flush(true);
    });
    window.addEventListener("pagehide", function () { flush(true); });
  }
  function boot() { trackLesson(); pull(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else setTimeout(boot, 0);

  window.Lab = {
    syncState: syncState,
    log: log,
    /* every interactive check in a lesson: Lab.check("order", true) */
    check: function (key, ok) { if (window.LESSON_ID) log("check", { id: window.LESSON_ID, key: key, ok: !!ok }); },
    progress: load,
    isDone: function (id) { return !!(load()[id] && load()[id].done); },
    markDone: function (id, quiz) {
      var p = load(); p[id] = Object.assign({}, p[id], { done: true, date: today() });
      if (quiz) p[id].quiz = quiz;
      save(p); log("done", { id: id }); return p[id];
    },
    setQuiz: function (id, quiz) {
      var p = load(); p[id] = Object.assign({}, p[id], { quiz: quiz }); save(p);
      log("quiz", { id: id, score: quiz.score, total: quiz.total });
    },
    today: today,
    icon: function (key, size) {
      return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" aria-hidden="true">' + (ICONS[key] || "") + "</svg>";
    },
    lesson: function (id) { return (window.LAB.lessons || []).filter(function (l) { return l.id === id; })[0] || null; },
    planned: function (id) { var P = window.PLAN; return P ? (P.catalog.filter(function (c) { return c.id === id; })[0] || null) : null; },
    /* Resolve an id that may be a lesson or a concept into {title, subject, url|null}. */
    node: function (id, prefix) {
      var l = this.lesson(id);
      if (l) return { id: id, title: l.title, subject: l.subject, url: (prefix || "") + l.url, done: this.isDone(id) };
      var c = this.planned(id);
      if (!c) return null;
      return { id: id, title: c.title, subject: c.subject, url: null, done: false, code: c.code };
    },
    streak: function () {
      var p = load(), days = {}, k;
      for (k in p) if (p[k].done && p[k].date) days[p[k].date] = 1;
      var n = 0, d = new Date();
      if (!days[today()]) d.setDate(d.getDate() - 1);
      for (;;) {
        var s = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        if (!days[s]) break; n++; d.setDate(d.getDate() - 1);
      }
      return n;
    }
  };
})();
