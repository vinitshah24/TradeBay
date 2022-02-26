const express = require("express");
const controller = require("../controllers/tradeController")

const router = express.Router();

// GET: /trades - send all trades to the user
router.get("/", controller.index);
// GET: /trades/new - send html form for creating new trade
router.get("/new", controller.new);
// POST: /trades - create new trade
router.post("/", controller.create);
// GET: /trades/:id - get trade for id
router.get("/:id", controller.show);
// GET: /trades/:id/edit - send form for editing existing trade
router.get("/:id/edit", controller.edit);
// PUT: /trades/:id - update the trade for id
router.put("/:id", controller.update);
// DELETE: /trades/:id - delete the trade with id
router.delete("/:id", controller.delete);

module.exports = router;