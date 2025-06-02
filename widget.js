// Description: This script creates a chat widget that allows users to interact with an AI service.
// widget.js
(function() {
  // --- Configuration & Initial Checks ---
  console.log('widget.js executing'); // First log to ensure it runs

  const config = window.myAIChatWidgetConfig;
  console.log('Widget Config received:', config);

  if (!config || !config.accountId || !config.apiKey) {
    console.error('AI Chat Widget: Configuration (accountId or apiKey) is missing or invalid from window.myAIChatWidgetConfig.');
    return; // Stop execution if essential config is missing
  }

  const { accountId, apiKey } = config;
  const apiBaseUrl = config.apiBaseUrl || 'https://fastapi-rag-2705cfd4c41a.herokuapp.com'; // Default or from config
  const widgetApiEndpoint = `${apiBaseUrl}/api/v1/widget/query`;

  // --- DOM Elements (will be created) ---
  let chatToggleButton;
  let chatWindow;
  let messagesContainer;
  let messageInput;
  let sendButton;
  let isChatOpen = false;

  // --- Styles ---
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ai-chat-widget-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-color: ${config.themeColor || '#007bff'};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px; /* Chat bubble icon or text */
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 99998;
        border: none;
        transition: transform 0.2s ease-in-out;
      }
      .ai-chat-widget-toggle:hover {
        transform: scale(1.1);
      }
      .ai-chat-widget-window {
        position: fixed;
        bottom: 90px; /* Above toggle button */
        right: 20px;
        width: 350px;
        max-width: 90vw;
        height: 500px;
        max-height: 70vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        display: flex; /* Changed from none to flex, visibility controlled by class */
        flex-direction: column;
        overflow: hidden;
        z-index: 99999;
        transform: translateY(100%) scale(0.5); /* Initial state for animation */
        opacity: 0;
        visibility: hidden;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0s linear 0.3s;
      }
      .ai-chat-widget-window.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0s linear 0s;
      }
      .ai-chat-header {
        background-color: ${config.themeColor || '#007bff'};
        color: white;
        padding: 10px 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 9px; /* Match parent */
        border-top-right-radius: 9px; /* Match parent */
      }
      .ai-chat-close-button {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        line-height: 1;
      }
      .ai-chat-messages-container {
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ai-chat-message {
        padding: 8px 12px;
        border-radius: 18px;
        max-width: 80%;
        word-wrap: break-word;
        line-height: 1.4;
      }
      .ai-chat-message.user {
        background-color: ${config.themeColor || '#007bff'};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .ai-chat-message.bot, .ai-chat-message.error {
        background-color: #f0f0f0;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }
      .ai-chat-message.error {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ef9a9a;
      }
      .ai-chat-message.loading {
        font-style: italic;
        color: #777;
        align-self: flex-start;
        padding: 8px 12px;
      }
      .ai-chat-input-area {
        display: flex;
        padding: 10px;
        border-top: 1px solid #eee;
        background-color: #f9f9f9;
      }
      .ai-chat-input-area input[type="text"] {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        margin-right: 8px;
        font-size: 14px;
      }
      .ai-chat-input-area button {
        padding: 10px 15px;
        background-color: ${config.themeColor || '#007bff'};
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
    console.log('Widget styles injected.');
  }

  // --- UI Creation Functions ---
  function createChatToggleButton() {
    chatToggleButton = document.createElement('button');
    chatToggleButton.className = 'ai-chat-widget-toggle';
    chatToggleButton.innerHTML = config.widgetButtonIcon || `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28px" height="28px">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>`; // Default chat icon
    chatToggleButton.setAttribute('aria-label', 'Open Chat');
    chatToggleButton.onclick = toggleChatWindow;
    document.body.appendChild(chatToggleButton);
    console.log('Chat toggle button created.');
  }

  function createChatWindow() {
    chatWindow = document.createElement('div');
    chatWindow.className = 'ai-chat-widget-window'; // Initially hidden by CSS opacity/transform

    // Header
    const header = document.createElement('div');
    header.className = 'ai-chat-header';
    const title = document.createElement('span');
    title.textContent = config.widgetTitle || 'Chat with Us';
    const closeButton = document.createElement('button');
    closeButton.className = 'ai-chat-close-button';
    closeButton.innerHTML = '×'; // '×' character
    closeButton.setAttribute('aria-label', 'Close Chat');
    closeButton.onclick = toggleChatWindow;
    header.appendChild(title);
    header.appendChild(closeButton);
    chatWindow.appendChild(header);

    // Messages Area
    messagesContainer = document.createElement('div');
    messagesContainer.className = 'ai-chat-messages-container';
    chatWindow.appendChild(messagesContainer);

    // Input Area
    const inputArea = document.createElement('div');
    inputArea.className = 'ai-chat-input-area';
    messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = config.inputPlaceholder || 'Type your message...';
    messageInput.onkeypress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent newline on enter
        handleSendMessage();
      }
    };
    sendButton = document.createElement('button');
    sendButton.textContent = config.sendButtonText || 'Send';
    sendButton.onclick = handleSendMessage;
    inputArea.appendChild(messageInput);
    inputArea.appendChild(sendButton);
    chatWindow.appendChild(inputArea);

    document.body.appendChild(chatWindow);
    console.log('Chat window UI created.');
  }

  // --- Event Handlers & UI Logic ---
  function toggleChatWindow() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      chatWindow.classList.add('open');
      messageInput.focus();
      chatToggleButton.innerHTML = config.widgetCloseIcon || `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>`; // Default close icon
      chatToggleButton.setAttribute('aria-label', 'Close Chat');
    } else {
      chatWindow.classList.remove('open');
      chatToggleButton.innerHTML = config.widgetButtonIcon || `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28px" height="28px">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>`;
      chatToggleButton.setAttribute('aria-label', 'Open Chat');
    }
    console.log('Chat window toggled:', isChatOpen);
  }

  function displayMessage(text, type) { // type can be 'user', 'bot', 'error', 'loading'
    const messageElement = document.createElement('div');
    messageElement.classList.add('ai-chat-message', type);
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
    return messageElement;
  }

  async function handleSendMessage() {
    const question = messageInput.value.trim();
    if (!question) return;

    displayMessage(question, 'user');
    messageInput.value = ''; // Clear input
    messageInput.disabled = true;
    sendButton.disabled = true;

    const loadingElement = displayMessage('Thinking...', 'loading');

    try {
      console.log('Sending query to API:', question, 'for accountId:', accountId, 'with apiKey:', apiKey.substring(0, 5) + "...");
      const response = await fetch(widgetApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          query: question,
          accountId: accountId,
        }),
      });

      messagesContainer.removeChild(loadingElement);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Server returned an error, but no details were provided.' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      displayMessage(data.answer, 'bot');
    } catch (error) {
      console.error('Widget API Call Error:', error);
      if (messagesContainer.contains(loadingElement)) { // Ensure loading element is still there before removing
          messagesContainer.removeChild(loadingElement);
      }
      displayMessage(`Error: ${error.message}`, 'error');
    } finally {
      messageInput.disabled = false;
      sendButton.disabled = false;
      messageInput.focus();
    }
  }

  // --- Initialization Function ---
  function initializeWidget() {
    console.log('Initializing widget...');
    injectStyles();
    createChatToggleButton();
    createChatWindow();

    // Optional: Display an initial greeting from the bot
    if (config.initialBotMessage) {
        displayMessage(config.initialBotMessage, 'bot');
    }
    console.log('Widget initialized.');
  }

  // --- Start the Widget ---
  // Wait for the DOM to be fully loaded before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    // DOMContentLoaded has already fired
    initializeWidget();
  }

})(); // Immediately Invoked Function Expression (IIFE)



// End of widget.js



// Explanation of the Full widget.js:
// IIFE (Immediately Invoked Function Expression): (function() { ... })();
// This wraps the entire widget code in a private scope to avoid polluting the global namespace of the host website.
// Configuration Reading:
// It reads window.myAIChatWidgetConfig.
// It checks if accountId and apiKey are present and logs an error if not.
// injectStyles():
// Creates a <style> tag and injects all the CSS needed for the widget directly into the <head> of the host page. This makes the widget self-contained stylistically.
// Uses config.themeColor for basic theming.
// createChatToggleButton():
// Creates the floating button that users click to open the chat.
// Appends it to document.body so it's always on top (controlled by z-index).
// Attaches toggleChatWindow to its click event.
// createChatWindow():
// Creates the main chat panel div.
// Creates the header (with title and close button).
// Creates the messagesContainer where chat messages will appear.
// Creates the input area with a text field and send button.
// Attaches event listeners for sending messages.
// Appends it to document.body. It's initially hidden by CSS (opacity: 0, transform, visibility: hidden) and made visible by adding the open class.
// toggleChatWindow():
// Toggles the visibility of the chatWindow by adding/removing the .open class.
// Changes the icon/text on the toggle button.
// Focuses the input field when the chat opens.
// displayMessage(text, type):
// A helper function to create a message div (styled based on type: 'user', 'bot', 'error', 'loading') and append it to messagesContainer.
// Scrolls the message area to the bottom.
// handleSendMessage():
// This is your askQuestion logic, but integrated to:
// Get text from messageInput.
// Call displayMessage for the user's question.
// Clear the input.
// Show a loading indicator.
// Make the fetch call to your API.
// Call displayMessage for the bot's response or an error.
// Re-enable input.
// initializeWidget():
// This function is called once the DOM is ready.
// It calls injectStyles(), createChatToggleButton(), and createChatWindow() to build the entire UI.
// Optionally displays an initial bot message if configured in window.myAIChatWidgetConfig.initialBotMessage.
// DOM Ready Check:
// It ensures initializeWidget is only called after the HTML document is fully parsed, so all elements are available.