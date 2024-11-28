/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const paginationHandler = require('../helpers/paginationHandler');

/**
 * Model class
 */
class Model {
    /**
     * Creates an instance of Model.
     * @param {string} client - The client.
     * @param {Object} model - The model.
     * @param {string} model.id - The ID of the model.
     * @param {string} model.name - The name of the model.
     * @param {string} model.activeState - The active state of the model.
     * @param {string} model.currentWorkspaceId - The ID of the current workspace of the model.
     * @param {string} model.currentWorkspaceName - The name of the current workspace of the model.
     * @param {string} model.modelUrl - The URL of the model.
     * @param {Array} model.categoryValues - The category values of the model.
     * @return {Model}
     */
    constructor(client, model) {
        this._client = client;
        this.id = model.id;
        this.name = model.name;
        this.activeState = model.activeState;
        this.currentWorkspaceId = model.currentWorkspaceId;
        this.currentWorkspaceName = model.currentWorkspaceName;
        this.modelUrl = model.modelUrl;
        this.categoryValues = model.categoryValues;
    }
}

module.exports = Model;
