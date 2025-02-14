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
            fetchTransactions(); // Refresh the transaction history after transfer
        } else {
            alert(`Transfer Failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error during transfer:', error);
        alert('Transfer failed. Please check your input and try again.');
    }
});
