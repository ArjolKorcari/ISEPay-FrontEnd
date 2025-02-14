document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById('errorMessage');

    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        try {
            const response = await fetch('http://localhost:7097/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
               // alert('Login successful!');
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('FullName', data.name);
                localStorage.setItem('UserId', data.userID);
              ///  alert('Login successful!');
                window.location.href = 'dashboard.html';
                errorMessage.style.display = 'none';
            } else {
                const errorData = await response.json();
                errorMessage.style.display = 'block';
                errorMessage.textContent = errorData.message || 'Login failed. Please check your credentials.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'An error occurred. Please try again later.';
        }
    });
});
