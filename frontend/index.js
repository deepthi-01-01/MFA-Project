
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Retrieving the values of the username and password fields from HTML page
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    //Making sure that the user has entered both and passoword. Their email is the username
    if (!username || !password) {
        alert('Please enter your credentials. One or more values are missing');
        return;
    }

    const allowedDomains = ['@gmail.com', '@rediffmail.com', '@marist.edu'];
    const isValidDomain = allowedDomains.some(domain => username.endsWith(domain));

    if (!isValidDomain) {
        alert('Invalid email domain. Please use @gmail.com or @rediffmail.com or @marist.edu.');
        return; // Stop further execution if validation fails
    }


    try {
        const response = await fetch('http://localhost:3000/send-otp', { // Point to backend server
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }), // Send the username in the request body
        });

        if (response.ok) {
            alert('OTP has been sent to your email.');
            sessionStorage.setItem('username', username);
            window.location.href = 'OTP.html'; // Redirect to OTP page
        } else {
            const error= await response.json();
            alert('Failed to send OTP : ${error.message}. Please try again.');
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('An error occurred while sending the OTP. Please try again.');
    }

    
});