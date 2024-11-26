/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('../errorHandler');

/**
 * AnaplanUploadFiles class to interact with Anaplan Upload Files API.
 */
class AnaplanUploadFiles {
    /**
     * Creates an instance of AnaplanUploadFiles.
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
     * Retrieves the list of files for a model.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of files.
     * ```json
     * [
     *   {
     *     "id": "113000000000",
     *     "name": "#T & #R.csv",
     *     "chunkCount": 0,
     *     "delimiter": "\"",
     *     "encoding": "ISO-8859-1",
     *     "firstDataRow": 2,
     *     "format": "txt",
     *     "headerRow": 1,
     *     "separator": ","
     *   },
     *   {
     *     "id": "113000000001",
     *     "name": "#T & #R-1.csv",
     *     "chunkCount": 0,
     *     "delimiter": "\"",
     *     "encoding": "ISO-8859-1",
     *     "firstDataRow": 2,
     *     "format": "txt",
     *     "headerRow": 1,
     *     "separator": ","
     *   },
     *   {
     *     "id": "113000000002",
     *     "name": "Sales metrics (1) - POC load.csv",
     *     "chunkCount": 0,
     *     "delimiter": "\"",
     *     "encoding": "UTF-8",
     *     "firstDataRow": 2,
     *     "format": "txt",
     *     "headerRow": 1,
     *     "separator": ","
     *   },
     *   {
     *     "id": "116000000001",
     *     "name": "ExportGrid - ORG2Test.xls",
     *     "chunkCount": 1,
     *     "firstDataRow": 0,
     *     "headerRow": 0
     *   }
     * ]
     * ```
     */
    async getFileList(workspaceId, modelId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/files`);
            return response.data.files;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Uploads a file as a single chunk.
     *
     * - You cannot compress a file that you are uploading as a single file.
     * - If the file is smaller than 1 MB, we recommend you PUT it onto the server by streaming it as an octet stream.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @param {Buffer} file - The file data.
     * @returns {Promise<void>} - A promise that resolves when the upload is complete.
     */
    async uploadFileAsSingleChunk(workspaceId, modelId, fileId, file) {
        try {
            await this.apiClient.put(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}`, file, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Sets the chunk count for a file.
     *
     * To upload a file, we recommend setting the chunkcount metadata of an upload so that the server knows how many chunks to process during an upload.
     * Set the chunkcount to -1 if you do not know how many chunks there will be and will be marking the upload complete when all chunks have been uploaded.
     *
     * Use chunking:
     * - If you want to be able to resume the transfer after the connection is lost during an upload.
     * - If you are extracting data from a database and want to push it to the server without holding all the results in memory.
     *
     * To avoid consuming large amounts of memory on the server, a chunk is expected to be between 1 and 50 MB
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @param {number} chunkCount - The number of chunks.
     * @returns {Promise<Object>} - A promise that resolves to the file information.
     * ```json
     * {
     *   "id": "113000000008",
     *   "name": "Tests.txt",
     *   "chunkCount": 1,
     *   "delimiter": "\"",
     *   "encoding": "ISO-8859-1",
     *   "firstDataRow": 2,
     *   "format": "txt",
     *   "headerRow": 1,
     *   "separator": "\t"
     * }
     * ```
     */
    async setChunkCount(workspaceId, modelId, fileId, chunkCount) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}`, {
                chunkCount,
            });
            return response.data.file;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Uploads a file in chunks.
     *
     * We recommend that you specify a chunk size no larger than 50MB of uncompressed data with no more than 1,000 chunks per file.
     * To reduce the upload time for larger chunks, compress the chunks. You can compress the chunks in a folder using a shell command.
     * For example, this command compresses all files within the current folder and those below it if they do not have the file extension .gz
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @param {number} chunkId - The ID of the chunk.
     * @param {boolean} isCompressedInGz=false - Whether the chunk is compressed or not
     * @param {Buffer} chunk - The chunk data.
     * @returns {Promise<void>} - A promise that resolves when the chunk upload is complete.
     */
    async uploadFileInChunks(workspaceId, modelId, fileId, chunkId, isCompressedInGz, chunk) {
        try {
            await this.apiClient.put(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}/chunks/${chunkId}`, chunk, {
                headers: {
                    'Content-Type': isCompressedInGz ? 'application/x-gzip' : 'application/octet-stream',
                },
            });
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Completes the upload of a file.
     *
     * After carrying out an upload with chunkCount set to -1, mark it complete.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @returns {Promise<Object>} - A promise that resolves to the file information.
     * ```json
     * {
     *   "id": "113000000008",
     *   "name": "achunky-aa",
     *   "chunkCount": 1,
     *   "delimiter": "\"",
     *   "encoding": "ISO-8859-1",
     *   "firstDataRow": 2,
     *   "format": "txt",
     *   "headerRow": 1,
     *   "separator": "\t"
     * }
     * ```
     */
    async completeUpload(workspaceId, modelId, fileId) {
        try {
            const response = await this.apiClient.post(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}/complete`);
            return response.data.file;
        } catch (error) {
            handleError(error);
        }
    }


    /**
     * Deletes a file that you have uploaded.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @returns {Promise<void>} - A promise that resolves when the file is deleted.
     */
    async deleteFile(workspaceId, modelId, fileId) {
        try {
            await this.apiClient.delete(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}`);
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanUploadFiles;