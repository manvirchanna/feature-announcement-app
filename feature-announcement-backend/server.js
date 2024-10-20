const express = require('express');
const http = require('http');  // Use http to create a server
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());  // Allow JSON body parsing for POST requests

// Sample features list
let features = [
    { id: 1, title: "New Dashboard", description: "A brand new look for our dashboard" },
    { id: 2, title: "Enhanced Security", description: "Two-factor authentication is now available" }
];

// Start the server on port 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
