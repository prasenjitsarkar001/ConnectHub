// Import mongoose and Schema class for defining models
import mongoose, { Schema } from "mongoose";

// Define a schema for the "Meeting" collection
const meetingSchema = new Schema(
    {
        // The ID of the user who created/owns this meeting
        user_id : { type: String },

        // A unique code for joining the meeting (required field)
        meetingCode : { type: String, required: true },

        // The date/time of the meeting
        // Defaults to current timestamp if not provided
        date : { type: Date, default: Date.now, required: true }
    }
)

// Create a model from schema → links to "meetings" collection in MongoDB
const Meeting = mongoose.model("Meeting", meetingSchema);

// Export model so controllers/services can use it
export { Meeting };
