document.addEventListener("DOMContentLoaded", function () {
    let selectedRole = null;

    // Step 1: Role Selection
    document.getElementById("admin-btn").addEventListener("click", function () {
        selectedRole = "Admin";
        localStorage.setItem("role", selectedRole);
        proceedToStep(2);
    });

    document.getElementById("agent-btn").addEventListener("click", function () {
        selectedRole = "Agent";
        localStorage.setItem("role", selectedRole);
        proceedToStep(2);
    });

    function proceedToStep(stepNumber) {
        document.querySelectorAll(".step").forEach(step => step.classList.remove("active"));
        document.getElementById(`step${stepNumber}`).classList.add("active");
    }

    // Step 2: Send OTP
    document.getElementById("register-form-step2").addEventListener("submit", function (event) {
        event.preventDefault();
    
        const email = document.getElementById("reg-email").value;
        const phoneNumber = document.getElementById("phone-number").value;
    
        localStorage.setItem("email", email);
        localStorage.setItem("phoneNumber", phoneNumber);
    
        // Construct the URL with query parameters
        const url = `http://localhost:7097/otp/send?email=${encodeURIComponent(email)}&phoneNumber=${encodeURIComponent(phoneNumber)}`;
    
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (response.status === 200) proceedToStep(3);
            else document.getElementById("step2-error-message").style.display = "block";
        })
        .catch(() => document.getElementById("step2-error-message").style.display = "block");
    });

    // Step 3: OTP Verification
    document.getElementById("otp-form").addEventListener("submit", function (event) {
        event.preventDefault();
    
        const otpCode = document.getElementById("otp-code").value;
    
        // Construct the URL with query parameters
        const url = `http://localhost:7097/otp/validate?inputOtp=${encodeURIComponent(otpCode)}`;
    
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            if (response.status === 200) proceedToStep(4);
            else document.getElementById("otp-error-message").style.display = "block";
        })
        .catch(() => document.getElementById("otp-error-message").style.display = "block");
    });

    // Step 4: Registration Form
    document.getElementById("register-form-step4").addEventListener("submit", function (event) {
        event.preventDefault();
    
        const fullName = document.getElementById("fullname").value;
        const cardId = document.getElementById("cardId").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const gender = document.getElementById("gender").value;
    
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
    
        const role = localStorage.getItem("role");
        const accessToken = localStorage.getItem("adminAccessToken"); // Retrieve access token
    
        if (!accessToken) {
            alert("Access token not found. Please log in again.");
            return;
        }
    
        let apiUrl = "";
    
        // Select the API endpoint based on role
        if (role === "Admin") {
            apiUrl = "http://localhost:7097/users/register/admin";
        } else if (role === "Agent") {
            apiUrl = "http://localhost:7097/users/register/agent";
        } else {
            alert("Invalid role selected!");
            return;
        }
    
        const requestData = {
            fullName,
            cardId,
            email: localStorage.getItem("email"),
            phoneNumber: localStorage.getItem("phoneNumber"),
            password,
            gender,
            role
        };
    
        fetch(apiUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}` // Include the token in the Authorization header
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.status === 200) {
                alert("Account created successfully!");
                window.location.href = "LoginComponent.html";
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data && !data.success) alert("Error: " + data.message);
        })
        .catch(() => alert("Something went wrong. Please try again."));
    });
    
});
