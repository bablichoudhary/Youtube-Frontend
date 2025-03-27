import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useState } from "react";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import SignUp from "./pages/SignUp";
import UploadVideo from "./pages/UploadVideo";
import CreateChannel from "./pages/CreateChannel";
import ViewChannel from "./pages/ViewChannel"; // ✅ Added View Channel Page
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext); // Get user state from AuthContext
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Local state for sidebar

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      {/* Navbar with Sidebar Toggle */}
      <Navbar toggleSidebar={toggleSidebar} />
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar (Controlled via local state) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/signup" element={<SignUp />} />{" "}
          {/* Merged Sign Up/Login */}
          {/* Protected Routes (Only for Authenticated Users) */}
          <Route
            path="/upload"
            element={user ? <UploadVideo /> : <Navigate to="/login" />}
          />
          <Route
            path="/create-channel"
            element={user ? <CreateChannel /> : <Navigate to="/login" />}
          />
          <Route
            path="/view-channel"
            element={user ? <ViewChannel /> : <Navigate to="/login" />}
          />
          {/* Redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
