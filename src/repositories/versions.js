/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanVersions class to interact with Anaplan Model Versions API.
 */
class AnaplanVersions {
    /**
     * Creates an instance of AnaplanVersions.
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
     * Retrieves metadata for all versions in a model.
     *
     * Use this call to get information about the model versions.
     * The response contains a list of the versions that the user has access to, and the model metadata that can be viewed from the UI.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - The returned versions only include the user’s model role with read access or higher.
     * - If the value for a field is set, it will be returned in the results.
     *
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of version metadata.
     * ```json
     * [
     *   {
     *     "id": "107000000001",
     *     "name": "Actual",
     *     "isCurrent": false,
     *     "isActual": true,
     *     "editFrom": {
     *         "periodText": "Start of Timescale",
     *         "date": "1900-01-01"
     *     },
     *     "editTo": {
     *         "periodText": "End of Timescale",
     *         "date": "2399-12-31"
     *     },
     *     "notes": "This version data is updated every Monday"
     *   },
     *   {
     *     "id": "107000000002",
     *     "name": "Variance",
     *     "isCurrent": false,
     *     "isActual": false,
     *     "switchover": {
     *         "periodText": "Mar 20",
     *         "date": "2020-03-01"
     *     },
     *     "formula": "Actual - 20",
     *     "editFrom": {
     *         "periodText": "Jan 20",
     *         "date": "2020-01-01"
     *     },
     *     "editTo": {
     *         "periodText": "Dec 20",
     *         "date": "2020-12-31"
     *     }
     *   }
     * ]
     * ```
     */
    async getVersionMetadata(modelId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/versions`);
            return response.data.versionMetadata;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Sets the switchover date for a specific version.
     *
     * Use this call to set the switchover date for a version.
     * The response contains the response code, as well as the date and human-readable date period as shown in the UI.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - To apply a switchover date, ensure the versionID corresponds to a version in Anaplan that is set to either forecast or variance.
     * - Ensure the switchover date is after the existing version switchover date.
     * - To reset the switchover date to Blank, pass an empty string in the request body.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} versionId - The ID of the version.
     * @param {string} date - The date to set as the switchover date (format: YYYY-MM-DD).
     * _ An ISO-formatted (YYYY-MM-DD) date string is used to set the switchover date. An empty string resets the switchover date.
     * _ Dates earlier than the current switchover date (for example, 2021-01-01 when the current switchover is 2021-06-01) or dates outside the current model year return a 400 Bad Request response.
     * @returns {Promise<Object>} - A promise that resolves to the updated switchover information.
     */
    async setVersionSwitchoverDate(modelId, versionId, date) {
        try {
            const response = await this.apiClient.put(`/models/${modelId}/versions/${versionId}/switchover`, {
                date,
            });
            return response.data.versionSwitchover;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanVersions;