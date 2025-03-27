import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createChannel } from "../api";

const CreateChannel = () => {
  const { user, token, setChannel } = useContext(AuthContext);
  const navigate = useNavigate();
  const [channel, setChannelLocal] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    console.log("CreateChannel Mounted!");
  }, []);

  const handleChange = (e) => {
    setChannelLocal({ ...channel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channel.channelName) {
      setError("Channel Name is required!");
      return;
    }

    try {
      const { data } = await createChannel(token, channel);
      setChannel(data);
      setSuccess("Channel created successfully!");
      setTimeout(() => navigate("/view-channel"), 2000);
    } catch (err) {
      setError("Error creating channel. Try again.");
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500">
        You must be logged in to create a channel.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create Your Channel
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow-lg space-y-4"
      >
        <div>
          <label
            htmlFor="channelName"
            className="block text-sm font-medium text-gray-700"
          >
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            name="channelName"
            placeholder="Enter your channel name"
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about your channel"
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="channelBanner"
            className="block text-sm font-medium text-gray-700"
          >
            Banner Image URL
          </label>
          <input
            type="text"
            id="channelBanner"
            name="channelBanner"
            placeholder="Paste the banner image URL here"
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-all duration-300"
        >
          Create Channel
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white p-2 rounded mt-2 transition-all duration-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
