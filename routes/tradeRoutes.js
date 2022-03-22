const express = require("express");
const controller = require("../controllers/tradeController")

const { isLoggedIn, isAuthor } = require('../middlewares/auth');
const { validateId } = require('../middlewares/validator');

const router = express.Router();

// GET: /trades - send all trades to the user
router.get("/", controller.index);
// GET: /trades/new - send html form for creating new trade
router.get("/new", isLoggedIn, controller.new);
// POST: /trades - create new trade
router.post("/", isLoggedIn, controller.create);
// GET: /trades/:id - get trade for id
router.get("/:id", validateId, controller.show);
// GET: /trades/:id/edit - send form for editing existing trade
router.get("/:id/edit", validateId, isLoggedIn, isAuthor, controller.edit);
// PUT: /trades/:id - update the trade for id
router.put("/:id", validateId, isLoggedIn, isAuthor, controller.update);
// DELETE: /trades/:id - delete the trade with id
router.delete("/:id", validateId, isLoggedIn, isAuthor, controller.delete);
// POST: /trades/rate
router.post("/like", isLoggedIn, controller.like);
router.post("/dislike", isLoggedIn, controller.dislike);

module.exports = router;