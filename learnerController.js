const path = require("path");
const fs = require("fs");

const dataPath = path.join(__dirname, "..", "data", "missions.json");

function loadMissions() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

// GET /api/learner/missions?moduleId=...
function getMissions(req, res) {
  try {
    const moduleId = req.query.moduleId;
    const missions = loadMissions();

    let filtered = missions;
    if (moduleId) {
      filtered = missions.filter((m) => m.moduleId === moduleId);
    }

    res.json(filtered);
  } catch (err) {
    console.error("Eroare la citirea missions.json:", err);
    res.status(500).json({ error: "Eroare la încărcarea misiunilor" });
  }
}

module.exports = {
  getMissions
};
