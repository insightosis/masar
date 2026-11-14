/* Single source of truth for the site. The daily lesson task appends to LAB.lessons
   and updates latest.html. Never put the student's name, results or the textbook here:
   this repository is public. */
window.LAB = {
  title: "مسار · الصف الحادي عشر",
  base: "https://insightosis.github.io/masar/",
  subjects: {
    physics:   { name: "الفيزياء",   color: "#d9772e", soft: "#ffe3cc", icon: "physics" },
    chemistry: { name: "الكيمياء",   color: "#2f9e78", soft: "#cdf2e4", icon: "chemistry" },
    biology:   { name: "الأحياء",    color: "#5c9a33", soft: "#e0f4c9", icon: "biology" },
    math:      { name: "الرياضيات",  color: "#7a5ad8", soft: "#e6ddff", icon: "math" },
    geology:   { name: "الجيولوجيا", color: "#c4664a", soft: "#fbdcd2", icon: "geology" }
  },
  /* { subject, title, date: "YYYY-MM-DD" } */
  exams: [],
  /* Lessons not published yet are looked up in PLAN.catalog (assets/plan.js), so links to them show as "قريباً". */
  lessons: [
    {
      id: "phy-u1-1-3",
      date: "2026-11-14",
      subject: "physics",
      unit: "الحركة · الدرس 1-3",
      title: "حركة القذيفة",
      url: "lessons/phy-u1-1-3.html",
      minutes: 37,
      prereq: ["phy-u1-1-1", "phy-u1-1-2", "math-u5-5-1"],
      related: ["math-u2-2-3"],
      next: ["phy-u1-2-1"],
      terms: [
        { ar: "السرعة الابتدائية", en: "v0 · Initial velocity", def: "سرعة الكرة لحظة خروجها من يدك. الصفر يعني لحظة البداية." },
        { ar: "زاوية الإطلاق", en: "θ · Launch angle", def: "كم رفعت اتجاه الرمية عن الأرض: 0° على الأرض و90° للأعلى تماماً." },
        { ar: "السرعة الأفقية", en: "vx · Horizontal velocity", def: "جزء السرعة الذي يمشي مع الأرض، ثابت لا يتغير. x خط ممدود على الأرض." },
        { ar: "السرعة الرأسية", en: "vy · Vertical velocity", def: "جزء السرعة الذي يصعد أو ينزل، مثل المصعد. يصير صفراً عند القمة." },
        { ar: "تسارع الجاذبية", en: "g · Gravity", def: "شدّ الأرض: 9.8 م/ث² للأسفل دائماً، حتى عند القمة." },
        { ar: "زمن التحليق", en: "T · Time of flight", def: "كم ثانية بقيت الكرة في الهواء. T من Time." },
        { ar: "أقصى ارتفاع", en: "H · Maximum height", def: "أعلى نقطة تصلها الكرة. H من Height." },
        { ar: "المدى", en: "R · Range", def: "المسافة على الأرض بين مكان الرمي ومكان الهبوط. R من Range." }
      ],
      gold: [
        { type: "exam", text: "عند القمة السرعة الرأسية صفر، لكن السرعة الكلية تساوي vx، والتسارع يساوي g وليس صفراً." },
        { type: "fast", text: "الزمن يحدده الاتجاه الرأسي فقط: جسم يسقط من ارتفاع h يحتاج t = √(2h ÷ g) مهما كانت سرعته الأفقية." },
        { type: "exam", text: "أقصى مدى عند 45° ويساوي v0² ÷ g." },
        { type: "fast", text: "مضاعفة v0 تضاعف المدى والارتفاع 4 مرات، والزمن مرتين." },
        { type: "fast", text: "الجسم يهبط بنفس مقدار سرعة الإطلاق وبنفس الزاوية تحت الأفقي (إذا هبط على نفس المستوى)." },
        { type: "trap", text: "قوانين T و H و R الجاهزة لا تُستخدم إذا قُذف الجسم من مكان مرتفع." },
        { type: "trap", text: "حوّل كم/ساعة إلى م/ث بالقسمة على 3.6، واضبط الآلة الحاسبة على الدرجات (DEG)." }
      ]
    }
  ]
};
