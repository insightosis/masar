/* Shared helpers: progress kept in this browser only (v1), subject icons, lookups. */
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
    geology: '<path d="M2 20l6-10 4 6 3-4 7 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 16h14M3.5 18.5h17" stroke="currentColor" stroke-width="1.2" opacity=".6"/>'
  };

  window.Lab = {
    progress: load,
    isDone: function (id) { return !!(load()[id] && load()[id].done); },
    markDone: function (id, quiz) {
      var p = load(); p[id] = Object.assign({}, p[id], { done: true, date: today() });
      if (quiz) p[id].quiz = quiz;
      save(p); return p[id];
    },
    setQuiz: function (id, quiz) { var p = load(); p[id] = Object.assign({}, p[id], { quiz: quiz }); save(p); },
    today: today,
    icon: function (key, size) {
      return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" aria-hidden="true">' + (ICONS[key] || "") + "</svg>";
    },
    lesson: function (id) { return (window.LAB.lessons || []).filter(function (l) { return l.id === id; })[0] || null; },
    concept: function (id) { return (window.LAB.concepts || []).filter(function (c) { return c.id === id; })[0] || null; },
    /* Resolve an id that may be a lesson or a concept into {title, subject, url|null}. */
    node: function (id, prefix) {
      var l = this.lesson(id);
      if (l) return { id: id, title: l.title, subject: l.subject, url: (prefix || "") + l.url, done: this.isDone(id) };
      var c = this.concept(id);
      if (!c) return null;
      if (c.lesson) { var cl = this.lesson(c.lesson); if (cl) return { id: cl.id, title: cl.title, subject: cl.subject, url: (prefix || "") + cl.url, done: this.isDone(cl.id) }; }
      return { id: id, title: c.title, subject: c.subject, url: null, done: false };
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
