const express = require('express');
const http = http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Frontend static files (HTML, CSS, JS) ko serve karne ke liye
app.use(express.static(path.join(__dirname)));

// Temporary memory array (Bina database ke users save karne ke liye)
const users = [];

// Root route par ab index.html khulega
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup Route
app.post('/api/signup', (req, res) => {
    const { mobile, password, inviteCode } = req.body;
    
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        return res.status(400).json({ success: false, message: "MOBLIE NUMBER ERROR" });
    }

    const existingUser = users.find(u => u.mobile === mobile);
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Ye mobile number pehle se registered hai!" });
    }

    const newUser = { mobile, password, inviteCode, balance: 0 };
    users.push(newUser);

    console.log("New User Registered:", mobile);
    res.json({ success: true, message: "SkyNova Account Created Successfully!" });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { mobile, password } = req.body;
    
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        return res.status(400).json({ success: false, message: "MOBLIE NUMBER OUR PASSWORD MISSMATCH " });
    }

    const user = users.find(u => u.mobile === mobile && u.password === password);
    if (!user) {
        return res.status(400).json({ success: false, message: "Galat Mobile Number ya Password!" });
    }

    res.json({ success: true, message: "Login Successful!", balance: user.balance });
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`SkyNova Server is running on port ${PORT}`);
});