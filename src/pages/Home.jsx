import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import {
  FaMusic,
  FaVideo,
  FaDownload,
  FaUser,
  FaRegBell,
} from "react-icons/fa";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch all videos on page load
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/videos`
        );
        const validVideos = data.filter((video) => video.channelId);
        setVideos(validVideos);
        setFilteredVideos(validVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Handle category button click and filter videos
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter((video) => video.category === category);
      setFilteredVideos(filtered);
    }
  };

  const categories = [
    "All",
    "Music",
    "Gaming",
    "Education",
    "Web Development",
    "JavaScript",
    "Sports",
    "Fun Video",
    "Food",
  ];

  return (
    <div className="flex">
      {/* Sidebar - Visible only on medium and larger screens */}
      <aside className="hidden md:block w-1/5 bg-gray-100 h-screen p-4">
        <ul className="space-y-4">
          <li className="flex items-center space-x-3 cursor-pointer hover:text-red-500">
            <FaMusic />
            <span>Music</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:text-red-500">
            <FaVideo />
            <span>Videos</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:text-red-500">
            <FaDownload />
            <span>Downloads</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:text-red-500">
            <FaRegBell />
            <span>Subscriptions</span>
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:text-red-500">
            <FaUser />
            <span>Profile</span>
          </li>
        </ul>
      </aside>

      {/* Main Video Section */}
      <div className="flex flex-col flex-grow">
        {/* Category Buttons */}
        <div className="p-4 flex space-x-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full border whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-red-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Display Filtered Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No videos available in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
