const Bookmark = require('../src/models/Bookmark.models');
const Note = require('../src/models/Note.models');
const SearchLog = require('../src/models/SearchLog.models');
const AuditLog = require('../src/models/AuditLog.models');
const mongoose = require('mongoose');

describe('Remaining Models Test', () => {
    const mockId = new mongoose.Types.ObjectId();

    describe('Bookmark Model', () => {
        it('should create a bookmark successfully', () => {
            const bookmark = new Bookmark({
                userId: mockId,
                lawId: mockId,
                note: 'Test note'
            });
            const err = bookmark.validateSync();
            expect(err).toBeUndefined();
        });
    });

    describe('Note Model', () => {
        it('should create a note successfully', () => {
            const note = new Note({
                userId: mockId,
                sectionId: mockId,
                noteText: 'Sample legal note'
            });
            const err = note.validateSync();
            expect(err).toBeUndefined();
        });
    });

    describe('SearchLog Model', () => {
        it('should create a search log successfully', () => {
            const log = new SearchLog({
                query: 'IPC section 302',
                resultsCount: 1
            });
            const err = log.validateSync();
            expect(err).toBeUndefined();
        });
    });

    describe('AuditLog Model', () => {
        it('should create an audit log successfully', () => {
            const log = new AuditLog({
                adminId: mockId,
                action: 'UPDATE_SECTION',
                targetCollection: 'sections',
                targetId: mockId
            });
            const err = log.validateSync();
            expect(err).toBeUndefined();
        });
    });
});
