/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const paginationHandler = require('../helpers/paginationHandler');

const Model = require('./models');

/**
 * Workspace class
 */
class Workspace {
    /**
     * Creates an instance of Workspace.
     *
     * @param {AnaplanClient} client - The client.
     * @param {Object} workspace - The workspace.
     * @param {string} workspace.id - The ID of the workspace.
     * @param {string} workspace.name - The name of the workspace.
     * @param {boolean} workspace.active - Whether the workspace is active.
     * @param {number} [workspace.sizeAllowance] - The size allowance of the workspace.
     * @param {number} [workspace.currentSize] - The current size of the workspace.
     * @return {Workspace}
     */
    constructor(client, workspace) {
        this._client = client;
        this.id = workspace.id;
        this.name = workspace.name;
        this.active = workspace.active;
        this.sizeAllowance = workspace.sizeAllowance;
        this.currentSize = workspace.currentSize;
    }

    /**
     * Get all the Models of the Workspace
     *
     * @param {boolean} [modelDetails=false] - Whether to include model details in the response.
     * Add sizeAllowance and currentSize
     * @return {Promise<Object>}
     * ```json
     * [
     *   {
     *     "id": "FC12345678912343455667",
     *     "activeState": "UNLOCKED",
     *     "name": "FP&A",
     *     "currentWorkspaceId": "8a8b8c8d8e8f8g8i",
     *     "currentWorkspaceName": "Financial Planning",
     *     "modelUrl": "https://rt.anaplan.com/anaplan/rt?selectedWorkspaceId\8a8b8c8d8e8f8g8i\u0026selectedModelId\FC12345678912343455667",
     *     "categoryValues": []
     *   }
     * ]
     * ```
     * @example
     * const models = await workspace.getModels();
     * const models = await workspace.getModels({modelDetails: true});
     */
    async getAllModels({modelDetails = false} = {modelDetails: false}) {
        await this._client.verifyConnection();
        const modelData = await paginationHandler({
            repository: this._client._repositories.models,
            apiCallName: this._client._repositories.models.retrieveModelsForWorkspace.name,
            params: {
                workspaceId: this.id,
                modelDetails: modelDetails
            },
            pageSize: 5000,
            maxPages: -1
        });

        return modelData.map(model => new Model(this._client, model));
    }

    /**
     * Get a specific Model of the Workspace by its name or ID.
     *
     * If both name and ID are provided, the ID will be used.
     * If neither name nor ID are provided, an error will be thrown.
     *
     * @param {string} [modelName] - The name of the model.
     * @param {string} [modelId] - The ID of the model.
     * @param {boolean} [modelDetails=false] - Whether to include model details in the response.
     * Add sizeAllowance and currentSize
     * @return {Promise<Object>}
     * ```json
     * {
     *  "id": "FC12345678912343455667",
     *  "activeState": "UNLOCKED",
     *  "name": "FP&A",
     *  "currentWorkspaceId": "8a8b8c8d8e8f8g8i",
     *  "currentWorkspaceName": "Financial Planning",
     *  "modelUrl": "https://rt.anaplan.com/anaplan/rt?selectedWorkspaceId\8a8b8c8d8e8f8g8i\u0026selectedModelId\FC12345678912343455667",
     *  "categoryValues": []
     *  }
     *  ```
     *  @throws {Error} - If neither name nor ID are provided.
     *  @example
     *  const model = await workspace.getOneModel({modelName: 'FP&A'});
     *  const model = await workspace.getOneModel({modelId: 'FC12345678912343455667'});
     *  const model = await workspace.getOneModel({modelName: 'FP&A', modelDetails: true});
     */
    async getOneModel({modelName, modelId, modelDetails = false}) {
        await this._client.verifyConnection();
        if (!modelName && !modelId) {
            throw new Error('Either modelName or modelId must be provided.');
        }

        let modelData;
        if (modelId) {
            modelData = await this._client._repositories.models.getModel({
                modelId: modelId,
                modelDetails: modelDetails
            });
        } else {
            modelData = (await this.getAllModels({modelDetails: modelDetails}))
                .find(model => model.name === modelName);
        }

        if (!modelData) {
            throw new Error(`Model ${modelId || modelName} not found.`);
        }

        return new Model(this._client, modelData);
    }
}

module.exports = Workspace;