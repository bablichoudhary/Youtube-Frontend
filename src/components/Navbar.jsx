import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

import { AiFillYoutube } from "react-icons/ai";
import { FaVideo, FaUserCircle, FaBell, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import SearchDropdown from "./SearchDropdown";
import { searchVideos } from "../api";

const Navbar = ({ toggleSidebar }) => {
  const { user, channel, setChannel, logout, token } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch channel info if user is logged in and has a token

  useEffect(() => {
    if (!channel && user && token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/channels/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          if (data) {
            setChannel(data); // ✅ no navigate here
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            console.log("Channel not found (user has no channel yet).");
          } else {
            console.error("Failed to fetch channel.", err);
          }
        });
    }
  }, [channel, user, token, setChannel]);

  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      setShowDropdown(true);
      try {
        const { data } = await searchVideos(query);
        setSearchResults(data.length > 0 ? data : []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Sign In Required",
        text: "Sign in to upload a video.",
        confirmButtonText: "Sign In",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) navigate("/signup");
      });
    } else if (!channel) {
      Swal.fire({
        icon: "info",
        title: "Create a Channel",
        text: "You need a channel to upload videos.",
        confirmButtonText: "Create Channel",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) navigate("/create-channel");
      });
    } else {
      navigate("/upload");
    }
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="bg-white text-black p-4 flex items-center justify-between relative">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <button onClick={toggleSidebar} className="text-2xl">
          ☰
        </button>
        <Link to="/" className="flex items-center space-x-1">
          <AiFillYoutube className="text-red-500 text-3xl" />
          <span className="text-xl font-semibold hidden sm:block">YouTube</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative flex-grow max-w-lg mx-4">
        {/* Desktop View: always show search input */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full p-2 border rounded bg-white text-black"
          />
          {showDropdown && searchQuery && (
            <SearchDropdown
              searchResults={searchResults}
              closeDropdown={() => setShowDropdown(false)}
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-2xl ml-10"
            >
              <FaSearch />
            </button>
          )}

          {isSearchOpen && (
            <div className="relative w-full">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="flex-grow p-2 border rounded bg-white text-black"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xl text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {showDropdown && searchQuery && (
                <div className="absolute top-full left-0 w-full bg-white z-50 shadow-lg rounded mt-1">
                  <SearchDropdown
                    searchResults={searchResults}
                    closeDropdown={() => setShowDropdown(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Profile / Sign In */}
      <div
        className={`flex items-center space-x-5 ${
          isSearchOpen ? "hidden md:flex" : ""
        }`}
      >
        <FaVideo
          className="text-2xl cursor-pointer"
          onClick={handleUploadClick}
        />
        <FaBell className="text-2xl cursor-pointer" />

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center cursor-pointer"
            >
              {channel?.channelBanner ? (
                <img
                  src={channel.channelBanner}
                  alt="Channel"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded w-44 p-2 z-50">
                <p className="text-sm text-gray-500 px-4">{user.email}</p>
                {channel ? (
                  <>
                    <Link
                      to="/view-channel"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      View Channel
                    </Link>
                    <Link
                      to="/upload"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Upload Video
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/create-channel"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Create Channel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signup"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
