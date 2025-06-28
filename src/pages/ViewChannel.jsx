import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchChannelByUser } from "../api";
import axios from "axios";
import { toast } from "react-toastify";

const ViewChannel = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadChannel = async () => {
      try {
        setLoading(true);
        const { data } = await fetchChannelByUser(user._id, token);
        setChannel(data);
      } catch (error) {
        console.error("Error fetching channel:", error);
        toast.error("Failed to load channel. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadChannel();
  }, [user, navigate, token]);

  // Handle delete channel (and associated videos)
  const handleDeleteChannel = async () => {
    if (!token) {
      toast.error("You must be logged in to delete the channel.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/channels/${channel._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChannel(null);
      toast.success("Channel and related videos deleted successfully!");
      navigate("/"); // Redirect to home page after successful deletion
    } catch (error) {
      console.error("Error deleting channel:", error);
      if (error.response && error.response.status === 404) {
        toast.error("Channel not found or already deleted.");
      } else {
        toast.error("Failed to delete channel. Please try again.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading channel...</p>;
  if (!channel) return <p className="text-center mt-10">No channel found.</p>;

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
      {/* Channel Banner and Details */}
      <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
        <img
          src={channel.channelBanner || "/default-banner.jpg"}
          alt="Channel Banner"
          className="w-full md:w-64 lg:w-80 h-60 object-cover rounded-lg shadow-md"
        />
        <div className="mt-4 md:mt-0 text-center md:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold">
            {channel.channelName}
          </h2>
          <p className="text-gray-500 mt-2 text-sm lg:text-base">
            {channel.description || "No description provided."}
          </p>
          <p className="mt-2 text-gray-700 font-medium">
            {channel.subscribers?.length || 0} Subscribers
          </p>

          <button
            onClick={handleDeleteChannel}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-lg transition duration-300"
          >
            Delete Channel
          </button>
        </div>
      </div>

      {/* Video Section */}
      <h3 className="text-xl lg:text-2xl font-bold mt-8">Your Videos</h3>
      {channel.videos && channel.videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {channel.videos.map((video) => (
            <div
              key={video._id}
              className="border p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 cursor-pointer transition duration-300"
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-40 lg:h-48 object-cover rounded-md"
              />
              <h4 className="text-md font-semibold mt-2 truncate">
                {video.title}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No videos available.</p>
      )}
    </div>
  );
};

export default ViewChannel;
