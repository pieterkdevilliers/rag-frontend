// widget.js
(function() {
  // --- Configuration & Initial Checks ---
  console.log('widget.js executing');

  const config = window.myAIChatWidgetConfig;
  console.log('Widget Config received:', config);

  if (!config || !config.accountId || !config.apiKey) {
    console.error('AI Chat Widget: Configuration (accountId or apiKey) is missing or invalid from window.myAIChatWidgetConfig.');
    return;
  }

  const { accountId, apiKey } = config;
  // Use apiBaseUrl from config if provided, otherwise default
  const apiBaseUrl = config.apiBaseUrl || 'https://fastapi-rag-2705cfd4c41a.herokuapp.com';
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
        font-size: 28px;
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
        bottom: 90px;
        right: 20px;
        width: 350px;
        max-width: 90vw;
        height: 500px;
        max-height: 70vh;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 99999;
        transform: translateY(100%) scale(0.5);
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
        border-top-left-radius: 9px;
        border-top-right-radius: 9px;
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
      .ai-chat-message-sources {
        margin-top: 8px;
        font-size: 0.85em;
        color: #555;
      }
      .ai-chat-message-sources strong {
        display: block;
        margin-bottom: 4px;
      }
      .ai-chat-message-sources ul {
        list-style-type: disc;
        margin-left: 20px;
        padding-left: 0;
        margin-top: 2px;
        margin-bottom: 0;
      }
      .ai-chat-message-sources li {
        margin-bottom: 2px;
      }
      /* Optional: Styling for clickable source links if you implement them
      .ai-chat-message-sources a {
        color: ${config.themeColor || '#007bff'};
        text-decoration: underline;
      }
      .ai-chat-message-sources a:hover {
        text-decoration: none;
      }
      */
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

      .ai-chat-iframe-modal-overlay { /* <<<< ENSURE THESE STYLES ARE PRESENT */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000; /* Higher than chat window */
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0s linear 0.3s;
      }
      .ai-chat-iframe-modal-overlay.open {
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease, visibility 0s linear 0s;
      }
      .ai-chat-iframe-modal-content {
        background-color: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        width: 80vw;
        height: 85vh;
        display: flex;
        flex-direction: column;
      }
      .ai-chat-iframe-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      .ai-chat-iframe-modal-header h3 {
        margin: 0;
        font-size: 1.1em;
      }
      .ai-chat-iframe-modal-close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #777;
      }
      .ai-chat-iframe-modal-body {
        flex-grow: 1;
        overflow: hidden; 
      }
      .ai-chat-iframe-modal-body iframe {
        width: 100%;
        height: 100%;
        border: none;
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
      </svg>`;
    chatToggleButton.setAttribute('aria-label', 'Open Chat');
    chatToggleButton.onclick = toggleChatWindow;
    document.body.appendChild(chatToggleButton);
    console.log('Chat toggle button created.');
  }

  function createChatWindow() {
    chatWindow = document.createElement('div');
    chatWindow.className = 'ai-chat-widget-window';

    const header = document.createElement('div');
    header.className = 'ai-chat-header';
    const title = document.createElement('span');
    title.textContent = config.widgetTitle || 'Chat with Us';
    const closeButton = document.createElement('button');
    closeButton.className = 'ai-chat-close-button';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close Chat');
    closeButton.onclick = toggleChatWindow;
    header.appendChild(title);
    header.appendChild(closeButton);
    chatWindow.appendChild(header);

    messagesContainer = document.createElement('div');
    messagesContainer.className = 'ai-chat-messages-container';
    chatWindow.appendChild(messagesContainer);

    const inputArea = document.createElement('div');
    inputArea.className = 'ai-chat-input-area';
    messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = config.inputPlaceholder || 'Type your message...';
    messageInput.onkeypress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
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
        </svg>`;
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

  // --- Source Processing Function (Plain JavaScript) ---
  function processSourcesForDisplay(rawSourcesArray, accountUniqueIdForSourceLink) {
    if (!rawSourcesArray || !Array.isArray(rawSourcesArray)) {
      return [];
    }

    return rawSourcesArray.map(sourceString => {
      let fileIdentifier = sourceString.split('/').pop() || sourceString;
      const originalFileIdentifier = fileIdentifier; // Keep original for linking if needed

      const lastUnderscoreIndex = fileIdentifier.lastIndexOf('_');
      let displayNameWithoutId = fileIdentifier;

      if (lastUnderscoreIndex !== -1) {
        // More robust check for ID-like pattern before an extension
        const partAfterUnderscore = fileIdentifier.substring(lastUnderscoreIndex + 1);
        if (/[a-f0-9]+\.(pdf|txt|docx|md)$/i.test(partAfterUnderscore)) { // Hex ID + common extensions
            displayNameWithoutId = fileIdentifier.substring(0, lastUnderscoreIndex);
        }
      }
      displayNameWithoutId = displayNameWithoutId.replace(/\.(pdf|txt|docx|md)$/i, '');
      let displayName = displayNameWithoutId.replace(/_/g, ' ').replace(/-/g, ' ');

      // Construct an ABSOLUTE URL for viewing the source if you implement a backend proxy
      const viewUrl = `${apiBaseUrl}/api/v1/files/view/${accountUniqueIdForSourceLink}/${encodeURIComponent(originalFileIdentifier)}`;

      return {
        displayName: displayName.trim() || originalFileIdentifier, // Fallback to original identifier
        fileIdentifier: originalFileIdentifier, // The actual filename.pdf
        viewUrl: viewUrl // For future clickable links
      };
    });
  }

// --- Function to create and show the iframe modal ---
let currentIframeModal = null; // To keep track of the currently open modal

function showPdfInIframeModal(sourceName, sourceUrl) {
  if (currentIframeModal) {
    document.body.removeChild(currentIframeModal); // Remove previous modal if any
  }

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'ai-chat-iframe-modal-overlay';

  // Modal Content
  const modalContent = document.createElement('div');
  modalContent.className = 'ai-chat-iframe-modal-content';

  // Modal Header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'ai-chat-iframe-modal-header';
  const title = document.createElement('h3');
  title.textContent = sourceName;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ai-chat-iframe-modal-close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    document.body.removeChild(overlay);
    currentIframeModal = null;
  };
  modalHeader.appendChild(title);
  modalHeader.appendChild(closeBtn);

  // Modal Body (for iframe)
  const modalBody = document.createElement('div');
  modalBody.className = 'ai-chat-iframe-modal-body';
  const iframe = document.createElement('iframe');
  iframe.src = sourceUrl;
  iframe.title = `Document: ${sourceName}`;
  modalBody.appendChild(iframe);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
  currentIframeModal = overlay;

  // Trigger the transition
  requestAnimationFrame(() => { // Ensures the element is in DOM before adding class
      overlay.classList.add('open');
  });
}


// --- Modify displayMessage to make sources clickable ---
function displayMessage(responseText, processedSourcesArray, type) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('ai-chat-message', type);

  const textElement = document.createElement('p');
  textElement.textContent = responseText;
  messageElement.appendChild(textElement);

  if (type === 'bot' && processedSourcesArray && processedSourcesArray.length > 0) {
    const sourcesWrapper = document.createElement('div');
    sourcesWrapper.className = 'ai-chat-message-sources';

    const sourcesTitle = document.createElement('strong');
    sourcesTitle.textContent = 'Sources:';
    sourcesWrapper.appendChild(sourcesTitle);

    const sourcesList = document.createElement('ul');
    processedSourcesArray.forEach(source => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#'; // Prevent default link navigation
      link.textContent = source.displayName;
      link.style.color = config.themeColor || '#007bff';
      link.style.textDecoration = 'underline';
      link.style.cursor = 'pointer';
      link.onclick = (e) => {
        e.preventDefault();
        console.log('Opening source:', source.displayName, source.viewUrl);
        showPdfInIframeModal(source.displayName, source.viewUrl);
      };
      listItem.appendChild(link);
      sourcesList.appendChild(listItem);
    });
    sourcesWrapper.appendChild(sourcesList);
    messageElement.appendChild(sourcesWrapper);
  }

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return messageElement;
}

  // --- Send Message API Call ---
  async function handleSendMessage() {
    const question = messageInput.value.trim();
    if (!question) return;

    displayMessage(question, [], 'user');
    messageInput.value = '';
    messageInput.disabled = true;
    sendButton.disabled = true;

    const loadingElement = displayMessage('Thinking...', [], 'loading');

    try {
      console.log('Sending query to API:', question, 'for accountId:', accountId, 'with apiKey:', apiKey.substring(0, 8) + "...");
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
        const errorData = await response.json().catch(() => ({ detail: 'Server returned an unparsable error.' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);

      if (data && data.response && data.response.response_text) {
        const rawSources = data.response.sources || [];
        const displayableSources = processSourcesForDisplay(rawSources, accountId); // Pass accountId here
        displayMessage(data.response.response_text, displayableSources, 'bot');
      } else {
        console.error('API response structure unexpected. Expected data.response.response_text.', data);
        displayMessage('Sorry, I received an unexpected response from the server.', [], 'error');
      }
    } catch (error) {
        console.error('Widget API Call Error:', error);
        // Ensure loadingElement is removed if it still exists
        if (loadingElement && messagesContainer.contains(loadingElement)) {
            messagesContainer.removeChild(loadingElement);
        }
        displayMessage(`Error: ${error.message}`, [], 'error');
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

    if (config.initialBotMessage) {
      displayMessage(config.initialBotMessage, [], 'bot'); // No sources for initial message
    }
    console.log('Widget initialized.');
  }

  // --- Start the Widget ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }

})();