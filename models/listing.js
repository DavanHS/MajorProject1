const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

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
      default: "/images/Default_image.jpg",
      set: (v) => (v && v.trim() !== "" ? v : "/images/Default_image.jpg"),
    },
  },
  price: {
    type: Number,
    default: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
