document.addEventListener("DOMContentLoaded", function () {
    const accountContainer = document.getElementById("accountContainer");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const addAccountBtn = document.getElementById("addAccountBtn");
    const accountTemplate = document.getElementById("accountTemplate");

    let accounts = [];
    let currentIndex = 0;

    async function fetchAccounts(accessToken, userId) {
        try {
            const response = await fetch(`http://localhost:7097/accounts/myAccounts/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch accounts: ${response.status} ${response.statusText}`);
            }

            accounts = await response.json();
            displayAccount();
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    }

    function displayAccount() {
        accountContainer.innerHTML = ""; // Clear previous accounts

        if (accounts.length === 0) {
            accountContainer.innerHTML = "<p>No accounts available.</p>";
            return;
        }

        const account = accounts[currentIndex];
        const cardClone = accountTemplate.content.cloneNode(true);
        cardClone.querySelector(".account-number").textContent = `Account: ${account.accountNumber}`;
        cardClone.querySelector(".account-balance").textContent = `Balance: ${account.balance.toFixed(2)}`;
        cardClone.querySelector(".account-currency").textContent = `Currency: ${account.currency}`;
        
        accountContainer.appendChild(cardClone);
    }

    prevBtn.addEventListener("click", () => {
        if (accounts.length > 0) {
            currentIndex = (currentIndex - 1 + accounts.length) % accounts.length;
            displayAccount();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (accounts.length > 0) {
            currentIndex = (currentIndex + 1) % accounts.length;
            displayAccount();
        }
    });

    addAccountBtn.addEventListener("click", () => {
        alert("Feature to add an account coming soon!"); // Placeholder action
    });

    // Get access token and user ID from local storage
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("UserId");

    if (accessToken && userId) {
        fetchAccounts(accessToken, userId);
    } else {
        console.error("Access token or user ID missing from local storage.");
    }
});
