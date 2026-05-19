const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const bookmarkService = require('../services/bookmark.service');

const addBookmark = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { sectionId } = req.params;

    const bookmark = await bookmarkService.addBookmark(userId, sectionId);

    return res.status(201).json(
        new ApiResponse(201, bookmark, 'Bookmark added successfully')
    );
});

const removeBookmark = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { sectionId } = req.params;

    const bookmark = await bookmarkService.removeBookmark(userId, sectionId);

    return res.status(200).json(
        new ApiResponse(200, bookmark, 'Bookmark removed successfully')
    );
});

const getUserBookmarks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page, limit, actCode } = req.query;

    const { data, meta } = await bookmarkService.getUserBookmarks({
        userId,
        page,
        limit,
        actCode
    });

    return res.status(200).json(
        new ApiResponse(200, data, 'Bookmarks retrieved successfully', meta)
    );
});

const checkBookmark = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { sectionId } = req.params;

    const result = await bookmarkService.isBookmarked(userId, sectionId);

    return res.status(200).json(
        new ApiResponse(200, result, 'Bookmark status checked')
    );
});

const updateBookmarkNote = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { sectionId } = req.params;
    const { note } = req.body;

    const bookmark = await bookmarkService.updateBookmarkNote(userId, sectionId, note);

    return res.status(200).json(
        new ApiResponse(200, bookmark, 'Bookmark note updated successfully')
    );
});

module.exports = {
    addBookmark,
    removeBookmark,
    getUserBookmarks,
    checkBookmark,
    updateBookmarkNote
};
