import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const VideoCard = ({ video }) => {
  const { token } = useContext(AuthContext);

  const [likes, setLikes] = useState(() => video.likes?.length || 0);
  const [liked, setLiked] = useState(false);

  const channelId = video?.channelId?._id;
  const channelName = video?.channelId?.channelName || "Unknown Channel";

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/videos/${video._id}/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLiked(data.isLiked || false);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [video._id, token]);

  const handleLike = async () => {
    if (!token) {
      alert("Please sign in to like videos.");
      return;
    }

    // Optimistically update UI
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/videos/${video._id}/like`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Use actual server response to confirm
      setLikes(data.likes.length);
      setLiked(data.isLiked);
    } catch (error) {
      console.error("Error liking video:", error);
      // Optionally revert
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="border-white p-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <Link to={`/video/${video._id}`}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full rounded-2xl max-h-[200px] sm:max-h-[220px] object-cover"
        />
        <h3 className="text-lg font-bold mt-2 truncate">{video.title}</h3>
      </Link>

      <p className="text-gray-600 truncate">{channelName}</p>
      <p className="text-gray-500 text-sm">{video.views} views</p>

      <button onClick={handleLike} className="flex items-center space-x-2">
        {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        <span>{likes}</span>
      </button>
    </div>
  );
};

export default VideoCard;
