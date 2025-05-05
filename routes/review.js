const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const listingController = require("../controllers/review.js");

//Reviews POST
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(listingController.createReview)
);

//Reviews Delete
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(listingController.deleteReview)
);

module.exports = router;
