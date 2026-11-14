/* Shared lesson runtime. A lesson page only needs markup plus:
     <script>Lesson.init({id:"geo-u1-1-1"});</script>   (after plan.js, data.js, lab.js, lesson.js)

   Everything below is wired from markup, so a new lesson writes no activity code:

   Quiz question     <div class="q"><p>..</p><div class="opts"><button>..</button><button data-ok>..</button></div><p class="why" hidden>..</p></div>
   Order activity    <div class="act" data-act="order" data-key="order" data-answer='["a","b"]' data-extra='["x"]'
                          data-ok="message" data-no="message" [data-rtl]>  (title/p inside; slots, pool and buttons are added)
   Choice/gap        <div class="act" data-act="gap" data-key="gap" data-ok="message"> ... <span class="gap"></span> ...
                          <div class="opts"><button class="pc" data-ok>..</button><button class="pc" data-no="why not">..</button></div>
   Type a number     <div class="act" data-act="type" data-key="type" data-answer="5" data-tol="0.1" data-ok=".." data-hint="..">
   Match pairs       <div class="act" data-act="match" data-key="match" data-pairs='[["term","meaning"],...]' data-ok="..">
   Sort into 2 bins  <div class="act" data-act="sort" data-key="sort" data-bins='["A","B"]' data-items='[["item",0],["item",1]]' data-ok="..">
   Worked example    button#hideSol toggles ol#steps
   Golden points     <div id="gold"></div>  (from LAB.lessons[id].gold)
   Links + finish    <div id="links"></div> ... <p id="finMsg"></p><button id="finBtn"></button>
   Every activity/question counts once, first try only, and goes to Lab.check for the parent page. */
(function () {
  "use strict";
  var QZ = { score: 0, answered: 0, total: 0, seen: {} }, ID = null;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function J(el, k, d) { try { return el.hasAttribute(k) ? JSON.parse(el.getAttribute(k)) : d; } catch (e) { return d; } }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function record(key, ok) {
    if (QZ.seen[key]) return; QZ.seen[key] = 1; QZ.answered++; if (ok) QZ.score++;
    if (window.Lab && Lab.check) Lab.check(key, ok);
    if (QZ.answered === QZ.total && window.Lab) Lab.setQuiz(ID, { score: QZ.score, total: QZ.total });
  }
  function fbEl(act) { var f = $(".fb", act); if (!f) { f = document.createElement("p"); f.className = "fb"; f.setAttribute("aria-live", "polite"); act.appendChild(f); } return f; }
  function say(act, text, cls) { var f = fbEl(act); f.textContent = text || ""; f.className = "fb" + (cls ? " " + cls : ""); }
  function win(act) { act.classList.add("win"); }
  function norm(s) { return String(s).replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }).replace("٫", ".").replace(/\s+/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").toLowerCase(); }

  /* ---------- activities ---------- */
  var A = {};
  A.order = function (act) {
    var key = act.dataset.key, ANS = J(act, "data-answer", []), extra = J(act, "data-extra", []), tries = 0;
    if (act.hasAttribute("data-rtl")) act.classList.add("rtl-slots");
    var slots = document.createElement("div"); slots.className = "slots";
    var pool = document.createElement("div"); pool.className = "pool";
    var row = document.createElement("div"); row.className = "row";
    row.innerHTML = '<button class="chk" type="button">تحقّق</button><button class="lite" type="button">من جديد</button>';
    act.appendChild(slots); act.appendChild(pool); act.appendChild(row); fbEl(act);
    function mk(t) { var b = document.createElement("button"); b.className = "pc"; b.type = "button"; b.textContent = t;
      b.addEventListener("click", function () { b.classList.remove("bad", "good"); (b.parentNode === pool ? slots : pool).appendChild(b); say(act, ""); }); return b; }
    function reset() { pool.innerHTML = ""; slots.innerHTML = ""; shuffle(ANS.concat(extra)).forEach(function (t) { pool.appendChild(mk(t)); }); say(act, ""); }
    reset(); row.lastChild.addEventListener("click", reset);
    row.firstChild.addEventListener("click", function () {
      var kids = [].slice.call(slots.children), ok = true; tries++;
      kids.forEach(function (b, i) { var g = b.textContent === ANS[i]; b.classList.toggle("good", g); b.classList.toggle("bad", !g); if (!g) ok = false; });
      if (ok && kids.length === ANS.length) { say(act, act.dataset.ok || "ممتاز!", "ok"); win(act); record(key, tries === 1); }
      else if (ok) say(act, "بداية صحيحة، أكمل باقي القطع.");
      else say(act, act.dataset.no || "القطع الحمراء في غير مكانها.", "no");
    });
  };
  A.gap = function (act) {
    var key = act.dataset.key, slot = $(".gap", act), done = false, tries = 0; fbEl(act);
    $$(".opts .pc", act).forEach(function (b) { b.type = "button"; b.addEventListener("click", function () {
      if (done) return; tries++;
      if (b.hasAttribute("data-ok")) { done = true; if (slot) slot.textContent = b.textContent; b.classList.add("good"); say(act, act.dataset.ok || "صح!", "ok"); win(act); record(key, tries === 1); }
      else { b.classList.add("bad"); say(act, b.getAttribute("data-no") || "ليست هذه، جرّب غيرها.", "no"); }
    }); });
  };
  A.type = function (act) {
    var key = act.dataset.key, tries = 0, ans = act.dataset.answer, tol = parseFloat(act.dataset.tol || "0"), words = J(act, "data-answers", null);
    var row = $(".row", act);
    if (!row) { row = document.createElement("div"); row.className = "row";
      row.innerHTML = '<input class="num-in" ' + (words ? 'style="width:200px;font-family:var(--body)"' : 'inputmode="decimal"') + ' aria-label="جوابك"><button class="chk" type="button">تحقّق</button>' + (act.dataset.hint ? '<button class="lite" type="button">تلميح</button>' : "");
      act.appendChild(row); }
    fbEl(act);
    var inp = $("input", row);
    function check() {
      var raw = inp.value; if (!String(raw).trim()) { say(act, "اكتب جوابك أولاً.", "no"); return; }
      tries++; var ok;
      if (words) ok = words.some(function (w) { return norm(w) === norm(raw); });
      else { var v = parseFloat(norm(raw).replace(",", ".")); ok = !isNaN(v) && Math.abs(v - parseFloat(ans)) <= tol + 1e-9; }
      if (ok) { say(act, act.dataset.ok || "صح!", "ok"); win(act); inp.disabled = true; record(key, tries === 1); }
      else say(act, act.dataset.no || "ليست هذه. راجع الخطوة وجرّب مرة ثانية.", "no");
    }
    $(".chk", row).addEventListener("click", check);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
    var h = $(".lite", row); if (h) h.addEventListener("click", function () { say(act, act.dataset.hint); });
  };
  A.match = function (act) {
    var key = act.dataset.key, pairs = J(act, "data-pairs", []), miss = 0, left = 0, selL = null, selR = null;
    var box = document.createElement("div"); box.className = "mt";
    var cl = document.createElement("div"), cr = document.createElement("div"); cl.className = cr.className = "col";
    box.appendChild(cl); box.appendChild(cr); act.appendChild(box); fbEl(act);
    function btn(t, i, side) { var b = document.createElement("button"); b.type = "button"; b.textContent = t; b.dataset.i = i; b.dataset.side = side; return b; }
    shuffle(pairs.map(function (p, i) { return i; })).forEach(function (i) { cl.appendChild(btn(pairs[i][0], i, "l")); });
    shuffle(pairs.map(function (p, i) { return i; })).forEach(function (i) { cr.appendChild(btn(pairs[i][1], i, "r")); });
    function tryPair() {
      if (!selL || !selR) return;
      if (selL.dataset.i === selR.dataset.i) {
        [selL, selR].forEach(function (b) { b.classList.remove("sel"); b.classList.add("done"); b.disabled = true; });
        left++; say(act, "");
        if (left === pairs.length) { say(act, act.dataset.ok || "كل الأزواج صحيحة!", "ok"); win(act); record(key, miss === 0); }
      } else {
        miss++; var a = selL, b = selR; a.classList.add("bad"); b.classList.add("bad"); say(act, "ليست زوجاً. جرّب مرة ثانية.", "no");
        setTimeout(function () { a.classList.remove("bad", "sel"); b.classList.remove("bad", "sel"); }, 650);
      }
      selL = selR = null;
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.dataset.side === "l") { if (selL) selL.classList.remove("sel"); selL = b; } else { if (selR) selR.classList.remove("sel"); selR = b; }
      b.classList.add("sel"); tryPair();
    });
  };
  A.sort = function (act) {
    var key = act.dataset.key, bins = J(act, "data-bins", []), items = J(act, "data-items", []), miss = 0, placed = 0, sel = null;
    act.classList.add("srt");
    var chips = document.createElement("div"); chips.className = "chips";
    var bx = document.createElement("div"); bx.className = "bins";
    bins.forEach(function (name, k) { var d = document.createElement("div"); d.className = "bin"; d.dataset.k = k; d.innerHTML = "<h4>" + esc(name) + '</h4><div class="in"></div>'; bx.appendChild(d); });
    shuffle(items.slice()).forEach(function (it) { var b = document.createElement("button"); b.type = "button"; b.className = "it"; b.textContent = it[0]; b.dataset.k = it[1]; chips.appendChild(b); });
    var tip = document.createElement("span"); tip.className = "tap"; tip.textContent = "اضغط على بطاقة، ثم على الصندوق المناسب";
    act.appendChild(chips); act.appendChild(tip); act.appendChild(bx); fbEl(act);
    chips.addEventListener("click", function (e) { var b = e.target.closest(".it"); if (!b) return; if (sel) sel.classList.remove("sel"); sel = b; b.classList.add("sel"); });
    bx.addEventListener("click", function (e) {
      var bin = e.target.closest(".bin"); if (!bin || !sel) return;
      if (sel.dataset.k === bin.dataset.k) {
        sel.classList.remove("sel", "bad"); sel.classList.add("good"); sel.disabled = true; $(".in", bin).appendChild(sel); placed++; say(act, "");
        if (placed === items.length) { tip.hidden = true; say(act, act.dataset.ok || "كل البطاقات في مكانها!", "ok"); win(act); record(key, miss === 0); }
      } else { miss++; var s = sel; s.classList.add("bad"); say(act, "ليس هذا مكانها. فكّر مرة ثانية.", "no"); setTimeout(function () { s.classList.remove("bad"); }, 650); }
      sel.classList.remove("sel"); sel = null;
    });
  };

  function wireQuiz() {
    $$(".q").forEach(function (q, qi) {
      var bs = $$(".opts button", q);
      bs.forEach(function (b) { b.type = "button"; b.addEventListener("click", function () {
        bs.forEach(function (x) { x.disabled = true; if (x.hasAttribute("data-ok")) x.classList.add("right"); });
        if (!b.hasAttribute("data-ok")) b.classList.add("wrong");
        var w = $(".why", q); if (w) w.hidden = false;
        record("q" + qi, b.hasAttribute("data-ok"));
      }); });
    });
  }
  function wireExample() {
    var h = $("#hideSol"), st = $("#steps"); if (!h || !st) return;
    h.addEventListener("click", function () { var on = h.getAttribute("aria-pressed") !== "true"; h.setAttribute("aria-pressed", String(on)); st.classList.toggle("hide", on); h.textContent = on ? "أظهِر الحل" : "أخفِ الحل وجرّب أولاً"; });
  }
  function gold() {
    var el = $("#gold"); if (!el || !window.Lab) return; var me = Lab.lesson(ID); if (!me) return;
    var TAG = { exam: "سؤال مكرر", fast: "قاعدة سريعة", trap: "فخ" };
    var star = '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill="#f2a51f"/></svg>';
    el.innerHTML = (me.gold || []).map(function (g) { return '<div class="gp">' + star + '<p><span class="lb ' + g.type + '">' + TAG[g.type] + "</span>" + esc(g.text) + "</p></div>"; }).join("");
  }
  function links() {
    if (!window.Lab || !window.LAB) return; var me = Lab.lesson(ID), S = LAB.subjects, el = $("#links");
    if (me && el) {
      var node = function (id) { var n = Lab.node(id, "../"); if (!n) return ""; var s = S[n.subject], st = 'style="--sc:' + s.color + '"', ic = Lab.icon(s.icon, 15);
        return n.url ? '<a class="node" ' + st + ' href="' + esc(n.url) + '">' + ic + esc(n.title) + (n.done ? " ✓" : "") + "</a>" : '<span class="node soon" ' + st + ">" + ic + esc(n.title) + " · قريباً</span>"; };
      var rows = [["تحتاجه قبله", me.prereq], ["يرتبط به", me.related], ["الدرس التالي", me.next]].filter(function (r) { return r[1] && r[1].length; });
      el.innerHTML = rows.map(function (r) { return '<div class="lrow"><span>' + r[0] + "</span>" + r[1].map(node).join("") + "</div>"; }).join("");
    }
    var btn = $("#finBtn"), msg = $("#finMsg"); if (!btn) return;
    function showDone() { btn.disabled = true; btn.textContent = "✓ منجز"; if (msg) msg.textContent = "رائع! سجّلناه في لوحة التتبع."; }
    if (Lab.isDone(ID)) showDone();
    btn.addEventListener("click", function () { Lab.markDone(ID, QZ.answered ? { score: QZ.score, total: QZ.total } : undefined); showDone(); });
  }

  window.Lesson = {
    record: record,
    /* add the √ sign to every .rad that does not have it yet (call again after inserting new ones) */
    radicals: function (root) {
      $$(".rad", root).forEach(function (r) { if (r.dataset.r) return; r.dataset.r = "1"; var s = r.querySelector(":scope>span"); if (s) r.insertBefore(document.createTextNode("√"), s); });
    },
    init: function (o) {
      ID = window.LESSON_ID = o.id;
      Lesson.radicals(document);
      var acts = $$(".act[data-act]");
      QZ.total = acts.length + $$(".q").length;
      acts.forEach(function (a) { var f = A[a.dataset.act]; if (f) f(a); });
      wireQuiz(); wireExample(); gold(); links();
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) $$("animateMotion,animate,animateTransform").forEach(function (n) { n.remove(); });
    }
  };
})();
