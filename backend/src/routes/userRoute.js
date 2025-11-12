// Import Router from Express
import { Router } from "express";

// Import controller functions for user auth
import {addToHistory, getUserHistory, login, register } from "../controllers/userController.js";

// Create a new router instance
const router = Router();

// Define route for user login (POST request)
router.route("/login").post(login)

// Define route for user registration (POST request)
router.route("/register").post(register)

// Placeholder route for adding activity (controller not implemented yet)
router.route("/add_to_activity").post(addToHistory)

// Placeholder route for fetching all activity (controller not implemented yet)
router.route("/get_all_activity").get(getUserHistory)

// Export router to be used in main app.js/server.js
export default router;
