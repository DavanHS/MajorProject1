const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const medthodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const mongoUrl = "mongodb://127.0.0.1:27017/majorProject1";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(medthodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => console.log("Database is working"))
  .catch((err) => console.log(err));

async function main() {
  mongoose.connect(mongoUrl);
}

// app.get("/testlisting", async (req, res) => {
//   let samplelisting = new listing({
//     title: "Beautiful Villa near the Beach",
//     description:
//       "It is a 5bhk villa with a swimming pool and a variety of recreational options with a good beach view",
//     price: 2500,
//     location: "Calangute, Goa",
//     country: "India"
//   });

//   await samplelisting.save();
//   console.log("New listing saved");
//   res.send("Sample was saved");
// });

//Test Run
app.get("/", (req, res) => {
  res.send("Root is working");
});

//Viewing all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
});

//Creating New Listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})

//Editing the listings
app.get("/listings/:id/edit", async (req, res) => {
  let {id} = req.params;
  const editListing = await Listing.findById(id);
  res.render("listings/edit.ejs", {editListing});
})

app.put("/listings/:id", async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body});
  res.redirect(`/listings/${id}`);
})

//Viewing a particular listing
app.get("/listings/:id", async (req, res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});

//Deleting a listing
app.delete("/listings/:id", async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});