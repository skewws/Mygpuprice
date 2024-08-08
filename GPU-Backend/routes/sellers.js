const express = require("express");
const Seller = require("../models/Seller");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { name, link } = req.body;

  try {
    const newSeller = new Seller({ name, link });
    const seller = await newSeller.save();
    res.status(201).json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { name, link } = req.body;

  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { name, link },
      { new: true }
    );
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json({ message: "Seller deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
