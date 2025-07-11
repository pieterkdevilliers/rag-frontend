// widget.js
(function () {
	// --- Configuration & Initial Checks ---
	console.log('widget.js executing');

	const config = window.myAIChatWidgetConfig;
	console.log('Widget Config received:', config);

	if (!config || !config.accountId || !config.apiKey) {
		console.error(
			'AI Chat Widget: Configuration (accountId or apiKey) is missing or invalid from window.myAIChatWidgetConfig.'
		);
		return;
	}

	const { accountId, apiKey } = config;
	const apiBaseUrl =
		config.apiBaseUrl || 'https://fastapi-rag-2705cfd4c41a.herokuapp.com';
	const widgetApiEndpoint = `${apiBaseUrl}/api/v1/widget/query`;
	const contactApiEndpoint =
		config.contactApiEndpoint || `${apiBaseUrl}/api/v1/widget/contact-us`;
	const chatMessageApiEndpoint = `${apiBaseUrl}/api/v1/widget/messages`;
	let sessionId = '';
	let visitorUuid = '';

	console.log('sessionId initialized:', sessionId);
	console.log('visitorUuid initialized:', visitorUuid);
	sessionId = new Date().getTime();
	visitorUuid = config.visitorUuid || `visitor-${sessionId}`;

	// --- DOM Elements ---
	let chatToggleButton;
	let chatWindow;
	let chatHeaderTitle;
	let messagesContainer;
	let messageInput;
	let sendButton;
	let isChatOpen = false;

	// Email Form DOM Elements
	let chatFooter;
	let showEmailFormButton;
	let emailFormContainer;
	let emailFormNameInput;
	let emailFormEmailInput;
	let emailFormMessageInput;
	let emailFormSendButton;
	let emailFormCancelButton;
	let emailFormStatusMessage;

	let isEmailFormVisible = false;
	let widgetStyleElement = null;

	// --- Styles ---
	function injectStyles() {
		const style = document.createElement('style');
		widgetStyleElement = document.createElement('style');
		widgetStyleElement.id = 'yourdocsai-widget-styles';
		widgetStyleElement.textContent = `
      /* --- Base style for the Chat Toggle Button --- */
      button.ai-chat-widget-toggle {
        /* Positioning */
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        
        /* Flexbox for centering content */
        display: flex;
        align-items: center;
        justify-content: center; /* Center the icon in the circle */

        /* Initial State: A Circle */
        width: 40px;
        height: 40px;
        border-radius: 50%; /* This makes it a circle */
        padding: 0; /* Remove padding for the initial circle state */
        
        /* Appearance */
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        overflow: hidden; /* Crucial: Hides the text that's outside the button's initial width */
        /* --- ANIMATION --- */
        /* Smoothly transition the properties that will change */
        transition: width 0.4s ease-in-out, 
                    border-radius 0.4s ease-in-out,
                    padding 0.4s ease-in-out;
      }

      /* --- Style for the Text Span inside the button --- */
      .ai-chat-widget-toggle span {
        /* Initial State: Hidden */
        max-width: 0;
        opacity: 0;
        
        /* Keep text on one line during animation */
        white-space: nowrap; 

        /* Text appearance */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        margin-left: 0; /* No margin when hidden */

        /* --- ANIMATION --- */
        /* Animate the span's properties. Delay opacity so it fades in after expanding. */
        transition: max-width 0.4s ease-in-out, 
                    opacity 0.2s 0.2s ease-in-out, /* opacity starts after 0.2s delay */
                    margin-left 0.4s ease-in-out;
      }

      /* 
      =========================================================
        EXPANDED STATE: When the .expanded class is added 
      =========================================================
      */
      .ai-chat-widget-toggle.expanded {
        /* Final State: A Pill/Rectangle */
        width: auto; /* Let the content determine the width */
        border-radius: 50px; /* A "pill" shape */
        padding: 12px 20px; /* Add padding back in */
      }

      /* The text span becomes visible inside the expanded button */
      .ai-chat-widget-toggle.expanded span {
        max-width: 150px; /* Set a max-width for the text to expand into */
        opacity: 1;
        margin-left: 8px; /* Create a gap between the icon and text */
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
      
      /* =======================================================
         START: MODIFICATION FOR DESKTOP HEIGHT
         ======================================================= */
      @media (min-width: 768px) {
        .ai-chat-widget-window {
          height: 825px;     /* Taller height for desktop */
          max-height: 90vh;  /* Taller max-height for desktop */
        }
      }
      /* =======================================================
         END: MODIFICATION FOR DESKTOP HEIGHT
         ======================================================= */

      .ai-chat-widget-window.open {
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0s linear 0s;
      }
      .ai-chat-header {
        background-color: ${config.themeColor || '#db2777'};
        color: white;
        padding: 10px 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 9px;
        border-top-right-radius: 9px;
      }
      button.ai-chat-close-button {
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
        background-color: ${config.themeColor || '#db2777'};
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
		/* Add this rule to give paragraphs some breathing room */
	  .ai-chat-message.bot p {
		margin: 0 0 0.75em 0; /* Add some margin to the bottom of each paragraph */
		}
	  .ai-chat-message.bot p:last-child {
		margin-bottom: 0; /* Remove margin from the very last paragraph */
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
        font-size: 16px;
      }
      .ai-chat-input-area button {
        padding: 0 12px;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
      }

      .ai-chat-iframe-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
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

      /* --- STYLES for Email Form --- */
      .ai-chat-footer {
        flex-direction: column;
        text-align: center;
        border-top: 1px solid #eee;
        background-color: #f9f9f9;
        display: flex;
        justify-content: center;
        gap: 8px;
        padding-inline: 8px;
      }
      .ai-chat-show-email-form-button {
        padding: 8px 15px;
        background-color: transparent;
        border: 1px solid ${config.themeColor || '#db2777'};
        border-radius: 20px;
		color: white;
        cursor: pointer;
        font-size: 13px;
        font-weight: normal;
        transition: background-color 0.2s, color 0.2s;
        align-self: center;
        margin-top: 15px;
      }
      .ai-chat-footer .ai-chat-footer-branding {
        align-self: flex-start; 
        font-size: 0.75rem; 
        color: #888;
        text-decoration: none;
        cursor: pointer;
        padding: 4px;
      }
      .ai-chat-footer .ai-chat-footer-branding:hover {
        text-decoration: underline;
      }

      .ai-chat-email-form-container {
        flex-grow: 1;
        padding: 15px;
        overflow-y: auto;
        display: none; /* Initially hidden */
        flex-direction: column;
        gap: 12px;
      }
      .ai-chat-email-form-container label {
        font-size: 14px;
        color: #333;
        margin-bottom: -8px;
      }
      .ai-chat-email-form-container input[type="text"],
      .ai-chat-email-form-container input[type="email"],
      .ai-chat-email-form-container textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        box-sizing: border-box;
      }
      .ai-chat-email-form-container textarea {
        min-height: 80px;
        resize: vertical;
      }
      .ai-chat-email-form-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
      .ai-chat-email-form-actions button {
        flex-grow: 1;
        padding: 10px 15px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
      }
      .ai-chat-email-form-actions .send {
        color: white;
      }
      .ai-chat-email-form-actions .cancel {
        background-color: #f0f0f0;
        color: #333;
        border: 1px solid #ddd;
      }
      .ai-chat-email-form-status {
        font-size: 13px;
        padding: 8px;
        border-radius: 4px;
        margin-top: 5px;
        text-align: center;
      }
      .ai-chat-email-form-status.success {
        background-color: #e6ffed;
        color: #008726;
        border: 1px solid #b3ffc6;
      }
      .ai-chat-email-form-status.error {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ef9a9a;
      }
		/* --- DEFAULT, HOVER and FOCUS states --- */
		button.ai-chat-widget-toggle:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
		}
		button.ai-chat-widget-toggle:focus-visible {
			outline: 2px solid ${config.themeColor || '#db2777'};
			outline-offset: 2px;
		}
		button.ai-chat-widget-toggle,
		button.ai-chat-widget-toggle:hover,
		.ai-chat-input-area button,
		.ai-chat-input-area button:hover,
		button.ai-chat-show-email-form-button,
		button.ai-chat-show-email-form-button:hover,
		.ai-chat-email-form-actions button.send,
		.ai-chat-email-form-actions button.send:hover,
		.ai-chat-email-form-actions button.cancel:hover {
			background-color:${config.themeColor || '#db2777'};
		}
		.ai-chat-show-email-form-button:hover,
		.ai-chat-show-email-form-button:hover {
			color: white;
		}
		.ai-chat-footer .ai-chat-footer-branding:hover {
			color: ${config.themeColor || '#db2777'};
		}
		button.ai-chat-close-button,
		button.ai-chat-close-button:hover {
			background-color: transparent;
		}
		button:hover {
			opacity: 0.8;
		}
    `;
		document.head.appendChild(widgetStyleElement);
		console.log(config.buttonText || 'Widget styles injected.');
	}

	// --- [ Rest of your JavaScript code remains unchanged ] ---
	// --- UI Creation Functions ---
	function createChatToggleButton() {
		chatToggleButton = document.createElement('button');
		chatToggleButton.className = 'ai-chat-widget-toggle';

		// The innerHTML remains the same, containing both icon and text
		chatToggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>
      <span>${config.buttonText || 'How can we help?'}</span>
    `;

		chatToggleButton.setAttribute('aria-label', 'Open Chat');
		chatToggleButton.onclick = toggleChatWindow;
		document.body.appendChild(chatToggleButton);
		console.log('Chat toggle button created.');

		// --- MODIFICATION START ---
		// After 10 seconds (10000 milliseconds), add the 'expanded' class to the button.
		setTimeout(() => {
			if (chatToggleButton && !isChatOpen) {
				// Check if the button still exists
				chatToggleButton.classList.add('expanded');
				console.log('Chat toggle button expanded.');
			}
		}, 10000);
		// --- MODIFICATION END ---
	}

	function createChatWindow() {
		chatWindow = document.createElement('div');
		chatWindow.className = 'ai-chat-widget-window';

		const header = document.createElement('div');
		header.className = 'ai-chat-header';
		chatHeaderTitle = document.createElement('span');
		chatHeaderTitle.textContent = config.widgetTitle || 'How can we help?';
		const closeButton = document.createElement('button');
		closeButton.className = 'ai-chat-close-button';
		closeButton.innerHTML = '×';
		closeButton.setAttribute('aria-label', 'Close Chat');
		closeButton.onclick = toggleChatWindow;
		header.appendChild(chatHeaderTitle);
		header.appendChild(closeButton);
		chatWindow.appendChild(header);

		messagesContainer = document.createElement('div');
		messagesContainer.className = 'ai-chat-messages-container';
		chatWindow.appendChild(messagesContainer);

		const inputArea = document.createElement('div');
		inputArea.className = 'ai-chat-input-area';
		messageInput = document.createElement('input');
		messageInput.type = 'text';
		messageInput.placeholder =
			config.inputPlaceholder || 'Type your message...';
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

		const poweredByLink = document.createElement('a');
		poweredByLink.href = 'https://yourdocsai.app';
		poweredByLink.target = '_blank';
		poweredByLink.rel = 'noopener noreferrer';
		poweredByLink.className = 'ai-chat-footer-branding';
		poweredByLink.textContent = 'Powered By YourDocsAI';
		chatFooter = document.createElement('div');
		chatFooter.className = 'ai-chat-footer';
		showEmailFormButton = document.createElement('button');
		showEmailFormButton.className = 'ai-chat-show-email-form-button';
		showEmailFormButton.textContent =
			config.openEmailFormButtonText || 'Send Us An Email';
		showEmailFormButton.onclick = switchToEmailFormView;
		chatFooter.appendChild(showEmailFormButton);
		chatFooter.appendChild(poweredByLink);
		chatWindow.appendChild(chatFooter);

		createEmailForm();
		chatWindow.appendChild(emailFormContainer);

		document.body.appendChild(chatWindow);
		console.log('Chat window UI created.');
	}

	function createEmailForm() {
		emailFormContainer = document.createElement('div');
		emailFormContainer.className = 'ai-chat-email-form-container';

		const nameLabel = document.createElement('label');
		nameLabel.setAttribute('for', 'ai-chat-email-name');
		nameLabel.textContent = config.emailFormNameLabel || 'Your Name:';
		emailFormNameInput = document.createElement('input');
		emailFormNameInput.type = 'text';
		emailFormNameInput.id = 'ai-chat-email-name';
		emailFormNameInput.placeholder =
			config.emailFormNamePlaceholder || 'e.g., Jane Doe';

		const emailLabel = document.createElement('label');
		emailLabel.setAttribute('for', 'ai-chat-user-email');
		emailLabel.textContent = config.emailFormEmailLabel || 'Your Email:';
		emailFormEmailInput = document.createElement('input');
		emailFormEmailInput.type = 'email';
		emailFormEmailInput.id = 'ai-chat-user-email';
		emailFormEmailInput.placeholder =
			config.emailFormEmailPlaceholder || 'e.g., jane.doe@example.com';

		const messageLabel = document.createElement('label');
		messageLabel.setAttribute('for', 'ai-chat-email-message');
		messageLabel.textContent =
			config.emailFormMessageLabel || 'Your Message:';
		emailFormMessageInput = document.createElement('textarea');
		emailFormMessageInput.id = 'ai-chat-email-message';
		emailFormMessageInput.placeholder =
			config.emailFormMessagePlaceholder || 'How can we help you?';

		emailFormStatusMessage = document.createElement('div');
		emailFormStatusMessage.className = 'ai-chat-email-form-status';
		emailFormStatusMessage.style.display = 'none';

		const actionsDiv = document.createElement('div');
		actionsDiv.className = 'ai-chat-email-form-actions';

		emailFormSendButton = document.createElement('button');
		emailFormSendButton.className = 'send';
		emailFormSendButton.textContent =
			config.emailFormSendButtonText || 'Send Email';
		emailFormSendButton.onclick = handleSendEmail;

		emailFormCancelButton = document.createElement('button');
		emailFormCancelButton.className = 'cancel';
		emailFormCancelButton.textContent =
			config.emailFormCancelButtonText || 'Cancel';
		emailFormCancelButton.onclick = switchToChatView;

		actionsDiv.appendChild(emailFormCancelButton);
		actionsDiv.appendChild(emailFormSendButton);

		emailFormContainer.appendChild(nameLabel);
		emailFormContainer.appendChild(emailFormNameInput);
		emailFormContainer.appendChild(emailLabel);
		emailFormContainer.appendChild(emailFormEmailInput);
		emailFormContainer.appendChild(messageLabel);
		emailFormContainer.appendChild(emailFormMessageInput);
		emailFormContainer.appendChild(emailFormStatusMessage);
		emailFormContainer.appendChild(actionsDiv);
	}

	// --- Event Handlers & UI Logic ---
	function toggleChatWindow() {
		isChatOpen = !isChatOpen;
		if (isChatOpen) {
			chatWindow.classList.add('open');
			if (isEmailFormVisible) {
				emailFormNameInput.focus();
			} else {
				messageInput.focus();
			}
			// This is the original "close" icon logic
			chatToggleButton.innerHTML =
				config.widgetCloseIcon ||
				`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>`;
			chatToggleButton.setAttribute('aria-label', 'Close Chat');
		} else {
			chatWindow.classList.remove('open');
			// This is the original "open" icon logic (when chat is closed)
			chatToggleButton.innerHTML =
				config.widgetButtonIcon ||
				`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
      </svg>`;
			chatToggleButton.setAttribute('aria-label', 'Open Chat');
			if (isEmailFormVisible) {
				switchToChatView(false);
			}
		}
		console.log('Chat window toggled:', isChatOpen);
	}

	function switchToEmailFormView() {
		isEmailFormVisible = true;
		messagesContainer.style.display = 'none';
		chatWindow.querySelector('.ai-chat-input-area').style.display = 'none';
		chatFooter.style.display = 'none';
		emailFormContainer.style.display = 'flex';

		chatHeaderTitle.textContent = config.emailFormTitle || 'Contact Us';
		emailFormNameInput.focus();
		clearEmailFormStatus();
		console.log('Switched to email form view.');
	}

	function switchToChatView(focusChatInput = true) {
		isEmailFormVisible = false;
		emailFormContainer.style.display = 'none';
		messagesContainer.style.display = 'flex';
		chatWindow.querySelector('.ai-chat-input-area').style.display = 'flex';
		chatFooter.style.display = 'flex';

		chatHeaderTitle.textContent =
			config.widgetTitle || 'Any questions we can help with?';
		clearEmailForm();
		clearEmailFormStatus();
		if (focusChatInput && isChatOpen) {
			messageInput.focus();
		}
		console.log('Switched to chat view.');
	}

	function clearEmailForm() {
		emailFormNameInput.value = '';
		emailFormEmailInput.value = '';
		emailFormMessageInput.value = '';
	}

	function displayEmailFormStatus(message, isSuccess = true) {
		emailFormStatusMessage.textContent = message;
		emailFormStatusMessage.className =
			'ai-chat-email-form-status ' + (isSuccess ? 'success' : 'error');
		emailFormStatusMessage.style.display = 'block';
	}

	function clearEmailFormStatus() {
		emailFormStatusMessage.style.display = 'none';
		emailFormStatusMessage.textContent = '';
	}

	function processSourcesForDisplay(
		rawSourcesArray,
		accountUniqueIdForSourceLink
	) {
		if (!rawSourcesArray || !Array.isArray(rawSourcesArray)) {
			return [];
		}
		return rawSourcesArray.map((sourceString) => {
			let fileIdentifier = sourceString.split('/').pop() || sourceString;
			const originalFileIdentifier = fileIdentifier;
			const lastUnderscoreIndex = fileIdentifier.lastIndexOf('_');
			let displayNameWithoutId = fileIdentifier;
			if (lastUnderscoreIndex !== -1) {
				const partAfterUnderscore = fileIdentifier.substring(
					lastUnderscoreIndex + 1
				);
				if (
					/[a-f0-9]+\.(pdf|txt|docx|md)$/i.test(partAfterUnderscore)
				) {
					displayNameWithoutId = fileIdentifier.substring(
						0,
						lastUnderscoreIndex
					);
				}
			}
			displayNameWithoutId = displayNameWithoutId.replace(
				/\.(pdf|txt|docx|md)$/i,
				''
			);

			let cleanedName = displayNameWithoutId
				.replace(/_/g, ' ')
				.replace(/-/g, ' ');

			let displayName = cleanedName
				.trim()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			const viewUrl = `${apiBaseUrl}/api/v1/files/view/${accountUniqueIdForSourceLink}/${encodeURIComponent(
				originalFileIdentifier
			)}`;
			return {
				displayName: displayName.trim() || originalFileIdentifier,
				fileIdentifier: originalFileIdentifier,
				viewUrl: viewUrl,
			};
		});
	}

	let currentIframeModal = null;
	function showPdfInIframeModal(sourceName, sourceUrl) {
		if (currentIframeModal) {
			document.body.removeChild(currentIframeModal);
		}
		const overlay = document.createElement('div');
		overlay.className = 'ai-chat-iframe-modal-overlay';
		const modalContent = document.createElement('div');
		modalContent.className = 'ai-chat-iframe-modal-content';
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
		requestAnimationFrame(() => {
			overlay.classList.add('open');
		});
	}

	function displayMessage(responseText, processedSourcesArray, type) {
		const messageElement = document.createElement('div');
		messageElement.classList.add('ai-chat-message', type);

		// Check if the message is from the bot before trying to split it
		if (type === 'bot' && responseText) {
			// This regex splits the text after a period, question mark, or exclamation mark
			// that is followed by a space. It keeps the punctuation.
			// This is a heuristic to create paragraphs from a single block of text.
			const sentences = responseText.split(/(?<=[.?!])\s+/);

			sentences.forEach((sentence) => {
				// Ensure we don't create empty <p> tags
				if (sentence.trim()) {
					const p = document.createElement('p');
					p.textContent = sentence;
					messageElement.appendChild(p);
				}
			});
		} else {
			// For user messages, errors, or loading text, use a single paragraph
			const p = document.createElement('p');
			p.textContent = responseText;
			messageElement.appendChild(p);
		}

		if (
			type === 'bot' &&
			processedSourcesArray &&
			processedSourcesArray.length > 0
		) {
			const sourcesWrapper = document.createElement('div');
			sourcesWrapper.className = 'ai-chat-message-sources';
			const sourcesTitle = document.createElement('strong');
			sourcesTitle.textContent =
				'Sources - For more information, click on the source links below:';
			sourcesWrapper.appendChild(sourcesTitle);
			const sourcesList = document.createElement('ul');
			processedSourcesArray.forEach((source) => {
				const listItem = document.createElement('li');
				const link = document.createElement('a');
				link.href = '#';
				link.textContent = source.displayName;
				link.style.color = config.themeColor || '#db2777';
				link.style.textDecoration = 'underline';
				link.style.cursor = 'pointer';
				link.onclick = (e) => {
					e.preventDefault();
					console.log(
						'Opening source:',
						source.displayName,
						source.viewUrl
					);
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

	async function handleSendMessage() {
		const question = messageInput.value.trim();
		if (!question) return;
		displayMessage(question, [], 'user');
		messageInput.value = '';
		messageInput.disabled = true;
		sendButton.disabled = true;
		const loadingElement = displayMessage('Thinking...', [], 'loading');
		try {
			console.log(
				'Sending chat message to API for accountId:',
				accountId
			);
			console.log(
				'Inside handleSendMessage USER Chat session ID:',
				sessionId,
				'Visitor UUID:',
				visitorUuid
			);
			await fetch(chatMessageApiEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': apiKey,
				},
				body: JSON.stringify({
					message_text: question,
					sender_type: 'user',
					accountId: accountId,
					chat_session_id: sessionId,
					visitor_uuid: visitorUuid,
					sources: [],
				}),
			});
		} catch (error) {
			console.error('Chat Message API Call Error:', error);
			// We don't want to block the chat response on this call, so we log it but don't display an error message
		}
		try {
			console.log(
				'Sending query to API:',
				question,
				'for accountId:',
				accountId,
				'with apiKey:',
				apiKey.substring(0, 8) + '...'
			);
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
				const errorData = await response.json().catch(() => ({
					detail: 'Server returned an unparsable error.',
				}));
				console.error('API Error Response:', errorData);
				throw new Error(
					errorData.detail || `API Error: ${response.status}`
				);
			}
			const data = await response.json();
			console.log('API Success Response:', data);
			if (data && data.response && data.response.response_text) {
				const rawSources = data.response.sources || [];
				const displayableSources = processSourcesForDisplay(
					rawSources,
					accountId
				);
				displayMessage(
					data.response.response_text,
					displayableSources,
					'bot'
				);
				try {
					console.log(
						'Sending chat message to API for accountId:',
						accountId
					);
					console.log(
						'Inside handleSendMessage BOT Chat session ID:',
						sessionId,
						'Visitor UUID:',
						visitorUuid
					);
					await fetch(chatMessageApiEndpoint, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-API-Key': apiKey,
						},
						body: JSON.stringify({
							message_text: data.response.response_text,
							sender_type: 'bot',
							accountId: accountId,
							chat_session_id: sessionId,
							visitor_uuid: visitorUuid,
							sources: data.response.sources,
						}),
					});
				} catch (error) {
					console.error('Chat Message API Call Error:', error);
					// We don't want to block the chat response on this call, so we log it but don't display an error message
				}
			} else {
				console.error(
					'API response structure unexpected. Expected data.response.response_text.',
					data
				);
				displayMessage(
					'Sorry, I received an unexpected response from the server.',
					[],
					'error'
				);
			}
		} catch (error) {
			console.error('Widget API Call Error:', error);
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

	async function handleSendEmail() {
		clearEmailFormStatus();
		const name = emailFormNameInput.value.trim();
		const email = emailFormEmailInput.value.trim();
		const message = emailFormMessageInput.value.trim();

		if (!name) {
			displayEmailFormStatus(
				config.emailFormErrorNameRequired || 'Please enter your name.',
				false
			);
			emailFormNameInput.focus();
			return;
		}
		if (!email) {
			displayEmailFormStatus(
				config.emailFormErrorEmailRequired ||
					'Please enter your email address.',
				false
			);
			emailFormEmailInput.focus();
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			displayEmailFormStatus(
				config.emailFormErrorEmailInvalid ||
					'Please enter a valid email address.',
				false
			);
			emailFormEmailInput.focus();
			return;
		}
		if (!message) {
			displayEmailFormStatus(
				config.emailFormErrorMessageRequired ||
					'Please enter your message.',
				false
			);
			emailFormMessageInput.focus();
			return;
		}

		emailFormSendButton.disabled = true;
		emailFormCancelButton.disabled = true;
		emailFormSendButton.textContent =
			config.emailFormSendingText || 'Sending...';

		try {
			console.log(
				'Sending email form data to API for accountId:',
				accountId
			);
			const response = await fetch(contactApiEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': apiKey,
				},
				body: JSON.stringify({
					name: name,
					email: email,
					message: message,
					sessionId: sessionId,
					visitorUuid: visitorUuid,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					detail: 'Failed to send email. Server error.',
				}));
				throw new Error(
					errorData.detail || `API Error: ${response.status}`
				);
			}

			console.log('Email form submitted successfully.');
			displayEmailFormStatus(
				config.emailFormSuccessMessage ||
					'Thank you! Your message has been sent.',
				true
			);
			clearEmailForm();
			setTimeout(() => {
				if (isEmailFormVisible) switchToChatView();
			}, 3000);
		} catch (error) {
			console.error('Email Form API Call Error:', error);
			displayEmailFormStatus(
				error.message ||
					config.emailFormGenericError ||
					'An error occurred. Please try again.',
				false
			);
		} finally {
			emailFormSendButton.disabled = false;
			emailFormCancelButton.disabled = false;
			emailFormSendButton.textContent =
				config.emailFormSendButtonText || 'Send Email';
		}
	}

	// --- Initialization Function ---
	function initializeWidget() {
		console.log('Initializing widget...');
		injectStyles();
		createChatToggleButton(); // Ensures original icon logic is used
		createChatWindow();

		switchToChatView(false); // Start in chat view, don't focus input yet

		if (config.initialBotMessage && !isEmailFormVisible) {
			displayMessage(config.initialBotMessage, [], 'bot');
		}
		console.log('Widget initialized.');
	}

	function destroyWidget() {
		console.log('Destroying YourDocsAI Widget...');

		// 1. Remove the main UI elements from the body
		if (chatToggleButton) chatToggleButton.remove();
		if (chatWindow) chatWindow.remove();
		if (currentIframeModal) currentIframeModal.remove(); // Also remove any open modals

		// 2. Remove the injected styles from the head
		if (widgetStyleElement) widgetStyleElement.remove();

		// 3. Clean up the global API object itself
		delete window.YourDocsAI;

		// 4. Reset internal variables (good practice)
		chatToggleButton = null;
		chatWindow = null;
		widgetStyleElement = null;
		currentIframeModal = null;

		console.log('Widget destroyed successfully.');
	}

	// Expose the destroy function on a global object.
	// We also add the init function in case it's needed for advanced scenarios.
	window.YourDocsAI = {
		init: initializeWidget,
		destroy: destroyWidget,
	};

	// --- Start the Widget ---
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializeWidget);
	} else {
		initializeWidget();
	}
})();
