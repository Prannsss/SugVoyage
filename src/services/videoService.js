import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if needed

// Get all videos
export const getVideos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch videos');
  }
};

// Get video by ID
export const getVideoById = async (id) => {
  try {
    if (!id) {
      throw new Error('Video ID is required');
    }

    const response = await axios.get(`${API_BASE_URL}/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch video');
  }
};

// Create new video
export const createVideo = async (videoData) => {
  try {
    const { user, video, caption } = videoData;

    // Validate required fields
    if (!user || !video || !caption) {
      throw new Error('Missing required fields: user, video, caption');
    }

    const response = await axios.post(`${API_BASE_URL}/videos`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error(error.response?.data?.message || 'Failed to create video');
  }
};

// Get videos by user
export const getVideosByUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await axios.get(`${API_BASE_URL}/videos/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos by user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch videos by user');
  }
};