// Step 1 form submission logic
document.getElementById('register-form-step1').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from the input fields
    const email = document.getElementById('reg-email').value;
    const phoneNumber = document.getElementById('phone-number').value;

    // Construct the URL with query parameters
    const url = new URL('http://localhost:7097/otp/send');
    const params = { email: email, phoneNumber: phoneNumber };
    localStorage.setItem('email', params.email);
    localStorage.setItem('phoneNumber', params.phoneNumber);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    // Perform API call with query parameters
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 200) {
            // If status is 200, redirect to OTP Validation Step
            document.getElementById('register-step1').classList.remove('active');
            document.getElementById('otp-validation').classList.add('active');
        } else {
            console.log("Error");
            // If status is not 200, show error message
            document.getElementById('step1-error-message').classList.add('active');
        }
    })
    .catch(error => {
        // In case of network issues or other errors, show the error message
        document.getElementById('step1-error-message').classList.add('active');
    });
});

// OTP validation form submission logic
document.getElementById('otp-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get OTP input value
    const otpCode = document.getElementById('otp-code').value;

    // Construct the URL with query parameters
    const url = new URL('http://localhost:7097/otp/validate');
    url.searchParams.append('inputOtp', otpCode);  // Append OTP as query parameter

    // Perform API call with query parameter
    fetch(url, {
        method: 'POST',  // Use GET since we're sending OTP as a query parameter
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 200) {
            // If OTP is valid, go to Step 2
            document.getElementById('otp-validation').classList.remove('active');
            document.getElementById('register-step2').classList.add('active');
        } else {
            console.log("Invalid OTP");
            // If OTP is invalid, show error message
            document.getElementById('otp-error-message').classList.add('active');
        }
    })
    .catch(error => {
        // In case of network issues or other errors, show the error message
        console.log("Error:", error);
        document.getElementById('otp-error-message').classList.add('active');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register-form-step2").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting normally

        // Get values from input fields
        const fullName = document.getElementById("fullname").value;
        const cardId = document.getElementById("cardId").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const gender = document.getElementById("gender").value;

        // Retrieve email and phone number from localStorage (set in Step 1)
        const email = localStorage.getItem("email");
        const phoneNumber = localStorage.getItem("phoneNumber"); // Assuming sessionStorage was used

        // Validate password confirmation
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Construct request body
        const requestData = {
            fullName: fullName,
            cardId: cardId,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            gender: gender
        };

  // Send request to backend
        fetch("http://localhost:7097/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.status === 200) {
                // Redirect to login page if account creation is successful
                alert("Account created successfully!");
                window.location.href = "LoginComponent.html";
                return;
            }
            return response.json(); // Continue processing if not 201
        })
        .then(data => {
            if (data && !data.success) {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });

    });
});



