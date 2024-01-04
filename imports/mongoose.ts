// import { Meteor } from "meteor/meteor";
// import mongoose from "mongoose";

// const HOST = Meteor.isProduction ? "mongodb" : "localhost";
// // const PORT = Meteor.settings.private.APP_PORT || 27017
// const PORT = 27017;
// // const DB_NAME = Meteor.settings.private.APP_NAME || 'db_core'
// const DB_NAME = "db_core";
// const DB_URL = `mongodb://${HOST}:${PORT}/${DB_NAME}`;

// // In mongoose v6, some options are no longer needed
// // see: https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
// mongoose.set("strictQuery", false);
// mongoose.connect(DB_URL).catch((error) => {
//   console.error("Mongoose connection error: ", error);
// });