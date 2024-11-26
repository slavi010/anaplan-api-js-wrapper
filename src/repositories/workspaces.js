/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanWorkspaces class to interact with Anaplan Workspaces API.
 */
class AnaplanWorkspaces {
    /**
     * Creates an instance of AnaplanWorkspaces.
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
     * Lists all workspaces the user has access to.
     * @param {boolean} [tenantDetails=false] - Whether to include tenant details in the response.
     * @returns {Promise<Array>} - A promise that resolves to an array of workspaces.
     * ```json
     * [
     *   {
     *   "id": "8a8b8c8d8e8f8g8i",
     *   "name": "Financial Planning",
     *   "active": true,
     *   "sizeAllowance": 1073741824,
     *   "currentSize": 873741824
     *   }
     * ]
     * ```
     */
    async listWorkspaces(tenantDetails = false) {
        try {
            const response = await this.apiClient.get('/workspaces', {
                params: { tenantDetails }
            });
            return response.data.workspaces;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves information about a specific workspace.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {boolean} [tenantDetails=false] - Whether to include tenant details in the response.
     * @returns {Promise<Object>} - A promise that resolves to the workspace information.
     * {
     *  "id": "8a8b8c8d8e8f8g8i",
     *  "name": "Financial Planning",
     *  "active":true,
     *  "sizeAllowance": 1073741824,
     *  "currentSize": 873741824
     * }
     */
    async getWorkspace(workspaceId, tenantDetails = false) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}`, {
                params: { tenantDetails }
            });
            return response.data.workspace;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanWorkspaces;