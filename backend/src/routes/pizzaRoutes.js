const express = require("express");
const { getPizzas, createPizza, deletePizza } = require("../controllers/pizzaController.js");

const router = express.Router();

router.get("/", getPizzas);
router.post("/", createPizza);
router.delete("/", deletePizza);

module.exports = router;
