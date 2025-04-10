const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: { type: String },
    url: {
      type: String,
      default:
        "/images/Default_image.jpg",
      set: (v) =>
        v && v.trim() !== ""
          ? v
          : "/images/Default_image.jpg",
    },
  },
  price: {
    type: Number,
    default: 0
  },
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
