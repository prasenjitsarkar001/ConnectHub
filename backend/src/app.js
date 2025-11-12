// Import express framework
import express from "express";
// Import Node's built-in HTTP server creator (used with socket.io)
import {createServer} from "node:http";

// Import socket.io server class (not used directly here but imported)
import { Server } from "socket.io";
// Import custom socket manager (handles socket.io connections)
import { connectToSocket } from "./controllers/socketManager.js";

// Import mongoose for MongoDB connection
import mongoose from "mongoose";
// Import CORS middleware for cross-origin requests
import cors from "cors";
// Import user-related routes
import userRoutes from "./routes/userRoute.js";

// Initialize express app
const app = express();
// Create HTTP server instance wrapping the express app
const server = createServer(app);
// Attach socket.io to the server via socketManager
const io = connectToSocket(server);

// Set the port for the app (environment variable or default 8000)
app.set ("port",process.env.PORT || 8000);

// Middleware setup
app.use(cors()); // Allow cross-origin requests (currently open to all origins)
app.use(express.json({limit: "40kb"})); // Parse incoming JSON payloads (limit size 40kb)
app.use(express.urlencoded({limit:"40kb",extended:true})); // Parse URL-encoded data (limit size 40kb)

// Mount user routes under /api/v1/users
app.use("/api/v1/users", userRoutes);

// Start function to connect to MongoDB and launch server
const start = async()=>{
    // Connect to MongoDB Atlas cluster using mongoose
    const connectionDb = await mongoose.connect("mongodb+srv://papaigaming709_db_user:SE8J3YxgX8ecRbhk@cluster0.bioomrq.mongodb.net/");
    // Log database host after successful connection
    console.log(`mongo connected  host db: ${connectionDb.connection.host}`)
    
    // Start server listening on configured port
    server.listen(app.get("port"),()=>{
        console.log("listing on port 8000")
    });
}

// Invoke start function to initialize DB and server
start();
