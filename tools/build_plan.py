#!/usr/bin/env python3
"""Build the study plan (assets/plan.js + plan.json) from the term-1 syllabus.

Syllabus = tables of contents of the Kuwait MOE grade-11 (science) student books,
term 1, 2026-2027. Pages are the book's printed page numbers, used only to weight
lessons by length.

Run from the repo root:  python3 tools/build_plan.py
"""
import json, datetime as dt
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (unit, unit title, code, lesson title, start page, end page)
SYL = {
 "math": [
  (1,"الأعداد الحقيقية","1-1","الجذور والتعبيرات الجذرية",12,22),
  (1,"الأعداد الحقيقية","1-2","الأسس النسبية",22,30),
  (1,"الأعداد الحقيقية","1-3","حل المعادلات",30,42),
  (2,"الدوال الحقيقية","2-1","مجال الدالة",44,50),
  (2,"الدوال الحقيقية","2-2","الدوال التربيعية ونمذجتها",50,56),
  (2,"الدوال الحقيقية","2-3","الدوال التربيعية والقطوع المكافئة",56,64),
  (2,"الدوال الحقيقية","2-4","صورتا معادلة الدالة التربيعية: الرأس والعامة",64,69),
  (2,"الدوال الحقيقية","2-5","المعكوسات ودوال الجذر التربيعي",69,75),
  (2,"الدوال الحقيقية","2-6","حل المتباينات",75,88),
  (3,"كثيرات الحدود","3-1","دوال القوى ومعكوساتها",90,97),
  (3,"كثيرات الحدود","3-2","الدوال الحدودية",97,102),
  (3,"كثيرات الحدود","3-3","العوامل الخطية لكثيرات الحدود",102,107),
  (3,"كثيرات الحدود","3-4","قسمة كثيرات الحدود",107,116),
  (3,"كثيرات الحدود","3-5","حل معادلات كثيرات الحدود",116,124),
  (4,"الدوال الأسية واللوغاريتمية","4-1","استكشاف النماذج الأسية",126,132),
  (4,"الدوال الأسية واللوغاريتمية","4-2","الدوال الأسية وتمثيلها بيانياً",132,138),
  (4,"الدوال الأسية واللوغاريتمية","4-3","الدوال اللوغاريتمية وتمثيلها بيانياً",138,144),
  (4,"الدوال الأسية واللوغاريتمية","4-4","خواص اللوغاريتمات",144,150),
  (4,"الدوال الأسية واللوغاريتمية","4-5","المعادلات الأسية واللوغاريتمية",150,158),
  (4,"الدوال الأسية واللوغاريتمية","4-6","اللوغاريتم الطبيعي",158,166),
  (5,"المتجهات","5-1","المتجه في المستوى",168,180),
  (5,"المتجهات","5-2","جمع المتجهات وطرحها",180,187),
  (5,"المتجهات","5-3","الضرب الداخلي",187,196),
  (6,"الإحصاء","6-1","المجتمع الإحصائي والمعاينة",198,202),
  (6,"الإحصاء","6-2","العينات",202,208),
  (6,"الإحصاء","6-3","أساليب عرض البيانات",208,213),
  (6,"الإحصاء","6-4","الانحراف المعياري",213,216),
  (6,"الإحصاء","6-5","القاعدة التجريبية",216,220),
  (6,"الإحصاء","6-6","القيمة المعيارية",220,228),
 ],
 "physics": [
  (1,"الحركة","1-1","الكميات العددية والكميات المتجهة",14,25),
  (1,"الحركة","1-2","تحليل المتجهات",25,29),
  (1,"الحركة","1-3","حركة القذيفة",29,38),
  (1,"الحركة","2-1","وصف الحركة الدائرية",43,54),
  (1,"الحركة","2-2","القوة الجاذبة المركزية",54,61),
  (1,"الحركة","2-3","القوة الطاردة المركزية",61,66),
  (2,"المادة والحرارة","3-1","مركز الثقل",71,74),
  (2,"المادة والحرارة","3-2","مركز الكتلة",74,78),
  (2,"المادة والحرارة","3-3","تحديد موضع مركز الكتلة أو مركز الثقل",78,85),
  (2,"المادة والحرارة","3-4","انقلاب الأجسام",85,90),
  (2,"المادة والحرارة","3-5","الاتزان (الثبات)",90,95),
  (2,"المادة والحرارة","3-6","مركز ثقل جسم الإنسان",95,99),
  (2,"المادة والحرارة","4-1","مسارات الأقمار الصناعية",105,111),
 ],
 "chemistry": [
  (1,"الإلكترونات في الذرة","1-1","الأفلاك الجزيئية",14,19),
  (1,"الإلكترونات في الذرة","2-1","الأفلاك المهجنة",20,25),
  (2,"المحاليل","1-1","الماء كمذيب قوي",30,33),
  (2,"المحاليل","1-2","المحاليل المائية",33,39),
  (2,"المحاليل","1-3","الأنظمة المائية غير المتجانسة",39,44),
  (2,"المحاليل","2-1","التفاعلات في المحاليل المائية",45,51),
  (2,"المحاليل","2-2","العوامل المؤثرة على الذوبانية",51,59),
  (2,"المحاليل","2-3","تركيب المحاليل",59,70),
  (2,"المحاليل","2-4","الحسابات المتعلقة بالخواص المجمّعة للمحاليل",70,75),
  (3,"الكيمياء الحرارية","1-1","التغيرات الحرارية",82,93),
 ],
 "biology": [
  (1,"علم النباتات","1-1","تركيب النباتات",14,28),
  (1,"علم النباتات","1-2","التغذية في النباتات",28,41),
  (1,"علم النباتات","1-3","النقل في النباتات",41,51),
  (1,"علم النباتات","1-4","نمو النباتات",51,60),
  (1,"علم النباتات","2-1","التكاثر الجنسي في النباتات (1)",61,68),
  (1,"علم النباتات","2-2","التكاثر الجنسي في النباتات (2)",68,75),
  (1,"علم النباتات","2-3","التكاثر اللاجنسي في النباتات",75,83),
  (2,"علم الوراثة","1-1","الأنماط الوراثية",94,101),
  (2,"علم الوراثة","1-2","مبادئ علم الوراثة",101,115),
  (2,"علم الوراثة","1-3","دراسة توارث الصفات في الإنسان",115,120),
  (2,"علم الوراثة","1-4","ارتباط الجينات (الارتباط والعبور)",120,126),
  (2,"علم الوراثة","1-5","الوراثة والجنس",126,134),
 ],
 "geology": [
  (1,"الكون والأرض","1-1","علم الأرض (الجيولوجيا)",14,19),
  (1,"الكون والأرض","2-1","نشأة الكون",21,25),
  (1,"الكون والأرض","2-2","المجرات ودورة حياة النجم",25,30),
  (1,"الكون والأرض","2-3","نشأة المجموعة الشمسية",30,34),
  (2,"مواد الأرض (1)","1-1","المعادن",38,41),
  (2,"مواد الأرض (1)","1-2","الخواص الفيزيائية للمعادن",41,49),
  (2,"مواد الأرض (1)","1-3","الخواص الكيميائية للمعادن",49,53),
  (2,"مواد الأرض (1)","1-4","الشكل البلوري للمعادن",53,59),
  (2,"مواد الأرض (1)","1-5","الأحجار الكريمة",59,63),
  (3,"مواد الأرض (2)","1-1","تكوّن الصخور النارية",67,70),
  (3,"مواد الأرض (2)","1-2","تركيب الصخور النارية",70,80),
  (3,"مواد الأرض (2)","2-1","منشأ الصخور الرسوبية",83,90),
  (3,"مواد الأرض (2)","2-2","التراكيب الأولية للصخور الرسوبية",90,95),
  (3,"مواد الأرض (2)","2-3","بيئات الصخور الرسوبية واستخداماتها",95,97),
  (3,"مواد الأرض (2)","3-1","التحوّل",99,102),
  (3,"مواد الأرض (2)","3-2","أنسجة الصخور المتحوّلة",102,109),
  (4,"العمليات التي تغيّر تضاريس الأرض","1-1","دور التحرّك الكتلي",113,116),
  (4,"العمليات التي تغيّر تضاريس الأرض","1-2","العوامل والمحفّزات المتحكمة بالتحرّك الكتلي",116,119),
  (4,"العمليات التي تغيّر تضاريس الأرض","1-3","تصنيف عمليات التحرّك الكتلي",119,125),
 ],
}
PREFIX = {"math":"math","physics":"phy","chemistry":"chem","biology":"bio","geology":"geo"}
# minutes per book page: problem-heavy subjects need more practice time
PACE = {"math":3.2,"physics":3.0,"chemistry":3.0,"biology":2.2,"geology":2.2}

START = dt.date(2026,11,15)      # first plan day
BUILD_END = dt.date(2026,12,11)  # every lesson learned by this day (Fri)
EXAM_START = dt.date(2026,12,20) # MOE window for grades 10-11: 20-31 Dec 2026
EXAM_END = dt.date(2026,12,31)
# Official per-subject dates, filled in when the MOE timetable is published: {"math": "2026-12-20", ...}
EXAMS = {}
# Kuwait weekend is Fri/Sat: more time then
# Minutes of NEW lessons a day. Saturday is a review day (no new lessons); see the timetable in assets/schedule.js.
CAP = {4:150, 5:0}               # weekday() 4=Fri 5=Sat
CAP_SCHOOL = 95
PM_CAP = {4:95}                  # evening session limit; the rest of the day's lessons go to the morning
PM_CAP_SCHOOL = 85
AM_CAP = {4:75}                  # morning lessons (recall comes on top); school mornings are short
AM_CAP_SCHOOL = 28
DAYS_AR = ["الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"]

def lesson_id(s,u,code): return f"{PREFIX[s]}-u{u}-{code}"

catalog = []
for s, rows in SYL.items():
    for (u,ut,code,title,a,b) in rows:
        pages = max(2,b-a)
        catalog.append({"id":lesson_id(s,u,code),"subject":s,"unit":u,"unitTitle":ut,"code":code,
                        "title":title,"pages":[a,b-1],"minutes":round(10+pages*PACE[s])})

def days(a,b):
    d=a
    while d<=b:
        yield d; d+=dt.timedelta(days=1)

# ---------- phase 1: build (new lessons, interleaved, paced so every subject finishes on time)
build_days = list(days(START,BUILD_END))
# Interleave subjects in proportion: each lesson gets the fraction of its subject done at its midpoint;
# sorting by that fraction spreads every subject evenly across the phase. Then lay the sequence on the
# calendar by cumulative time, so Fri/Sat (bigger capacity) take more and the last lesson lands on BUILD_END.
seq=[]
for s in SYL:
    q=[c for c in catalog if c["subject"]==s]; tot=sum(c["minutes"] for c in q); run=0
    for c in q:
        seq.append(((run+c["minutes"]/2)/tot, list(SYL).index(s), c)); run+=c["minutes"]
seq.sort(key=lambda x:(x[0],x[1]))
caps=[CAP.get(d.weekday(),CAP_SCHOOL) for d in build_days]
# lay the sequence on the calendar by cumulative time: each lesson goes to the day where its midpoint falls
cum=[];acc=0
for c in caps: acc+=c; cum.append(acc)
total_min=sum(c["minutes"] for _,_,c in seq)
plan=[{"date":d.isoformat(),"phase":"build","items":[]} for d in build_days]
run=0
for _,_,c in seq:
    mid=(run+c["minutes"]/2)/total_min*cum[-1]; run+=c["minutes"]
    k=next(i for i,v in enumerate(cum) if v>=mid and caps[i]>0)
    plan[k]["items"].append({"type":"new","lesson":c["id"]})
week_ids=[]
for i,d in enumerate(build_days):
    week_ids += [it["lesson"] for it in plan[i]["items"] if it["type"]=="new"]
    if d.weekday()==5:
        plan[i]["items"]=[{"type":"weekly-am","minutes":45,"lessons":week_ids[:],"title":"مراجعة الأسبوع: النقاط الأساسية والرموز والقوانين"},
                          {"type":"weekly-pm","minutes":90,"lessons":week_ids[:],"title":"تحدي الأسبوع: اختبارات وتطبيقات تفاعلية على دروس الأسبوع"}]
        week_ids=[]
queues={s:[] for s in SYL}
# anything left (should be none) goes to the last build days
left=[c for q in queues.values() for c in q]
assert not left, f"unscheduled: {[c['id'] for c in left]}"

# ---------- phase 2: consolidate (one subject per day, units summaries + applications book + timed quiz)
CONS = [("math","مراجعة الرياضيات: الوحدات 1 إلى 6"),("physics","مراجعة الفيزياء: الفصول 1 إلى 4"),
        ("chemistry","مراجعة الكيمياء: الوحدات 1 إلى 3"),("biology","مراجعة الأحياء: النباتات والوراثة"),
        ("geology","مراجعة الجيولوجيا: الوحدات 1 إلى 4"),
        ("mixed","نقاط الضعف: إعادة الدروس الأقل درجة في الاختبارات القصيرة")]
for d,(s,title) in zip(days(BUILD_END+dt.timedelta(days=1),dt.date(2026,12,17)),CONS):
    plan.append({"date":d.isoformat(),"phase":"consolidate","items":[{"type":"review","subject":s,"title":title,
        "minutes":CAP.get(d.weekday(),CAP_SCHOOL)}]})

# ---------- phase 3: mock exams under time
MOCK = {dt.date(2026,12,18):[("math","اختبار تجريبي كامل: الرياضيات"),("physics","اختبار تجريبي كامل: الفيزياء")],
        dt.date(2026,12,19):[("chemistry","اختبار تجريبي كامل: الكيمياء"),("biology","اختبار تجريبي كامل: الأحياء"),("geology","اختبار تجريبي كامل: الجيولوجيا")]}
for d,ms in MOCK.items():
    plan.append({"date":d.isoformat(),"phase":"mock","items":[{"type":"mock","subject":s,"title":t,"minutes":60} for s,t in ms]})

# ---------- phase 4: exam window. Per-subject dates come from the official timetable once published:
# the evening before each exam = review of that subject's golden points + one past-paper.
byday={dt.date.fromisoformat(v):k for k,v in EXAMS.items()}
for d in days(EXAM_START-dt.timedelta(days=1),EXAM_END):
    nxt=byday.get(d+dt.timedelta(days=1))
    if d<EXAM_START and not nxt: continue
    if nxt:
        item={"type":"eve","subject":nxt,"title":"ليلة اختبار "+{"math":"الرياضيات","physics":"الفيزياء","chemistry":"الكيمياء","biology":"الأحياء","geology":"الجيولوجيا"}[nxt]+": النقاط الذهبية + نموذج اختبار سابق","minutes":90}
    elif EXAMS:
        continue
    else:
        item={"type":"eve","subject":"tbd","title":"مراجعة ليلة الاختبار حسب الجدول الرسمي","minutes":60}
    if d<EXAM_START:  # eve of an exam on the first day falls on the last mock day
        for day in plan:
            if day["date"]==d.isoformat(): day["items"].append(item)  # split into sessions below
        continue
    plan.append({"date":d.isoformat(),"phase":"exams","items":[item]})

# ---------- two sittings a day: 06:00 (before school, short) and 18:00 (the main one).
lesson_min={c["id"]:c["minutes"] for c in catalog}
cat_ix={c["id"]:k for k,c in enumerate(catalog)}
def mins(it): return lesson_min[it["lesson"]] if it["type"]=="new" else it.get("minutes",0)
for day in plan:
    d=dt.date.fromisoformat(day["date"]); items=day.pop("items")
    news=[i for i in items if i["type"]=="new"]; other=[i for i in items if i["type"]!="new"]
    am=[];pm=news[:]
    cap=PM_CAP.get(d.weekday(),PM_CAP_SCHOOL)
    # move the shortest lessons to the morning until the evening fits its limit (keep at least one in the evening)
    am_cap=AM_CAP.get(d.weekday(),AM_CAP_SCHOOL)
    while len(pm)>1 and sum(mins(i) for i in pm)>cap:
        # never move a lesson ahead of an earlier lesson of the same subject that stays in the evening
        cand=[i for i in pm if not any(cat_ix[j["lesson"]]<cat_ix[i["lesson"]] and j["lesson"].split("-")[0]==i["lesson"].split("-")[0] for j in pm)]
        if not cand: break
        it=min(cand,key=mins)
        if sum(mins(i) for i in am)+mins(it)>am_cap: break
        pm.remove(it); am.append(it)
    order={id(i):k for k,i in enumerate(news)}
    am.sort(key=lambda i:order[id(i)]); pm.sort(key=lambda i:order[id(i)])
    for it in other:
        (am if it["type"] in ("weekly-am",) else pm).append(it)
    if day["phase"]=="consolidate":
        rv=pm[0]; half=dict(rv); half["minutes"]=45 if d.weekday() in (4,5) else 30; rv["minutes"]=90
        half["title"]=rv["title"]+" · الملخصات والنقاط الذهبية"; rv["title"]=rv["title"]+" · تمارين كتاب التطبيقات واختبار قصير"; am=[half]
    if day["phase"]=="mock" and len(pm)>1 and not am: am=[pm.pop(0)]
    if day["phase"]=="exams" and not am:
        am=[{"type":"warmup","minutes":20,"title":"إحماء قبل الاختبار: النقاط الذهبية للمادة فقط، بدون دروس جديدة"}]
    if day["phase"]=="build" and d.weekday()!=5:
        am.insert(0,{"type":"recall","minutes":10,"title":"استرجاع سريع على دروس أمس"})
        if len(am)==1 and pm:
            am.append({"type":"preview","minutes":10,"title":"تمهيد: رموز ومصطلحات دروس المساء"})
    day["sessions"]={"am":am,"pm":pm}

out = {"generated":dt.date.today().isoformat(),
       "source":"جداول محتويات كتب الطالب، الصف الحادي عشر علمي، الفصل الأول 2026-2027، وزارة التربية الكويت",
       "examWindow":{"start":EXAM_START.isoformat(),"end":EXAM_END.isoformat(),
                     "note":"فترة اختبارات نهاية الفصل الأول للصفين العاشر والحادي عشر. مواعيد المواد تُضاف عند نشر الجدول الرسمي."},
       "sessions":{"am":{"name":"جلسة الصباح","time":"06:00"},"pm":{"name":"جلسة المساء","time":"18:00"}},
       "exams":[{"subject":k,"date":v} for k,v in sorted(EXAMS.items(),key=lambda x:x[1])],
       "phases":{"build":{"name":"تعلّم","from":START.isoformat(),"to":BUILD_END.isoformat()},
                 "consolidate":{"name":"تثبيت","from":"2026-12-12","to":"2026-12-17"},
                 "mock":{"name":"اختبارات تجريبية","from":"2026-12-18","to":"2026-12-19"},
                 "exams":{"name":"الاختبارات","from":EXAM_START.isoformat(),"to":EXAM_END.isoformat()}},
       "catalog":catalog,"days":plan}
(ROOT/"plan.json").write_text(json.dumps(out,ensure_ascii=False,indent=1),encoding="utf-8")
(ROOT/"assets"/"plan.js").write_text("/* Generated by tools/build_plan.py. Do not edit by hand. */\nwindow.PLAN = "+json.dumps(out,ensure_ascii=False)+";\n",encoding="utf-8")

# report
by={}
for day in plan:
    for it in day["sessions"]["am"]+day["sessions"]["pm"]:
        if it["type"]=="new": by.setdefault(day["date"],[]).append(it["lesson"])
mins={c["id"]:c["minutes"] for c in catalog}
for day in plan[:len(build_days)]:
    d=dt.date.fromisoformat(day["date"])
    a=[it.get("lesson",it["type"]) for it in day["sessions"]["am"]]; b=[it.get("lesson",it["type"]) for it in day["sessions"]["pm"]]
    print(day["date"],DAYS_AR[d.weekday()],"AM",a,"| PM",b)
print("lessons",len(catalog),"build days",len(build_days))
