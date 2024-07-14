const mongoose = require("mongoose");
const Subject = require("../models/subject.js");
const Timetable = require("../models/timetable.js");

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
  let adsj = await Subject.findOne({ subcode: "ADSJ" });
  let adsjl = await Subject.findOne({ subcode: "ADSJL" });
  let lunch = await Subject.findOne({ subcode: "BREAK" });
  let free = await Subject.findOne({ subcode: "FREE" });
  // console.log(adsj, adsjl, lunch, free);
  const sampledata = [
    {
      id: "timetable001",
      Monday: [
        adsj._id,
        adsj._id,
        free._id,
        adsj._id,
        lunch._id,
        free._id,
        free._id,
      ],
      Tuesday: [
        adsjl._id,
        adsjl._id,
        adsjl._id,
        free._id,
        lunch._id,
        free._id,
        adsj._id,
      ],
      Wednesday: [
        free._id,
        adsjl._id,
        adsjl._id,
        adsjl._id,
        lunch._id,
        adsj._id,
        free._id,
      ],
      Thursday: [
        free._id,
        free._id,
        adsj._id,
        free._id,
        lunch._id,
        adsj._id,
        adsj._id,
      ],
      Friday: [
        free._id,
        adsjl._id,
        adsjl._id,
        adsjl._id,
        lunch._id,
        free._id,
        adsj._id,
      ],
      Saturday: [
        adsj._id,
        adsj._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
    },
    {
      id: "default",
      Monday: [
        free._id,
        free._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
      Tuesday: [
        free._id,
        free._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
      Wednesday: [
        free._id,
        free._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
      Thursday: [
        free._id,
        free._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
      Friday: [
        free._id,
        free._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
      Saturday: [
        free._id,
        free._id,
        free._id,
        free._id,
        lunch._id,
        free._id,
        free._id,
      ],
    },
  ];
  await Timetable.deleteMany({});
  await Timetable.insertMany(sampledata);
};

initDB().catch((error) => {
  console.log("Error initializing DB:", error.message);
});

// const populateData = async () => {
//   try {
//     const populatedTimetables = await Timetable.find({
//       id: "timetable001",
//     }).populate("Monday Tuesday Wednesday Thursday Friday Saturday");
//     const populatedTable = populatedTimetables[0];
//     console.log(populatedTable);
//     // console.log("Populated Timetables:", populatedTimetables);
//   } catch (error) {
//     console.log("Error populating data:", error.message);
//   }
// };

// initDB()
//   .then(populateData)
//   .catch((error) => {
//     console.log("Error initializing DB:", error.message);
//   });
