import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50`}
    >
      {/* Close Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-3 right-3 text-black text-2xl"
      >
        <FaTimes />
      </button>

      {/* Main Sidebar Links */}
      <ul className="mt-10 text-black space-y-4">
        <li>
          <Link
            to="/"
            className="flex items-center gap-3 hover:text-red-500 font-semibold"
            onClick={toggleSidebar}
          >
            🏠 Home
          </Link>
        </li>

        <li>📺 Subscriptions</li>

        <li>
          <Link
            to="/view-channel"
            className="flex items-center gap-3 hover:text-red-500 font-semibold"
            onClick={toggleSidebar}
          >
            👤 Your Channel
          </Link>
        </li>

        <li>
          <Link
            to="/"
            className="flex items-center gap-3 hover:text-red-500 font-semibold"
            onClick={toggleSidebar}
          >
            📹 Your Videos
          </Link>
        </li>

        <hr className="border-gray-300" />
      </ul>

      {/* Additional Section Below */}
      <ul className="mt-4 text-black space-y-4">
        <li className="hover:text-gray-700 cursor-pointer">🎞 Shorts</li>
        <li className="hover:text-gray-700 cursor-pointer">⏳ History</li>
        <li className="hover:text-gray-700 cursor-pointer">📜 Playlist</li>
        <li className="hover:text-gray-700 cursor-pointer">🎓 Your Courses</li>
        <li className="hover:text-gray-700 cursor-pointer">⏳ Watch Later</li>
        <li className="hover:text-gray-700 cursor-pointer">👍 Liked Videos</li>
        <li className="hover:text-gray-700 cursor-pointer">⬇ Downloads</li>
        <li className="hover:text-gray-700 cursor-pointer">✂ Your Clips</li>
      </ul>
    </div>
  );
};

export default Sidebar;
