const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

// ✅ Route test API
router.get("/", (req, res) => {
  res.status(200).json({ message: "API Auth accessible" });
});

// ✅ Inscription
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "❌ Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "✅ Utilisateur créé avec succès" });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ Connexion
router.post("/login", authController.login);

// ✅ Vérification du code 2FA
router.post("/verify-2fa", authController.verify2FA);

// ✅ Récupération du profil connecté
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ Route générique de profil (alternative Frontend)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ 🔥 TEMPORAIRE : route sans filtrage de rôle pour tester
router.get("/provider-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Utilisateur non trouvé" });

    res.json(user); // ⛔️ Pas de vérification du rôle ici
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

module.exports = router;

