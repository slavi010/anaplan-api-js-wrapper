/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const base64 = require('base-64');

/**
 * AnaplanAuth class to interface with the Anaplan Authentication Service API.
 */
class AnaplanAuth {
    /**
     * Constructor to initialize the base URL for the Anaplan Authentication Service API.
     */
    constructor() {
        this.baseUrl = 'https://auth.anaplan.com';
    }

    /**
     * Creates an authentication token using a username and password.
     * @param {string} username - The Anaplan username.
     * @param {string} password - The Anaplan password.
     * @returns {Promise<Object>} - The response data from the API.
     */
    async createAuthToken(username, password) {
        const encodedCredentials = base64.encode(`${username}:${password}`);
        try {
            const response = await axios.post(`${this.baseUrl}/token/authenticate`, null, {
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create auth token: ${error}`);
        }
    }

    /**
     * Creates an authentication token using a certificate.
     * @param {string} cert - The base64-encoded certificate in PEM format.
     * @param {string} encodedString - The base64-encoded randomly generated string.
     * @param {string} encodedSignedString - The base64-encoded signed string.
     * @returns {Promise<Object>} - The response data from the API.
     */
    async createAuthTokenWithCertificate(cert, encodedString, encodedSignedString) {
        try {
            const response = await axios.post(`${this.baseUrl}/token/authenticate`, {
                encodedData: encodedString,
                encodedSignedData: encodedSignedString
            }, {
                headers: {
                    'Authorization': `CACertificate ${cert}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create auth token with certificate: ${error.message}`);
        }
    }

    /**
     * Retrieves the details of an existing authentication token.
     * @param {string} authToken - The authentication token.
     * @returns {Promise<Object>} - The response data from the API.
     */
    async getAuthTokenDetails(authToken) {
        try {
            const response = await axios.get(`${this.baseUrl}/token/validate`, {
                headers: {
                    'Authorization': `AnaplanAuthToken ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get auth token details: ${error.message}`);
        }
    }

    /**
     * Generates a new authentication token from an existing one.
     * @param {string} authToken - The existing authentication token.
     * @returns {Promise<Object>} - The response data from the API.
     */
    async refreshAuthToken(authToken) {
        try {
            const response = await axios.post(`${this.baseUrl}/token/refresh`, null, {
                headers: {
                    'Authorization': `AnaplanAuthToken ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to refresh auth token: ${error.message}`);
        }
    }

    /**
     * Deletes an authentication token, effectively logging out the user.
     * @param {string} authToken - The authentication token.
     * @returns {Promise<void>} - Resolves if the logout is successful.
     */
    async logout(authToken) {
        try {
            await axios.post(`${this.baseUrl}/token/logout`, null, {
                headers: {
                    'Authorization': `AnaplanAuthToken ${authToken}`
                }
            });
        } catch (error) {
            throw new Error(`Failed to logout: ${error.message}`);
        }
    }
}

module.exports = AnaplanAuth;