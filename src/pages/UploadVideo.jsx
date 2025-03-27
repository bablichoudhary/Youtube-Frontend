import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const UploadVideo = () => {
  const { user, token } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    category: "",
    videoUrl: "",
    thumbnailUrl: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      axios
        .get(`http://localhost:5000/api/channels/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setChannel(response.data))
        .catch(() => setChannel(null));
    }
  }, [user, token]);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!channel) {
      setErrorMessage("You need to create a channel before uploading a video.");
      return;
    }

    if (!videoData.title || !videoData.videoUrl) {
      setErrorMessage("Title and Video URL are required!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/videos`,
        { ...videoData, channelId: channel._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Video uploaded successfully!");
      setTimeout(() => navigate("/"), 2000); // Redirect to home page after 2 seconds
    } catch (error) {
      setErrorMessage("Failed to upload video. Please try again.");
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500">
        You must be logged in to upload a video.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700">
        Upload Video
      </h2>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={videoData.title}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="description"
          placeholder="Video Description"
          value={videoData.description}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <select
          name="category"
          onChange={handleChange}
          value={videoData.category}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Choose Your Category</option>
          <option value="Gaming">Gaming</option>
          <option value="Education">Education</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Fun Video">Fun Video</option>
          <option value="Food">Food</option>
          <option value="Web Development">Web Development</option>
          <option value="JavaScript">JavaScript</option>
        </select>

        <input
          type="text"
          name="videoUrl"
          placeholder="Video URL"
          value={videoData.videoUrl}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="thumbnailUrl"
          placeholder="Thumbnail Image URL"
          value={videoData.thumbnailUrl}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg text-sm transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm transition duration-200"
          >
            Upload Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;
