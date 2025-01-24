document.addEventListener("DOMContentLoaded", function () {
    let accounts = []; // Initialize an empty array for accounts

    //Step 1- Initial call Function to fetch accounts from the backend
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
                // Handle specific status codes
                if (response.status === 400) {
                    displayNoAccountsMessage("You are not approved yet.");
                } else {
                    throw new Error(`Failed to fetch accounts: ${response.status} ${response.statusText}`);
                }
                return; // Exit the function if there's an error
            }

            // Assign fetched data to the accounts array
            accounts = await response.json();
            console.log(accounts);

            // Call the function to display the accounts
            renderCarousel();
        } catch (error) {
            console.error("Error fetching accounts:", error);
            displayNoAccountsMessage("You are not approved yet. Try again Later!");
        }
    }

    const carousel = document.getElementById("carousel");
    const dotsContainer = document.getElementById("dots");
    let currentIndex = 0;

    //Step 2 - render carusel based on fetch 
    function renderCarousel() {
        // Clear existing cards and dots
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        if (accounts.length === 0) {
            displayNoAccountsMessage("You have no accounts.");
            return; // Exit if there are no accounts
        }

        accounts.forEach((account, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="User Image" class="card-img">
                <h3 class="card-title">${account.accountType}  Account</h3>
                <p class="card-info">Account Number: ${account.accountNumber}</p>
                <p class="card-info">Balance: ${account.balance}</p>
                <p class="card-info">Currency: ${account.currency}</p>

            `;
            carousel.appendChild(card);

            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.dataset.index = index;
            dot.addEventListener("click", () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

       // adjustCarouselWidth();
    }

    function displayNoAccountsMessage(message) {
        // Clear existing cards and dots
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        const messageCard = document.createElement("div");
        messageCard.classList.add("card");
        messageCard.innerHTML = `
            <h3 class="card-title">${message}</h3>
        `;
        carousel.appendChild(messageCard);
        adjustCarouselWidth(); // Adjust width for the message card
    }
    function adjustCarouselWidth() {
        const containerWidth = document.querySelector(".carousel-container").offsetWidth;
        const totalSlides = accounts.length === 0 ? 1 : accounts.length; // Adjust for message card

        document.querySelectorAll(".card").forEach(card => {
            card.style.width = `${containerWidth}px`; // Corrected syntax
        });

        carousel.style.width = `${containerWidth * totalSlides}px`; // Total carousel width
        updateCarousel();
    }

    //Update carousel based on dot click or touch event
    function updateCarousel() {
        const containerWidth = document.querySelector(".carousel-container").offsetWidth;
        console.log("this is offsetwidth of carusel container:", containerWidth
        )
        const offset = -currentIndex * containerWidth;
        carousel.style.transform = `translateX(${offset}px)`;

        document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
        document.querySelector(`.dot[data-index='${currentIndex}']`).classList.add("active");
    }

    let startX = 0;
    document.getElementById("carouselContainer").addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        console.log("this is startx:", startX)
    });

    document.getElementById("carouselContainer").addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        console.log("this is endX:", endX)
        if (startX - endX > 50) {
            currentIndex = Math.min(currentIndex + 1, accounts.length - 1);
        } else if (endX - startX > 50) {
            currentIndex = Math.max(currentIndex - 1, 0);
        }
        updateCarousel();
    });

    window.addEventListener("resize", adjustCarouselWidth);

    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("UserId");

    //Step 1.
    // Call the fetchAccounts function with appropriate parameters
    fetchAccounts(accessToken, userId); // Fetch accounts when the page loads
 // Handle selection and highlight selected items
 document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation(); // Keep dropdown open

        if (this.classList.contains("currency")) {
            selectedCurrency = this.textContent;
            document.querySelectorAll(".currency").forEach(el => el.classList.remove("selected"));
        } else if (this.classList.contains("type")) {
            selectedType = this.textContent;
            document.querySelectorAll(".type").forEach(el => el.classList.remove("selected"));
        }

        this.classList.add("selected"); // Highlight selected item

        // Show "Add" button when both selections are made
        document.getElementById("addButton").style.display = (selectedCurrency && selectedType) ? "block" : "none";
    });
});



// Close dropdown when clicking "Add"
document.getElementById("addButton").addEventListener("click", function() {
    // Alert the user about the selected values
   // alert(`You selected: ${selectedCurrency} - ${selectedType}`);

    // Close the dropdown
    let dropdown = bootstrap.Dropdown.getOrCreateInstance(document.getElementById("dropdownButton"));
    dropdown.hide();

    // Get the userId from local storage (or other source)
    //const userId = localStorage.getItem("UserId"); // Replace with the correct userId retrieval if needed
    const accountType = selectedType === "Standard" ? 0 : 1; // Example: Map selectedType to an accountType (0 or 1)

    // Create the POST request payload
    const payload = {
        userId: userId,
        currency: selectedCurrency,
        accountType: accountType // Assuming accountType is either 0 (Standard) or 1 (Other)
    };

    // Get the access token from local storage (if needed for authentication)
    const accessToken = localStorage.getItem("accessToken");

    // Send the POST request to the backend
    fetch("http://localhost:7097/accounts/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}` // Include the access token if required
        },
        body: JSON.stringify(payload) // Convert the payload to JSON
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.success) {
            alert("Account successfully added!");
        } else {
            alert("Failed to add account: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error adding account:", error);
        alert("An error occurred while adding the account.");
    });
});

    
});
