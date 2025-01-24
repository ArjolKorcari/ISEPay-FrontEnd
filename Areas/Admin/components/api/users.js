// Assuming you have the access token stored in a variable, 
// for example, retrieved from a login response or stored in localStorage
const accessToken = localStorage.getItem("adminAccessToken");


// Function to fetch users data based on status from the backend API with Authorization Header
async function fetchUsersByStatus(status) {
  let url = '';

  // Set the correct URL based on the status
  if (status === 'ALL') {
    url = 'http://localhost:7097/users';  // All users
  } else {
    url = `http://localhost:7097/users/status?status=${status}`;  // Users by status
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    renderUserTable(data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Function to render user data in the table
function renderUserTable(users) {
  const tableBody = document.getElementById('user-table-body');
  tableBody.innerHTML = ''; // Clear existing data

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.userID}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phoneNumber}</td>
      <td>${user.cardId}</td>
      <td><img src="${user.picture}" alt="User Picture" class="user-image"></td>
      <td class="action-buttons">
        <button class="btn btn-accept" onclick="acceptUser('${user.userID}')">Accept</button>
        <button class="btn btn-reject" onclick="rejectUser('${user.userID}')">Reject</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Update the total numbers after rendering users
  updateTotalNumbers();
}

// Function to update the total numbers for each category
function updateTotalNumbers() {
  const pendingCount = document.querySelectorAll('.user-row.pending').length; // Placeholder for actual count
  const activeCount = document.querySelectorAll('.user-row.active').length; // Placeholder for actual count
  const deletedCount = document.querySelectorAll('.user-row.deleted').length; // Placeholder for actual count
  const allCount = document.querySelectorAll('.user-row').length;

  document.getElementById('pending-count').innerText = pendingCount;
  document.getElementById('active-count').innerText = activeCount;
  document.getElementById('deleted-count').innerText = deletedCount;
  document.getElementById('all-count').innerText = allCount;
}

// Function to filter users based on status
function filterUsers(status) {
  fetchUsersByStatus(status);
}

// Functions for Accept and Reject actions
function acceptUser(userID) {
  const url = `http://localhost:7097/users/approve/${userID}`;

  fetch(url, {
    method: "POST", // or "PUT" depending on your API
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to approve user");
    }
    return response.json();
  })
  .then(data => {
    alert(`User ${userID} accepted.`);
    console.log("Success:", data);
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Failed to approve user.");
  });
}


function rejectUser(userID) {
  const url = `http://localhost:7097/users/delete/${userID}`;

  fetch(url, {
    method: "DELETE", // or "PUT" depending on your API
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return response.json();
  })
  .then(data => {
    alert(`User ${userID} deleted.`);
    console.log("Success:", data);
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Failed to delete user.");
  });
}

// Initially load all users when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  filterUsers('ALL');  // Load all users by default
});
