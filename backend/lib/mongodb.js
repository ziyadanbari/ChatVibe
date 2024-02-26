import mongoose from "mongoose";

export function connectToDB(mongodb_uri) {
  return mongoose.connect(mongodb_uri, {
    bufferCommands: true,
    dbName: "chatvibe",
  });
}
