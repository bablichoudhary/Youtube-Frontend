import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Authentication
export const registerUser = (userData) => API.post("/users/register", userData);
export const loginUser = (userData) => API.post("/users/login", userData);
export const getUserProfile = (token) =>
  API.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } });

// Videos
export const fetchVideos = () => API.get("/videos");
export const fetchVideoById = (id) => API.get(`/videos/${id}`);
export const uploadVideo = (token, videoData) =>
  API.post("/videos", videoData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// **New: Search Videos by title, category, and channel name**
export const searchVideos = (query) =>
  API.get(`/videos/search?query=${query}`).catch((error) => {
    console.error("Error fetching search results:", error);
    throw error; // Handle the 404 or server error gracefully
  });

// Comments
export const fetchComments = (videoId) => API.get(`/comments/${videoId}`);
export const addComment = (token, commentData) =>
  API.post("/comments", commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Channels
export const createChannel = (token, channelData) =>
  API.post("/channels", channelData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchChannelByUser = (userId, token) =>
  API.get(`/channels/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchChannelById = (channelId) =>
  API.get(`/channels/${channelId}`);

export const deleteChannel = (token, channelId) =>
  API.delete(`/channels/${channelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
// Like a Video
export const likeVideo = (token, videoId) =>
  API.post(
    `/videos/${videoId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

// Subscribe to a Channel
export const subscribeToChannel = (token, channelId) =>
  API.post(
    `/channels/${channelId}/subscribe`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
export const dislikeVideo = (token, videoId) =>
  API.post(
    `/videos/${videoId}/dislike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
