<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkyNova - Login & Signup</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0f172a;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #1e293b;
            padding: 30px;
            border-radius: 10px;
            width: 350px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        h2 {
            text-align: center;
            color: #38bdf8;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #475569;
            background-color: #0f172a;
            color: #fff;
            border-radius: 5px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #38bdf8;
            border: none;
            color: #0f172a;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background-color: #0ea5e9;
        }
        .toggle-btn {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
            color: #94a3b8;
            cursor: pointer;
        }
        .toggle-btn span {
            color: #38bdf8;
            text-decoration: underline;
        }
        #message {
            text-align: center;
            margin-top: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>

<div class="container">
    <h2 id="form-title">SkyNova - Signup</h2>
    <form id="authForm">
        <div class="form-group">
            <label>Mobile Number (10 Digits)</label>
            <input type="text" id="mobile" maxlength="10" pattern="[0-9]{10}" required placeholder="10 digit ka mobile number">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required placeholder="Apni marji ka password dalein">
        </div>
        <div class="form-group" id="inviteGroup">
            <label>Invite Code (Optional)</label>
            <input type="text" id="inviteCode" placeholder="Invite code agar ho">
        </div>
        <button type="submit" id="submitBtn">Sign Up</button>
    </form>
    
    <div class="toggle-btn" onclick="toggleForm()">
        <p id="toggleText">Pehle se account hai? <span>Login karein</span></p>
    </div>
    <div id="message"></div>
</div>

<script>
    let isLogin = false;

    function toggleForm() {
        isLogin = !isLogin;
        const title = document.getElementById('form-title');
        const submitBtn = document.getElementById('submitBtn');
        const inviteGroup = document.getElementById('inviteGroup');
        const toggleText = document.getElementById('toggleText');

        if (isLogin) {
            title.innerText = "SkyNova - Login";
            submitBtn.innerText = "Login";
            inviteGroup.style.display = "none";
            toggleText.innerHTML = "Account nahi hai? <span>Sign Up karein</span>";
        } else {
            title.innerText = "SkyNova - Signup";
            submitBtn.innerText = "Sign Up";
            inviteGroup.style.display = "block";
            toggleText.innerHTML = "Pehle se account hai? <span>Login karein</span>";
        }
    }

    document.getElementById('authForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const mobile = document.getElementById('mobile').value;
        const password = document.getElementById('password').value;
        const inviteCode = document.getElementById('inviteCode').value;
        const messageDiv = document.getElementById('message');

        // Check mobile number is exactly 10 digits
        if (mobile.length !== 10 || isNaN(mobile)) {
            messageDiv.style.color = "#f87171";
            messageDiv.innerText = "Kripya sahi 10 digit ka mobile number dalein!";
            return;
        }

        const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';
        const bodyData = isLogin ? { mobile, password } : { mobile, password, inviteCode };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();

            if (data.success) {
                messageDiv.style.color = "#4ade80";
                messageDiv.innerText = data.message;
                if (isLogin) {
                    setTimeout(() => {
                        alert("Login successful!");
                    }, 500);
                }
            } else {
                messageDiv.style.color = "#f87171";
                messageDiv.innerText = data.message || data.error;
            }
        } catch (err) {
            messageDiv.style.color = "#f87171";
            messageDiv.innerText = "Server ya Database se connect nahi ho pa raha hai!";
        }
    });
</script>

</body>
</html>