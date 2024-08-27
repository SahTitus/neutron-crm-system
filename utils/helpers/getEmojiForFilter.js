// A helper function to get the emoji based on the filter type
export const getEmojiForFilter = (filter) => {
	switch (filter) {
		case "campaign":
			return "📢";
		case "customer":
			return "👨‍🔬";
		case "lead":
			return "🕵️";
		case "opportunity":
			return "💰";
		case "task":
			return "📋";
		default:
			return "❓";
	}
};