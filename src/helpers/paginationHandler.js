/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 */

/**
 * Handles pagination in the API responses.
 *
 * This
 *
 * @param {function} apiCall - The API call to make.
 * - The function must return a promise that resolves to an object with the following properties:
 * ```json
 * "meta":{
 *     "paging":{
 *       "currentPageSize":3,
 *       "offset":0,
 *       "totalSize":3
 *     },
 *     "schema":"https://api.anaplan.com/2/0/models/75A40874E6B64FA3AE0743278996850F/objects/file"
 *   },
 *   "status": ...
 * }
 * ```
 * - The status will be ignored.
 * - The other parameter (not meta and status) will have there array of data contained in the response.
 * - If there are other properties in the response (not an array), they will be ignored.
 * @param {params} params - The parameters to pass to the API call.
 * The function should accept the following parameters:
 * - `limit`: The number of items to retrieve.
 * - `offset`: The number of pages to skip before returning the data.
 * @param {number} [pageSize=1000] - The size of the page.
 * @param {number} [maxPages=-1] - The maximum number of pages to retrieve.
 * -1 means no limit.
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of data.
 *
 * TODO test this function
 */
function paginationHandler(apiCall, params, pageSize = 1000, maxPages = -1) {
    return new Promise(async (resolve, reject) => {
        let offset = 0;
        let data = [];
        let currentPage = 0;
        let totalSize = 0;
        let totalPages = 0;
        let currentSize = 0;

        do {
            const response = await apiCall({ ...params, limit: pageSize, offset });
            if (currentPage === 0) {
                totalSize = response.meta.paging.totalSize;
                totalPages = Math.ceil(totalSize / pageSize);
            }
            currentSize = response.meta.paging.currentPageSize;
            data = data.concat(response.data);
            offset += currentSize;
            currentPage++;
        } while (currentSize > 0 && (maxPages === -1 || currentPage < maxPages));

        resolve(data);
    });
}