const express = require("express");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");
const { transactionSchema, updateTransactionSchema } = require("../schemas/transactionSchemas");
const {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();
router.use(protect);

// Note: multipart fields arrive as strings, so numeric/boolean coercion happens
// via Zod's z.coerce where relevant before validate() runs — for JSON requests
// (no receipt) req.body is already correctly typed by the client.
router.get("/", listTransactions);
router.post("/", upload.single("receipt"), validate(transactionSchema), createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", upload.single("receipt"), validate(updateTransactionSchema), updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
