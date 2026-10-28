import mongoose from "mongoose"
import { dbUrl } from "./constant.js"

const connectToDb = async () => {
    try {
        await mongoose.connect(dbUrl)
        console.log("application is connected to database successfully.")
    } catch (error) {
        console.log("unable to connect to database:", error.message)
    }
}

export default connectToDb
