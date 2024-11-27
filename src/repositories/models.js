/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanModels class to interact with Anaplan Models API.
 */
class AnaplanModels {
    /**
     * Creates an instance of AnaplanModels.
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
     * Lists all models the user has access to.
     * @param {Object} [params={}] - Optional parameters for the request.
     * @param {boolean} [params.modelDetails] - Whether to include model memory usage.
     * @param {string} [params.s] - Search pattern to retrieve models.
     * @param {number} [params.limit] - The number of models to return in the page.
     * @param {number} [params.offset] - The number of pages to skip before returning the data.
     * @returns {Promise<Array>} - A promise that resolves to an array of models.
     * ```json
     * [{
     *    "id": "FC12345678912343455667",
     *    "activeState": "UNLOCKED",
     *    "name": "FP&A",
     *    "currentWorkspaceId": "8a8b8c8d8e8f8g8i",
     *    "currentWorkspaceName": "Financial Planning",
     *    "modelUrl": "https://rt.anaplan.com/anaplan/rt?selectedWorkspaceId\8a8b8c8d8e8f8g8i\u0026selectedModelId\FC12345678912343455667",
     *    "categoryValues": []
     * }]
     * ```
     */
    async listModels(params) {
        try {
            const response = await this.apiClient.get('/models', {
                params: {
                    modelDetails: params.modelDetails ? 'true' : 'false',
                    s: params.s,
                    limit: params.limit,
                    offset: params.offset
                }
            });
            return response.data.models;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves information about a specific model.
     * @param {string} modelId - The ID of the model.
     * @param {boolean} [modelDetails=false] - Whether to include model memory usage.
     * @returns {Promise<Object>} - A promise that resolves to the model information.
     * ```json
     * {
     *   "id": "FC12345678912343455667",
     *   "activeState": "UNLOCKED",
     *   "name": "PF&A",
     *   "currentWorkspaceId": "8a8b8c8d8e8f8g8i",
     *   "currentWorkspaceName": "Financial Planning",
     *   "modelUrl": "https://rt.anaplan.com/anaplan/rt?selectedWorkspaceId\8a8b8c8d8e8f8g8i\u0026selectedModelId\FC12345678912343455667",
     *   "categoryValues": []
     * },
     * "status": {
     *   "code": 200,
     *   "message": "Success"
     * }
     * ```
     *
     * When modelDetails=true
     * ```json
     * {
     *   "id": "FC12345678912343455667",
     *   "name": "PF&A",
     *   "activeState": "UNLOCKED",
     *   "lastSavedSerialNumber": 2000000,
     *   "modelTransactionRunning": false,
     *   "lastModifiedByUserGuid": "5c8f44f65d3a11ea95e4026d2ec6a15d",
     *   "memoryUsage": 474900,
     *   "currentWorkspaceId": "8a8b8c8d8e8f8g8i",
     *   "currentWorkspaceName": "Financial Planning",
     *   "modelUrl": "https://rt.anaplan.com/anaplan/rt?selectedWorkspaceId\8a8b8c8d8e8f8g8i\u0026selectedModelId\FC12345678912343455667",
     *   "categoryValues": [],
     *   "isoCreationDate": "2022-02-10T19:14:23.000+0000",
     *   "lastModified": "2022-02-10T19:14:24.000+0000"
     * }
     */
    async getModel(modelId, modelDetails = false) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}`, {
                params: { modelDetails }
            });
            return response.data.model;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves models for a specific workspace.
     * @param {Object} params - Parameters for the request.
     * @param {string} params.workspaceId - The ID of the workspace.
     * @param {boolean} params.modelDetails=false - Whether to include model memory usage.
     * @param {number} [params.limit] - The number of models in the page.
     * @param {number} [params.offset] - The number of pages to skip before returning the data.
     * @returns {Promise<Object>} - A promise that resolves to the response.
     * ```json
     * {
     *   "meta": {
     *     "schema": "https://api.anaplan.com/2/0/objects/model",
     *     "paging": {
     *       "currentPageSize": 4,
     *       "totalSize": 4,
     *       "offset": 0
     *     }
     *   },
     *   "status": {
     *     "code": 200,
     *     "message": "Success"
     *   },
     *   "models": [
     *     {
     *       "id": "8BA821045BB34083B467C0082781DA69",
     *       "name": "Budgeting, Planning and Forecasting",
     *       "activeState": "UNLOCKED",
     *       "lastSavedSerialNumber": 2010876,
     *       "lastModifiedByUserGuid": "8a80da97613fc3d50161443501710056",
     *       "memoryUsage": 163950621,
     *       "currentWorkspaceId": "8a8196a258539d4c0158b0f9abe70bfd",
     *       "currentWorkspaceName": "ZZZ Sorting",
     *       "modelUrl": "https://api.anaplan.com/anaplan/framework.jsp?selectedWorkspaceId=8a8196a258539d4c0158b0f9abe70bfd&selectedModelId=8BA821045BB34083B467C0082781DA69",
     *       "categoryValues": [
     *         {
     *           "id": "8a8208a36543ed8f01655aff2edf264a",
     *           "attribute": "Sales",
     *           "categoryId": "15f6fd454b3a11ea814a026d2ec6a15d",
     *           "categoryName": "Business Function",
     *           "customerId": "8a8208a36543ed8f01655aff2ed52645"
     *         }
     *       ],
     *       "isoCreationDate": "2017-11-13T21:20:10.000+0000",
     *       "lastModified": "2020-11-26T00:29:01.000+0000"
     *     },
     *     {
     *       "id": "E216CF62E3F84342879E8480236AE78E",
     *       "name": "zmodel",
     *       "activeState": "UNLOCKED",
     *       "lastSavedSerialNumber": 2000035,
     *       "lastModifiedByUserGuid": "8a80da97613fc3d50161443501710056",
     *       "memoryUsage": 763180,
     *       "currentWorkspaceId": "8a8196a258539d4c0158b0f9abe70bfd",
     *       "currentWorkspaceName": "ZZZ Sorting",
     *       "modelUrl": "https://api.anaplan.com/anaplan/framework.jsp?selectedWorkspaceId=8a8196a258539d4c0158b0f9abe70bfd&selectedModelId=E216CF62E3F84342879E8480236AE78E",
     *       "categoryValues": [
     *         {
     *           "id": "8a8208a36543ed8f01655aff2edf2655",
     *           "attribute": "Planning, Budgeting and Forecasting",
     *           "categoryId": "15f70a644b3a11ea814a026d2ec6a15d",
     *           "categoryName": "App",
     *           "customerId": "8a8208a36543ed8f01655aff2ed52645"
     *         },
     *         {
     *           "id": "8a8208a36543ed8f01655aff2edf264b",
     *           "attribute": "Finance",
     *           "categoryId": "15f6fd454b3a11ea814a026d2ec6a15d",
     *           "categoryName": "Business Function",
     *           "customerId": "8a8208a36543ed8f01655aff2ed52645"
     *         }
     *       ],
     *       "isoCreationDate": "2016-11-29T16:45:02.000+0000",
     *       "lastModified": "2020-11-30T19:46:53.000+0000"
     *     },
     *     {
     *       "id": "1A0D320FF0C644479E98A207A5003E1A",
     *       "name": "zz archive",
     *       "activeState": "ARCHIVED",
     *       "lastSavedSerialNumber": 2000013,
     *       "lastModifiedByUserGuid": "8a80da97613fc3d50161443501710056",
     *       "currentWorkspaceId": "8a8196a258539d4c0158b0f9abe70bfd",
     *       "currentWorkspaceName": "ZZZ Sorting",
     *       "modelUrl": "https://api.anaplan.com/anaplan/framework.jsp?selectedWorkspaceId=8a8196a258539d4c0158b0f9abe70bfd&selectedModelId=1A0D320FF0C644479E98A207A5003E1A",
     *       "categoryValues": [
     *         {
     *           "id": "8a8208a36543ed8f01655aff2edf264d",
     *           "attribute": "Marketing",
     *           "categoryId": "15f6fd454b3a11ea814a026d2ec6a15d",
     *           "categoryName": "Business Function",
     *           "customerId": "8a8208a36543ed8f01655aff2ed52645"
     *         }
     *       ],
     *       "isoCreationDate": "2018-09-25T18:26:00.000+0000",
     *       "lastModified": "2018-09-25T18:26:00.000+0000"
     *     },
     *     {
     *       "id": "71B2E50D32664AF1B60FBC0C72B339AF",
     *       "name": "ZZmodel_Archive",
     *       "activeState": "UNLOCKED",
     *       "lastSavedSerialNumber": 2000015,
     *       "lastModifiedByUserGuid": "8a80da97613fc3d50161443501710056",
     *       "memoryUsage": 672300,
     *       "currentWorkspaceId": "8a8196a258539d4c0158b0f9abe70bfd",
     *       "currentWorkspaceName": "ZZZ Sorting",
     *       "modelUrl": "https://api.anaplan.com/anaplan/framework.jsp?selectedWorkspaceId=8a8196a258539d4c0158b0f9abe70bfd&selectedModelId=71B2E50D32664AF1B60FBC0C72B339AF",
     *       "categoryValues": [
     *         {
     *           "id": "8a8208a36543ed8f01655aff2ede2646",
     *           "attribute": "IT",
     *           "categoryId": "15f6fd454b3a11ea814a026d2ec6a15d",
     *           "categoryName": "Business Function",
     *           "customerId": "8a8208a36543ed8f01655aff2ed52645"
     *         }
     *       ],
     *       "isoCreationDate": "2018-08-17T18:05:23.000+0000",
     *       "lastModified": "2020-09-29T01:04:08.000+0000"
     *     }
     *   ]
     * }
     * ```
     */
    async retrieveModelsForWorkspace(params = {}) {
        try {
            const response = await this.apiClient.get(`/workspaces/${params.workspaceId}/models`, {
                params: {
                    modelDetails: params.modelDetails ? 'true' : 'false',
                    limit: params.limit,
                    offset: params.offset
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Bulk deletes models in a workspace.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {Array<string>} modelIds - Array of model IDs to be deleted.
     * @returns {Promise<Object>} - A promise that resolves to the deletion result.
     * If errors:
     * ```json
     * [
     *    {
     *      "modelId": "BC24B51B39CF4701ACF7CBFD2ED93C36",
     *      "message": "Model is open. Please close the model before trying again."
     *    },
     *    {
     *      "modelId": "EA8467B737A144C5B73CD56BA86085A0",
     *      "message": "Something went wrong. Deleting this model failed."
     *    },
     *    {
     *      "modelId": "Incorrect_Model_Id",
     *      "message": "Model ID does not exist."
     *    }
     * ]
     * ```
     */
    async bulkDeleteModels(workspaceId, modelIds) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/bulkDeleteModels`, {
                modelIdsToDelete: modelIds,
            });
            return response.data.bulkDeleteModelsFailures;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Checks the status of a specific model.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Object>} - A promise that resolves to the model status.
     *
     * Ongoing export task
     * ```json
     * {
     *    "exportTaskType":null,
     *    "taskId":"6EB7F52C07CA4E86909A213C608765A1-11",
     *    "currentStep":"Processing ...",
     *    "tooltip":"The system is currently processing an Export:\n\nExport started by user Jesse Smith (jesse.smith@yourcompany.com)\n\nExport started at 11:23 (UTC)\nTasks can be cancelled in Model Management.",
     *    "progress":0.44110000000000005,
     *    "creationTime":1578569563167
     * }
     * ```
     *
     * Ongoing import task
     * ```json
     * {
     *     "peakMemoryUsageEstimate": null,
     *     "peakMemoryUsageTime": null,
     *     "progress": 0.0,
     *     "currentStep": "Processing ...",
     *     "tooltip": "The system is currently processing an Import:\n\nImport started by user Jesse Smith (jesse.smith@yourcompany.com)\n\nImport started at 00:51 (UTC)\nTasks can be cancelled in Model Management.",
     *     "exportTaskType": null,
     *     "creationTime": 1645577520129,
     *     "taskId": "E9CB709BD63D4003ACFB60CADFC2FC0B"
     * }
     * ```
     *
     * No ongoing task
     * ```json
     * {
     *     "peakMemoryUsageEstimate": null,
     *     "peakMemoryUsageTime": null,
     *     "progress": -1.0,
     *     "currentStep": "Open",
     *     "tooltip": null,
     *     "exportTaskType": null,
     *     "creationTime": 1645577591822,
     *     "taskId": null
     * }
     * ```
     */
    async checkModelStatus(workspaceId, modelId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/status`, null, {
                headers: {
                    Accept: 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanModels;