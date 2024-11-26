/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanLists class to interact with Anaplan Model Lists API.
 */
class AnaplanLists {
    /**
     * Creates an instance of AnaplanLists.
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
     * Lists all lists in a model.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of lists.
     * ```json
     * [
     *   {
     *       "id": "101000000000",
     *       "name": "Organization"
     *   },
     *   {
     *       "id": "101000000001",
     *       "name": "opportunities"
     *   },
     *   {
     *       "id": "101000000002",
     *       "name": "sales rep"
     *   },
     *   {
     *       "id": "101000000003",
     *       "name": "Bakery"
     *   },
     *   {
     *       "id": "101000000004",
     *       "name": "List2"
     *   }
     * ]
     * ```
     */
    async listModelLists(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/lists`);
            return response.data.lists;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for a specific list.
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @returns {Promise<Object>} - A promise that resolves to the list metadata.
     * ```json
     * {
     *   "id": "101000000001",
     *   "name": "Sales Reps",
     *   "properties": [
     *       {
     *           "name": "Salesforce",
     *           "format": "TEXT",
     *           "notes": "",
     *           "referencedBy": ""
     *       },
     *       {
     *           "name": "Mail",
     *           "format": "TEXT",
     *           "notes": "",
     *           "referencedBy": ""
     *       }
     *   ],
     *   "hasSelectiveAccess": false,
     *   "parent": {
     *       "id": "101000000000",
     *       "name": "Organization"
     *   },
     *   "managedBy": "",
     *   "numberedList": false,
     *   "useTopLevelAsPageDefault": false,
     *   "itemCount": 1,
     *   "workflowEnabled": false,
     *   "productionData": false
     * }
     * ```
     */
    async getListMetadata(workspaceId, modelId, listId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}`);
            return response.data.metadata;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves data for items in a specific list.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - This call only supports the retrieval of list data up to 1,000,000 records.
     * If the specified list contains more than 1,000,000 records, then the call returns a 400 Bad Request HTTP status, instead of a subset of the records.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @param {boolean} includeAll - Whether to include all optional fields.
     * @returns {Promise<Array>} - A promise that resolves to an array of list items.
     * ```json
     * [
     *   {
     *     "id": "206000000001",
     *     "name": "cake",
     *     "code": "c1"
     *   },
     *   {
     *     "id": "206000000002",
     *     "name": "bread",
     *     "code": "b2"
     *   },
     *   {
     *     "id": "206000000003",
     *     "name": "pastry",
     *     "code": "p3"
     *   }
     * ]
     * ```
     *
     * includeAll=true
     * ```json
     * [
     *   {
     *     "id": "206000000001",
     *     "name": "cake",
     *     "code": "c1",
     *     "subsets": {
     *       "favourite": true
     *     },
     *     "properties": {
     *       "count": "1.0"
     *     }
     *   },
     *   {
     *     "id": "206000000002",
     *     "name": "bread",
     *     "code": "b2",
     *     "subsets": {
     *       "favourite": false
     *     },
     *     "properties": {
     *       "count": "4.0"
     *     }
     *   },
     *   {
     *     "id": "206000000003",
     *     "name": "pastry",
     *     "code": "p3",
     *     "subsets": {
     *       "favourite": true
     *     },
     *     "properties": {
     *       "count": "5.0"
     *     }
     *   }
     * ]
     * ```
     *
     */
    async getListItems(workspaceId, modelId, listId, includeAll = false) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/items`, {
                params: { includeAll },
            });
            return response.data.listItems;
        } catch (error) {
            handleError(error);
        }
    }


    // make a table with:

//
// For a numbered list, the name column is used for the index. The name is automatically generated. When you add an item, the API does not allow a name as an input.
//
// Scenario	Existing	Input in API	Behavior	Result
// Add a new list Item	There are no existing items	name=n1
// code=c1	A name is not a valid input. A new list item is not added.	An error message returns.
// Add a new list item	There are no existing items	code=c1	Success.
// A new item is added.	success code=c1
// Add a list item with a conflicting code	code=c1	code=c1	There is a duplicate code. A new list item is not added.	An error message returns.




    /**
     * Adds items to a list.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - A maximum of 100,000 list items can be added with a single call.
     *
     * Add items to a general list
     * | Scenario | Existing | Input in API | Behavior | Result |
     * | --- | --- | --- | --- | --- |
     * | Add a new list Item | There are no existing items | name=n1 code=c1 | Success. A new list item is created. | name=n1 code=c1 |
     * | Add list item with name conflicts | name=n1 code=c1 | name=n1 code=c2 | There is a duplicate name. A new list item is not added. | An error message returns. |
     * | Add list item with code conflicts | name=n1 code=c1 | name=n2 code=c1 | There is a duplicate name. A new list item is not added. | An error message returns. |
     * | Add list item without name | There are no existing items | code=c1 | There is a missing name. A new list item is not added. | An error message returns. |
     *
     * Add items to a numbered list
     * | Scenario | Existing | Input in API | Behavior | Result |
     * | --- | --- | --- | --- | --- |
     * | Add a new list Item | There are no existing items | name=n1 code=c1 | A name is not a valid input. A new list item is not added. | An error message returns. |
     * | Add a new list item | There are no existing items | code=c1 | Success. A new item is added. | success code=c1 |
     * | Add a list item with a conflicting code | code=c1 | code=c1 | There is a duplicate code. A new list item is not added. | An error
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @param {Array<Object>} items - Array of items to be added.
     * @param {String} [items.name] - The name value for the item in the list.
     * @param {String} [items.code] - The code value for the item in the list.
     * @param {String} [items.parent] - The name of the parent item in the list
     * @param {Object} [items.properties] - The value of each custom list property.
     * @param {Object} [items.subsets] - The value of each custom list subset.
     *
     * @returns {Promise<Object>} - A promise that resolves to the addition result.
     */
    async addListItems(workspaceId, modelId, listId, items) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/items?action=add`, {
                items,
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Updates items in a list.
     *
     * There are two kinds of lists in Anaplan: standard list and numbered list.
     * For a standard list, the API identifies the item using the id, code, or name.
     * For numbered list, the API uses the id or code.
     * If property or subset is not specified in the input, the existing value is not updated.
     * You can update one or more items in each request.
     *
     * When you specify the list item identifier, select one of the appropriate identifiers (id, code, or name).
     * If the request contains multiple identifiers, the API returns an error.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - A maximum of 100,000 list items can be updated with a single call.
     * - The update list items allows updates or lists and numbered Lists.
     *
     * | Scenario | Existing | Input in API | Behavior | Result |
     * | --- | --- | --- | --- | --- |
     * | Update list item | name=n1 code=c1 | name=n1 code=c1 | Success. | name=n1 code=c1 |
     * | Update name | name=n1 code=c1 | name=n2 code=c1 | Success. | name=n2 code=c1 |
     * | Update code | id=id1 name=n1 code=c1 | id=id1 name=n1 code=c2 | Success. | id=id1 name=n1 code=c2 |
     * | Update code without existing code | id=id1 name=n1 | id=id1 name=n1 code=c2 | Success. | id=id1 name=n1 code=c2 |
     * | Update code (removing existing code) | id=id1 name=n1 code=c1 | id=id1 name=n1 code="" | This scenario does not provide a new code to replace the existing value. An error returns. | error: INCOMPLETE_DATA |
     * | Update code without an existing code (assign a code without the id) | name=n1 | name=n1 code=c1 | Success. | name=n1 code=c1 |
     * | Update code with same name | name=n1 code=c1 | name=n1 code=c2 | The name is already used. An error returns. | error: INCOMPLETE_DATA |
     * | Update value with code only | code=c1 properties{p1=1234} | code=c1 properties{p1=1234} | Success. | |
     * | Update value with name only. Do not specify the code | name=n1 code=c1 properties{p1=1234} | name=n1 properties{p1=1234} | The code is required to identify the record. An error returns. | error: INCOMPLETE_DATA |
     * | Update value with name only | name=n1 properties{p1=1234} | name=n1 properties{p1=4321} | Success. | |
     * | When the code is not defined, the API can still update with the name | name=n1 properties{p1=4321} | name=n1 properties{p1=4321} | Success.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @param {Array<Object>} items - Array of items to be updated.
     * @param {String} [items.name] - The name value for the item in the list.
     * @param {String} [items.code] - The code value for the item in the list.
     * @param {String} [items.id] - The Anaplan ID of the item in the list.
     * @param {String} [items.parent] - The name of the parent item in the list
     * @param {Object} [items.properties] - The value of each custom list property.
     * @param {Object} [items.subsets] - The value of each custom list subset.
     * @returns {Promise<Object>} - A promise that resolves to the update result.
     * ```json
     * {
     *   "meta": {
     *       "schema": "https://anaplan.api.com/2/0/objects/list"
     *   },
     *   "status": {
     *       "code": 200,
     *       "message": "Success"
     *   },
     *   "total": 2,
     *   "ignored": 1,
     *   "updated": 1,
     *   "failures": {
     *      {
     *         "failureType": "INCORRECT_FORMAT",
     *         "failureMessageDetails": "incorrect format -- column name:p-number, value:wrong format for number",
     *         "requestIndex": 1
     *      }
     *   }
     * }
     * ```
     */
    async updateListItems(workspaceId, modelId, listId, items) {
        try {
            const response = await this.apiClient.put(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/items`, {
                items,
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Deletes items from a list.
     *
     * You can delete one or more list items in one API call by providing different identifiers for each item.
     * For example, provide the ID for one item and code for another.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - A maximum of 100,000 list items can be deleted with a single call.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {Array<Object>} items - Array of items to be deleted.
     * @param {String} [items.id] - The Anaplan ID of the item in the list.
     * @param {String} [items.code] - The code value for the item in the list.
     * @returns {Promise<Object>} - A promise that resolves to the deletion result.
     * ```json
     * {
     *     "meta": {
     *         "schema": "https://api.anaplan.com/2/0/objects/list"
     *     },
     *     "status": {
     *         "code": 200,
     *         "message": "Success"
     *     },
     *     "deleted": 2
     * }
     * ```
     *
     * When errors:
     * ```json
     * {
     *   "meta": {
     *       "schema": "https://api.anaplan.com/2/0/objects/list"
     *   },
     *   "status": {
     *       "code": 200,
     *       "message": "Success"
     *   },
     *   "result": {
     *     "numberOfItemsDeleted": 1,
     *     "failures": [
     *       {
     *           "requestIndex": 1,
     *           "failureType": "Not found",
     *           "failureMessageDetails": "Code 'Region 1' not found"
     *       },
     *       {
     *           "requestIndex": 2,
     *           "failureType": "Ambiguous criteria",
     *           "failureMessageDetails": "Specifying both ID and code not supported (201000000001:i1)"
     *       }
     *     ]
     *   }
     * }
     * ```
     */
    async deleteListItems(workspaceId, modelId, listId, items) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/items?action=delete`, {
                items,
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Resets the index on a list.
     *
     * - To use this API call and reset the index on a list, the list must be empty, otherwise you will receive a 400 Bad Request error.
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @returns {Promise<Object>} - A promise that resolves to the reset result.
     */
    async resetListIndex(modelId, listId) {
        try {
            const response = await this.apiClient.post(`/models/${modelId}/lists/${listId}/resetIndex`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Initiates a large volume read request on a list.
     *
     * Use this call to read data from lists that are larger than a million lines.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - As a best practice, use the Delete read requests call to clear all pages from completed exports as soon as you download all pages.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @returns {Promise<Object>} - A promise that resolves to the read request response.
     * ```json
     * {
     *     "meta": {
     *         "schema": "https://api.anaplan.com/2/0/objects/listReadRequest"
     *     },
     *     "status": {
     *         "code": 200,
     *         "message": "Success"
     *     },
     *     "listReadRequest": {
     *         "requestId": "0A06B0739F0E47BB92E2326C603D86EC",
     *         "requestState": "IN_PROGRESS", // NOT_STARTED
     *         "url": "https://api.anaplan.com/2/0/workspaces/{workspaceId}/models/{modelId}/lists/{listId}/readRequests/{requestId}"
     *     }
     * }
     * ```
     */
    async initiateLargeReadRequest(workspaceId, modelId, listId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/readRequests`);
            return response.data.listReadRequest;
        } catch (error) {
            handleError(error);
        }
    }


    /**
     * Retrieves the status of a large read request.
     *
     * Use this call to check on the status of an export action after a bulk data long request is initiated.
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @param {string} requestId - The ID of the read request.
     * @returns {Promise<Object>} - A promise that resolves to the read request status.
     * ```json
     * {
     *     "meta": {
     *         "schema": "https://api.anaplan.com/2/0/objects/listReadRequest"
     *     },
     *     "status": {
     *         "code": 200,
     *         "message": "Success"
     *     },
     *     "listReadRequest": {
     *         "requestId": "0A06B0739F0E47BB92E2326C603D86EC",
     *         "listId": 101000000014,
     *         "requestState": "COMPLETE", // IN_PROGRESS
     *         "url": "https://api.anaplan.com/2/0/workspaces/{workspaceId}/models/{modelId}/lists/{listId}/readRequests/{requestId}",
     *         "availablePages": 100,
     *         "successful": true
     *     }
     * }
     * ```
     */
    async getReadRequestStatus(workspaceId, modelId, listId, requestId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/readRequests/${requestId}`);
            return response.data.listReadRequest;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Downloads a specific page of a read request.
     *
     * Use this call to download the available pages, either when the read request is in progress, or when the request is completed.
     * This request returns a CSV format response of the export list items.
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @param {string} requestId - The ID of the read request.
     * @param {number} pageNo - The page number (starting from 0).
     * @returns {Promise<string>} - A promise that resolves to the CSV data of the page.
     */
    async downloadPage(workspaceId, modelId, listId, requestId, pageNo) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/readRequests/${requestId}/pages/${pageNo}`, {
                headers: {
                    Accept: 'text/csv'
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Deletes a read request.
     *
     * Use this call to delete or cancel an initiated read request. This removes all the pages from the file store and stops the ongoing read request.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - As a best practice, use this call to clear all pages from completed exports as soon as you download all pages.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} listId - The ID of the list.
     * @param {string} requestId - The ID of the request.
     * @returns {Promise<Object>} - A promise that resolves to the delete request response.
     * ```json
     * {
     *     "meta": {
     *         "schema": "https://api.anaplan.com/2/0/objects/listReadRequest"
     *     },
     *     "status": {
     *         "code": 200,
     *         "message": "Success"
     *     },
     *     "listReadRequest": {
     *         "requestId": "0A06B0739F0E47BB92E2326C603D86EC",
     *         "listId": 101000000014,
     *         "requestState": "COMPLETE", // CANCELLED
     *         "url": "https://api.anaplan.com/2/0/workspaces/{workspaceId}/models/{modelId}/lists/{listId}/readRequests/{requestId}",
     *         "successful": true
     *     }
     * }
     * ```
     */
    async deleteReadRequest(workspaceId, modelId, listId, requestId) {
        try {
            const response = await this.apiClient.delete(`/workspaces/${workspaceId}/models/${modelId}/lists/${listId}/readRequests/${requestId}`);
            return response.data.listReadRequest;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanLists;
