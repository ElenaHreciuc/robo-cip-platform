const path = require("path");
const express = require("express");

const learnerRoutes = require("./routes/learnerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Pentru body JSON (viitor POST/PUT etc.)
app.use(express.json());

// Servire fișiere statice (frontend)
const publicPath = path.join(__dirname, "..", "..", "public");
app.use(express.static(publicPath));

// Rute API elevi
app.use("/api/learner", learnerRoutes);

// Pagina de start = index.html (pagina de module)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// (Opțional) fallback simplu
app.get("/module", (req, res) => {
  res.sendFile(path.join(publicPath, "learner.html"));
});

app.listen(PORT, () => {
  console.log(`Server Robo-Cip pornit pe http://localhost:${PORT}`);
});
