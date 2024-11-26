/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('../errorHandler');

/**
 * AnaplanProcessActions class to interact with Anaplan Process Actions API.
 */
class AnaplanProcessActions {
    /**
     * Creates an instance of AnaplanProcessActions.
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
     * Lists all process definitions available in a model.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of process definitions.
     * should be?:
     * ```json
     * [
     *   {
     *     "id":"118000000001",
     *     "name":"Process1"
     *   },
     *   {
     *     "id":"118000000002",
     *     "name":"Process2"
     *   }
     * ]
     * ```
     */
    async listProcessDefinitions(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for a specific process.
     *
     * - Actions which are imports or exports (actionType field is IMPORT or EXPORT) contain additional fields in the response (see below).
     * Other actions just contain the id, name, and actionType.
     * - Actions are ordered in the sequence that they run when the Process itself is executed.
     * - For an action with actionType of IMPORT, you can use the importDataSourceId value as the ID of a file for the fileId parameter when you upload or download files
     * - For actions with actionType of EXPORT or IMPORT, you can find more information about them if you use the IDs as exportId or importId in the export and import metadata endpoints.
     * - The possible values for actionType (non-exhaustive list):
     *   - IMPORT
     *   - EXPORT
     *   - DELETE_BY_SELECTION
     *   - ORDER_HIERARCHY
     *   - OPTIMIZER
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} processId - The ID of the process.
     * @param {string} [showImportDataSource=false] - Whether to include additional information regarding the import data source in an import action.
     * @returns {Promise<Object>} - A promise that resolves to the process metadata.
     * ```json
     * {
     *   "name": "ProcessWithActions",
     *   "actions": [
     *     {
     *       "id": "112000000000",
     *       "name": "Sales from import-sales.csv",
     *       "actionType": "IMPORT",
     *       "importDataSourceId": "113000000000",
     *       "importType": "MODULE_DATA",
     *       "importDataSource": {
     *         "importDataSourceId": "113000000000",
     *         "type": "FILE"
     *       }
     *     },
     *     {
     *       "id": "116000000000",
     *       "name": "Sales - Revenue.xls",
     *       "actionType": "EXPORT",
     *       "exportType": "GRID_CURRENT_PAGE",
     *       "exportFormat": "application/vnd.ms-excel",
     *       "layout": "GRID_CURRENT_PAGE"
     *     },
     *     {
     *       "id": "117000000000",
     *       "name": "Delete from Products",
     *       "actionType": "DELETE_BY_SELECTION"
     *     }
     *   ]
     * }
     * ```
     */
    async getProcessDefinitionMetadata(workspaceId, modelId, processId, showImportDataSource = false) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}`);
            return response.data.processMetadata;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Starts a process.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} processId - The ID of the process.
     * @param {string} [cancel=false] - Whether to cancel the process if it is already running.
     * @returns {Promise<Object>} - A promise that resolves to the process task information.
     * ```JSON
     * {
     *   "taskId": "E1F648F527AF4297B09E06C278B99F4C"
     * }
     * ```
     */
    async startProcess(workspaceId, modelId, processId, cancel = false) {
        try {
            let response;
            if (cancel) {
                response = await this.apiClient.delete(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks`, {
                    localeName: 'en_US',
                });
            } else {
                response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks`, {
                    localeName: 'en_US',
                });
            }
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Lists tasks for a specific process.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} processId - The ID of the process.
     * @returns {Promise<Array>} - A promise that resolves to an array of process tasks.
     * ```JSON
     * [{
     *   "taskId":"BAB7819744034F25BF73EA1B41804478",
     *   "taskState":"IN_PROGRESS",
     *   "creationTime":1535145539157
     * }]
     * ```
     */
    async listProcessTasks(workspaceId, modelId, processId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks`);
            return response.data.tasks;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Monitors the status of a specific process task.
     *
     * You can use optional query parameter includeProcessDetails to get the start time and duration of each step.
     *
     * Note: As a best practice, we recommend you check the status of an ongoing process no more than once every 5 seconds. For long running processes it is suggested to check at even longer intervals.
     *
     * In the response:
     * - `currentStep` is the task associated with the specified taskId.
     * - `taskState` is the status of the process task.
     * - `progress` is a double that is typically 1.0.
     * - `result` is a JSON object that indicates whether a failure dump file was created, the objectId, and whether the task succeeded.
     * - `failureDumpAvailable` indicates whether this process container or an action within it has a failure dump file. Note: For a deletion action, failureDumpAvailable is always false.
     * - `nestedResults` indicates whether the actions carried out in the process were successful. This contains details in the form of a JSON array, which also contains some debug information when failures occur. Get the failure dump file to view the complete debug information.
     * - `objectID` is the identifier of the process task or a task that it includes. For instance, if nestedResults has failureDumpAvailable true, you need the objectID within that section to obtain the related 'dump' file.
     * - `taskID` is the ID that you specified in the request.
     * - `duration` is the overall processing time.
     * - `startTime` is the time when the step started.
     *
     * Here is a list of each possible taskState:
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
     * @param {string} processId - The ID of the process.
     * @param {string} taskId - The ID of the task.
     * @param {boolean} [includeProcessDetails=false] - Whether to include the start time and duration of each step.
     * @returns {Promise<Object>} - A promise that resolves to the process task status.
     * ```JSON
     * {
     *   "type":"taskInformation",
     *   "taskId":"2846F8E2FD624F7FA91EC6E2F6E318C0",
     *   "currentStep":"Complete.",
     *   "progress": 1,
     *   "result": {
     *     "failureDumpAvailable":false,
     *     "nestedResults":[
     *       {
     *         "failureDumpAvailable": false,
     *         "objectId": "117000000015",
     *         "successful": true
     *       }
     *     ],
     *     "objectId": "118000000002",
     *     "successful": true
     *   },
     *   "taskState": "COMPLETE"
     * }
     * ```
     *
     * With includeProcessDetails:
     * ```JSON
     * {
     *   "type":"taskInformation",
     *   "taskId":"2846F8E2FD624F7FA91EC6E2F6E318C0",
     *   "currentStep":"Complete.",
     *   "progress":1,
     *   "result":{
     *     "failureDumpAvailable":false,
     *     "nestedResults":[
     *       {
     *         "failureDumpAvailable":false,
     *         "objectId":"117000000015",
     *         "successful":true,
     *         "duration": "1112",
     *         "startTime": "1677624625790"
     *       }
     *     ],
     *     "objectId":"118000000002",
     *     "successful":true,
     *     "duration": "868",
     *     "startTime": "1677624626034"
     *   },
     *   "taskState":"COMPLETE"
     * }
     * ```
     */
    async monitorProcessTask(workspaceId, modelId, processId, taskId, includeProcessDetails = false) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks/${taskId}`,
                {
                    params: {
                        includeProcessDetails,
                    },
                });
            return response.data.task;
        } catch (error) {
            handleError(error);
        }
    }

    // /**
    //  * Checks the dump file for failures in a process task.
    //  *
    //  *
    //  *
    //  * @param {string} workspaceId - The ID of the workspace.
    //  * @param {string} modelId - The ID of the model.
    //  * @param {string} processId - The ID of the process.
    //  * @param {string} taskId - The ID of the task.
    //  * @param {string} objectId - The ID of the dump object.
    //  * @returns {Promise<Object>} - A promise that resolves to the dump file information.
    //  */
    // async checkDumpFileForProcessFailures(workspaceId, modelId, processId, taskId, objectId) {
    //     try {
    //         const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks/${taskId}/dumps/${objectId}`);
    //         return response.data;
    //     } catch (error) {
    //         handleError(error);
    //     }
    // }

    /**
     * Retrieves the chunks of a dump file for a process task.
     *
     * Begin by querying the number of chunks using the /chunks endpoint.
     * It is possible for a dump file to be very large.
     * To help manage the size of a dump file and prevent timeouts, download the dump file in chunks.
     * Chunks are 10mb or less and numbered sequentially from 0.
     * In order to get the dump file for a particular action in the process, use the ObjectID.
     * The ObjectID can be obtained from the /tasks/{taskId} endpoint.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} processId - The ID of the process.
     * @param {string} taskId - The ID of the task.
     * @param {string} objectId - The ID of the dump object.
     * @returns {Promise<Object>} - A promise that resolves to
     * ```JSON
     * {
     *   "meta":{
     *     "paging":{
     *       "currentPageSize":1,
     *       "offset":0,
     *       "totalSize":3
     *     },
     *     "schema":"https://api.anaplan.com/2/0/models/75A40874E6B64FA3AE0743278996850F/objects/chunk"
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
    async getProcessDumpFileChunks(workspaceId, modelId, processId, taskId, objectId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks/${taskId}/dumps/${objectId}/chunks`);
            return response.data.chunks;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Downloads a specific chunk of a dump file for a process task.
     *
     * Download the chunks sequentially and then concatenate them on your host.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} processId - The ID of the process.
     * @param {string} taskId - The ID of the task.
     * @param {string} objectId - The ID of the dump object.
     * @param {string} chunkId - The ID of the chunk.
     * @returns {Promise<Buffer>} - A promise that resolves to the chunk data.
     */
    async downloadProcessDumpFileChunk(workspaceId, modelId, processId, taskId, objectId, chunkId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks/${taskId}/dumps/${objectId}/chunks/${chunkId}`, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Downloads the dump file for a process task without chunking.
     *
     * - To prevent issues that may arise when downloading large dump files, we recommend that dump files are downloaded in chunks.
     * Please see above sections for steps.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} processId - The ID of the process.
     * @param {string} taskId - The ID of the task.
     * @param {string} objectId - The ID of the dump object.
     * @returns {Promise<Buffer>} - A promise that resolves to the dump file data (csv format).
     */
    async downloadProcessDumpFile(workspaceId, modelId, processId, taskId, objectId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/processes/${processId}/tasks/${taskId}/dumps/${objectId}`, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanProcessActions;