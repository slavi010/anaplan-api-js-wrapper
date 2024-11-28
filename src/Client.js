/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 *
 * @fileoverview AnaplanClient class for the client side of the application. WIP
 */

const axios = require('axios');
const m = require('./repositories');
const Workspace = require('./models/workspaces');
/**
 * AnaplanClient class for the client side of the application.
 * mix of the model classes to interact with the Anaplan APIs.
 */
class AnaplanClient {
    /**
     * Creates an instance of AnaplanClient.
     */
    constructor() {
        this._authRepository = new m.anaplanAuth();
        this._repositories = []; 
    }

    /**
     * Connect via username and password.
     * @param {string} username - The username.
     * @param {string} password - The password.
     */
    async connect({username, password}) {
        try {
            const authToken = await this._authRepository.createAuthToken(username, password);
            this.fullToken = authToken.tokenInfo;
            this.token = authToken.tokenInfo.tokenValue;
            await this._prepareRepositories();
        } catch (error) {
            m.errorHandler.handleError(error);
        }
    }

    /**
     * Connect via certificate.
     * @param {string} certificate - The base64-encoded certificate in PEM format.
     * @param {string} encodedString - The base64-encoded randomly generated string.
     * @param {string} encodedSignedString - The base64-encoded signed string.
     */
    async connectWithCertificate(certificate, encodedString, encodedSignedString) {
        try {
            const authToken = await this._authRepository.createAuthTokenWithCertificate(certificate, encodedString, encodedSignedString);
            this.fullToken = authToken.tokenInfo;
            this.token = authToken.tokenInfo.tokenValue;
            await this._prepareRepositories();
        } catch (error) {
            m.errorHandler.handleError(error);
        }
    }

    /**
     * Prepare all repositories when connected.
     */
    async _prepareRepositories() {
        this._repositories = {
            deleteActions: new m.deleteActions(this.token),
            downloadFiles: new m.downloadFiles(this.token),
            exportActions: new m.exportActions(this.token),
            importActions: new m.importActions(this.token),
            lineItems: new m.lineItems(this.token),
            modelActions: new m.actions(this.token),
            modelCalendar: new m.calendar(this.token),
            modelLists: new m.lists(this.token),
            modelMetadata: new m.modelOthers(this.token),
            models: new m.models(this.token),
            modelVersions: new m.versions(this.token),
            processActions: new m.processActions(this.token),
            uploadFiles: new m.uploadFiles(this.token),
            users: new m.users(this.token),
            workspaces: new m.workspaces(this.token),
        }
    }

    /**
     * Verify the connection.
     *
     * @throws {Error} - If no connected.
     */
    async verifyConnection() {
        // not connected yet
        if (!this.token) {
            throw new Error('Not connected. Please connect first.');
        }
        // expired token
        if (this.fullToken.expiresAt < Date.now() + 10) {
            throw new Error('Token expired. Please reconnect.');

        }
    }

    /**
     * Logout.
     * @param {boolean} [withRevoke=true] - Whether to revoke the token.
     */
    async logout({withRevoke = true} = {}) {
        try {
            if (withRevoke) {
                await this._authRepository.logout(this.token);
            }
        } catch (error) {
            m.errorHandler.handleError(error);
        }
        this.fullToken = null;
        this.token = null;
        this._repositories = [];
    }

    /**
     * Get All Workspaces.
     * @returns {Promise<Workspace[]>} - A promise that resolves to an array of workspaces.
     * [
     *   {
     *   "id": "8a8b8c8d8e8f8g8i",
     *   "name": "Financial Planning",
     *   "active": true,
     *   "sizeAllowance": 1073741824,
     *   "currentSize": 873741824
     *   }
     * ]
     */
    async getAllWorkspaces() {
        await this.verifyConnection();
        const workspaces = await this._repositories.workspaces.listWorkspaces();
        return workspaces.map(workspace => new Workspace(this, workspace))
    }

    /**
     * Get One Workspace by its ID or name.
     *
     * If both name and ID are provided, the ID will be used.
     * If neither name nor ID are provided, an error will be thrown.
     *
     * @param {string} [workspaceId] - The ID of the workspace.
     * @param {string} [workspaceName] - The name of the workspace.
     *
     * @returns {Promise<Workspace>} - A promise that resolves to the workspace information.
     * {
     *   "id": "8a8b8c8d8e8f8g8i",
     *   "name": "Financial Planning",
     *   "active":true,
     *   "sizeAllowance": 1073741824,
     *   "currentSize": 873741824
     * }
     * @throws {Error} - If workspaceId and workspaceName are not provided.
     * @example
     * const workspace = await client.getOneWorkspace({workspaceId: '8a8b8c8d8e8f8g8i'});
     * const workspace = await client.getOneWorkspace({workspaceName: 'Financial Planning'});
     */
    async getOneWorkspace({workspaceId, workspaceName}) {
        if (!workspaceId && !workspaceName) {
            throw new Error('Please provide a workspaceId or workspaceName.');
        }
        await this.verifyConnection();

        if (workspaceId) {
            const workspaceData = await this._repositories.workspaces.getWorkspace(workspaceId);
            return new Workspace(this, workspaceData);
        } else {
            const workspaces = await this.getAllWorkspaces();
            return workspaces.find(workspace => workspace.name === workspaceName);
        }
    }
}

module.exports = AnaplanClient;