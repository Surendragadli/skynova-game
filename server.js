const express = require('express');
const http = require('http');
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
app.use(express.static(path.join(__dirname)));

const users = [];
let manualCrashOverride = null;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/deposit.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'deposit.html'));
});

app.get('/withdraw.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'withdraw.html'));
});

app.get('/refer.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'refer.html'));
});

app.get('/account.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'account.html'));
});

// Admin Crash Control APIs
app.post('/api/set-crash', (req, res) => {
    const { crashVal } = req.body;
    manualCrashOverride = parseFloat(crashVal);
    console.log("Admin set manual crash to:", manualCrashOverride);
    res.json({ success: true, message: `Crash set to ${manualCrashOverride}x` });
});

app.get('/api/get-crash', (req, res) => {
    res.json({ crash: manualCrashOverride });
});

app.post('/api/signup', (req, res) => {
    const { mobile, password, inviteCode } = req.body;
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        return res.status(400).json({ success: false, message: "MOBLIE NUMBER ERROR" });
    }
    const existingUser = users.find(u => u.mobile === mobile);
    if (existingUser) {
        return res.status(400).json({ success: false, message: "Ye mobile number pehle se registered hai!" });
    }
    users.push({ mobile, password, inviteCode, balance: 0 });
    res.json({ success: true, message: "SkyNova Account Created Successfully!" });
});

app.post('/api/login', (req, res) => {
    const { mobile, password } = req.body;
    const user = users.find(u => u.mobile === mobile && u.password === password);
    if (!user) {
        return res.status(400).json({ success: false, message: "Galat Mobile Number ya Password!" });
    }
    res.json({ success: true, message: "Login Successful!", balance: user.balance });
});

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