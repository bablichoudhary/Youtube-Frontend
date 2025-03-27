import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./context/AuthContext.jsx"; // ✅ Default export
import VideoProvider from "./context/VideoContext.jsx"; // ✅ Default export
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <VideoProvider>
      <App />
    </VideoProvider>
  </AuthProvider>
);
