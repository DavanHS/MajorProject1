const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/user.js");

router
  .route("/signup")
  .get(listingController.signUpForm)
  .post(saveRedirectUrl, wrapAsync(listingController.signUp));

router
  .route("/login")
  .get(listingController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    listingController.login
  );

router.get("/logout", listingController.logout);

module.exports = router;
