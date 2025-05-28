if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Database is working"))
  .catch((err) => console.log(err));

async function main() {
  mongoose.connect(mongoUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '6818c998919f33d2d0f68cd2' }))
    await Listing.insertMany(initData.data);
    console.log("Data was initalised");
};

initDB();