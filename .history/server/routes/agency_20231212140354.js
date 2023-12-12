const express = require("express");
const router = express.Router();
const { requireSignin } = require("../middlewares/index");
const {
    makeAgency,
    getAccountStatus,
    currentInstructor,
    instructorCourses,
    removePackage,
    updatePackage,
    getPackage,
    allPackages,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    checkEnrollment,
    feedBack,
    getFeedback,
    getChatbewtweenUserAndAgency,
    addChatbewtweenUserAndAgency,
  } = require("../controllers/agency");


router.get("/instructor-courses", requireSignin, instructorCourses);
router.get('/packages/:packageId',requireSignin, getPackage);
router.get("/current-instructor", requireSignin, currentInstructor);
router.get("/allpackages",requireSignin, allPackages);
router.get('/stripe-success/:packageId', requireSignin, stripeSuccess);
router.get('/user-packages', requireSignin, userCourses);
router.get('/check-enrollment/:packageId', requireSignin, checkEnrollment);
router.get("/packages/:packageId/feedback", requireSignin, getFeedback);
router.post("/packages/:packageId/feedback", requireSignin, feedBack);
router.post("/make-agency", requireSignin, makeAgency);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.post('/paid-enrollment/:packageId', requireSignin, paidEnrollment);
router.put('/packages/:packageId',requireSignin, updatePackage);
router.delete('/packages/:packageId',requireSignin, removePackage);

router.get('/chat',getChatbewtweenUserAndAgency);
router.post("/addChat", addChatbewtweenUserAndAgency);
module.exports = router;


module.exports = router;