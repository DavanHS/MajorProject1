const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  req.body.listing.price = Number(req.body.listing.price);
  req.body.listing.owner = req.user._id;
  let url, filename;
  if (typeof req.file !== "undefined") {
    url = req.file.path;
    filename = req.file.filename;
  } else {
    url = "/images/Default_image.jpg";
    filename = "default";
  }
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const editListing = await Listing.findById(id);
  let originalImageUrl = editListing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_100,w_50/"
  );
  console.log(originalImageUrl);
  res.render("listings/edit.ejs", { editListing, originalImageUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const editListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    editListing.image = { url, filename };
    await editListing.save();
  }

  if (!editListing.image || !editListing.image.url) {
    editListing.image = {
      url: "/images/Default_image.jpg",
      filename: "default",
    };
    await editListing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.viewListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found or does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
