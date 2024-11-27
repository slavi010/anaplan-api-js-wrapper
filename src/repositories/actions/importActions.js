/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('../errorHandler');

/**
 * AnaplanImportActions class to interact with Anaplan Import Actions API.
 *
 * You can bring data into Anaplan by importing it with the API. For instance, you can import a file that you have uploaded.
 *
 * To import your data using the API:
 *
 * 1. Upload files.
 * 2. Get the import id and Start the import.
 * 3. Monitor each import task using the id that was returned when you started the import. If you are importing a large file, it might take some time depending on the way in which you import it.
 * 4. Check for failures in each import task when the import is complete.
 *
 * Note: Workspace administrators can run any action regardless of their assigned model role. For example, if you are a Workspace Administrator, an import ignores any Selective access and Dynamic Cell Access restrictions, in the same way as the desktop experience.
 *
 * When an import action completes successfully, all downstream calculations are also complete. This includes cells linked by formulas to the cells being updated.
 */
class AnaplanImportActions {
    /**
     * Creates an instance of AnaplanImportActions.
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
     * Retrieves the import ID for a model.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of import IDs.
     * ```json
     * [
     *   {
     *   "id": "112000000007",
     *   "name": "ORG2Test from Organization.txt",
     *   "importDataSourceId": "113000000006",
     *   "importType": "HIERARCHY_DATA"
     *   }
     * ]
     * ```
     */
    async getImportId(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/imports`);
            return response.data.imports;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Starts an import.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} importId - The ID of the import.
     * @returns {Promise<Object>} - A promise that resolves to the import task information.
     * ```json
     * {
     *   "taskId": "5E6331685CC648A29B725923B8FAEA1C"
     * }
     * ```
     */
    async startImport(workspaceId, modelId, importId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}/tasks`, {
                localeName: 'en_US',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Lists import tasks for a specific import.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} importId - The ID of the import.
     * @returns {Promise<Array>} - A promise that resolves to an array of import tasks.
     * The IDs are sorted in ascending order of creation, identified by the creationTime value.
     * ```json
     * {
     *   "taskId": "9530E1C5CAEB440DAC4E669178787160",
     *   "taskState": "COMPLETE",
     *   "creationTime": 1535145471641
     * }
     * ```
     */
    async listImportTasks(workspaceId, modelId, importId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}/tasks`);
            return response.data.tasks;
        } catch (error) {
            handleError(error);
        }
    }


    /**
     * Monitors the status of a specific import task.
     *
     * - As a best practice, we recommend you check the status of an ongoing import action no more than once every 5 seconds.
     * For long running imports it is suggested to check at even longer intervals.
     * - You can cancel an ongoing monitoring task if you make the same call using the DELETE verb instead of the GET one.
     *
     * | Status | Description |
     * |--------------|-----------------------------------------------------------------------------|
     * | NOT_STARTED | The task is scheduled to run, but has not started yet. |
     * | IN_PROGRESS | The task is currently running. |
     * | COMPLETE | The task has finished running whether successful or not. |
     * | CANCELLING | The task is currently being canceled. Cancellation is not yet complete. |
     * | CANCELLED | The task has been canceled and the changes have been rolled back. |
     *
     * details contains a JSON array that contains debug information
     *
     * If a dump file is available, failureDumpAvailable is true and objectId contains the ID of the dump file.
     * The dump file contains details of the failures that occurred during the import.
     * You can use the objectId to get the dump file.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} importId - The ID of the import.
     * @param {string} taskId - The ID of the task.
     * @param {boolean} deleteTask=false - Should delete the task?
     * @returns {Promise<Object>} - A promise that resolves to the import task status.
     * ```json
     * {
     *   "taskId": "1B1D84DDD53847BAA621810B593C3FC1",
     *   "currentStep": "Complete.",
     *   "progress": 1.0,
     *   "result": {
     *     "details": [
     *       {
     *       "localMessageText": "Employees: 90 (0/90) rows successful, 5 ignored ",
     *       "occurrences": 0,
     *       "type": "hierarchyRowsProcessed",
     *       "values": [
     *         "hierarchyName",
     *         "Employees",
     *         "successRowCount",
     *         "90",
     *         "successCreateCount",
     *         "0",
     *         "successUpdateCount",
     *         "90",
     *         "warningsRowCount",
     *         "0",
     *         "warningsCreateCount",
     *         "0",
     *         "warningsUpdateCount",
     *         "0",
     *         "failedCount",
     *         "0",
     *         "ignoredCount",
     *         "5",
     *         "totalRowCount",
     *         "95",
     *         "totalCreateCount",
     *         "0",
     *         "totalUpdateCount",
     *         "90",
     *         "invalidCount",
     *         "0",
     *         "updatedCount",
     *         "90",
     *         "renamedCount",
     *         "90",
     *         "createdCount",
     *         "0"
     *         ]
     *       }
     *     ],
     *   "failureDumpAvailable": false,
     *   "objectId": "112000000009",
     *   "successful": true
     *   },
     * "taskState": "COMPLETE",
     * "creationTime": 1571258347545
     * }
     * ```
     */
    async monitorImportTask(workspaceId, modelId, importId, taskId,deleteTask= false) {
        try {
            if (deleteTask) {
                const response = await this.apiClient.delete(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}/tasks/${taskId}`);
            } else {
                const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}/tasks/${taskId}`);
            }
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves the chunks of a dump file for an import task.
     *
     * It is possible for a dump file to be very large.
     * To help manage the size of a dump file and prevent timeouts, download the dump file in chunks.
     * Chunks are 10mb or less and numbered sequentially from 0.
     *
     * @param {Object} params - The parameters to pass to the API.
     * @param {string} params.workspaceId - The ID of the workspace.
     * @param {string} params.modelId - The ID of the model.
     * @param {string} params.importId - The ID of the import.
     * @param {string} params.taskId - The ID of the task.
     * @param {string} params.limit - The maximum number of chunks to return in the page.
     * @param {string} params.offset - The number of pages to skip before returning the page.
     * @returns {Promise<Object>} - A promise that resolves to the result data.
     * ```json
     * {
     *   "meta" : {
     *       "paging" : {
     *       "currentPageSize" : 1,
     *       "offset" : 0,
     *       "totalSize" : 3
     *       },
     *       "schema" : "https://api.anaplan.com/2/0/models/CB0A5A4D5C5943B5837FF42C5FAA95E1/objects/chunk"
     *   },
     *   "status" : {
     *       "code" : 200,
     *       "message" : "Success"
     *   },
     *   "chunks" : [
     *     {
     *       "id" : "0",
     *       "name" : "Chunk 0"
     *     },
     *     {
     *       "id" : "1",
     *       "name" : "Chunk 1"
     *     },
     *     {
     *       "id" : "2",
     *       "name" : "Chunk 2"
     *     },
     *     {
     *       "id" : "3",
     *       "name" : "Chunk 3"
     *     } ]
     *   }
     * ```
     */
    async getDumpFileChunks(params) {
        try {
            const response = await this.apiClient.get(`/workspaces/${params.workspaceId}/models/${params.modelId}/imports/${params.importId}/tasks/${params.taskId}/dump/chunks`, {
                    params: {
                        limit: params.limit,
                        offset: params.offset,
                    }
                });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Downloads a specific chunk of a dump file for an import task.
     *
     * Once you have the chunk count, download them sequentially and concatenate
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} importId - The ID of the import.
     * @param {string} taskId - The ID of the task.
     * @param {string} chunkId - The ID of the chunk.
     * @returns {Promise<Buffer>} - A promise that resolves to the chunk data (inside is csv)
     */
    async downloadDumpFileChunk(workspaceId, modelId, importId, taskId, chunkId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}/tasks/${taskId}/dump/chunks/${chunkId}`, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Downloads the dump file for an import task without chunking.
     *
     * - To prevent issues that may arise when downloading large dump files, we recommend that dump files are downloaded in chunks.
     * Please see above sections for steps.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} importId - The ID of the import.
     * @param {string} taskId - The ID of the task.
     * @returns {Promise<Buffer>} - A promise that resolves to the dump file data (inside is csv).
     */
    async downloadDumpFile(workspaceId, modelId, importId, taskId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}/tasks/${taskId}/dump`, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for a specific import definition.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} importId - The ID of the import.
     * @returns {Promise<Object>} - A promise that resolves to the import metadata.
     * ```json
     * {
     *   "name":"Employees from Employees.txt",
     *   "type":"FILE",
     *   "source":{
     *      "textEncoding":"ISO-8859-1",
     *      "columnSeparator":"\t",
     *      "textDelimiter":"\"",
     *      "headerRow":1,
     *      "firstDataRow":2,
     *      "decimalSeparator":".",
     *      "headerNames":[
     *         "Name",
     *         "Sales Region",
     *         "Parent",
     *         "Code",
     *         "Sales Team",
     *         "Start Date",
     *         "Leave Date",
     *         "Salary",
     *         "Address",
     *         "Quota",
     *         "Bonus %",
     *         "Sales Rep",
     *         "Staff",
     *         "Exec"
     *      ],
     *      "columnCount":14
     *   }
     * }
     * ```
     */
    async getImportDefinitionMetadata(workspaceId, modelId, importId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/imports/${importId}`);
            return response.data.importMetadata;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanImportActions;