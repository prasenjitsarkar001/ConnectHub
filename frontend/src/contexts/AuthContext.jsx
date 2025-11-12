// Import dependencies
import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import server from "../environment";

// Create global AuthContext object
export const AuthContext = createContext({});

// Axios client instance for user-related API calls
const client = axios.create({
   baseURL: "http://localhost:8000/api/v1/users"
    // baseURL: `${server}/api/v1/users` // All requests will be prefixed with this URL
})

export const AuthProvider = ({ children }) => {

    // Access the current AuthContext (if any)
    const authContext = useContext(AuthContext);

    // Store user-related state (can be updated later with login/register info)
    const [userData, setUserData] = useState(authContext);

    // React Router hook to navigate programmatically
    const router = useNavigate();

    /**
     * Handle user registration
     * Sends name, username, password to backend /register route
     * Returns backend's success message if registration successful
     */
    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })

            if (request.status === httpStatus.CREATED) {
                return request.data.message; // "User Registered"
            }
        } catch (err) {
            throw err; // Let calling component catch and show error
        }
    }

    /**
     * Handle user login
     * Sends username + password to backend /login route
     * If login successful, stores token in localStorage and redirects to /home
     */
    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token); // Store auth token locally
                router("/home") // Redirect user to home page
            }
        } catch (err) {
            throw err; // Pass error to UI
        }
    }

    /**
     * Get user's activity history
     * Calls backend /get_all_activity with token
     */
    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token") // Attach token from localStorage
                }
            });
            return request.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Add a meeting to user's activity history
     * Calls backend /add_to_activity with meeting code + token
     */
    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request;
        } catch (e) {
            throw e;
        }
    }

    // Data object passed down to all children via context
    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }

    // Provide AuthContext to child components
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
