const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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

// Temporary memory array (Bina database ke users save karne ke liye)
const users = [];

// Basic test route
app.get('/', (req, res) => {
    res.send("SkyNova Server is running successfully!");
});

// Signup Route
app.post('/api/signup', (req, res) => {
    const { mobile, password, inviteCode } = req.body;
    
    // Mobile number validation (Exact 10 digits & numbers only)
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        return res.status(400).json({ success: false, message: "MOBLIE NUMBER ERROR" });
    }

    // Check karein ki user pehle se registered hai ya nahi
    const existingUser = users.find(u => u.mobile === mobile);
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Ye mobile number pehle se registered hai!" });
    }

    // Naya user save karein
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

// Socket.io connection (Live data ke liye)
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`SkyNova Server is running on http://localhost:${PORT}`);
});