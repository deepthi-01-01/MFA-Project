
document.addEventListener('DOMContentLoaded', () => {
    

    const otpInputs = document.querySelectorAll('.input-box'); // Select all OTP input boxes

    // Functionality to allow the movement to next boxes without user having to select the next one
    otpInputs.forEach((box, index) => {
        // Move to the next box on input
        box.addEventListener('input', () => {
            if (box.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Move to the previous box on backspace
        box.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && box.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
            else if (event.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus(); // Move to the previous box on ArrowLeft
            } else if (event.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus(); // Move to the next box on ArrowRight
            }
        });
    });

    // Handle OTP form submission
    document.getElementById('otp-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Combine all input values into a single OTP string
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        const username= sessionStorage.getItem('username');


        if (otp.length === otpInputs.length) {
            
            try {
                const response = await fetch('http://localhost:3000/verify-otp', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, otp }),
                });

                if (response.ok) {
                    alert('OTP verified successfully!');
                    window.location.href = 'success.html'; // Redirect to success page
                } else {
                    const error = await response.json();
                    alert(`OTP verification failed: ${error.message}`);
                    window.location.href = 'failure.html'; // Redirect to failure page
                }
            } catch (error) {
                console.error('Error verifying OTP:', error);
                alert('An error occurred while verifying the OTP. Please try again.');
            }
        } else {
            alert('Please fill all four boxes.');
        }
    });
});