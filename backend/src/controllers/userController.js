// Import standard HTTP status codes (e.g., 200, 404, 500)
import httpStatus from "http-status";

// Import User model (MongoDB via Mongoose)
import { User } from "../models/userModel.js";

// Import bcrypt for hashing + comparing passwords
import bcrypt, { hash } from "bcrypt"

// Import crypto (Node.js built-in) for random token generation
import crypto from "crypto"

// (Not used here, but imported in case of meeting-related features)
import { Meeting } from "../models/meetingModel.js";

/**
 * LOGIN CONTROLLER
 * Authenticates a user by username + password.
 */
const login = async (req, res) => {

    // Extract login credentials from request body
    const { username, password } = req.body;

    // Quick check: if either field missing, return 400
    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide" })
    }

    try {
        // Check if user exists in database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
        }

        // Compare plaintext password with stored hashed password
        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            // Generate a random session token (NOT JWT, just random string)
            let token = crypto.randomBytes(20).toString("hex");

            // Store token in DB (so user stays authenticated)
            user.token = token;
            await user.save();

            // Return token as response
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            // If password doesn’t match → Unauthorized
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        // Catch-all for DB/Server errors
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}

/**
 * REGISTER CONTROLLER
 * Creates a new user account with hashed password.
 */
const register = async (req, res) => {
    // Extract fields from request body
    const { name, username, password } = req.body;

    try {
        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        // Hash the password before saving (10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user document
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        // Save user in DB
        await newUser.save();

        // Return success response
        res.status(httpStatus.CREATED).json({ message: "User Registered" })
    } catch (e) {
        // Catch-all error
        res.json({ message: `Something went wrong ${e}` })
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}


export { login, register, getUserHistory, addToHistory }
