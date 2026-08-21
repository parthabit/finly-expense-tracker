const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const { overview, listUsers, suspendUser, deleteUser } = require("../controllers/adminController");

const router = express.Router();
router.use(protect, adminOnly);

router.get("/overview", overview);
router.get("/users", listUsers);
router.patch("/users/:id/suspend", suspendUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
