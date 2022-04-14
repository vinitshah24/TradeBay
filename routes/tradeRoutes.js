const express = require("express");
const controller = require("../controllers/tradeController")
const trController = require("../controllers/tradeRequestController")

const { isLoggedIn, isAuthor } = require('../middlewares/auth');
const { validateId, validateTrade } = require('../middlewares/validator');

const router = express.Router();

router.get("/sent", isLoggedIn, trController.getSentRequest);
router.get("/rec", isLoggedIn, trController.getReceivedRequest);
router.post("/run", isLoggedIn, trController.postTradeRequest);

// GET: /trades - send all trades to the user
router.get("/", controller.index);
// GET: /trades/new - send html form for creating new trade
router.get("/new", isLoggedIn, controller.new);
// POST: /trades - create new trade
router.post("/", isLoggedIn, validateTrade, controller.create);
// GET: /trades/:id - get trade for id
router.get("/:id", validateId, controller.show);
// GET: /trades/:id/edit - send form for editing existing trade
router.get("/:id/edit", validateId, isLoggedIn, isAuthor, controller.edit);
// PUT: /trades/:id - update the trade for id
router.put("/:id", validateId, isLoggedIn, isAuthor, validateTrade, controller.update);
// DELETE: /trades/:id - delete the trade with id
router.delete("/:id", validateId, isLoggedIn, isAuthor, controller.delete);
// POST: /trades/like
router.post("/like", isLoggedIn, controller.like);
// POST: /trades/dislike
router.post("/dislike", isLoggedIn, controller.dislike);
// GET: /trades/swap
router.get("/:id/swap", validateId, isLoggedIn, controller.swap);

router.post("/initiate", isLoggedIn, trController.initiateRequest);

module.exports = router;