const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/majorProject1";

main()
  .then(() => console.log("Database is working"))
  .catch((err) => console.log(err));

async function main() {
  mongoose.connect(mongoUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '6811a4176f197ed2817df3fb' }))
    await Listing.insertMany(initData.data);
    console.log("Data was initalised");
};

initDB();