# Feature Announcement System

This project is a real-time feature announcement system that includes both a frontend and backend. It allows users to view existing features and receive new feature announcements via WebSockets.

## Project Structure

The repository contains two main folders:

1. `feature-announcement-frontend` - The frontend React application.
2. `feature-announcement-backend` - The backend Node.js application with WebSocket support.

## Features

- **Real-time updates:** New features are announced live and displayed instantly on the frontend.
- **Feature listing:** All existing features are fetched and displayed when the page loads.

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Steps to Get Started

### 1. Clone the Repository

```bash
git clone https://github.com/manvirchanna/feature-announcement-app.git
cd feature-announcement-app
```

### 2. Install Dependencies
Install the dependencies for both the backend and frontend applications:

```bash
# Install backend dependencies
cd feature-announcement-backend
npm install

# Install frontend dependencies
cd feature-announcement-frontend
npm install
```

### 3. Run the Backend
Start the backend server by navigating to the feature-announcement-backend directory and running:

```bash
cd feature-announcement-backend
npm start
```

### 4. Run the Frontend
Start the frontend server by navigating to the feature-announcement-frontend directory and running:

```bash
cd ../feature-announcement-frontend
npm start
```

### 5. Requesting New Announcements

To test real-time announcements, you can either:

#### Option 1: Using WebSocket Connections

1. **WebSocket Setup**:
   The backend is set up to broadcast new feature announcements via WebSockets. When a new feature is pushed to the backend, it is immediately sent to all connected frontend clients. The frontend automatically listens to these WebSocket messages and displays the new announcement in real-time.

2. **Pushing a New Announcement**:
   - You can simulate pushing a new feature to the WebSocket from the backend by sending a message in the correct format through WebSocket clients like http://localhost:3001/add-feature from your backend code. You can send a JSON object representing a new feature. For example:

   ```json
   {
     "id": 4,
     "title": "Feature D",
     "description": "This is a newly announced feature."
   }


You can access the deployed frontend at https://feature-announcement-frontend.onrender.com and the backend at https://feature-announcement-backend.onrender.com

### Future Scope

#### User Management: We can introduce a user management system where users can onboard themselves and roles can be aligned to each user.

#### Admin Portal: An admin portal can be developed where admins can post announcements and select specific user groups for each announcement. For example, certain announcements might only be for admins, while others are for normal users.

#### UI Enhancements: Like social media platforms, we can add a bell icon at the top to enhance the notification experience. The bell icon can show the count of new notifications, and upon clicking, it can display recent notifications as well as some older ones.
