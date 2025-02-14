document.getElementById('currencyForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amountToConvert = document.getElementById('amountToConvert').value;
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${baseUrl}/transactions/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fromCurrency, toCurrency, amountToConvert })
        });

        const result = await response.json();
        if (response.ok) {
            const convertedAmount = result.convertedAmount;
            document.getElementById('conversionResult').innerHTML = 
                `${amountToConvert} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            alert(`Conversion Failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Currency conversion failed:', error);
        alert('Currency conversion failed. Please try again.');
    }
});
