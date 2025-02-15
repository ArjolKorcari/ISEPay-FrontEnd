// Import base URL from config
import baseUrl from './config.js';

// 1️⃣ Fetch User Transactions
async function fetchTransactions() {
    const userId = localStorage.getItem('UserId');
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${baseUrl}/transactions/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const transactions = await response.json();
        const tableBody = document.querySelector("#transactionTable tbody");

        tableBody.innerHTML = "";
        transactions.forEach(tx => {
            const row = `<tr>
                <td>${tx.date}</td>
                <td>${tx.recipient}</td>
                <td>${tx.amount}</td>
                <td>${tx.type}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchTransactions);

/*
// 2️⃣ Handle Fund Transfer
document.getElementById('transferForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const amount = document.getElementById('amount').value;
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${baseUrl}/transactions/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fromAccount, toAccount, amount })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Transfer Successful!');
            fetchTransactions();
        } else {
            alert(`Transfer Failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error during transfer:', error);
    }
});


// 3️⃣ Currency Converter
document.getElementById('currencyForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amountToConvert = document.getElementById('amountToConvert').value;

    const apiKey = '5810309df5002d0ee65710bf';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rates[toCurrency];
            const convertedAmount = (amountToConvert * rate).toFixed(2);
            document.getElementById('conversionResult').innerHTML = 
                `${amountToConvert} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            alert('Failed to fetch exchange rates.');
        }
    } catch (error) {
        console.error('Currency conversion failed:', error);
    }
}
);
*/
// Remove hardcoded transaction data and fetch transactions from API
fetchTransactions();
