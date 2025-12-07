import UserModel from "../../model/userModel.js";
import bcrypt from "bcryptjs";

const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        username,
        name: req.body.name || username, // Use name from request or default to username
        nickname: req.body.nickname || username, // Use nickname from request or default to username
      });

      await newUser.save();

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: newUser._id,
          nickname: newUser.nickname,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          nickname: user.nickname,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  },
};

export default userController;
