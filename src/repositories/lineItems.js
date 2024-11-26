/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

const axios = require('axios');
const { handleError } = require('./errorHandler');

/**
 * AnaplanLineItems class to interact with Anaplan Line Items API.
 */
class AnaplanLineItems {
    /**
     * Creates an instance of AnaplanLineItems.
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
     * Lists all line items in a model.
     * @param {string} modelId - The ID of the model.
     * @returns {Promise<Array>} - A promise that resolves to an array of line items.
     * ```json
     * [
     *     {
     *         "moduleId": "102000000000",
     *         "moduleName": "Sales Entry",
     *         "id": "206000000000",
     *         "name": "Quantity Sold"
     *     },
     *     {
     *         "moduleId": "102000000000",
     *         "moduleName": "Sales Entry",
     *         "id": "206000000001",
     *         "name": "Price"
     *     },
     *     {
     *         "moduleId": "102000000000",
     *         "moduleName": "Sales Entry",
     *         "id": "206000000002",
     *         "name": "Revenue"
     *     },
     *     {
     *         "moduleId": "102000000001",
     *         "moduleName": "Profit",
     *         "id": "208000000000",
     *         "name": "Commission"
     *     },
     *     {
     *         "moduleId": "102000000001",
     *         "moduleName": "Profit",
     *         "id": "208000000001",
     *         "name": "Cost"
     *     },
     *     {
     *         "moduleId": "102000000001",
     *         "moduleName": "Profit",
     *         "id": "208000000002",
     *         "name": "Profit"
     *     }
     * ]
     * ```
     */
    async listLineItems(modelId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/lineItems`);
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves dimension IDs for a specific line item.
     * @param {string} modelId - The ID of the model.
     * @param {string} lineItemId - The ID of the line item.
     * @returns {Promise<Array>} - A promise that resolves to an array of dimension IDs.
     * ```json
     * [
     *     {
     *         "id": "20000000003",
     *         "name": "Time"
     *     },
     *     {
     *         "id": "20000000020",
     *         "name": "Versions"
     *     },
     *     {
     *         "id": "101000000001",
     *         "name": "Products"
     *     },
     *     {
     *         "id": "101000000002",
     *         "name": "Regions"
     *     }
     * ]
     * ```
     */
    async getLineItemDimensions(modelId, lineItemId) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/lineItems/${lineItemId}/dimensions`);
            return response.data.dimensions;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for all line items in a model.
     * @param {string} modelId - The ID of the model.
     * @param {boolean} includeAll - Whether to include all metadata.
     * @returns {Promise<Array>} - A promise that resolves to an array of line item metadata.
     * ```json
     * [
     *   {
     *     "moduleId": "102000000001",
     *     "moduleName": "module2",
     *     "id": "206000000006",
     *     "name": "lineitem-child",
     *
     *     "isSummary": false,
     *     "startOfSection": false,
     *     "broughtForward": false,
     *     "useSwitchover": true,
     *     "breakback": false,
     *
     *     "cellCount": 51,
     *
     *     "version": {
     *         "name": "All",
     *         "id": "16000000000"
     *     },
     *     "appliesTo": [
     *         {
     *             "name": "org-sub1",
     *             "id": "109000000001"
     *         },
     *         {
     *             "name": "linesubset1",
     *             "id": "114000000001"
     *         }
     *     ],
     *     "dataTags": [
     *         {
     *             "name": "tag1",
     *             "id": "127000000002"
     *         },
     *         {
     *             "name": "tag2",
     *             "id": "127000000001"
     *         },
     *         {
     *             "name": "tag3",
     *             "id": "127000000000"
     *         }
     *     ],
     *     "referencedBy": [
     *         {
     *             "name": "lineitem5",
     *             "id": "206000000005"
     *         }
     *     ],
     *
     *     "parent": {
     *         "name": "lineitem5",
     *         "id": "206000000005"
     *     },
     *     "readAccessDriver": {
     *         "name": "lineitem2",
     *         "id": "206000000003"
     *     },
     *     "writeAccessDriver": {
     *         "name": "lineitem2",
     *         "id": "206000000003"
     *     },
     *
     *     "formula": "3 + 9",
     *     "format": "NUMBER",
     *     "formatMetadata": {
     *         "dataType": "NUMBER",
     *         "minimumSignificantDigits": 4,
     *         "decimalPlaces": -1,
     *         "negativeNumberNotation": "MINUS_SIGN",
     *         "unitsType": "NONE",
     *         "unitsDisplayType": "NONE",
     *         "zeroFormat": "ZERO",
     *         "comparisonIncrease": "GOOD",
     *         "groupingSeparator": "COMMA",
     *         "decimalSeparator": "FULL_STOP"
     *     },
     *
     *     "summary": "Sum",
     *     "timeScale": "Month",
     *     "timeRange": "timeRange1",
     *     "formulaScope": "All Versions",
     *     "style": "Normal",
     *     "code": "code7",
     *     "notes": "note1"
     *   }
     * ]
     * ```
     */
    async getAllLineItemMetadata(modelId, includeAll = true) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/lineItems`, {
                params: { includeAll }
            });
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * Retrieves metadata for all line items in a specific module.
     *
     * Only workspace administrators can use this call.
     * You need Read access to the module. Otherwise, you receive a 404 response.
     * The items in the response are in the same order that they appear on the user interface.
     * This returns line items for a specific module. For all the line items in the model see Retrieve all line items in the model.
     * An invalid or a non-existing module ID returns a 404 response.
     *
     * @param {string} modelId - The ID of the model.
     * @param {string} moduleId - The ID of the module.
     * @param {boolean} includeAll - A Boolean query parameter. If true, the call response includes additional information about the applicable line item or list.
     * @returns {Promise<Array>} - A promise that resolves to an array of line item metadata.
     * ```json
     * [{
     *     "moduleId": "102000000001",
     *     "moduleName": "module2",
     *     "id": "206000000006",
     *     "name": "lineitem-child",
     *
     *     "isSummary": false,
     *     "startOfSection": false,
     *     "broughtForward": false,
     *     "useSwitchover": true,
     *     "breakback": false,
     *
     *     "cellCount": 51,
     *
     *     "version": {
     *         "name": "All",
     *         "id": "16000000000"
     *     },
     *     "appliesTo": [
     *         {
     *             "name": "org-sub1",
     *             "id": "109000000001"
     *         },
     *         {
     *             "name": "linesubset1",
     *             "id": "114000000001"
     *         }
     *     ],
     *     "dataTags": [
     *         {
     *             "name": "tag1",
     *             "id": "127000000002"
     *         },
     *         {
     *             "name": "tag2",
     *             "id": "127000000001"
     *         },
     *         {
     *             "name": "tag3",
     *             "id": "127000000000"
     *         }
     *     ],
     *     "referencedBy": [
     *         {
     *             "name": "lineitem5",
     *             "id": "206000000005"
     *         }
     *     ],
     *
     *     "parent": {
     *         "name": "lineitem5",
     *         "id": "206000000005"
     *     },
     *     "readAccessDriver": {
     *         "name": "lineitem2",
     *         "id": "206000000003"
     *     },
     *     "writeAccessDriver": {
     *         "name": "lineitem2",
     *         "id": "206000000003"
     *     },
     *
     *     "formula": "3 + 9",
     *     "format": "NUMBER",
     *     "formatMetadata": {
     *         "dataType": "NUMBER",
     *         "minimumSignificantDigits": 4,
     *         "decimalPlaces": -1,
     *         "negativeNumberNotation": "MINUS_SIGN",
     *         "unitsType": "NONE",
     *         "unitsDisplayType": "NONE",
     *         "zeroFormat": "ZERO",
     *         "comparisonIncrease": "GOOD",
     *         "groupingSeparator": "COMMA",
     *         "decimalSeparator": "FULL_STOP"
     *     },
     *
     *     "summary": "Sum",
     *     "timeScale": "Month",
     *     "timeRange": "timeRange1",
     *     "formulaScope": "All Versions",
     *     "style": "Normal",
     *     "code": "code7",
     *     "notes": "note1"
     *   }
     * ]
     * ```
     */
    async getLineItemMetadataForModule(modelId, moduleId, includeAll = true) {
        try {
            const response = await this.apiClient.get(`/models/${modelId}/modules/${moduleId}/lineItems`, {
                params: { includeAll }
            });
            return response.data.items;
        } catch (error) {
            handleError(error);
        }
    }
}

module.exports = AnaplanLineItems;