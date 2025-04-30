const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Viewing all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

//Creating New Listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    req.body.listing.price = Number(req.body.listing.price);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
  })
);

//Editing the listings
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { runValidators: true },
      { new: true }
    );
    if (
      !req.body.listing.image.url ||
      req.body.listing.image.url.trim() === ""
    ) {
      editListing.image.url = "/images/Default_image.jpg";
    } else {
      editListing.image.url = req.body.listing.image.url;
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);

//Viewing a particular listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing not found or does not exist");
      return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Deleting a listing
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
