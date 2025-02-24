import mongoose from "mongoose";
import { config } from "./app.config";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
};

export default connectToDatabase;
