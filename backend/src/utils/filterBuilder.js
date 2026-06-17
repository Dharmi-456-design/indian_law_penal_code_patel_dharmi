/**
 * Build a dynamic MongoDB filter object from query parameters
 * @param {object} query - Express request query object
 * @returns {object} MongoDB filter object
 */
const buildSectionFilter = (query) => {
    const filter = {};

    // Filter by act code (enum: NIA, MVA, IEA, IPC, IDA, HMA, CrPC, CPC)
    if (query.actCode) {
        filter.actCode = query.actCode;
    }

    // Filter by chapter (numeric)
    if (query.chapter) {
        filter.chapter = Number(query.chapter);
    }

    // Filter by section number (exact match)
    if (query.sectionNumber) {
        filter.sectionNumber = query.sectionNumber.trim();
    }

    // Full-text search across title and description
    if (query.q) {
        const regex = new RegExp(query.q.trim(), 'i');
        filter.$or = [
            { sectionTitle: regex },
            { sectionDesc: regex },
            { sectionNumber: regex }
        ];
    }

    // Filter by archive status (default to false if not specified)
    if (query.isArchived !== undefined) {
        filter.isArchived = query.isArchived === 'true';
    } else {
        filter.isArchived = false;
    }

    return filter;
};

module.exports = {
    buildSectionFilter
};
