import React from "react";
import { Link } from "react-router-dom";

const SearchDropdown = ({ searchResults, closeDropdown }) => {
  return (
    <div className="absolute bg-white shadow-md rounded mt-2 w-full z-50">
      {searchResults.length > 0 ? (
        searchResults.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="block p-2 hover:bg-gray-100"
            onClick={closeDropdown} // Close dropdown on video click
          >
            <div>
              <p className="font-bold">{video.title}</p>
              <p className="text-sm text-gray-500">
                {video.channelId?.channelName || "Unknown Channel"}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p className="p-2 text-gray-500">No results found</p>
      )}
    </div>
  );
};

export default SearchDropdown;
