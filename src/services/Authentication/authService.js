import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = "http://localhost:3000/api"; // Adjust if needed

// Register a new user
export const registerUser = async (userData) => {
  try {
    const { email, password, username } = userData;

    // Validate required fields
    if (!email || !password || !username) {
      throw new Error("Missing required fields:  email, password, username");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Validate required fields
    if (!email || !password) {
      throw new Error("Missing required fields: email, password");
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};
