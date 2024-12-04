require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies

// Temporary in-memory storage for OTPs
const otpStore = {};

// Generate a random 4-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Endpoint: Send OTP
app.post('/send-otp', (req, res) => {
    const { username } = req.body; // Username is the email

    if (!username) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const otp = generateOTP();
    otpStore[username] = otp; // Store OTP in-memory for simplicity
    console.log(`Generated OTP for ${username}: ${otp}`); // For testing

    // Send OTP via email (to be implemented in the next step)
    sendOTPEmail(username, otp)
        .then(() => {
            res.status(200).json({ message: 'OTP sent successfully!' });
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            res.status(500).json({ message: 'Failed to send OTP.' });
        });
});

// Endpoint: Verify OTP
app.post('/verify-otp', (req, res) => {
    const { username, otp } = req.body;

    if (!username || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    if (otpStore[username] === otp) {
        delete otpStore[username]; // Remove OTP after successful verification
        res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
});




// Function to send OTP email
function sendOTPEmail(toEmail, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use any email provider (e.g., Outlook, Yahoo)
        auth: {
            user: process.env.EMAIL_USER, // loading from .env file
            pass: process.env.EMAIL_PASS, // loading from .env file
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: toEmail, // Recipient address
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otp}`, // Email body
    };

    return transporter.sendMail(mailOptions)
     .then((info) =>{
        console.log('Email sent:', info.response);
     })
     .catch((error) =>{
        console.error('Nodemailer Error:', error); // Log the error details
        throw error;
     })
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});