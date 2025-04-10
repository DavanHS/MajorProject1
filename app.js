const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const medthodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const mongoUrl = "mongodb://127.0.0.1:27017/majorProject1";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(medthodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => console.log("Database is working"))
  .catch((err) => console.log(err));

async function main() {
  mongoose.connect(mongoUrl);
}

//Test Run
app.get("/", (req, res) => {
  res.send("Root is working");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Viewing all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

//Creating New Listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    req.body.listing.price = Number(req.body.listing.price);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Editing the listings
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const editListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
  })
);

app.put(
  "/listings/:id",
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
    res.redirect(`/listings/${id}`);
  })
);

//Viewing a particular listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Deleting a listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { err });
  // res.status(statusCode).send(message);
});
app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});
