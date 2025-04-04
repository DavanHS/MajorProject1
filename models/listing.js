const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: { type: String }, // Added type for filename
    url: {
      type: String,
      default:
        "https://www.freepik.com/free-vector/house-rent-concept-with-placard_9843844.htm",
      set: (v) =>
        v && v.trim() !== ""
          ? v
          : "https://www.freepik.com/free-vector/house-rent-concept-with-placard_9843844.htm",
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
