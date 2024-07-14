const mongoose = require("mongoose");
// const Subject = require("../models/Subject");
const initSubData = require("./subdata.js");
const MONGO_URL =
  "mongodb+srv://22b81a05y9:ananya521@clusterprojects.7x4tczd.mongodb.net/fwms";

main()
  .then(() => {
    console.log("connection to db established");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Subject.deleteMany({});
  await Subject.insertMany(initSubData.subdata);
  console.log("database has been initialized");
};

initDB();
