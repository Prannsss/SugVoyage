import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if needed

// Get all posts
export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

// Get post by ID
export const getPostById = async (id) => {
  try {
    if (!id) {
      throw new Error('Post ID is required');
    }

    const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const { user, image, caption } = postData;

    // Validate required fields
    if (!user || !image || !caption) {
      throw new Error('Missing required fields: user, image, caption');
    }

    const response = await axios.post(`${API_BASE_URL}/posts`, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(error.response?.data?.message || 'Failed to create post');
  }
};

// Get posts by user
export const getPostsByUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch posts by user');
  }
};