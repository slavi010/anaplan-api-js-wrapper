/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const {handleError} = require('../errorHandler');

/**
 * AnaplanExportActions class to interact with Anaplan Export Actions API.
 */
class AnaplanExportActions {
    /**
     * Creates an instance of AnaplanExportActions.
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
     * Lists the available export definitions for a model.
     *
     * To run an export, you need the ID of its export definition.
     * You can get a list of the export definitions with their ID for models in your workspace.
     * This enables you to decide on the Export action to carry out.
     * If you already know the ID of the export definition, you can skip this step.
     *
     * @param {Object} params - The parameters to pass to the API.
     * @param {string} params.workspaceId - The ID of the workspace.
     * @param {string} params.modelId - The ID of the model.
     * @param {number} [params.limit] The number of export definitions to return in the page.
     * @param {number} [params.offset] - The number of pages to skip before returning the first export definition.
     * @returns {Promise<Object>} - A promise that resolves to the response.
     * ```json
     * {
     *   "meta":{
     *     "paging":{
     *       "currentPageSize":2,
     *       "offset":0,
     *       "totalSize":2
     *     },
     *     "schema":"https://api.anaplan.com//2/0/models/75A40874E6B64FA3AE0743278996850F/objects/export"
     *   },
     *   "status":{
     *     "code":200,
     *     "message":"Success"
     *   },
     *   "exports":[
     *     {
     *       "id":"116000000000",
     *       "name":"Deployed quota - Deployed quota.txt",
     *       "exportType":"TABULAR_MULTI_COLUMN"
     *     },
     *     {
     *       "id":"116000000001",
     *       "name":"ExportGrid - ORG2Test.xls",
     *       "exportType":"GRID_CURRENT_PAGE"
     *     }
     *   ]
     * }
     * ```
     */
    async listExportDefinitions(params) {
        try {
            const response = await this.apiClient.get(`/workspaces/${params.workspaceId}/models/${params.modelId}/exports`,
                {
                    params: {
                        limit: params.limit,
                        offset: params.offset
                    }
                }
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for a specific export definition.
     *
     * You can use the API to obtain metadata, such as column names, data types, and export format, for an export definition, using the model's ID.
     *
     * - If the export has its line items in columns, dataTypes shows the types.
     * "ENTITY" is any member of a List.
     * - If the export has its line items in rows or pages, Anaplan does not know the types and dataTypes shows "MIXED".
     *
     * The rowCount value in the response provides an estimate of the number of rows for the resulting export.
     * The rowCount will likely be slightly different from the exported data.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} exportId - The ID of the export.
     * @returns {Promise<Object>} - A promise that resolves to the export metadata.
     * ```json
     * {
     *   "columnCount":16,
     *   "dataTypes":[
     *     "ENTITY",
     *     "MIXED",
     *     "MIXED",
     *     "MIXED",
     *     "MIXED"
     *   ],
     *   "delimiter":"\"",
     *   "encoding":"UTF-8",
     *   "exportFormat":"text/csv",
     *   "headerNames":[
     *     "ListWithSemiColonAsSeparator",
     *     "Parent",
     *     "Code",
     *     "DepProjects",
     *     "col1",
     *     "col2",
     *     "col3",
     *     "col4",
     *     "data",
     *     "delete"
     *   ],
     *   "listNames":[
     *     "",
     *     "",
     *     "",
     *     ""
     *   ],
     *   "rowCount":20432,
     *   "separator":","
     * }
     * ```
     */
    async getExportDefinitionMetadata(workspaceId, modelId, exportId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/exports/${exportId}`);
            return response.data.exportMetadata;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Starts an export and returns the newly-created taskID.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} exportId - The ID of the export.
     * @returns {Promise<Object>} - A promise that resolves to the export task information.
     * ```json
     * {
     *   "taskId":"F362B99442C54425970E200037D48A91"
     * }
     * ```
     */
    async startExport(workspaceId, modelId, exportId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/exports/${exportId}/tasks`, {
                localeName: 'en_US',
            });
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Lists export tasks for a specific export.
     *
     * @param {Object} params - The parameters to pass to the API.
     * @param {string} params.workspaceId - The ID of the workspace.
     * @param {string} params.modelId - The ID of the model.
     * @param {string} params.exportId - The ID of the export.
     * @param {number} [params.limit] - The maximum number of export tasks to return in the page.
     * @param {number} [params.offset] - The number of pages to skip before returning the first export task.
     *
     * @returns {Promise<Object>} - A promise that resolves to response.
     * ```json
     * {
     *   "meta":{
     *     "paging":{
     *       "currentPageSize":2,
     *       "offset":0,
     *       "totalSize":2
     *     },
     *     "schema":"https://api.anaplan.com//2/0/models/736367E9DB484E3AB3A50C3704FD33ED/objects/task"
     *   },
     *   "status":{
     *     "code":200,
     *     "message":"Success"
     *   },
     *   "tasks":[
     *     {
     *       "taskId":"08990C16C3464583B6E16BD851E0F8AE",
     *       "taskState":"IN_PROGRESS",
     *       "creationTime":1535145394668
     *     }
     *   ]
     * }
     * ```
     */
    async listExportTasks(params) {
        try {
            const response = await this.apiClient.get(`/workspaces/${params.workspaceId}/models/${params.modelId}/exports/${params.exportId}/tasks`,
                {
                    params: {
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
     * Monitors the status of a specific export task.
     *
     * - As a best practice, we recommend you check the status of an ongoing export action no more than once every 5 seconds.
     * For long running exports it is suggested to check at even longer intervals.
     * - You can cancel an ongoing monitoring task if you make the same call using the DELETE verb instead of the GET one.
     *
     * In the response:
     * - `currentStep` is the task associated with the specified taskID.
     * - `taskState` is the status of that export task.
     * - `progress` is a double that is typically 1.0.
     * - `result` is a JSON object that indicates the object ID, and whether the task succeeded.
     * - `taskId` is the ID that you specified in the request.
     *
     * Here is a list of each possible taskState:
     * | Status | Description |
     * | --- | --- |
     * | NOT_STARTED | The task is scheduled to run, but has not started yet. |
     * | IN_PROGRESS | The task is currently running. |
     * | COMPLETE | The task has finished running whether successful or not. |
     * | CANCELLING | The task is currently being canceled. Cancellation is not yet complete. |
     * | CANCELLED | The task has been canceled and the changes have been rolled back. |
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} exportId - The ID of the export.
     * @param {string} taskId - The ID of the task.
     * @param {string} [cancel=false] - Cancels the monitoring task, if set to true.
     * @returns {Promise<Object>} - A promise that resolves to the export task status.
     * {
     *   "type": "taskInformation",
     *   "taskId": "BFEC582EBD4146068FE4061831C8F0F0",
     *   "currentStep": "Complete.",
     *   "progress": 1,
     *   "result": {
     *     "failureDumpAvailable": false,
     *     "objectId":"116000000002",
     *     "successful": true
     *   },
     *   "taskState": "COMPLETE"
     * }
     */
    async monitorExportTask(workspaceId, modelId, exportId, taskId, cancel = false) {
        try {
            let response;
            if (cancel) {
                response = await this.apiClient.delete(`/workspaces/${workspaceId}/models/${modelId}/exports/${exportId}/tasks/${taskId}`);
            } else {
                response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/exports/${exportId}/tasks/${taskId}`);
            }
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }


    /**
     * Retrieves the list of files for a model, including both import and export files.
     * You can identify an export file by its metadata and id.
     *
     * @param {Object} params - The parameters to pass to the API.
     * @param {string} params.workspaceId - The ID of the workspace.
     * @param {string} params.modelId - The ID of the model.
     * @param {number} [params.limit] - The maximum number of files to return in the page.
     * @param {number} [params.offset] - The number of pages to skip before returning the first file.
     * @returns {Promise<Object>} - A promise that resolves to the response.
     * ```json
     * {
     *   "meta":{
     *     "paging":{
     *       "currentPageSize":3,
     *       "offset":0,
     *       "totalSize":3
     *     },
     *     "schema":"https://api.anaplan.com/2/0/models/75A40874E6B64FA3AE0743278996850F/objects/file"
     *   },
     *   "status":{
     *     "code":200,
     *     "message":"Success"
     *   },
     *   "files":[
     *     {
     *       "id":"113000000000",
     *       "name":"UploadedWork.csv",
     *       "chunkCount":0,
     *       "delimiter":"\"",
     *       "encoding":"UTF-8",
     *       "firstDataRow":2,
     *       "format":"txt",
     *       "headerRow":1,
     *       "separator":","
     *     },
     *     {
     *       "id":"113000000003",
     *       "name":"FileUploadB2.csv",
     *       "chunkCount":1,
     *       "delimiter":"\"",
     *       "encoding":"UTF-8",
     *       "firstDataRow":2,
     *       "format":"txt",
     *       "headerRow":1,
     *       "separator":","
     *     },
     *     {
     *       "id":"116000000000",
     *       "name":"ExportFile12.csv",
     *       "chunkCount":0,
     *       "firstDataRow":0,
     *       "headerRow":0
     *     }
     *   ]
     * }
     * ```
     */
    async listFiles(params) {
        try {
            const response = await this.apiClient.get(`/workspaces/${params.workspaceId}/models/${params.modelId}/files`,
                {
                    params: {
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
     * Retrieves the chunks of a file.
     *
     * @param {Object} params - The parameters to pass to the API.
     * @param {string} params.workspaceId - The ID of the workspace.
     * @param {string} params.modelId - The ID of the model.
     * @param {string} params.fileId - The ID of the file.
     * @param {number} [params.limit] - The maximum number of chunks to return in the page.
     * @param {number} [params.offset] - The number of pages to skip before returning the first chunk.
     * @returns {Promise<Object>} - A promise that resolves to the result data.
     * ```json
     * {
     *   "meta":{
     *     "paging":{
     *       "currentPageSize":4,
     *       "offset":0,
     *       "totalSize":4
     *     },
     *     "schema":"https://api.anaplan.com//2/0/models/75A40874E6B64FA3AE0743278996850F/objects/chunk"
     *   },
     *   "status":{
     *     "code":200,
     *     "message":"Success"
     *   },
     *   "chunks":[
     *     {
     *       "id":"0",
     *       "name":"Chunk 0"
     *     },
     *     {
     *       "id":"1",
     *       "name":"Chunk 1"
     *     },
     *     {
     *       "id":"2",
     *       "name":"Chunk 2"
     *     },
     *     {
     *       "id":"3",
     *       "name":"Chunk 3"
     *     }
     *   ]
     * }
     * ```
     */
    async getFileChunks(params) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}/chunks`,
                {
                    params: {
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
     * Retrieves a specific chunk of a file.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @param {string} chunkId - The ID of the chunk.
     * @returns {Promise<Buffer>} - A promise that resolves to the chunk data.
     */
    async getFileChunk(workspaceId, modelId, fileId, chunkId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}/chunks/${chunkId}`, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

}

module
    .exports = AnaplanExportActions;