// Import mongoose and Schema class
import mongoose, { Schema } from "mongoose";

// Define schema for the "User" collection
const userSchema = new Schema(
    {
        // User's full name (required)
        name : { type: String, required: true },

        // Username (must be unique, required for login)
        username : { type: String, required: true, unique: true },

        // Hashed password (required)
        password : { type: String, required: true },

        // Token field (used for session management / authentication)
        token : { type: String }
    }
)

// Create model from schema → corresponds to "users" collection in MongoDB
const User = mongoose.model("User", userSchema);

// Export so controllers/services can use this model
export { User };
