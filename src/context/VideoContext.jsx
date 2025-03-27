import { createContext, useState, useEffect } from "react";
import { fetchVideos } from "../api";

export const VideoContext = createContext(null);

const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]); // State for storing all videos
  useEffect(() => {
    fetchVideos()
      .then(({ data }) => setVideos(data))
      .catch(console.error);
  }, []);

  return (
    <VideoContext.Provider
      value={{ videos, setVideos, allVideos, setAllVideos }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoProvider; // ✅ Ensure default export
