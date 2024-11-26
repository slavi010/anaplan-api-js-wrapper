/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanCalendar class to interact with Anaplan Model Calendar API.
 */
class AnaplanCalendar {
    /**
     * Creates an instance of AnaplanCalendar.
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
     * Retrieves the current period in Anaplan.
     *
     * If the current period is not set in Anaplan, this call returns empty strings for the periodText and lastDay values of the currentPeriod.
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Object>} - A promise that resolves to the current period information.
     * ```json
     * {
     *   "periodText": "May 20",
     *   "lastDay": "2020-05-31",
     *   "calendarType": "Calendar Months/Quarters/Years"
     * }
     * ```
     */
    async getCurrentPeriod(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/currentPeriod`);
            return response.data.currentPeriod;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Sets the current period in Anaplan.
     *
     * Use this call to change or reset the current period in Anaplan.
     * When this call contains a specified date (for example, 2020-05-20), the API determines what period range contains the specified data and sets that range as the current period.
     * When the date value is set to blank in this call, the API resets the current period to blank.
     *
     * Warning: A change to your time settings is a potentially destructive action and may lead to data loss.
     * The new range of time periods may not include previous time periods.
     * Any data in the removed time periods is deleted from the model.
     *
     * - To use this call, you must be a Workspace Administrator
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} date - The date to set as the current period (format: YYYY-MM-DD).
     * - The date to use to set, or reset, the current period. The date format is YYYY-MM-DD.
     * - If the date parameter is left blank the current period resets.
     * - If the date is not provided in the YYYY-MM-DD format, the call returns a 400 Bad Request response with this message: Invalid ISO date format '{date}'. Date should match format YYYY-MM-DD
     * - If this value falls outside of a valid range, the call returns a 400 Bad Request response with this message: Specified date '{date}' is out of timescale range {start of timescale} - {end of timescale}.
     * @returns {Promise<Object>} - A promise that resolves to the updated current period information.
     * ```json
     * {
     *   "periodText":"May 20",
     *   "lastDay":"2020-05-31",
     *   "calendarType":"Calendar Months/Quarters/Years"
     * }
     * ```
     */
    async setCurrentPeriod(workspaceId, modelId, date) {
        try {
            const response = await this.apiClient.put(`/workspaces/${workspaceId}/models/${modelId}/currentPeriod`, {
                date,
            });
            return response.data.currentPeriod;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves the current fiscal year in Anaplan.
     *
     * Use this call to get the current fiscal year with the start and end date from the model calendar.
     * The value of the start and end date is determined by the calendar type set in the model.
     * This value is not always a range from Jan 1 to Dec 31.
     * The API returns an empty value If the calendar type does not have an available fiscal year (for example, Weeks General).
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Object>} - A promise that resolves to the current fiscal year information.
     * ```json
     * {
     *   "fiscalYear": {
     *     "year": "FY21",
     *     "startDate": "2021-01-01",
     *     "endDate": "2021-12-31"
     *   }
     * }
     * ```
     *
     * Calendar Type: weeks 4-4-5,4-5-4 or 5-4-4
     * ```json
     * {
     *   "calendarType": "Calendar Months/Quarters/Years",
     *   "fiscalYear": {
     *     "year": "FY21",
     *     "startDate": "2020-03-29",
     *     "endDate": "2021-03-27"
     *   },
     *   "pastYearsCount": 0,
     *   "futureYearsCount": 0,
     *   "currentPeriod": {
     *     "periodText": "",
     *     "lastDay": ""
     *   },
     *   "totalsSelection": {
     *     "quarterTotals": true,
     *     "halfYearTotals": false,
     *     "yearToDateSummary": false,
     *     "yearToGoSummary": false,
     *     "totalOfAllPeriods": false
     *   }
     * }
     * ```
     *
     * Calendar Type: weeks general
     * ```json
     * {}
     * ```
     */
    async getCurrentFiscalYear(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/modelCalendar`);
            return response.data.modelCalendar;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Updates the current fiscal year in Anaplan.
     *
     * Use this call to update the current fiscal year for the model calendar.
     * The year input value has to be a valid fiscal year supported by the model calendar in Anaplan.
     * If successful, this call returns the updated fiscal year with start and end date associated with current model calendar type.
     * This call returns a 400 bad request message if the input value is out of range or model calendar type does not have an available fiscal year (for example, Weeks General).
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} year - The fiscal year to set (e.g., "FY21").
     * @returns {Promise<Object>} - A promise that resolves to the updated fiscal year information.
     */
    async updateCurrentFiscalYear(workspaceId, modelId, year) {
        try {
            const response = await this.apiClient.put(`/workspaces/${workspaceId}/models/${modelId}/modelCalendar/fiscalYear`, {
                year,
            });
            return response.data.modelCalendar.fiscalYear;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanCalendar;