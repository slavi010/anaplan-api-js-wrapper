/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

/**
 * Handles API errors.
 * @param {Error} error - The error object.
 */
const handleError = (error) => {
    if (error.response) {
        // Server responded with a status other than 2xx
        console.error('API response error:', error.response.data);
    } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
    } else {
        // Something else happened
        console.error('Error:', error.message);
    }
    throw error;
};

module.exports = { handleError };