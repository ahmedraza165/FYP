
const express = require("express");
const router = express.Router();
const { requireSignin , upload } = require("../middlewares/index");
const { User } = require('../models/user');
const { Form } = require('../models/packages');


const {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  createnewpackage,
} = require("../controllers/auth");

router.get('/VerifyEmail/:emailVerificationToken', async (req, res) => {
  const { emailVerificationToken } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { emailVerificationToken },
      { isVerified: true, emailVerificationToken: null }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.isVerified = true;
    console.log(user.isVerified);
    res.json({ message: 'Account activated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/createnewpackage", upload.single("image"), requireSignin, createnewpackage);

module.exports = router;
