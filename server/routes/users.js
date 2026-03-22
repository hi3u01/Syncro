const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST - Vytvoření nového uživatele (Registrace)
router.post("/register", async (req, res) => {
  try {
    // Zde později přidáme kontrolu, zda uživatel s tímto emailem už neexistuje
    // a zahashujeme heslo. Prozatím ukládáme čistá data pro testování.
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    // Pro bezpečnost nevracíme heslo v odpovědi
    savedUser.password = undefined;

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Získání všech uživatelů (např. pro trenéra)
router.get("/", async (req, res) => {
  try {
    // Vracíme uživatele, ale vynecháme hesla (selektujeme přes '-password')
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
