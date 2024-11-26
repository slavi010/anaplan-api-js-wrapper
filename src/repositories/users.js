/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanUsers class to interact with Anaplan Users API.
 */
class AnaplanUsers {
    /**
     * Creates an instance of AnaplanUsers.
     * @param {string} authToken - The authentication token.
     */
    constructor(authToken) {
        this.authToken = authToken;
        this.apiClient = axios.create({
            baseURL: process.env.ANAPLAN_INTEGRATION_API_URL,
            headers: {
                Authorization: `AnaplanAuthToken ${this.authToken}`,
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Retrieves information about the authenticated user.
     *
     * @returns {Promise<Object>} - A promise that resolves to the user information.
     * ```json
     * {
     *   "id":"8a8b844a477d5da70147d150ee080b17",
     *   "active":true,
     *   "email":"a.user@anaplan.com",
     *   "emailOptIn":true,
     *   "firstName":"A",
     *   "lastName":"User",
     *   "customerId":"8b81da6f5fb6b75701604d6c950c05b1",
     *   "lastLoginDate":"2017-09-07T08:05:37.000+0000"
     * }
     * ```
     */
    async getYourUser() {
        try {
            const response = await this.apiClient.get('/users/me');
            return response.data.user;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves information about a specific user.
     *
     * - To use this call, you must be a Workspace Administrator, or have any tenant-level access role.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Object>} - A promise that resolves to the user information.
     * ```json
     * {
     *    "id":"8a8196a55b193fa0015b1e57f3da172c",
     *    "active":true,
     *    "email":"a.user@anaplan.com",
     *    "emailOptIn":true,
     *    "firstName":"A",
     *    "lastName":"User",
     *    "lastLoginDate":"2017-09-07T08:05:37.000+0000"
     * }
     * ```
     */
    async getUserInfo(userId) {
        try {
            const response = await this.apiClient.get(`/users/${userId}`);
            return response.data.user;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Lists all users.
     *
     * - To use this call, you must be a Workspace Administrator, or have any tenant-level access role.
     *
     * @returns {Promise<Array>} - A promise that resolves to an array of users.
     */
    async listUsers() {
        try {
            const response = await this.apiClient.get('/users');
            return response.data.users;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanUsers;