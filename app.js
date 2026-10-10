const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
app.use(express.json({limit:"64kb"}));
const staticAliases = {
  "/css/styles.css":"styles.css",
  "/js/robo-menu-button.js":"robo-menu-button.js",
  "/js/learner.js":"learner.js",
  "/js/home.js":"home.js",
  "/js/activity-log.js":"activity-log.js"
};
for (const [url,file] of Object.entries(staticAliases)) {
  app.get(url, (_,res) => res.sendFile(path.join(ROOT,file)));
}
app.get("/assets/img/:file", (req,res) => {
  if (!/^[\w-]+\.(png|jpg|jpeg|webp|gif)$/i.test(req.params.file)) return res.sendStatus(404);
  res.sendFile(path.join(ROOT,req.params.file));
});
app.get("/api/learner/missions", (req,res) => {
  try {
    const missions = JSON.parse(fs.readFileSync(path.join(ROOT,"missions.json"),"utf8"));
    res.json(req.query.moduleId ? missions.filter(m=>m.moduleId===req.query.moduleId):missions);
  } catch (err) { console.error(err); res.status(500).json({error:"Nu pot încărca misiunile"}); }
});
// Serve only public assets; keep source, metadata and teaching data off static URLs.
app.get("/favicon.ico", (_,res) => res.sendFile(path.join(ROOT,"robo_hero.png")));
app.get("/portfolio.html", (_,res) => res.redirect(302,"/portofolio.html"));
app.get("/", (_,res) => res.sendFile(path.join(ROOT,"index.html")));
app.get(new RegExp("^/[a-z0-9_-]+[.](html|js|css|png|jpg|jpeg|webp|gif|glb|mp4)$","i"), (req,res,next) => {
  const name = req.path.slice(1);
  if (["app.js","learnerController.js","learnerRoutes.js"].includes(name)) return res.sendStatus(404);
  res.sendFile(path.join(ROOT,name), err => { if(err && !res.headersSent) next(); });
});
app.get("/resources/:name", (req,res) => {
  const file = req.params.name;
  if (!/^[a-z0-9_-]+\.(html|js|css)$/i.test(file)) return res.sendStatus(404);
  res.sendFile(path.join(ROOT,file));
});
app.get("/module",(_,res)=>res.sendFile(path.join(ROOT,"learner.html")));
app.listen(PORT,"0.0.0.0",()=>console.log("Robo-Cip running on "+PORT));
