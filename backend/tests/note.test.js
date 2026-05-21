const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User.models');
const Section = require('../src/models/Section.models');
const Note = require('../src/models/Note.models');
const { generateTokens } = require('../src/services/auth.service');

let userToken;
let otherUserToken;
let userId;
let sectionId;
let noteId;

beforeAll(async () => {
    // Create the primary test user
    const user = await User.create({
        name: 'Note User',
        email: 'noteuser@example.com',
        password: 'Password123!',
        role: 'user'
    });
    userId = user._id;
    const tokens = generateTokens(user);
    userToken = tokens.accessToken;

    // Create a second user to test ownership restrictions
    const otherUser = await User.create({
        name: 'Other User',
        email: 'otheruser@example.com',
        password: 'Password123!',
        role: 'user'
    });
    const otherTokens = generateTokens(otherUser);
    otherUserToken = otherTokens.accessToken;

    // Create a test section to attach notes to
    const section = await Section.create({
        actCode: 'IPC',
        actName: 'Indian Penal Code',
        sectionNumber: '420',
        sectionTitle: 'Cheating and dishonestly inducing delivery of property',
        sectionDesc: 'Whoever cheats and thereby dishonestly induces...'
    });
    sectionId = section._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await Section.deleteMany({});
    await Note.deleteMany({});
    await mongoose.connection.close();
});

describe('Notes API', () => {

    // ──────────────────────────────────────────────
    // POST /api/v1/notes — Create
    // ──────────────────────────────────────────────
    describe('POST /api/v1/notes', () => {
        it('should create a note successfully', async () => {
            const res = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ sectionId, noteText: 'Important section for fraud cases.' });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.noteText).toBe('Important section for fraud cases.');
            expect(res.body.data.sectionId).toHaveProperty('actCode', 'IPC');

            // Save for subsequent tests
            noteId = res.body.data._id;
        });

        it('should reject creation without noteText', async () => {
            const res = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ sectionId });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });

        it('should reject creation with an invalid sectionId', async () => {
            const res = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ sectionId: 'not-a-valid-id', noteText: 'Test note' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 for unauthenticated requests', async () => {
            const res = await request(app)
                .post('/api/v1/notes')
                .send({ sectionId, noteText: 'Unauthenticated note' });

            expect(res.statusCode).toEqual(401);
        });
    });

    // ──────────────────────────────────────────────
    // GET /api/v1/notes — List
    // ──────────────────────────────────────────────
    describe('GET /api/v1/notes', () => {
        it('should return notes scoped to the current user', async () => {
            const res = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].noteText).toBe('Important section for fraud cases.');
        });

        it('should return empty array for a user with no notes', async () => {
            const res = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', `Bearer ${otherUserToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBe(0);
        });
    });

    // ──────────────────────────────────────────────
    // PUT /api/v1/notes/:id — Update
    // ──────────────────────────────────────────────
    describe('PUT /api/v1/notes/:id', () => {
        it('should update a note successfully', async () => {
            const res = await request(app)
                .put(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ noteText: 'Updated note text for IPC 420.' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.noteText).toBe('Updated note text for IPC 420.');
        });

        it('should prevent another user from editing the note', async () => {
            const res = await request(app)
                .put(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${otherUserToken}`)
                .send({ noteText: 'Hijacked note text.' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
        });

        it('should reject update without noteText', async () => {
            const res = await request(app)
                .put(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });
    });

    // ──────────────────────────────────────────────
    // DELETE /api/v1/notes/:id — Delete
    // ──────────────────────────────────────────────
    describe('DELETE /api/v1/notes/:id', () => {
        it('should prevent another user from deleting the note', async () => {
            const res = await request(app)
                .delete(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${otherUserToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.success).toBe(false);
        });

        it('should delete a note owned by the user', async () => {
            const res = await request(app)
                .delete(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);

            // Verify deletion in DB
            const deleted = await Note.findById(noteId);
            expect(deleted).toBeNull();
        });

        it('should return 404 when deleting an already-deleted note', async () => {
            const res = await request(app)
                .delete(`/api/v1/notes/${noteId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(404);
        });
    });
});
