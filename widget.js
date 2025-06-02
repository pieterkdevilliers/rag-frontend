// Inside widget.js
async function askQuestion(question) {
    const apiUrl = 'https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/widget/query'; // Your actual API endpoint

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.apiKey, // Send the widget-specific API key
                // 'X-Account-ID': config.accountId // While you have it here, the API key should be enough for the backend to identify the account
            },
            body: JSON.stringify({
                query: question,
                accountId: config.accountId // Send accountId in the body for explicit routing on backend
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
            throw new Error(errorData.detail || `API Error: ${response.status}`);
        }

        const data = await response.json();
        displayBotResponse(data.answer); // Assuming your API returns { "answer": "..." }
    } catch (error) {
        console.error('Widget API Error:', error);
        displayBotResponse(`Error: ${error.message}`);
    } finally {
        // Hide loading indicator
    }
}

function displayUserQuestion(text) { /* ... logic to add to chat UI ... */ }
function displayBotResponse(text) { /* ... logic to add to chat UI ... */ }