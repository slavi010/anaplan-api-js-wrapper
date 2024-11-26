/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanModelMetadata class to interact with Anaplan Other Model Metadata API.
 */
class AnaplanModelMetadata {
    /**
     * Creates an instance of AnaplanModelMetadata.
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
     * Looks up dimension items by name or code.
     *
     * To use this call, you must be a Workspace Administrator.
     * This call does not return results for names or codes for which an item does not exist.
     * If the given workspace, model, or dimension do not exist, this call returns a 404 code.
     * If the dimension does not support codes and codes are provided, this call returns a 400 code.
     *
     * Supported dimensions are:
     * - Lists - the request must include Name or Code of list item must be provided as input.
     * - Time - the request must include the time period name (as visible in Anaplan UI, e.g. "May 21") as input.
     * - Version - the request must include the name of the version as input.
     * - Users - the request must include the user name as input.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} dimensionId - The ID of the dimension.
     * @param {Array<string>} names - Array of names to look up.
     * @param {Array<string>} codes - Array of codes to look up.
     * @returns {Promise<Array>} - A promise that resolves to an array of dimension items.
     * ```json
     * [
     *   {
     *     "name":"South",
     *     "id":"208000000001",
     *     "code":"S"
     *   },
     *   {
     *     "name":"West",
     *     "id":"208000000004",
     *     "code":"W"
     *   }
     * ]
     * ```
     */
    async lookupDimensionItemsByNameOrCode(workspaceId, modelId, dimensionId, names, codes) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/dimensions/${dimensionId}/items`, {
                names,
                codes,
            });
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves all items in a dimension.
     *
     * Use this call to retrieve the IDs, codes, and names for items in a specified dimension. The dimension must be a list, a list subset, a line item subset, or the Users dimension.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - This call is on the model-level. It returns all dimension items as it does not have view-level hiding, filtering, or Selective Access. For the view-level endpoint, see Retrieve selected items in a dimension.
     * - If codes have not been set for an item, then the response excludes the code field.
     * - This call only supports the retrieval of dimensions and items from a dimension that contains a maximum of 1,000,000 items.
     * - The call returns a 400 response for any more than that number of items.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} dimensionId - The ID of the dimension.
     * @returns {Promise<Array>} - A promise that resolves to an array of dimension items.
     * ```json
     * [
     *   {
     *     "code" : "N",
     *     "id" : "200000000001",
     *     "name" : "North"
     *   },
     *   {
     *     "code" : "E",
     *     "id" : "200000000002",
     *     "name" : "East"
     *   },
     *   {
     *     "code" : "S",
     *     "id" : "200000000003",
     *     "name" : "South"
     *   },
     *   {
     *     "code" : "W",
     *     "id" : "200000000004",
     *     "name" : "West"
     *   },
     *   {
     *     "id" : "200000000000",
     *     "name" : "Total Company"
     *   }
     * ]
     * ```
     */
    async getAllItemsInDimension(modelId, dimensionId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/dimensions/${dimensionId}/items`);
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves selected items in a dimension.
     *
     * This call returns data as filtered by the page builder when they configure the view. This call respects hidden items, filtering selections, and Selective Access. If the view contains hidden or filtered items, these do not display in the response.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - This call works with any dimension type.
     * - The items in the response may not be ordered.
     * - The response returns Items within a flat list (no hierarchy).
     * - This is a view-level call. For the model-level call, see Retrieve all data for items in a dimension.
     * - This call only supports the retrieval of dimension items within a view that contains a maximum of 1,000,000 cells. If the specified view contains more than 1,000,000 dimension items, then the call returns a 400 Bad Request HTTP status, instead of a subset of the dimension items. Use the quick sum bar in Anaplan to identify the number of dimension items in a view.
     * - The viewId in this request can also be replaced by any valid lineItemId. If the Line Item has a changed dimensionality (has a Subsidiary View), the response returns the applicable dimension items for the given dimension. Otherwise, the response returns all default applicable dimension items for the given dimension.
     *
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} viewId - The ID of the view.
     * @param {string} dimensionId - The ID of the dimension.
     * @returns {Promise<Array>} - A promise that resolves to an array of dimension items.
     * ```json
     * [{
     *     "id": "220000000001",
     *     "name": "England"
     *   },
     *   {
     *     "id": "220000000002",
     *     "name": "Wales"
     * }]
     * ```
     */
    async getSelectedItemsInDimension(modelId, viewId, dimensionId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/views/${viewId}/dimensions/${dimensionId}/items`);
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves the IDs and names of all modules in a specified model.
     *
     * - To use this call, you must be a Workspace Administrator
     *
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of modules.
     * ```json
     * [
     *   {
     *     "id": "102000000125",
     *     "name": "REV01 Price Book"
     *   },
     *   {
     *     "id": "102000000121",
     *     "name": "REV02 Volume Inputs"
     *   }
     * ]
     */
    async getAllModules(modelId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/modules`);
            return response.data.modules;
        } catch (error)
        {
            handleError(error);
        }
    }

    /**
     * Retrieves the IDs and names of all views in a specified model.
     *
     * The results include default and saved views.
     * If you add the query parameter includesubsidiaryviews=true, this includes unsaved subsidiary views in the results.
     * This call also retrieves the ID of the module that the views belong to.
     *
     * - To use this call, you must be a Workspace Administrator
     * - Single quotes enclose the module and view names that have special characters
     *
     * For default views:
     * - The value of the {viewId} is identical to the value of the {moduleId}
     * - The value of the name is identical to the value of the module
     *
     * For saved views:
     * - The name consists of the module name, a period, and the saved view name. For example, REP01 Profit & Loss Report.P & L by Country
     *
     * For unsaved subsidiary views:
     * - The name consists of the module name and the line item name that the subsidiary view is created from
     * - These are separated by a period(.)
     *
     * @param {string} modelId - The ID of the model.
     * @param {boolean} includeSubsidiaryViews - Whether to include unsaved subsidiary views.
     * @returns {Promise<Array>} - A promise that resolves to an array of views.
     * ```json
     * [
     *   {
     *     "id": "102000000000",
     *     "name": "StrategicPlanning",
     *     "moduleId": "102000000000"
     *   },
     *   {
     *     "id": "207000000000",
     *     "name": "StrategicPlanning.UK Financial forecast",
     *     "moduleId": "102000000000"
     *   }
     * ]
     * ```
     */
    async getAllViews(modelId, includeSubsidiaryViews = false) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/views`, {
                params: { includesubsidiaryviews: includeSubsidiaryViews }
            });
            return response.data.views;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves the IDs and names of all views in a specified module.
     *
     * Use this call to retrieve all view IDs and names for a specified module. This call also returns the default view for the module.
     * If the user adds the query parameter includesubsidiaryviews=true, unsaved subsidiary views will also be included in the results.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - For the default view, the {viewId} is the same as the {moduleId}.
     * - For unsaved subsidiary views, the {viewId} and {viewName} are the same as the {lineItemId} and {lineItemName} that the subsidiary view is created from.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} moduleId - The ID of the module.
     * @param {boolean} includeSubsidiaryViews - Whether to include unsaved subsidiary views.
     * @returns {Promise<Array>} - A promise that resolves to an array of views.
     * ```json
     * [
     *   {
     *     "id": "102000000000",
     *     "name": "default",
     *     "moduleId": "102000000000"
     *   },
     *   {
     *     "id": "203000000000",
     *     "name": "SavedView",
     *     "moduleId": "102000000000"
     *   }
     * ]
     * ```
     */
    async getViewsForModule(modelId, moduleId, includeSubsidiaryViews = false) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/modules/${moduleId}/views`, {
                params: { includesubsidiaryviews: includeSubsidiaryViews }
            });
            return response.data.views;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves cell data for a view.
     *
     * Use this call to retrieve the cell data for a view. You can either query for the default page, or provide page selectors to query for other pages.
     * This call returns data in either a CSV grid response or as JSON.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - This call only supports the retrieval of cells from a view that contains a maximum of 1,000,000 cells.
     * - If the specified view contains more than 1,000,000 cells, then the call returns a 400 Bad Request HTTP status.
     * - If you call several times in a short amount of time, you may receive a 429 response.
     * - You can replace the viewId with any valid lineItemId.
     *
     * ### CSV responses
     * The first line of the CSV response contains the values of the page selectors.
     * The response omits this line when there are no dimensions on pages.
     * When there are multiple dimensions on columns, a line for each dimension follows the first line that contains the values of the page selectors.
     * When there are multiple dimensions on rows, a column displays on the left, before the data, for each dimension on rows.
     * You can export the CSV data in different layouts by passing two query parameters exportType and moduleId together.
     *
     * ### JSON responses
     * The response returns Content-Type application/json with this format:
     * - A `pages` key with a value that is a list of the selected items for each page selector. If no page selectors exist for this view, the list displays as empty or absent.
     * - A `columnCoordinates` key with a value that is a list of the coordinates for all values in that column. Each list item is itself a list containing one or more values. The length of each list equals the number of dimensions on columns.
     * - A `rows` key with a value that is a list of row objects. Each row object contains:
     * - A `rowCoordinates` key with a value that is a list of the coordinates for all values in the current row. Each list item is itself a list that contains one or more values. The length of each list equals the number of dimensions on rows.
     * - A `cells` key with a value, which is a list of all the cell values in the current row. To get the full coordinates for each cell, use the position of the cell value in the cells list, and find the column coordinates at the same position in the columnCoordinates list. Then, to uniquely specify the cell, combine the column coordinates with the rowCoordinates for the current row and any selected pages.
     *
     * In a JSON-formatted response, the system will perform substitutions to the following invalid characters:
     * - Character in JSON	Meaning	Replaced by
     * - `\b`	backspace	` \\b `
     * - `\t`	tab	` \\t `
     * - `\n`	new line	` \\n `
     * - `\f`	newline+space	` \\f `
     * - `\r`	carriage return	` \\r `
     * - `"`	double quote	` \\ `
     * - `/`	forward slash	` \/\ `
     * - `\\`	backslash	` \\\ `
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} viewId - The ID of the view.
     * @param {string} [format='json'] - The format of the response ('json' or 'csv').
     * @param {Object} [params={}] - Additional query parameters.
     * @param {Array<string>} [params.pages] - Multi-valued, colon-separated page selector values that identify the page to retrieve.
     * @param {number} [params.dimensionId] - The dimension ID.
     * @param {number} [params.itemId] - The item ID.
     * @param {string} [params.exportType] - Required with \{moduleId\} when you export data in the following layouts: TABULAR\_SINGLE\_COLUMN and TABULAR\_MULTI\_COLUMN.
     * @param {string} [params.moduleId] - ID of the parent module of the view. Required with exportType.
     * @param {number} [params.maxRows] - Limits the number of exported rows to \{maxRows\} not including the header.
     * @returns {Promise<Object>} - A promise that resolves to the cell data.
     * ```json
     * {
     *   "pages": [ "Value", "23mm" ],
     *   "columnCoordinates": [ ["Jan 13"], ["Feb 13"], ["Mar 13"], ["Q1 FY13"], ["Apr 13"], ["May 13"], ["Jun 13"], ["Q2 FY13"], ["H1 FY13"], ["Jul 13"], ["Aug 13"], ["Sep 13"], ["Q3 FY13"], ["Oct 13"], ["Nov 13"], ["Dec 13"], ["Q4 FY13"], ["H2 FY13"], ["FY13"] ],
     *   "rows": [
     *     {
     *       "rowCoordinates": [ "Durham" ],
     *       "cells": [
     *         "64.6", "57.94", "108.36", "230.97", "173.46", "321.17", "398.7", "893.43", "1124.3", "433.05", "435.52", "421.46", "1290.03", "300.11", "150.53", "70.23", "520.87", "1810.9", "2935.3"
     *       ]
     *     },
     *     {
     *       "rowCoordinates": [ "Newcastle upon Tyne" ],
     *       "cells": [
     *         "96.33", "92.69", "136.24", "325.27", "234.81", "468.96", "489.6", "1193.38", "1518.65", "535.86", "531.8", "542.6", "1610.25", "346.22", "171.65", "84.72", "602.6", "2212.85", "3731.5"
     *       ]
     *     },
     *     {
     *       "rowCoordinates": [ "Sunderland" ],
     *       "cells": [
     *         "57.06", "63.73", "56.33", "177.13", "124.52", "236.29", "286.86", "647.67", "824.8", "301.15", "302.13", "299.61", "902.9", "145.01", "115.58", "65.05", "325.65", "1228.55", "2053.35"
     *       ]
     *     }
     *   ]
     * }
     * ```
     */
    async getCellDataForView(modelId, viewId, format = 'json', params= {
        format: format === 'json' ? 'v1' : undefined,
        ...params,
        pages: params.pages ? params.pages.join(',') : undefined,
        dimensionId: params.dimensionId,
        itemId: params.itemId,
        exportType: params.exportType,
        moduleId: params.moduleId,
        maxRows: params.maxRows
    }) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/views/${viewId}/data`, {
                headers: {
                    Accept: format === 'json' ? 'application/json' : 'text/csv'
                },
                params: {
                    format: format === 'json' ? 'v1' : undefined,
                    ...params
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves all line items in a specific module.
     *
     * To use this call, you must be a Workspace Administrator.
     * The Model Role of the user must allow Read access to the module. Otherwise, this call returns a 404 Not Found HTTP status.
     * The items in the response are in the same order that appears in the Anaplan UI.
     * This call returns line items for a specific module. For all the line items in the model see Retrieve All Line Items in a Model.
     * If this query contains an invalid or a non-existing Module ID, the API returns a 404 Not Found HTTP status.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} moduleId - The ID of the module.
     * @returns {Promise<Array>} - A promise that resolves to an array of line items.
     * ```json
     * [
     *   {
     *     "moduleId": "102000000000",
     *     "moduleName": "Sales Entry",
     *     "id": "206000000000",
     *     "name": "Quantity Sold"
     *   },
     *   {
     *     "moduleId": "102000000000",
     *     "moduleName": "Sales Entry",
     *     "id": "206000000001",
     *     "name": "Price"
     *   },
     *   {
     *     "moduleId": "102000000000",
     *     "moduleName": "Sales Entry",
     *     "id": "206000000002",
     *     "name": "Revenue"
     *   }
     * ]
     * ```
     */
    async getAllLineItemsInModule(modelId, moduleId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/modules/${moduleId}/lineItems`);
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves dimension items for a line item.
     *
     * Use this call to retrieve IDs, codes, and names for dimension items that apply to the specified line item.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - This call works with any dimension type.
     * - Your requesting model role must allow read access to the module the line item belongs to. Otherwise, this call returns a 404 Not Found HTTP status.
     * - The items in the response are ordered as listed in the Anaplan model.
     * - The response returns items within a flat list (no hierarchy).
     * - This call only supports the retrieval of dimension items where the dimension contains a maximum of 1,000,000 items.
     * - Providing a non-existent Line Item ID or Dimension ID returns a 404 Not Found HTTP status.
     * - If the request provides an invalid line item ID or dimension ID this call returns a 400 Bad Request HTTP status.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} lineItemId - The ID of the line item.
     * @param {string} dimensionId - The ID of the dimension.
     * @returns {Promise<Array>} - A promise that resolves to an array of dimension items.
     * ```json
     * [
     *   {
     *     "id": "220000000001",
     *     "name": "England"
     *   },
     *   {
     *     "id": "220000000002",
     *     "name": "Wales"
     *   }
     * ]
     * ```
     */
    async getDimensionItemsForLineItem(modelId, lineItemId, dimensionId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/lineItems/${lineItemId}/dimensions/${dimensionId}/items`);
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Initiates a large read request for view data.
     *
     * This call enables you to read data from views that are larger than a million cell count.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - As a best practice, use the Delete read requests call to clear all pages from completed exports as soon as you download all pages.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} viewId - The ID of the view.
     * @param {string} exportType - The type of export (e.g., 'TABULAR_MULTI_COLUMN').
     * @returns {Promise<Object>} - A promise that resolves to the read request response.
     * ```json
     * {
     *     "requestId": "0A06B0739F0E47BB92E2326C603D86EC",
     *     "requestState": "IN_PROGRESS",
     *     "url": "https://api.anaplan.com/2/0/workspaces/{workspaceId}/models/{modelId}/views/{viewId}/readRequests/{requestId}"
     * }
     * ```
     */
    async initiateLargeReadRequest(workspaceId, modelId, viewId, exportType = 'TABULAR_MULTI_COLUMN') {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/views/${viewId}/readRequests`, {
                exportType
            });
            return response.data.viewReadRequest;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves the status of a large read request.
     *
     * Use this call to check the status of an export action after a bulk data long request is initiated.
     * You can use it to check how many pages are available to download.
     *
     * - To use this call, you must be a Workspace Administrator.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} viewId - The ID of the view.
     * @param {string} requestId - The ID of the request.
     * @returns {Promise<Object>} - A promise that resolves to the status of the read request.
     * ```json
     * {
     *     "requestId": "0A06B0739F0E47BB92E2326C603D86EC",
     *     "viewId": 101000000014,
     *     "requestState": "COMPLETE",
     *     "url": "https://api.anaplan.com/2/0/workspaces/{workspaceId}/models/{modelId}/views/{viewId}/readRequests/{requestId}",
     *     "availablePages": 100,
     *     "successful": true
     * }
     * ```
     */
    async getLargeReadRequestStatus(workspaceId, modelId, viewId, requestId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/views/${viewId}/readRequests/${requestId}`, {
                headers: {
                    Accept: 'application/json'
                }
            });
            return response.data.viewReadRequest;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Downloads a specific page of a large read request.
     *
     * Use this call to download the available pages, either when the read request is in progress, or when the request is completed.
     * This request returns a CSV format response of the export list items.
     *
     * - To use this call, you must be a Workspace Administrator.
     * - You can download up to availablePages number of pages returned by the export status API.
     * - Page numbers start with zero.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} viewId - The ID of the view.
     * @param {string} requestId - The ID of the request.
     * @param {number} pageNo - The page number (starting from 0).
     * @returns {Promise<string>} - A promise that resolves to the CSV data of the page.
     */
    async downloadPage(workspaceId, modelId, viewId, requestId, pageNo) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/views/${viewId}/readRequests/${requestId}/pages/${pageNo}`, {
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
     * @param {string} viewId - The ID of the view.
     * @param {string} requestId - The ID of the request.
     * @returns {Promise<Object>} - A promise that resolves to the delete request response.
     * ```json
     * {
     *     "requestId": "0A06B0739F0E47BB92E2326C603D86EC",
     *     "viewId": 101000000014,
     *     "requestState": "COMPLETE", // CANCELLED
     *     "url": "https://api.anaplan.com/2/0/workspaces/{workspaceId}/models/{modelId}/views/{viewId}/readRequests/{requestId}",
     *     "successful": true
     * }
     * ```
     */
    async deleteReadRequest(workspaceId, modelId, viewId, requestId) {
        try {
            const response = await this.apiClient.delete(`/workspaces/${workspaceId}/models/${modelId}/views/${viewId}/readRequests/${requestId}`);
            return response.data.viewReadRequest;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Writes cell data by coordinate or name.
     *
     * Use this call to set cell values in a module.
     *
     * Ensure the request body is an array of CellWrite objects. Each object is for an updated individual cell and its full set of dimensions.
     *
     * The response contains a summary of the number of cells updated successfully and the details of why some cells that could not be updated.
     *
     * Notes:
     * - Ensure the user has write access enabled.
     * - Ensure the request includes all of the required fields.
     * - Ensure the request has a value field that is either a string, number or boolean and is compatible with the line item format/data type.
     * - If one cell cannot update, the other cells in the request still continue to update.
     * - To use this call, you must be a Workspace Administrator.
     * - Workspace administrators can import data into any cell (except aggregate cells, see below), including read-only and invisible cells.
     * - You can update a maximum of 100,000 cells or 15 MB of data (whichever is lower), in a single API call. For larger scale payloads, we recommend you use the import API.
     * - Write cell data does not apply to aggregate cells.
     * - An aggregate cell is a cell where one of its dimension items has its own child items.
     * - This includes aggregate cells for line Items with breakback enabled.
     * - For a line Item that is dimensioned by a composite list, the only writeable cells are the child items, that are defined directly in the dimension list and not defined in a parent list.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} moduleId - The ID of the module.* @param {string} moduleId - The ID of the module.
     * @param {Array<Object>} cellWrites - Array of CellWrite objects. Each object must include:
     * @param {string} cellWrites.lineItemId - The ID of the line item that belongs to the module. Required if `lineItemName` is not provided.
     * @param {string} [cellWrites.lineItemName] - The name of the line item that belongs to the module. Required if `lineItemId` is not provided.
     * @param {Array<Object>} [cellWrites.dimensions] - An array of dimension coordinates. This field can be omitted if the line item is a single cell without any dimensions applied to it.
     * @param {string} cellWrites.dimensionId - The ID of the dimension that is on the line item. Required if `dimensionName` is not provided.
     * @param {string} [cellWrites.dimensionName] - The name of the dimension that is on the line item. Required if `dimensionId` is not provided.
     * @param {string} cellWrites.itemId - The ID of the dimension item that is on the dimension. Required if `itemName` or `itemCode` is not provided.
     * @param {string} [cellWrites.itemName] - The name of the item on the dimension. Required if `itemId` or `itemCode` is not provided.
     * @param {string} [cellWrites.itemCode] - The code of the item on the dimension. Required if `itemId` or `itemName` is not provided.
     * @param {string|number|boolean} cellWrites.value - The value to set for the cell. Cannot be null.
     * @returns {Promise<Object>} - A promise that resolves to the write result.
     * ```json
     * [
     *   {
     *     "lineItemId": "206000000000",
     *     "dimensions": [
     *         { "dimensionId": "101000000001", "itemId": "202000000001" },
     *         { "dimensionId": "20000000003", "itemId": "5438300031" },
     *         { "dimensionId": "20000000020", "itemId": "107000000001" }
     *     ],
     *     "value": 1111
     *   },
     *   {
     *     "lineItemId": "206000000001",
     *     "dimensions": [
     *         { "dimensionId": "101000000001", "itemId": "202000000001" },
     *         { "dimensionId": "20000000003", "itemId": "5438300031" },
     *         { "dimensionId": "20000000020", "itemId": "107000000001" }
     *     ],
     *     "value": "Some text value"
     *   }
     * ]
     * ```
     */
    async writeCellData(modelId, moduleId, cellWrites) {
        try {
            const response = await this.apiClient.post(`/models/${modelId}/modules/${moduleId}/data`, cellWrites);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

}

module.exports = AnaplanModelMetadata;