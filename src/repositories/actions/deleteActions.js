/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('../errorHandler');

/**
 * AnaplanDeleteActions class to interact with Anaplan Delete Actions API.
 */
class AnaplanDeleteActions {
    /**
     * Creates an instance of AnaplanDeleteActions.
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
     * Lists all delete actions available in a model.
     *
     * Returns:
     * - `id` is the Id of the action that you can carry out in the specified model.
     * - `name` is the name of the action that you can carry out. You can view these actions in the Anaplan user interface in the Action settings for the model.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of delete actions.
     */
    async listDeleteActions(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/actions`);
            return response.data.actions.filter(action => action.actionType === 'DELETE_BY_SELECTION');
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Starts a delete action.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} actionId - The ID of the delete action.
     * @returns {Promise<Object>} - A promise that resolves to the delete task information.
     * ```json
     * {
     *   "taskId":"0690AA1C761F48549C3442A02F91D962"
     * }
     * ```
     */
    async startAction(workspaceId, modelId, actionId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/actions/${actionId}/tasks`, {
                localeName: 'en_US',
            });
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Lists delete tasks for a specific delete action.
     *
     *
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} actionId - The ID of the delete action.
     * @returns {Promise<Array>} - A promise that resolves to an array of delete tasks.
     * ```json
     * [
     *   {
     *     "taskId":"F37EA1512BC448D3B223431C33B844B6",
     *     "taskState":"COMPLETE",
     *     "creationTime":1535145589808
     *   }
     * ]
     * ```
     */
    async listDeleteTasks(workspaceId, modelId, actionId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/actions/${actionId}/tasks`);
            return response.data.tasks;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Monitors the status of a specific delete task.
     *
     * In the response:
     * - `currentStep` is the task associated with the specified taskID.
     * - `taskState` is the status of that deletion task.
     * - `progress` is a double that is typically 1.0.
     * - `result` is a JSON object that indicates the object ID, and whether the task succeeded.
     * Note: For a deletion action, failureDumpAvailable is always false.
     * - `taskID` is the ID that you specified in the request.
     *
     * | Status | Description |
     * |--------------|-----------------------------------------------------------------------------|
     * | NOT_STARTED | The task is scheduled to run, but has not started yet. |
     * | IN_PROGRESS | The task is currently running. |
     * | COMPLETE | The task has finished running whether successful or not. |
     * | CANCELLING | The task is currently being canceled. Cancellation is not yet complete. |
     * | CANCELLED | The task has been canceled and the changes have been rolled back. |
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} actionId - The ID of the delete action.
     * @param {string} taskId - The ID of the task.
     * @returns {Promise<Object>} - A promise that resolves to the delete task status.
     * ```json
     * {
     *   "type": "taskInformation",
     *   "taskId": "0690AA1C761F48549C3442A02F91D962",
     *   "currentStep": "Complete.",
     *   "progress":1 ,
     *   "result": {
     *     "failureDumpAvailable": false,
     *     "objectId": "117000000019",
     *     "successful": true
     *   },
     *   "taskState": "COMPLETE"
     * }
     * ```
     */
    async monitorDeleteTask(workspaceId, modelId, actionId, taskId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/actions/${actionId}/tasks/${taskId}`);
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanDeleteActions;