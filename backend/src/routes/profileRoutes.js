const express = require("express");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");
const { changePasswordSchema } = require("../schemas/authSchemas");
const {
  updateProfile,
  uploadAvatar,
  changePassword,
  deleteAccount,
} = require("../controllers/profileController");

const router = express.Router();
router.use(protect);

router.put("/", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.put("/change-password", validate(changePasswordSchema), changePassword);
router.delete("/", deleteAccount);

module.exports = router;
