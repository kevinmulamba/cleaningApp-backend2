const { verifyToken: verifyJWT } = require("../config/jwt"); // ✅ Import sécurisé

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé : Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJWT(token); // ✅ Vérification avec fonction centralisée

  if (!decoded) {
    return res.status(403).json({ message: "Token invalide" });
  }

  req.user = decoded; // ✅ Utilisable ensuite dans les routes
  next();
};

module.exports = verifyToken;

