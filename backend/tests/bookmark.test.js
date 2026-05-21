const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const Section = require('../src/models/Section.models');
const Bookmark = require('../src/models/Bookmark.models');
const { generateTokens } = require('../src/services/auth.service');

let userToken;
let userId;
let sectionId;

beforeAll(async () => {
    // Create a test user
    const user = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123!',
        role: 'user'
    });
    userId = user._id;
    const tokens = generateTokens(user);
    userToken = tokens.accessToken;

    // Create a test section
    const section = await Section.create({
        actCode: 'IPC',
        actName: 'Indian Penal Code',
        sectionNumber: '378',
        sectionTitle: 'Theft',
        sectionDesc: 'Whoever, intending to take dishonestly any movable property...'
    });
    sectionId = section._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});
    await Bookmark.deleteMany({});
    await mongoose.connection.close();
});

describe('Bookmarks API', () => {
    describe('POST /api/v1/bookmarks/:sectionId', () => {
        it('should add a new bookmark successfully', async () => {
            const res = await request(app)
                .post(`/api/v1/bookmarks/${sectionId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.lawId.actCode).toBe('IPC');
        });

        it('should not create a duplicate bookmark (idempotency)', async () => {
            // First one is already added, doing it again shouldn't fail but return the same
            const res = await request(app)
                .post(`/api/v1/bookmarks/${sectionId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(201); // Or 200 depending on implementation details
            
            // Verify there is still only one bookmark in DB
            const count = await Bookmark.countDocuments({ userId, lawId: sectionId });
            expect(count).toBe(1);
        });
    });

    describe('GET /api/v1/bookmarks/:sectionId/check', () => {
        it('should return true if section is bookmarked', async () => {
            const res = await request(app)
                .get(`/api/v1/bookmarks/${sectionId}/check`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.isBookmarked).toBe(true);
        });
    });

    describe('PATCH /api/v1/bookmarks/:sectionId/note', () => {
        it('should add a note to a bookmark', async () => {
            const res = await request(app)
                .patch(`/api/v1/bookmarks/${sectionId}/note`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ note: 'This section is important for my case.' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.note).toBe('This section is important for my case.');
        });
    });

    describe('GET /api/v1/bookmarks', () => {
        it('should retrieve paginated user bookmarks', async () => {
            const res = await request(app)
                .get('/api/v1/bookmarks')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.meta).toBeDefined();
            expect(res.body.meta.total).toBe(1);
        });
    });

    describe('DELETE /api/v1/bookmarks/:sectionId', () => {
        it('should remove a bookmark', async () => {
            const res = await request(app)
                .delete(`/api/v1/bookmarks/${sectionId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);

            // Verify it was deleted
            const count = await Bookmark.countDocuments({ userId, lawId: sectionId });
            expect(count).toBe(0);
        });
    });
});
