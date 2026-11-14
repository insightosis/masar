/*
 * masar-sync: keeps one student's progress so the parent can follow it from any device.
 *
 * KV binding: MASAR. Keys:
 *   cfg     {writeToken, parentCode, createdAt}
 *   state   {progress:{lessonId:{done,date,quiz,checks}}, events:[...], updatedAt}
 *
 * Endpoints (JSON):
 *   POST /claim                      first-time setup, only while no cfg exists -> {writeToken, parentCode}
 *   GET  /state      Bearer write    the device pulls its saved progress (restore after a wipe)
 *   POST /push       Bearer write    {progress, events} merged into state
 *   GET  /report     Bearer parent   everything for the parent page
 *   GET  /link       Bearer parent   the write token again, to link a new or wiped device
 *   POST /rotate     Bearer parent   new write token (old device links stop working)
 */

const ORIGINS = ["https://insightosis.github.io", "http://localhost:8000", "http://127.0.0.1:8000"];
const MAX_BODY = 96 * 1024;
const MAX_EVENTS = 3000;

function cors(req) {
  const o = req.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(req, body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, cors(req))
  });
}
function rand(bytes) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
/* constant-time compare */
function same(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function bearer(req) {
  const h = req.headers.get("Authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
}
async function getJSON(env, key, dflt) {
  const v = await env.MASAR.get(key, "json");
  return v == null ? dflt : v;
}
async function readBody(req) {
  const t = await req.text();
  if (t.length > MAX_BODY) throw new Error("too large");
  return t ? JSON.parse(t) : {};
}

const ID_RE = /^[a-z]{2,5}-[a-z0-9-]{1,24}$/;

/* Merge one device snapshot into the stored one. Nothing is ever un-done. */
function mergeProgress(base, inc) {
  const out = Object.assign({}, base);
  for (const id of Object.keys(inc || {})) {
    if (!ID_RE.test(id)) continue;
    const a = out[id] || {}, b = inc[id] || {};
    const m = Object.assign({}, a);
    if (b.done) {
      m.done = true;
      if (b.date && (!a.date || b.date < a.date)) m.date = String(b.date).slice(0, 10);
    }
    if (b.quiz && typeof b.quiz.score === "number" && typeof b.quiz.total === "number") {
      /* keep the first full attempt (that's the honest one) unless none was kept yet */
      if (!a.quiz) m.quiz = { score: b.quiz.score, total: b.quiz.total };
    }
    out[id] = m;
  }
  return out;
}
function cleanEvent(e) {
  if (!e || typeof e !== "object" || typeof e.type !== "string") return null;
  const o = { t: String(e.t || "").slice(0, 30), type: e.type.slice(0, 16) };
  if (e.id && ID_RE.test(e.id)) o.id = e.id;
  if (e.key) o.key = String(e.key).slice(0, 24);
  if (typeof e.ok === "boolean") o.ok = e.ok;
  if (typeof e.sec === "number") o.sec = Math.max(0, Math.min(6 * 3600, Math.round(e.sec)));
  if (typeof e.score === "number") o.score = e.score;
  if (typeof e.total === "number") o.total = e.total;
  if (e.eid) o.eid = String(e.eid).slice(0, 24);
  return o;
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (path === "/" ) return json(req, { ok: true, service: "masar-sync" });

      const cfg = await getJSON(env, "cfg", null);

      if (path === "/claim" && req.method === "POST") {
        if (cfg) return json(req, { error: "already-claimed" }, 409);
        const c = { writeToken: rand(16), parentCode: rand(9), createdAt: new Date().toISOString() };
        await env.MASAR.put("cfg", JSON.stringify(c));
        return json(req, { writeToken: c.writeToken, parentCode: c.parentCode });
      }
      if (!cfg) return json(req, { error: "not-set-up" }, 404);

      const tok = bearer(req);
      const isWriter = same(tok, cfg.writeToken);
      const isParent = same(tok, cfg.parentCode);

      if (path === "/state" && req.method === "GET") {
        if (!isWriter) return json(req, { error: "unauthorized" }, 401);
        const s = await getJSON(env, "state", { progress: {}, events: [] });
        return json(req, { progress: s.progress || {}, updatedAt: s.updatedAt || null });
      }

      if (path === "/push" && req.method === "POST") {
        if (!isWriter) return json(req, { error: "unauthorized" }, 401);
        const body = await readBody(req);
        const s = await getJSON(env, "state", { progress: {}, events: [] });
        s.progress = mergeProgress(s.progress || {}, body.progress || {});
        const seen = new Set((s.events || []).map((e) => e.eid).filter(Boolean));
        const add = (Array.isArray(body.events) ? body.events : []).slice(0, 500).map(cleanEvent)
          .filter((e) => e && !(e.eid && seen.has(e.eid)));
        s.events = (s.events || []).concat(add).slice(-MAX_EVENTS);
        s.updatedAt = new Date().toISOString();
        await env.MASAR.put("state", JSON.stringify(s));
        return json(req, { ok: true, progress: s.progress, accepted: add.length });
      }

      if (path === "/report" && req.method === "GET") {
        if (!isParent) return json(req, { error: "unauthorized" }, 401);
        const s = await getJSON(env, "state", { progress: {}, events: [] });
        return json(req, s);
      }

      if (path === "/link" && req.method === "GET") {
        if (!isParent) return json(req, { error: "unauthorized" }, 401);
        return json(req, { writeToken: cfg.writeToken });
      }

      if (path === "/rotate" && req.method === "POST") {
        if (!isParent) return json(req, { error: "unauthorized" }, 401);
        cfg.writeToken = rand(16);
        await env.MASAR.put("cfg", JSON.stringify(cfg));
        return json(req, { writeToken: cfg.writeToken });
      }

      return json(req, { error: "not-found" }, 404);
    } catch (e) {
      return json(req, { error: "bad-request" }, 400);
    }
  }
};
