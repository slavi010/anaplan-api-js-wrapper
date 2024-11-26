/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('../errorHandler');

/**
 * AnaplanDownloadFiles class to interact with Anaplan Download Files API.
 */
class AnaplanDownloadFiles {
    /**
     * Creates an instance of AnaplanDownloadFiles.
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
     * Retrieves the chunks in a file.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @returns {Promise<Array>} - A promise that resolves to an array of chunks.
     */
    async getFileChunks(workspaceId, modelId, fileId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}/chunks`);
            return response.data.chunks;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves the data in a specific chunk of a file.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} modelId - The ID of the model.
     * @param {string} fileId - The ID of the file.
     * @param {string} chunkId - The ID of the chunk.
     * @returns {Promise<Buffer>} - A promise that resolves to the chunk data.
     */
    async getFileChunkData(workspaceId, modelId, fileId, chunkId) {
        try {
            const response = await this.apiClient.get(`/workspaces/${workspaceId}/models/${modelId}/files/${fileId}/chunks/${chunkId}`, {
                responseType: 'arraybuffer',
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Deletes a file that was uploaded.
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

module.exports = AnaplanDownloadFiles;