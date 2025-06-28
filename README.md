YouTube Clone Frontend
Project Overview
This is the frontend of a YouTube Clone built using React, Vite, Tailwind CSS, and Axios. The application replicates key YouTube features, including video upload, likes/dislikes, comments, channel creation, and user authentication. It is integrated with a Node.js/Express backend and MongoDB to manage users, videos, and channels.

Installation
cd frontend

npm install

Clone https://github.com/bablichoudhary/Youtube_frontend.git

npm run dev

Features
Authentication and Authorization:

Users can sign up and log in.

JWT-based authentication with protected routes.

User details, like the name, are shown in the Navbar after login.

Channel Management:

Users can create a channel with a name, description, and banner image.

View channel details like subscribers, uploaded videos, and profile info.

Only users with a channel can upload videos.

Video Features:

Users can upload videos by providing a title, description, video URL, category, and thumbnail.

Users can like, dislike, and comment on videos.

Each video displays the associated channel name, likes, dislikes, and view count.

User Interaction:

Static sidebar with navigation options like Home, Subscriptions, and Profile.

Responsive Navbar with dropdown options: View Channel, Upload Video, and Logout.

Sign Up page with both login and signup functionality in a single form.

Responsive Design:

Fully responsive layout using Tailwind CSS, optimized for mobile, tablet, and desktop screens.

Sidebar can be toggled using a hamburger menu.

Technology Stack
Frontend:
React – JavaScript library for building the user interface.

Vite – Fast and optimized build tool for React.

Tailwind CSS – Utility-first CSS framework for responsive design.

Axios – For making API requests to the backend.

React Router – For handling navigation between pages.

Toastify – To display success/error notifications.

Folder Structure

youtube-clone-frontend/
├── public/ # Public assets
├── src/
│ ├── api/ # API service functions (e.g., login, video uploads)
│ ├── components/ # Reusable components (Navbar, Sidebar, VideoCard, etc.)
│ ├── context/ # Context API setup for AuthContext and global state management
│ ├── pages/ # Main pages (Home, SignUp, CreateChannel, ViewChannel, VideoPlayer.)
│ ├── styles/ # Tailwind configuration
── App.jsx # Main App component
── main.jsx # Entry point for the React app
├── .env # Environment variables (e.g., API URL)
├── package.json # Project metadata and dependencies
└── vite.config.js # Vite configuration

Core Pages and Components Pages:

Home Page: Displays all videos fetched from the backend.

Sign Up Page: Includes both sign-up and login forms on a single page.

Create Channel Page: Allows users to create a channel by providing a name, description, and banner image.

View Channel Page: Displays channel info (profile, videos, subscribers).

Upload Video Page: Users can upload videos by providing required details.

Main Components:
Navbar: Contains the YouTube logo, search bar, user icon, upload button, and dropdown menu.

Sidebar: Provides navigation options like Home, Subscriptions, Music, and Profile.

Video Player: Reusable component for displaying individual video information (thumbnail, title, views, etc.).

Authentication Flow
Sign Up & Login:

Users can sign up with a username, email, and password.

Existing users can log in using their email and password.

After login, users are redirected to the home page, and the token is saved in localStorage.

Protected Routes:

Access to certain pages (like video upload and channel creation) is restricted to logged-in users.

Users without a channel cannot upload videos.

API Integration
The frontend is connected to a backend API built with Node.js, Express, and MongoDB. API requests are made using Axios with proper JWT authentication headers.
Example API routes:

POST /api/users/register – User registration

POST /api/users/login – User login

GET /api/videos – Fetch all videos

POST /api/videos/:id/like – Like a video

POST /api/videos/:id/dislike – Dislike a video

Youtube Clone Video Link
https://drive.google.com/drive/u/0/folders/1xWED52LyuwUhMpXwHT4E3tzKqBm2bp8R
