import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config("");
async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect successfully!");
  } catch (error) {
    console.log("Connect failure!");
  }
}

export { connect };
