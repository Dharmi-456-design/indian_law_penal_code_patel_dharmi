/**
 * Utility to build pagination metadata
 * @param {number} total - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 * @returns {object} Pagination metadata
 */
const buildPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages
    };
};

/**
 * Utility to build MongoDB sort object
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {object} Sort object
 */
const buildSortObj = (sortBy, sortOrder) => {
    const sort = {};
    if (sortBy) {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
        sort.sectionNumber = 1; // Default sort for sections
    }
    return sort;
};

module.exports = {
    buildPaginationMeta,
    buildSortObj
};
