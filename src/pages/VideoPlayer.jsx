import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import {
  FaRegHeart,
  FaHeart,
  FaRegThumbsDown,
  FaThumbsDown,
} from "react-icons/fa";
import { fetchVideoById, fetchComments, addComment } from "../api";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { VideoContext } from "../context/VideoContext";
import axios from "axios";
import Comment from "../components/Comment";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const { videos: allVideos, setAllVideos } = useContext(VideoContext);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };

  useEffect(() => {
    const incrementView = async () => {
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/videos/${id}/views`
        );
      } catch (error) {
        console.error("Error incrementing video views:", error.message);
      }
    };
    incrementView();
  }, [id]);

  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);
      try {
        const { data } = await fetchVideoById(id);
        setVideo(data);
        setLikes(data.likes.length);
        setDislikes(data.dislikes.length);
        setLiked(data.isLiked);
        setDisliked(data.isDisliked);
        if (allVideos.length === 0) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/videos`
          );
          setAllVideos(res.data);
        }
      } catch (error) {
        console.error("Error fetching video or related videos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id, allVideos, setAllVideos]);

  useEffect(() => {
    const loadSubscribers = async () => {
      if (!video || !video.channelId) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/channels/${video.channelId._id}`
        );
        setSubscribers(data.subscribers.length);
        setSubscribed(data.isSubscribed);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };
    loadSubscribers();
  }, [video]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { data } = await fetchComments(id);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    loadComments();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      toast.error("You must be logged in to like videos.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/videos/${id}/like`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    if (!token) {
      toast.error("You must be logged in to dislike videos.");
      return;
    }
    try {
      setDisliked((prev) => !prev);
      setDislikes((prev) => (disliked ? prev - 1 : prev + 1));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/videos/${id}/dislike`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDislikes(response.data.dislikes);
      setDisliked(response.data.isDisliked);
    } catch (error) {
      console.error("Error disliking video:", error);
      toast.error("An error occurred. Please try again.");
      setDisliked((prev) => !prev);
      setDislikes((prev) => (disliked ? prev + 1 : prev - 1));
    }
  };

  const handleSubscribe = async () => {
    if (!token) {
      toast.error("You must be logged in to subscribe.");
      return;
    }
    if (!video || !video.channelId) {
      console.error("Channel ID is missing. Cannot subscribe.");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/channels/${
          video.channelId._id
        }/subscribe`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscribers((prev) => (subscribed ? prev - 1 : prev + 1));
      setSubscribed(!subscribed);
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const { data: savedComment } = await addComment(token, {
        videoId: id,
        text: newComment,
      });
      setComments([
        ...comments,
        { ...savedComment, userId: { _id: user._id, username: user.username } },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      toast.error("You must be logged in to delete comments.");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading videos...</p>;

  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 lg:pr-4">
          <h2 className="text-xl font-bold">{video.title}</h2>
          {embedUrl ? (
            <iframe
              width="100%"
              height="400"
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            ></iframe>
          ) : (
            <video
              src={video.videoUrl}
              controls
              className="w-full my-4"
            ></video>
          )}
          <div className="flex items-center space-x-4 my-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center space-x-2 ${
                disliked
                  ? "text-blue-500 hover:text-blue-700"
                  : "hover:text-gray-800"
              }`}
              aria-label={disliked ? "Remove Dislike" : "Dislike"}
            >
              {disliked ? <FaThumbsDown /> : <FaRegThumbsDown />}
              <span>{dislikes}</span>
            </button>

            <button
              onClick={handleSubscribe}
              className={`mt-2 ml-2 px-4 py-1 ${
                subscribed ? "bg-gray-900" : "bg-gray-500"
              } text-white rounded`}
              disabled={subscribed}
            >
              {subscribed ? "Subscribed" : "Subscribe"} {subscribers}
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">Comments</h3>
          <div className="bg-gray-100 p-4 rounded">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c?._id} className="flex items-center justify-between">
                  <Comment comment={c} />
                  {user && c?.userId?._id === user._id && (
                    <button
                      onClick={() => handleDeleteComment(c?._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded mt-2"
            >
              Comment
            </button>
          </form>
        </div>
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <h3 className="text-lg font-bold">More Videos</h3>
          <ul>
            {allVideos
              .filter((vid) => vid._id !== id && vid.channelId)
              .map((relatedVideo) => (
                <li key={relatedVideo._id} className="my-4">
                  <Link to={`/video/${relatedVideo._id}`}>
                    <img
                      src={relatedVideo.thumbnailUrl}
                      alt={relatedVideo.title}
                      className="w-full rounded"
                    />
                    <p className="font-bold">{relatedVideo.title}</p>
                    <p className="text-sm text-gray-500">
                      {relatedVideo.views} views
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
