import { logger } from "./log";

export const validateEmail = (email) => {
    const mailformat = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email.match(mailformat)) {
        return "Invalid email format.";
    }

    return true; // If email is value, return true indicating successful email validation.
};

export const extractNameParts = (fullName) => {
    const nameParts = fullName.trim().split(/\s+/); // Split by any whitespace and trim any leading/trailing spaces
    const firstName = nameParts[0] || ""; // Default to empty string if not available
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Use second part if available
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : ""; // Join middle parts if available

    return { firstName, middleName, lastName };
};

const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes
export const isFileSizeValid = (size) => {
    if (size > MAX_FILE_SIZE) {
        logger("File size exceeds 500KB.")
        return false; // Prevent the upload
    }
    return true;  // Continue with the upload
};

export const convertImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const handleOpenCampaignModal = (setFormType, toggleSideModal) => {
    setFormType('campaign');
    toggleSideModal('dynamicForm')
}

// Function to format numbers with K and M suffixes
export const formatNumber = (value) => {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    } else {
        return value.toString();
    }
};