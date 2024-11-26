/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const anaplanAuth = require('./anaplanAuth');
const deleteActions = require('./actions/deleteActions');
const downloadFiles = require('./actions/zzzdownloadsFiles');
const errorHandler = require('./errorHandler');
const exportActions = require('./actions/exportActions');
const importActions = require('./actions/importActions');
const lineItems = require('./lineItems');
const actions = require('./actions/actions');
const calendar = require('./calendar');
const lists = require('./lists');
const modelOthers = require('./modelOthers');
const models = require('./models');
const versions = require('./versions');
const processActions = require('./actions/processActions');
const uploadFiles = require('./actions/uploadFiles');
const users = require('./users');
const workspaces = require('./workspaces');

module.exports = {
    anaplanAuth,
    deleteActions,
    downloadFiles,
    errorHandler,
    exportActions,
    importActions,
    lineItems,
    actions,
    calendar,
    lists,
    modelOthers,
    models,
    versions,
    processActions,
    uploadFiles,
    users,
    workspaces,
};