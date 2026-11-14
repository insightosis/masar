/* Daily timetable. Edit the times here; every page reads them.
   School hours are an assumption until the school's own timetable is confirmed.
   Rule: every block ends by 21:30, then 30 minutes to get ready for sleep, lights out at 22:00. */
window.SCHEDULE = {
  schoolDays: [0, 1, 2, 3, 4],          // Sun..Thu (Date.getDay())
  exams: { from: "2026-12-20", to: "2026-12-31" },
  kinds: {
    study:   { name: "مسار",            color: "#f07c2a" },
    school:  { name: "المدرسة",          color: "#2287f0" },
    homework:{ name: "الواجبات",         color: "#17b388" },
    project: { name: "المشروع",          color: "#5fb02a" },
    course:  { name: "الدورة (أونلاين، وقت مرن)", color: "#8a63f2", flex: true },
    play:    { name: "لعب وترفيه",       color: "#ff5f8f" },
    meal:    { name: "وجبة وراحة",       color: "#e2a33f" },
    rest:    { name: "روتين",            color: "#8b86b3" },
    sleep:   { name: "النوم",            color: "#6d68a8" }
  },
  templates: {
    school: { name: "يوم دراسي (الأحد إلى الخميس)", blocks: [
      ["05:45", "06:00", "rest",     "استيقاظ وروتين الصباح"],
      ["06:00", "06:40", "study",    "جلسة الصباح", "am"],
      ["06:40", "07:00", "meal",     "فطور وتجهيز"],
      ["07:00", "13:30", "school",   "الدوام المدرسي"],
      ["13:30", "14:30", "meal",     "غداء وراحة"],
      ["14:30", "15:30", "homework", "الواجبات والدفتر"],
      ["15:30", "16:30", "play",     "لعب وترفيه"],
      ["16:30", "17:30", "course",   "دورة هندسة الأجيال: فيديو أونلاين، تقدر تبدّلها مع وقت اللعب"],
      ["17:30", "18:00", "meal",     "وجبة خفيفة واستراحة"],
      ["18:00", "19:40", "study",    "جلسة المساء", "pm"],
      ["19:40", "20:10", "meal",     "العشاء مع العائلة"],
      ["20:10", "20:50", "project",  "المشروع المدرسي (إن وُجد، وإلا وقت حر)"],
      ["20:50", "21:30", "play",     "لعب وترفيه"],
      ["21:30", "22:00", "rest",     "الاستعداد للنوم بدون شاشات"],
      ["22:00", "22:00", "sleep",    "النوم"]
    ]},
    friday: { name: "الجمعة", blocks: [
      ["05:45", "06:00", "rest",     "استيقاظ وروتين الصباح"],
      ["06:00", "07:20", "study",    "جلسة الصباح", "am"],
      ["07:20", "08:00", "meal",     "فطور"],
      ["08:00", "09:30", "play",     "لعب وترفيه"],
      ["09:30", "10:30", "course",   "دورة هندسة الأجيال: فيديو أونلاين، تقدر تبدّلها مع وقت اللعب"],
      ["10:30", "11:30", "homework", "الواجبات والدفتر"],
      ["11:30", "15:00", "meal",     "صلاة الجمعة والغداء مع العائلة"],
      ["15:00", "17:30", "play",     "لعب وطلعات"],
      ["17:30", "18:00", "meal",     "وجبة خفيفة"],
      ["18:00", "19:40", "study",    "جلسة المساء", "pm"],
      ["19:40", "20:15", "meal",     "العشاء"],
      ["20:15", "21:30", "play",     "وقت حر ولعب"],
      ["21:30", "22:00", "rest",     "الاستعداد للنوم بدون شاشات"],
      ["22:00", "22:00", "sleep",    "النوم"]
    ]},
    saturday: { name: "السبت (يوم المراجعة)", blocks: [
      ["05:45", "06:00", "rest",     "استيقاظ وروتين الصباح"],
      ["06:00", "06:50", "study",    "جلسة الصباح: النقاط الأساسية للأسبوع", "am"],
      ["06:50", "07:30", "meal",     "فطور"],
      ["07:30", "09:30", "play",     "لعب وترفيه"],
      ["09:30", "10:30", "course",   "دورة هندسة الأجيال: فيديو أونلاين، تقدر تبدّلها مع وقت اللعب"],
      ["10:30", "12:00", "project",  "المشروع المدرسي والدفتر"],
      ["12:00", "14:30", "meal",     "غداء ووقت عائلة"],
      ["14:30", "17:30", "play",     "لعب وطلعات"],
      ["17:30", "18:00", "meal",     "وجبة خفيفة"],
      ["18:00", "19:40", "study",    "جلسة المساء: اختبارات وتطبيقات الأسبوع", "pm"],
      ["19:40", "20:15", "meal",     "العشاء"],
      ["20:15", "21:30", "play",     "وقت حر ولعب"],
      ["21:30", "22:00", "rest",     "الاستعداد للنوم بدون شاشات"],
      ["22:00", "22:00", "sleep",    "النوم"]
    ]},
    exam: { name: "أيام الاختبارات", blocks: [
      ["05:30", "06:00", "rest",     "استيقاظ وفطور خفيف"],
      ["06:00", "06:25", "study",    "إحماء قبل الاختبار", "am"],
      ["06:25", "07:00", "meal",     "فطور وطريق"],
      ["07:00", "11:00", "school",   "الاختبار"],
      ["11:00", "14:00", "meal",     "غداء ونوم قصير"],
      ["14:00", "16:00", "play",     "لعب وترفيه"],
      ["16:00", "17:00", "course",   "دورة هندسة الأجيال أونلاين (أو راحة إذا كان الغد صعباً)"],
      ["17:00", "18:00", "meal",     "وجبة واستراحة"],
      ["18:00", "19:40", "study",    "جلسة المساء: مراجعة اختبار الغد", "pm"],
      ["19:40", "20:15", "meal",     "العشاء"],
      ["20:15", "21:15", "play",     "وقت هادئ"],
      ["21:15", "21:45", "rest",     "الاستعداد للنوم"],
      ["21:45", "21:45", "sleep",    "نوم مبكر قبل الاختبار"]
    ]}
  },
  kindFor: function (dateStr) {
    var d = new Date(dateStr + "T12:00:00"), w = d.getDay();
    if (w === 5) return "friday";
    if (w === 6) return "saturday";
    if (dateStr >= this.exams.from && dateStr <= this.exams.to) return "exam";
    return "school";
  },
  /* Draw one day's timeline into el. With a date, study blocks list that day's plan items and the
     current block is marked; with a template key only, it shows the template. */
  render: function (el, dateStr, tplKey) {
    var self = this, key = tplKey || this.kindFor(dateStr), tpl = this.templates[key];
    var P = window.PLAN, S = window.LAB && window.LAB.subjects, cat = {};
    if (P) P.catalog.forEach(function (c) { cat[c.id] = c; });
    var day = P && dateStr ? P.days.filter(function (d) { return d.date === dateStr; })[0] : null;
    var now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
    var isToday = dateStr && window.Lab && dateStr === Lab.today();
    function m(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
    function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function len(b) { var d = m(b[1]) - m(b[0]); return d >= 60 ? (Math.floor(d / 60) + " س" + (d % 60 ? " " + (d % 60) + " د" : "")) : (d ? d + " د" : ""); }
    function items(sess) {
      if (!day || !day.sessions[sess]) return "";
      var tot = 0, h = day.sessions[sess].map(function (it) {
        if (it.type === "new") { var c = cat[it.lesson], s = S[c.subject]; tot += c.minutes;
          var pub = window.Lab && Lab.lesson(c.id), t = pub ? '<a href="' + esc(pub.url) + '">' + esc(c.title) + "</a>" : esc(c.title);
          return '<li style="--sc:' + s.color + '"><span class="tl-dot"></span>' + esc(s.name) + " " + c.code + ": " + t + "</li>"; }
        tot += it.minutes || 0;
        return '<li><span class="tl-dot"></span>' + esc(it.title || it.note || "") + "</li>";
      }).join("");
      return '<ul class="tl-items">' + h + '</ul><span class="tl-sub">مخطط له ≈ ' + tot + " دقيقة</span>";
    }
    el.innerHTML = '<p class="tl-name">' + esc(tpl.name) + "</p>" + tpl.blocks.map(function (b) {
      var k = self.kinds[b[2]], cur = isToday && nowMin >= m(b[0]) && nowMin < m(b[1]), past = isToday && nowMin >= m(b[1]) && b[2] !== "sleep";
      return '<div class="tl-b' + (cur ? " now" : "") + (past ? " past" : "") + '" style="--kc:' + k.color + '">'
        + '<time class="tl-t">' + b[0] + (b[1] !== b[0] ? " – " + b[1] : "") + "</time>"
        + '<div class="tl-c"><b>' + esc(b[3]) + (cur ? ' <span class="tl-now">الآن</span>' : "") + '</b><span class="tl-k">' + esc(k.name) + (len(b) ? " · " + len(b) : "") + "</span>"
        + (b[4] ? items(b[4]) : "") + "</div></div>";
    }).join("");
  }
};
