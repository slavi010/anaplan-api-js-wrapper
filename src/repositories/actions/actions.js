/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('../errorHandler');

/**
 * AnaplanActions class to interact with Anaplan Model Actions API.
 */
class AnaplanActions {
    /**
     * Creates an instance of AnaplanActions.
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
     * Lists all actions available in a model.
     *
     * Result:
     * - `id` is the Id of the action that you can carry out in the specified model.
     * - `actionType` is the type of action contained in the model.
     * - `name` is the name of the action that you can carry out. You can view these actions in the Anaplan user interface in the Action settings for the model.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Object>} - A promise that resolves to the response
     * ```json
     * {
     *   "meta": {
     *     "paging": {
     *       "currentPageSize": 11,
     *       "offset": 0,
     *       "totalSize": 11
     *     },
     *     "schema": "https://api.anaplan.com/2/0//models/F7F3D1004C214A00A44C1655DE413B50/objects/action"
     *   },
     *   "status": {
     *     "code": 200,
     *     "message": "Success"
     *   },
     *   "actions": [
     *     {
     *       "id": "117000000011",
     *       "actionType": "DELETE_BY_SELECTION",
     *       "name": "Delete From List Action"
     *     },
     *     {
     *       "id": "117000000010",
     *       "actionType": "ORDER_HIERARCHY",
     *       "name": "Order List Action"
     *     },
     *     {
     *       "id": "117000000009",
     *       "name": "Open Dashboard Action"
     *     },
     *     {
     *       "id": "117000000008",
     *       "actionType": "SIMPLE_CREATE",
     *       "name": "Create Action"
     *     },
     *     {
     *       "id": "117000000007",
     *       "actionType": "BULK_DELETE_ENTITIES",
     *       "name": "Delete Branch Action"
     *     },
     *     {
     *       "id": "117000000006",
     *       "actionType": "SELECT_CHILDREN",
     *       "name": "Assign Action"
     *     },
     *     {
     *       "id": "117000000005",
     *       "actionType": "UPDATE_CURRENT_PERIOD",
     *       "name": "Update Current Period Action"
     *     },
     *     {
     *       "id": "117000000003",
     *       "actionType": "BULK_ENTITY_COPY",
     *       "name": "Copy Branch Action"
     *     },
     *     {
     *       "id": "117000000004",
     *       "actionType": "COPY_TO_NUMBERED_LIST",
     *       "name": "Assign Only Action"
     *     },
     *     {
     *       "id": "117000000002",
     *       "actionType": "OPTIMIZER",
     *       "name": "Optimizer Action"
     *     },
     *     {
     *       "id": "117000000001",
     *       "actionType": "BULK_COPY",
     *       "name": "Bulk Copy Action Via Versions"
     *     }
     *   ]
     * }
     * ```
     *
     */
    async listModelActions(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/actions`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for a specific action.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} actionId - The ID of the action.
     * @returns {Promise<Object>} - A promise that resolves to the action metadata.
     *
     * For delete from list action
     * ```json
     * {
     *   "id": "117000000011",
     *   "listId": "101000000015",
     *   "filterLineItemId": "503000000001",
     *   "actionType": "DELETE_BY_SELECTION",
     *   "name": "Delete From List Action"
     * }
     * ```
     *
     * For order list action
     * ```json
     * {
     *   "id": "117000000010",
     *   "listId": "101000000004",
     *   "sortOrder": "Descending",
     *   "lineItemId": "411000000002",
     *   "actionType": "ORDER_HIERARCHY",
     *   "name": "Order List Action"
     * }
     * ```
     *
     * For open dashboard action
     * ```json
     * {
     *   "id": "117000000009",
     *   "name": "Open Dashboard Action"
     * }
     * ```
     *
     * For create action
     * ```json
     * {
     *   "id": "117000000008",
     *   "actionType": "SIMPLE_CREATE",
     *   "name": "Create Action"
     * }
     * ```
     *
     * For delete branch action
     * ```json
     * {
     *   "id": "117000000007",
     *   "actionType": "BULK_DELETE_ENTITIES",
     *   "name": "Delete Branch Action"
     * }
     * ```
     *
     * For assign action
     * ```json
     * {
     *   "id": "117000000006",
     *   "actionType": "SELECT_CHILDREN",
     *   "name": "Assign Action"
     * }
     * ```
     *
     * For update current period
     * {
     *   "id": "117000000005",
     *   "actionType": "UPDATE_CURRENT_PERIOD",
     *   "name": "Update Current Period Action"
     * }
     *
     * ...
     */
    async getModelActionMetadata(workspaceId, modelId, actionId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/actions/${actionId}`);
            return response.data.action;
        } catch (error) {
            handleError(error);
        }
    }


    /**
     * Starts an action.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} actionId - The ID of the delete action.
     * @returns {Promise<Object>} - A promise that resolves to the delete task information.
     */
    async startDeleteAction(workspaceId, modelId, actionId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/actions/${actionId}/tasks`, {
                localeName: 'en_US',
            });
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanActions;