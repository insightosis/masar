/* Single source of truth for the site. The daily lesson task appends to LAB.lessons
   and updates latest.html. Never put the student's name, results or the textbook here:
   this repository is public. */
window.LAB = {
  title: "مسار · الصف الحادي عشر",
  base: "https://insightosis.github.io/masar/",
  subjects: {
    physics:   { name: "الفيزياء",   color: "#f07c2a", icon: "physics" },
    chemistry: { name: "الكيمياء",   color: "#17b388", icon: "chemistry" },
    biology:   { name: "الأحياء",    color: "#5fb02a", icon: "biology" },
    math:      { name: "الرياضيات",  color: "#8a63f2", icon: "math" },
    geology:   { name: "الجيولوجيا", color: "#e2653f", icon: "geology" }
  },
  /* { subject, title, date: "YYYY-MM-DD" } */
  exams: [],
  /* Lessons not published yet are looked up in PLAN.catalog (assets/plan.js), so links to them show as "قريباً". */
  lessons: [
    {
      id: "phy-u1-1-3",
      date: "2026-11-14",
      subject: "physics",
      unit: "الحركة · الدرس 1-3 · ص 29 إلى 37",
      title: "حركة القذيفة",
      url: "lessons/phy-u1-1-3.html",
      minutes: 37,
      prereq: ["phy-u1-1-1", "phy-u1-1-2", "math-u5-5-1"],
      related: ["math-u2-2-3"],
      next: ["phy-u1-2-1"],
      terms: [
        { ar: "السرعة الابتدائية", en: "v0 · Initial velocity", def: "سرعة الكرة لحظة خروجها من يدك. الصفر يعني لحظة البداية." },
        { ar: "زاوية الإطلاق", en: "θ · Launch angle", def: "الزاوية بين اتجاه الرمية والمحور الأفقي." },
        { ar: "المركبة الأفقية للسرعة", en: "v0x · Horizontal component", def: "v0x = v0 cos θ، ثابتة طوال الرحلة. x خط ممدود على الأرض." },
        { ar: "المركبة الرأسية للسرعة", en: "v0y · Vertical component", def: "v0y = v0 sin θ. بعد الرمي vy = −g t + v0 sin θ، وتصير صفراً عند القمة." },
        { ar: "عجلة الجاذبية", en: "g · Gravitational acceleration", def: "نحو 10 م/ث² في مسائل الكتاب، للأسفل دائماً: a_y = −g." },
        { ar: "الإزاحة", en: "Δx, Δy · Displacement", def: "Δx التقدم الأفقي و Δy الارتفاع أو النزول. Δ تعني التغيّر." },
        { ar: "الزمن الكلي", en: "t′ · Time of flight", def: "زمن الرحلة كلها t′ = 2t، حيث t زمن الوصول للقمة." },
        { ar: "أقصى ارتفاع", en: "h_max · Maximum height", def: "أعلى نقطة، وعندها vy = 0. max = القمة." },
        { ar: "المدى الأفقي", en: "R · Range", def: "المسافة الأفقية بين نقطة الإطلاق ونقطة الوصول على نفس المستوى." },
        { ar: "القطع المكافئ", en: "Parabola", def: "شكل مسار القذيفة عند إهمال مقاومة الهواء." }
      ],
      gold: [
        { type: "exam", text: "حركة القذيفة مركّبة من حركة منتظمة السرعة على المحور الأفقي وحركة منتظمة العجلة على المحور الرأسي." },
        { type: "exam", text: "عند أقصى ارتفاع vy = 0، لكن السرعة الكلية تساوي v0x وليست صفراً، والعجلة تساوي g." },
        { type: "fast", text: "رمي أفقي من ارتفاع h: v0y = 0، والزمن من h = ½ g t² فقط، ثم Δx = v t." },
        { type: "exam", text: "أقصى مدى عند 45°، والزاويتان المتتامتان (مثل 30° و60°) تعطيان نفس المدى، والأكبر زاوية أعلى ارتفاعاً وأطول زمناً." },
        { type: "fast", text: "بإهمال الهواء تصطدم القذيفة بالأرض بنفس مقدار سرعة الإطلاق وبنفس الزاوية لكن تحت الأفقي." },
        { type: "exam", text: "مقاومة الهواء تقلل المدى والارتفاع، ولا يبقى المسار قطعاً مكافئاً تاماً." },
        { type: "trap", text: "قوانين t′ و h_max و R الجاهزة لا تُستخدم إذا لم تصل القذيفة إلى نفس مستوى الإطلاق. ارجع لمعادلتي Δx و Δy." },
        { type: "trap", text: "الكتاب يأخذ g = 10 م/ث² في المسائل، واضبط الآلة الحاسبة على الدرجات (DEG)." }
      ]
    }
  ]
};
