console.log('/common.js loaded');

// Scroll to a specific response anchor after the DOM updates
const scrollToResponseAnchor = async (anchor) => {
	await nextTick();
	const responseAnchor = document.querySelector(anchor);
	if (responseAnchor) {
		responseAnchor.scrollIntoView({ behavior: 'smooth' });
	}
};

// Example usage:
// scrollToResponseAnchor('.query-response__container');

export { scrollToResponseAnchor };
