/* Single source of truth for the site. The daily lesson task appends to LAB.lessons
   and updates latest.html. Never put the student's name, results or the textbook here:
   this repository is public. */
window.LAB = {
  title: "مسار · الصف الحادي عشر",
  base: "https://insightosis.github.io/masar/",
  subjects: {
    physics:   { name: "الفيزياء",   color: "#ffb547", icon: "physics" },
    chemistry: { name: "الكيمياء",   color: "#3fe0c5", icon: "chemistry" },
    biology:   { name: "الأحياء",    color: "#7ddc6a", icon: "biology" },
    math:      { name: "الرياضيات",  color: "#9d8cff", icon: "math" },
    geology:   { name: "الجيولوجيا", color: "#e08a5a", icon: "geology" }
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
      title: "حركة المقذوفات",
      url: "lessons/phy-u1-1-3.html",
      minutes: 15,
      prereq: ["phy-u1-1-1", "phy-u1-1-2", "math-u5-5-1"],
      related: ["math-u2-2-3"],
      next: ["phy-u1-2-1"],
      terms: [
        { ar: "المقذوف", en: "Projectile", def: "جسم يُطلق في الهواء ثم يتحرك بتأثير الجاذبية وحدها." },
        { ar: "المسار", en: "Trajectory", def: "الطريق الذي يرسمه الجسم في الهواء، وشكله قطع مكافئ." },
        { ar: "زاوية الإطلاق", en: "Launch angle (θ)", def: "الزاوية بين اتجاه السرعة الابتدائية والخط الأفقي." },
        { ar: "المركبة الأفقية", en: "Horizontal component (vx)", def: "جزء السرعة الموازي للأرض، ثابت طوال الحركة." },
        { ar: "المركبة الرأسية", en: "Vertical component (vy)", def: "جزء السرعة العمودي على الأرض، يتغير بسبب الجاذبية." },
        { ar: "السقوط الحر", en: "Free fall", def: "حركة لا تؤثر فيها إلا الجاذبية، بتسارع ثابت للأسفل." },
        { ar: "تسارع الجاذبية", en: "Gravitational acceleration (g)", def: "مقداره 9.8 م/ث² تقريباً، واتجاهه دائماً لأسفل." },
        { ar: "زمن التحليق", en: "Time of flight (T)", def: "الزمن من لحظة الإطلاق حتى لحظة الهبوط." },
        { ar: "أقصى ارتفاع", en: "Maximum height (H)", def: "أعلى نقطة يصلها الجسم، وعندها السرعة الرأسية صفر." },
        { ar: "المدى الأفقي", en: "Horizontal range (R)", def: "المسافة الأفقية بين نقطة الإطلاق ونقطة الهبوط." },
        { ar: "زاويتان متتامتان", en: "Complementary angles", def: "مجموعهما 90°، مثل 30° و 60°، وتعطيان نفس المدى." },
        { ar: "تحليل المتجه", en: "Vector resolution", def: "تفكيك متجه مائل إلى مركبتين متعامدتين باستخدام cos و sin." }
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
