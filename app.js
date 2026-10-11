const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const app = express();
const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
app.set("trust proxy",1);
app.disable("x-powered-by");
app.use(express.json({limit:"64kb"}));
app.use(express.urlencoded({extended:false,limit:"8kb"}));
const TEACHER_FILES=new Set(["teacher-notes.html","teacher-dashboard.html","teacher-guide.html","menu-robo.html"]);
const COOKIE="robo_teacher_session";
const SESSION_SECONDS=8*60*60;
const attempts=new Map();
function configurationReady(){return /^[0-9a-f]{32}:[0-9a-f]{64}$/i.test(process.env.TEACHER_PASSWORD_SCRYPT||"") && (process.env.TEACHER_SESSION_SECRET||"").length>=32}
function timingEqual(a,b){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function verifyPassword(password){if(!configurationReady()||typeof password!=="string"||password.length>1024)return false;const [salt,hash]=process.env.TEACHER_PASSWORD_SCRYPT.split(":");try{return timingEqual(crypto.scryptSync(password,Buffer.from(salt,"hex"),32).toString("hex"),hash)}catch{return false}}
function sessionToken(){const expires=Date.now()+SESSION_SECONDS*1000;const val=String(expires);const sig=crypto.createHmac("sha256",process.env.TEACHER_SESSION_SECRET).update(val).digest("hex");return val+"."+sig}
function isAuthenticated(req){if(!configurationReady())return false;const cookie=(req.headers.cookie||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));if(!cookie)return false;const raw=cookie.substring(COOKIE.length+1);const parts=raw.split(".");if(parts.length!==2||!/^\d{13}$/.test(parts[0])||Number(parts[0])<Date.now()||! /^[0-9a-f]{64}$/.test(parts[1]))return false;const expected=crypto.createHmac("sha256",process.env.TEACHER_SESSION_SECRET).update(parts[0]).digest("hex");return timingEqual(expected,parts[1])}
function teacherGuard(req,res,next){res.set("Cache-Control","no-store");res.set("X-Content-Type-Options","nosniff");if(!isAuthenticated(req))return res.redirect(303,"/teacher");next()}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderTeacherPage(auth,error){return `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spațiul profesorului – Robo-Cip</title><style>body{font:16px system-ui,sans-serif;color:#19495a;background:linear-gradient(135deg,#e5f8fb,#f5fcfd 55%,#eaf4fb);margin:0;padding:20px}.card{max-width:980px;margin:5vh auto;padding:32px;border-radius:24px;background:linear-gradient(145deg,#ffffff,#f4fcfd);border:1px solid #d7f0f3;box-shadow:0 10px 30px #1455681c}h1{font-size:28px;color:#15576b;margin:0 0 8px}input{display:block;width:100%;box-sizing:border-box;font:inherit;padding:12px;border:1px solid #a4d3dc;border-radius:12px;margin:12px 0}button,.link{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;border:1px solid #9adce5;border-radius:13px;background:linear-gradient(135deg,#1ba2b4,#13849d);color:#fff;padding:12px 14px;min-height:48px;text-decoration:none;font:600 15px system-ui,sans-serif;cursor:pointer;text-align:center}button:hover,.link:hover{background:linear-gradient(135deg,#168fa5,#106d86)}button:focus-visible,.link:focus-visible,a:focus-visible{outline:3px solid #78dce9;outline-offset:3px}.teacher-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}.teacher-actions form{margin:0;display:flex;min-width:0}.teacher-actions form button{width:100%}.note{padding:14px 17px;border-radius:13px;background:#e8f8fa;color:#22576a;line-height:1.5;border:1px solid #d3eef1}.error{color:#9a351c}.back-link{color:#25788d;text-decoration:none;font-size:14px}.back-link:hover{text-decoration:underline}@media(max-width:760px){.teacher-actions{grid-template-columns:repeat(2,minmax(0,1fr))}.card{padding:22px}}@media(max-width:460px){.teacher-actions{grid-template-columns:1fr}.card{padding:18px}}</style></head><body><main class="card"><h1>🔒 Spațiul profesorului</h1><p>Robo-Cip · Resurse destinate cadrelor didactice</p>${auth?'<p class="note">Autentificare activă. Selectați resursa dorită.</p><div class="teacher-actions"><a class="link" href="/teacher-notes.html">Jurnalul profesorului</a><a class="link" href="/teacher-guide.html">Ghid pedagogic</a><a class="link" href="/teacher-dashboard.html">Tabloul de bord</a><form action="/teacher/logout" method="post"><button type="submit">Deconectare</button></form></div>':`<p class="note">Introdu parola profesorului pentru acces la resursele protejate.</p>${error?'<p class="error" role="alert">'+escapeHTML(error)+'</p>':''}<form action="/teacher/login" method="post"><label for="password">Parola profesorului</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="1024"><button type="submit">Autentificare</button></form>`}<p><a class="back-link" href="/modules.html">← Înapoi la activitățile elevilor</a></p></main></body></html>`}
app.get("/teacher",(req,res)=>{res.set("Cache-Control","no-store");res.send(renderTeacherPage(isAuthenticated(req),configurationReady()?"":"Autentificarea este în curs de configurare."))});
app.post("/teacher/login",(req,res)=>{
res.set("Cache-Control","no-store");if(!configurationReady())return res.status(503).send(renderTeacherPage(false,"Accesul profesorului nu este încă configurat."));
const key=req.ip||"unknown",now=Date.now();const r=attempts.get(key)||{count:0,until:0};
if(r.until>now)return res.status(429).send(renderTeacherPage(false,"Prea multe încercări. Reîncearcă în 15 minute."));
if(verifyPassword(req.body?.password)){attempts.delete(key);res.cookie(COOKIE,sessionToken(),{httpOnly:true,secure:process.env.NODE_ENV==="production"||req.secure,sameSite:"strict",maxAge:SESSION_SECONDS*1000,path:"/"});return res.redirect(303,"/teacher")}
r.count++;if(r.count>=5){r.until=now+15*60*1000;r.count=0}attempts.set(key,r);if(attempts.size>4000)attempts.clear();return res.status(401).send(renderTeacherPage(false,"Parolă incorectă."))
});
app.post("/teacher/logout",(req,res)=>{res.clearCookie(COOKIE,{path:"/",sameSite:"strict",secure:process.env.NODE_ENV==="production"||req.secure});res.redirect(303,"/teacher")});
const staticAliases={
"/css/styles.css":"styles.css",
"/js/robo-menu-button.js":"robo-menu-button.js",
"/js/learner.js":"learner.js",
"/js/home.js":"home.js",
"/js/activity-log.js":"activity-log.js"
};
for(const [url,file] of Object.entries(staticAliases))app.get(url,(_,res)=>res.sendFile(path.join(ROOT,file)));
app.get("/assets/img/:file",(req,res)=>{if(!/^[\w-]+\.(png|jpg|jpeg|webp|gif)$/i.test(req.params.file))return res.sendStatus(404);res.sendFile(path.join(ROOT,req.params.file))});
app.get("/api/learner/missions",(req,res)=>{try{const missions=JSON.parse(fs.readFileSync(path.join(ROOT,"missions.json"),"utf8"));res.json(req.query.moduleId?missions.filter(m=>m.moduleId===req.query.moduleId):missions)}catch(err){console.error(err);res.status(500).json({error:"Nu pot încărca misiunile"})}});
app.get("/favicon.ico",(_,res)=>res.sendFile(path.join(ROOT,"robo_hero.png")));
app.get("/portfolio.html",(_,res)=>res.redirect(302,"/portofolio.html"));
app.get("/",(_,res)=>res.sendFile(path.join(ROOT,"index.html")));
app.get(new RegExp("^/[a-z0-9_-]+[.](html|js|css|png|jpg|jpeg|webp|gif|glb|mp4)$","i"),(req,res,next)=>{
const name=req.path.slice(1);
if(["app.js","learnerController.js","learnerRoutes.js"].includes(name))return res.sendStatus(404);
if(TEACHER_FILES.has(name))return teacherGuard(req,res,()=>res.sendFile(path.join(ROOT,name)));
res.sendFile(path.join(ROOT,name),err=>{if(err&&!res.headersSent)next()})
});
app.get("/resources/:name",(req,res)=>{const file=req.params.name;if(!/^[a-z0-9_-]+\.(html|js|css)$/i.test(file))return res.sendStatus(404);if(TEACHER_FILES.has(file))return teacherGuard(req,res,()=>res.sendFile(path.join(ROOT,file)));res.sendFile(path.join(ROOT,file))});
app.get("/module",(_,res)=>res.sendFile(path.join(ROOT,"learner.html")));
app.listen(PORT,"0.0.0.0",()=>console.log("Robo-Cip running on "+PORT));
