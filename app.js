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
function renderTeacherPage(auth,error){return `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spațiul profesorului – Robo-Cip</title><style>body{font:17px system-ui,sans-serif;color:#173553;background:linear-gradient(130deg,#edf7ff,#fff5ef);margin:0;padding:20px}.card{max-width:640px;margin:5vh auto;padding:28px;border-radius:22px;background:white;box-shadow:0 9px 27px #132d4b20}h1{font-size:27px}input{display:block;width:100%;box-sizing:border-box;font:inherit;padding:12px;border:1px solid #a8bed4;border-radius:12px;margin:12px 0}button,.link{display:inline-block;border:0;border-radius:12px;background:#1673af;color:white;padding:12px 16px;text-decoration:none;font:inherit;cursor:pointer;margin:7px 6px 5px 0}.note{padding:13px;border-radius:11px;background:#f2f8fc;line-height:1.5}.error{color:#8a2b15}</style></head><body><main class="card"><h1>🔒 Spațiul profesorului</h1><p>Robo-Cip · Resurse destinate cadrelor didactice</p>${auth?'<p class="note">Autentificare activă. Selectați resursa dorită.</p><a class="link" href="/teacher-notes.html">Jurnalul profesorului</a><a class="link" href="/teacher-guide.html">Ghid pedagogic</a><a class="link" href="/teacher-dashboard.html">Tabloul de bord</a><form action="/teacher/logout" method="post"><button type="submit">Deconectare</button></form>':`<p class="note">Introdu parola profesorului pentru acces la resursele protejate.</p>${error?'<p class="error" role="alert">'+escapeHTML(error)+'</p>':''}<form action="/teacher/login" method="post"><label for="password">Parola profesorului</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="1024"><button type="submit">Autentificare</button></form>`}<p><a href="/modules.html">← Înapoi la activitățile elevilor</a></p></main></body></html>`}
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
